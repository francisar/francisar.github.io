title:  "svn 编译支持http协议问题"
date:   2016/07/18 22:27
categories: subversion
tag: svn http
---

svn 版本1.9.4
系统centos6.2
编译安装的svn是成功了，在linux上执行 svn checkout http://.... 命令时候报错
svn: E170000: Unrecognized URL scheme for
执行svn --version


<!--language:c-->

    svn, version 1.9.4 (r1740329)
    compiled Jul 18 2016, 14:01:25 on x86_64-unknown-linux-gnu

    Copyright (C) 2016 The Apache Software Foundation.
    This software consists of contributions made by many people;
    see the NOTICE file for more information.
    Subversion is open source software, see http://subversion.apache.org/

    The following repository access (RA) modules are available:

       * ra_svn : Module for accessing a repository using the svn network protocol.
         - with Cyrus SASL authentication
         - handles 'svn' scheme
       * ra_local : Module for accessing a repository on local disk.
         - handles 'file' scheme


没有'http' scheme。

原来，svn1.8版本以后，需要serf软件包支持访问 http 协议的版本库，不然就会报错.serf需要用scons来编译安装，所以先安装下scons

<!--language:c-->

    pip install scons

注：如果是自己编译的python版本，scons安装成功后，再python的bin路径下编辑下scons文件，将首行#! /usr/bin/env python 修改为自己编译的python执行路径

svn 1.9.4版本需要serf1.3.4以上版本，我下载的是1.3.8


<!--language:c-->

    wget https://archive.apache.org/dist/serf/serf-1.3.8.tar.bz2
    tar -xvf serf-1.3.8.tar.bz2
    cd serf-1.3.8
    scons PREFIX=/usr/local/serf APR=/apps/apr/bin/apr-1-config APU=/apps/apr-util/bin/apu-1-config
    scons install
    scons -c

重新编译svn 加上 --with-serf=/usr/local/serf

<!--language:c-->

    ./configure  --with-serf=/usr/local/serf

然后将serf的lib路径添加到系统搜索路径

<!--language:c-->

    vim /etc/ld.so.conf.d/serf.conf
    加入内容：/usr/local/serf/lib
    ldconfig

否则会报错
svn: error while loading shared libraries: libserf-1.so.1: cannot open shared object file: No such file or directory

svn --version 看下信息


<!--language:c-->

    svn, version 1.9.4 (r1740329)
    compiled Jul 18 2016, 14:01:25 on x86_64-unknown-linux-gnu

    Copyright (C) 2016 The Apache Software Foundation.
    This software consists of contributions made by many people;
    see the NOTICE file for more information.
    Subversion is open source software, see http://subversion.apache.org/

    The following repository access (RA) modules are available:

    * ra_svn : Module for accessing a repository using the svn network protocol.
        - with Cyrus SASL authentication
        - handles 'svn' scheme
    * ra_local : Module for accessing a repository on local disk.
        - handles 'file' scheme
    * ra_serf : Module for accessing a repository via WebDAV protocol using serf.
        - using serf 1.3.8 (compiled with 1.3.8)
        - handles 'http' scheme
        - handles 'https' scheme


