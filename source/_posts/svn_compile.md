title:  "svn ����֧��httpЭ������"
date:   2016/07/18 22:27
categories: subversion
tag: svn http
---

svn �汾1.9.4
ϵͳcentos6.2
���밲װ��svn�ǳɹ��ˣ���linux��ִ�� svn checkout http://.... ����ʱ�򱨴�
svn: E170000: Unrecognized URL scheme for
ִ��svn --version


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


û��'http' scheme��

ԭ����svn1.8�汾�Ժ���Ҫserf�����֧�ַ��� http Э��İ汾�⣬��Ȼ�ͻᱨ��.serf��Ҫ��scons�����밲װ�������Ȱ�װ��scons

<!--language:c-->

    pip install scons

ע��������Լ������python�汾��scons��װ�ɹ�����python��bin·���±༭��scons�ļ���������#! /usr/bin/env python �޸�Ϊ�Լ������pythonִ��·��

svn 1.9.4�汾��Ҫserf1.3.4���ϰ汾�������ص���1.3.8


<!--language:c-->

    wget https://archive.apache.org/dist/serf/serf-1.3.8.tar.bz2
    tar -xvf serf-1.3.8.tar.bz2
    cd serf-1.3.8
    scons PREFIX=/usr/local/serf APR=/apps/apr/bin/apr-1-config APU=/apps/apr-util/bin/apu-1-config
    scons install
    scons -c

���±���svn ���� --with-serf=/usr/local/serf

<!--language:c-->

    ./configure  --with-serf=/usr/local/serf

Ȼ��serf��lib·����ӵ�ϵͳ����·��

<!--language:c-->

    vim /etc/ld.so.conf.d/serf.conf
    �������ݣ�/usr/local/serf/lib
    ldconfig

����ᱨ��
svn: error while loading shared libraries: libserf-1.so.1: cannot open shared object file: No such file or directory

svn --version ������Ϣ


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


