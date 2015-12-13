title:  "基于公有云建设私有网络（三）"
date:   2015/12/13 14:41
categories: 网络技术
tag: VPN openvpn 网络 
---

接下来是openvpn的配置

## openvpn介绍
OpenVpn的技术核心是虚拟网卡，其次是SSL协议实现，由于SSL协议在其它的词条中介绍的比较清楚了，这里重点对虚拟网卡及其在OpenVpn的中的工作机理进行介绍：虚拟网卡是使用网络底层编程技术实现的一个驱动软件，安装后在主机上多出现一个网卡，可以像其它网卡一样进行配置。服务程序可以在应用层打开虚拟网卡，如果应用软件（如IE）向虚拟网卡发送数据，则服务程序可以读取到该数据，如果服务程序写合适的数据到虚拟网卡，应用软件也可以接收得到。虚拟网卡在很多的操作系统下都有相应的实现，这也是OpenVpn能够跨平台一个很重要的理由。

## openvpn服务端配置

安装不做赘述，主要是配置文件
<!--lang:bash-->

    local       100.1.100.3                                 ;服务器监听的IP地址
    port        1194                                        ;端口
    proto       udp                                         ;协议使用udp
    dev         tun                                         ;使用tun模式（还有一种模式是tap）
    ca          /etc/openvpn/easy-rsa/2.0/keys/ca.crt       ;ca证书
    cert        /etc/openvpn/easy-rsa/2.0/keys/server.crt   ;服务器证书
    key         /etc/openvpn/easy-rsa/2.0/keys/server.key   ;服务器密钥
    dh          /etc/openvpn/easy-rsa/2.0/keys/dh2048.pem   
    server      172.16.1.0 255.255.255.0                    ;给客户端分配的IP地址段
    push        "route 192.168.2.0 255.255.255.0"           ;推送给客户端的路由，使远程接入的员工可以访问北京办公网
    push        "route 172.16.2.0 255.255.255.0"            ;使远程办公员工可以访问公有云虚拟出来的网段
    push        "route 192.168.3.0 255.255.255.0"           ;使远程接入的员工可以访问天津办公网
    push        "dhcp-option DNS 192.168.2.200"             ;推送内部dns服务器地址为客户端dns
    log         /data/log/openvpn.log
    keepalive   10 120
    verb        3
    client-to-client
    comp-lzo
    persist-key
    persist-tun

## openvpn客户端

客户端配置文件如下
<!--lang:bash-->

    client
    proto udp
    dev tun
    remote 100.1.100.3  1194  
    ca ca.crt
    cert client.crt
    key client.key  
    dh dh2048.pem
    keepalive 10 120
    comp-lzo
    comp-noadapt
    user daemon
    group daemon
    persist-key
    persist-tun
    status openvpn-status.log
    verb 3