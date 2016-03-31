title:  "python eval踩坑后"
date:   2016/03/31 13:14
categories: python
tag: python LEGB eval 
---

## 踩坑
最近在做一个数据采集的功能，每5分钟采集一次数据，由于数据是从日志中采集分析，通过crontab给spark提交任务去计算的，spark任务无法保证是在整5分钟间隔的时候执行（比如：00分，5分，10分），所以需要对当前时间做下处理，将非整5分钟的时间修改为整5分钟，然后做日志筛选
时间处理的具体代码如下:
<!--lang:python-->

now = time.time() - 300                                   #当前时间延后5分钟 
daypath = time.strftime("%Y%m%d",time.localtime(now))     #取当天的日志路径
hour = time.strftime("%H%M",time.localtime(now))          #取小时分钟
minute = eval(hour)                                       #讲小时分钟转换为数字 
minute = minute - (minute % 5)                            #将分钟对5取模，减去余数
rowkey = "%s%04d" % (daypath,minute)                      #生成hbase rowkey(201603301320)
end = time.mktime(time.strptime(rowkey,'%Y%m%d%H%M'))     #将rowkey换算为时间戳 
begin = end - 300                                         #取begin到end之间的日志

以上代码在白天运行时毫无问题，但是到凌晨一点开始，没有计算没有数据了
经过分析发现，minute = eval(hour) 在晚上1点开始的时候，假设hour是0115，eval转换时会将hour视为八进制的数字，所以转换以后是163
minute = minute - (minute % 5)后，minute变为160，rowkey = "%s%04d" % (daypath,minute） 执行后，rowkey为201603300160，时间完全错
了，自然筛选不到日志

## eval

<!--lang:python-->

eval(expression[, globals[, locals]])

The expression argument is parsed and evaluated as a Python expression (technically speaking, a condition list) using the globals and locals dictionaries as global and local namespace. If the globals dictionary is present and lacks ‘__builtins__’, the current globals are copied into globals before expression is parsed. This means that expression normally has full access to the standard __builtin__ module and restricted environments are propagated. If the locals dictionary is omitted it defaults to the globals dictionary. If both dictionaries are omitted, the expression is executed in the environment where eval() is called. The return value is the result of the evaluated expression.

expression参数会被解析为python表达式来执行，eval有三个参数，expression，globals，locals，globals和locals可选，传入字典，分别对应expression全局命名空间和局部命名空间，globals传入的字典中如果没有__builtins__，当前全局__builtins__将会在expression执行前传入globals


## python变量解析原则

我们都知道python变量名解析遵循LEGB原则，即首先是本地,之后是函数内，之后是全局，最后是内置。
在默认的情况下，变量名赋值会创建或者改变本地变量当函数中使用未认证的变量名时，Python就会搜索4个作用域（本地作用域，之后是上一层结构中def或lambda的本地作用域，之后是全局作用域，最后是内置作用域。
以下面代码为例:
<!--lang:python-->

g = 'I am global'
def local():
    e = 'I am function'
    if g is not None:
        l = 'I am local'
        print g,e,l,len(g)

代码1-1

从如上代码看：
在print g,e,l执行时，l来自本地变量，e来自函数内变量，g为全局变量,那么什么是内置变量呢，内置变量就是上面所说的__builtins__相关，而len(g)中的len来自内置变量

## python内置变量

在Python中，有一个内建模块，该模块中有一些常用函数;而该模块在Python启动后、且没有执行程序员所写的任何代码前，Python会首先加载该内建函数到内存。另外，该内建模块中的功能可以直接使用，不用在其前添加内建模块前缀。比如：内建模块中有一个len()函数，计算一个对象的长度，如len('aaa')将返回3。

在Python2.X版本中，内建模块被命名为__builtin__，而到了Python3.X版本中，却更名为builtins

当使用内建模块中函数或其它功能时，可以直接使用，不用添加内建模块的名字;但是，如果想要向内建模块中添加一些功能，以便在任何函数中都能直接使用而不用再进行import，这时，就要导入内建模块，在内建模块的命名空间(即__dict__字典属性)中添加该功能。在导入时，如果是Python2.X版本，就要导入__builtin__模块;如果是Python3.X版本，就要导入builtins模块。

例如实现一个加法函数并导入内建变量

python2:
<!--lang:python-->

import __builtin__
def add(x,y):
    return x+y
__builtin__.__dict__['add'] = add

代码2-1

python3:
<!--lang:python-->

import builtins
def add(x,y):
    return x+y
builtins.__dict__['add'] = add

代码2-2


那__builtins__是什么呢

__builtins__即是引用，那么它内建模块有一个相同点：Python程序一旦启动，它们二者就会在程序员所写的代码没有运行之前就已经被加载到内存中了
1. 在主模块__main__中：
__builtins__是对内建模块__builtin__本身的引用，即__builtins__完全等价于__builtin__，二者完全是一个东西，不分彼此。它在任何地方都可见，即在任何地方都可使用它。此时，__builtins__的类型是模块类型。
__builtin__仅仅在导入它时才可见。哪个作用域中使用__builtin__，哪个作用域就要导入它(导入仅仅是让__builitin__标识符在该作用域内可见)。一般都是在模块的顶层(即模块的全局作用域)导入__builtin__，这样，其后的任何作用域可通过标识符向上查找来引用__builtin__。
2. 在非__main__模块中：
__builtins__仅是对__builtin__.__dict__的引用，而非__builtin__本身。它在任何地方都可见。此时__builtins__的类型是字典。

## 再看eval

eval(expression[, globals[, locals]])

当globals和locals为空时，expression运行在当前eval运行的全局名称空间和本地名称空间
当globals为空，locals不为空时，全局名称空间为当前eval运行的全局命名空间，本地名称空间为locals的传值
当globals不为空，expression的全局名称空间为globals（包括内置名称空间），如果locals为空，本地名称空间继承globals，如果locals不为空，expression的本地名称空间为locals
<!--lang:python-->

g = 'I am global'
def local():
    e = 'I am function'
    if g is not None:
        l = 'I am local'
        eval("e",None,{'m':123})  #NameError
        eval("l",None,{'m':123})  #NameError
        eval("g",None,{'m':123})  #'I am global'
        eval("g",{},{'m':123})    #NameError



