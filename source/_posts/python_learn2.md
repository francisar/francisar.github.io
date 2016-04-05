title:  "python shell交互与历史命令"
date:   2016/04/05 13:20
categories: python
tag: python python交互shell 
---


python的开发过程中，我们总会打开python的交互式终端，来进行一些代码测试，自己编译的python版本，在使用过程中发现无法使用上下左右键，导致使用起来非常不便。Linux中自带的python版本，都可以像GNU bash shell一样，可以左右编辑当前input，上下选择历史input。

python的交互式终端，input编辑以及历史命令的选择，依赖于GNU readline library,因此在编译python前，需要先安装readline-devel。
已经编译完成的，安装readline-devel后，可以通过easy_install readline的方式来添加此功能（未测试）。


## Key Bindings
在python的终端中，可以进行一些自定义的设置，具体设置内容存放在~/.inputrc。
按键的自定义设置：
key-name: function-name
例如讲tab键设置自动补全
Tab: complete  
（不过设置完以后发现无法根据python语法进行自动补全）

也可以进行其他的一些选项设置
例如：
set horizontal-scroll-mode On  #如果输入超过了screen宽度，仍然单行显示


选项以及按键自定义设置具体可以参考[这里](http://web.mit.edu/gnu/doc/html/rlman_1.html)
