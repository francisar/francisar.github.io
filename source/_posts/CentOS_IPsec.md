title:  "基于公有云建设私有网络（二）"
date:   2015/11/26 15:41
categories: 网络技术
tag: VPN IPsec 网络 GRE 
---


上篇博客中，介绍了下网络拓扑的规划和设计，现在，着重介绍下CentOS与H3C路由器的ipsecVPN的配置，CentOS使用的软件包是openswan，由于办公网络使用的是民用网，出口IP不固定，因此采用ike野蛮模式进行协商

## IPsec介绍

IPsec 协议工作在OSI 模型的第三层，使其在单独使用时适于保护基于TCP或UDP的协议（如 安全套接子层（SSL）就不能保护UDP层的通信流）。这就意味着，与传输层或更高层的协议相比，IPsec协议必须处理可靠性和分片的问题，这同时也增加了它的复杂性和处理开销。它有两种安全协议，分别是AH和ESP，AH主要提供身份验证和数据完整性验证，ESP则提供身份验证，数据完整性验证以及加密功能（我们选用ESP）。封装模式有传输模式和隧道模式（我们选择隧道模式）。密钥管理采用ISAKMP。详细内容可以到H3C的
[IPsec原理](http://www.h3c.com.cn/Service/Channel_Service/Operational_Service/ICG_Technology/201005/675214_30005_0.htm)介绍帖子中查看，讲的挺详细的。


## CentOS配置

1. CentOS中可以通过yum安装对应的包
<!--lang:bash-->

    yum install epel-release
    yum install openswan

2. 修改/添加 /etc/sysctl.conf

<!--lang:bash-->

    net.ipv4.ip_forward = 1
    net.ipv4.conf.default.accept_redirects = 0
    net.ipv4.conf.default.send_redirects = 0
    net.ipv4.conf.eth0.rp_filter = 0
    net.ipv4.conf.default.rp_filter = 0
    
3. 然后将上述配置生效

<!--lang:bash-->

    sysctl -p


4. 修改/添加ipsec配置文件/etc/ipsec.conf
<!--lang:bash-->

    config setup
	    protostack=netkey
	    listen=100.1.100.3
	    plutodebug=none
	    plutostderrlog=/data/ipsec/log/pluto.log
	    dumpdir=/data/ipsec/pluto/
	    nat_traversal=yes
	    virtual_private=%v4:10.0.0.0/8,%v4:192.168.0.0/16,%v4:172.16.0.0/12
        include /etc/ipsec.d/*.conf
4. 添加各分部配置文件（在/etc/ipsec.d/下）
公有云到北京分部cloud_to_bj.conf
<!--lang:bash-->

    conn    cloud_to_bj_net
        connaddrfamily=ipv4
        aggrmode=yes
        authby=secret
        auto=start
        ike=aes128-sha1;modp1024
        ## phase 1 ##
        keyexchange=ike
        ## phase 2 ##
        phase2=esp
        phase2alg=aes128-sha1;modp1024
        compress=no
        pfs=yes
        type=tunnel
        left=100.1.100.3
        leftsubnet=172.16.0.0/16
        leftid=@cloud.cloud.com
        right=%any
        rightsubnet=192.168.2.0/24
        rightid=@bj.bj.com
公有云到天津分部cloud_to_tj.conf
<!--lang:bash-->

    conn    cloud_to_bj_net
        connaddrfamily=ipv4
        aggrmode=yes
        authby=secret
        auto=start
        ike=aes128-sha1;modp1024
        ## phase 1 ##
        keyexchange=ike
        ## phase 2 ##
        phase2=esp
        phase2alg=aes128-sha1;modp1024
        compress=no
        pfs=yes
        type=tunnel
        left=100.1.100.3
        leftsubnet=172.16.0.0/16
        leftid=@cloud2.cloud.com
        right=%any
        rightsubnet=192.168.3.0/24
        rightid=@tj.tj.com
北京分部到天津分部bj_to_tj.conf
<!--lang:bash-->

    conn   bj_to_tj_net
        connaddrfamily=ipv4
        aggrmode=yes
        authby=secret
        auto=start
        ike=aes128-sha1;modp1024
        ## phase 1 ##
        keyexchange=ike
        ## phase 2 ##
        phase2=esp
        phase2alg=aes128-sha1;modp1024
        compress=no
        pfs=yes
        type=tunnel
        left=100.1.100.3
        leftsubnet=192.168.2.0/24
        leftid=@cloud1.cloud.com
        right=%any
        rightsubnet=192.168.3.0/24
        rightid=@tj1.tj.com
天津分部到北京分部tj_to_bj.conf
<!--lang:bash-->

    conn   tj_to_bj_net
    connaddrfamily=ipv4
    aggrmode=yes
        authby=secret
        auto=start
        ike=aes128-sha1;modp1024
        ## phase 1 ##
        keyexchange=ike
        ## phase 2 ##
        phase2=esp
        phase2alg=aes128-sha1;modp1024
        compress=no
        pfs=yes
        type=tunnel
        left=100.1.100.3
        leftsubnet=192.168.3.0/24
        leftid=@cloud3.cloud.com
        right=%any
        rightsubnet=192.168.2.0/24
        rightid=@bj1.bj.com
设置预共享密钥，在/etc/ipsec.d/下创建cloud.secrets,添加如下内容
<!--lang:bash-->

    100.1.100.3   %any:   PSK "123456" 
    
<font color=red>注：123456为预共享密钥，正式设置时一定要修改成一个安全的值</font>
启动以及验证ipsec服务
<!--lang:bash-->

    service ipsec start
    chkconfig ipsec on
    ipsec verify
    
结果如下即可
<!--lang:bash-->

    erifying installed system and configuration files
    Version check and ipsec on-path                       [OK]
    Libreswan 3.8 (netkey) on 3.10.0-123.9.3.el7.x86_64
    Checking for IPsec support in kernel                  [OK]
    NETKEY: Testing XFRM related proc values
         ICMP default/send_redirects                  [OK]
         ICMP default/accept_redirects                [OK]
         XFRM larval drop                             [OK]
    Pluto ipsec.conf syntax                               [OK]
    Hardware random device                                [N/A]
    Checking rp_filter                                    [OK]
    Checking that pluto is running                        [OK]
    Pluto listening for IKE on udp 500                   [OK]
    Pluto listening for IKE/NAT-T on udp 4500            [OK]
    Pluto ipsec.secret syntax                            [OK]
    Checking NAT and MASQUERADEing                        [TEST INCOMPLETE]
    Checking 'ip' command                                 [OK]  
    Checking 'iptables' command                           [OK]
    Checking 'prelink' command does not interfere with FIPSChecking for obsolete ipsec.conf options              [OK]
    Opportunistic Encryption                              [DISABLED]

5. H3C路由器配置
北京分部路由器
配置ike proposal

<!--lang:bash-->

    ike proposal 1
    encryption-algorithm aes-cbc 128
    dh group2
配置ikepeer

<!--lang:bash-->

    ike peer bj_cloud
    exchange-mode aggressive
    proposal 1
    pre-shared-key simple 123456
    id-type name
    remote-name cloud.cloud.com
    remote-address 100.1.100.3
    local-name bj.bj.com
    nat traversal
    
    ike peer bj_tj
    exchange-mode aggressive
    proposal 1
    pre-shared-key simple 123456
    id-type name
    remote-name cloud3.cloud.com
    remote-address 100.1.100.3
    local-name bj1.bj.com
    nat traversal
配置ipsec transform-set

<!--lang:bash-->

    ipsec transform-set bj
    encapsulation-mode tunnel
    transform esp
    esp authentication-algorithm sha1
    esp encryption-algorithm aes-cbc-128
配置ipsec policy

<!--lang:bash-->

    ipsec policy bj 1 isakmp
    security acl 3000
    pfs dh-group2
    ike-peer bj_cloud
    transform-set bj 
    ipsec policy bj 2 isakmp
    security acl 3001
    pfs dh-group2
    ike-peer bj_cloud
    transform-set bj

配置感兴趣流
<!--lang:bash-->
    
    acl number 3000
    rule 0 permit ip source 192.168.2.0 0.0.0.255 destination 172.16.0.0 0.0.255.255
    rule 20 deny ip
    acl number 3001
    rule 0 permit ip source 192.168.2.0 0.0.0.255 destination 192.168.3.0 0.0.0.255
    rule 20 deny ip
    
在接口上启用ipsec
<!--lang:bash-->

    interface Dialup 1
    ipsec policy bj
