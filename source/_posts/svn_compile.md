title:  "svn ����֧��httpЭ������"
date:   2016/07/18 22:27
categories: subversion
tag: svn http
---

svn �汾1.9
ϵͳcentos6.2
���밲װ��svn�ǳɹ��ˣ���linux��ִ�� svn checkout http://.... ����ʱ�򱨴�
svn: E170000: Unrecognized URL scheme for
������ svn --version
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
���� dev ģ�����û���ؽ���.....



��svn1.8�汾֮ǰ����ԭ���İ�װ�����ǿ��Լ��ص�dav��ģ�飬���ǣ�1.8�汾�Ժ���Ҫserf�����֧�ַ��� http Э��İ汾�⣬��Ȼ�ͻᱨ��.   serf��Ҫ��scons�����밲װ�������Ȱ�װ��scons



http://sourceforge.net/projects/scons/files/scons/2.3.3/

�������µ�Դ�밲װ

tar xvf scons-2.3.3.tar.gz 

cd scons-2.3.3

python setup.py install





���أ����밲װscons
wget https://serf.googlecode.com/files/serf-1.3.3.tar.bz2
���ߵ�http://download.csdn.net/detail/xiangliangyu2008/8086429����




tar -xvf serf-1.3.3.tar.bz2

cd serf-1.3.3

scons PREFIX=/usr/local/serf

scons install

scons -c





���±���svn ���� --with-serf=/usr/local/serf
./configure  --with-serf=/usr/local/serf



�ټ�һ������serfԴ������ libserf-1.so.1 ���Ƶ�svn�İ�װĿ¼�µ�libĿ¼���߷ŵ�/usr/lib64/������ᱨ��
svn: error while loading shared libraries: libserf-1.so.1: cannot open shared object file: No such file or directory



ln -s /usr/local/serf/lib /usr/lib64/libserf
ldconfig




svn --version ������Ϣ

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
ok���չ�.....
