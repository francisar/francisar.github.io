title:  "svn 编译支持http协议问题"
date:   2016/07/18 22:27
categories: subversion
tag: svn http
---

svn 版本1.9
系统centos6.2
编译安装的svn是成功了，在linux上执行 svn checkout http://.... 命令时候报错
svn: E170000: Unrecognized URL scheme for
又重新 svn --version
svn, version 1.8.9 (r1591380)
   compiled Jun  7 2014, 06:14:20 on x86_64-unknown-linux-gnu
Copyright (C) 2014 The Apache Software Foundation.
This software consists of contributions made by many people;
see the NOTICE file for more information.
Subversion is open source software, see http://subversion.apache.org/
The following repository access (RA) modules are available:
* ra_svn : Module for accessing a repository using the svn network protocol.
  - handles 'svn' scheme
* ra_local : Module for accessing a repository on local disk.
  - handles 'file' scheme
发现 dev 模块根本没加载进来.....



在svn1.8版本之前按照原来的安装方法是可以加载到dav的模块，但是，1.8版本以后，需要serf软件包支持访问 http 协议的版本库，不然就会报错.   serf需要用scons来编译安装，所以先安装下scons



http://sourceforge.net/projects/scons/files/scons/2.3.3/

下载最新的源码安装

tar xvf scons-2.3.3.tar.gz 

cd scons-2.3.3

python setup.py install





下载，编译安装scons
wget https://serf.googlecode.com/files/serf-1.3.3.tar.bz2
或者到http://download.csdn.net/detail/xiangliangyu2008/8086429下载




tar -xvf serf-1.3.3.tar.bz2

cd serf-1.3.3

scons PREFIX=/usr/local/serf

scons install

scons -c





重新编译svn 加上 --with-serf=/usr/local/serf
./configure  --with-serf=/usr/local/serf



再加一步，把serf源码包里的 libserf-1.so.1 复制到svn的安装目录下的lib目录或者放到/usr/lib64/，否则会报错
svn: error while loading shared libraries: libserf-1.so.1: cannot open shared object file: No such file or directory



ln -s /usr/local/serf/lib /usr/lib64/libserf
ldconfig




svn --version 看下信息

svn, version 1.8.9 (r1591380)
   compiled Jun  8 2014, 01:20:36 on x86_64-unknown-linux-gnu
Copyright (C) 2014 The Apache Software Foundation.
This software consists of contributions made by many people;
see the NOTICE file for more information.
Subversion is open source software, see http://subversion.apache.org/
The following repository access (RA) modules are available:
* ra_svn : Module for accessing a repository using the svn network protocol.
  - handles 'svn' scheme
* ra_local : Module for accessing a repository on local disk.
  - handles 'file' scheme
* ra_serf : Module for accessing a repository via WebDAV protocol using serf.
  - using serf 1.3.3
  - handles 'http' scheme
  - handles 'https' scheme
ok，收工.....
