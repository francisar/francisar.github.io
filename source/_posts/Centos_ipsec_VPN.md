title:  "基于公有云建设私有网络（一）"
date:   2015/11/26 15:41
categories: 网络技术
tag: VPN IPsec 网络 GRE 
---

## 写在前面的话
在现今多种多样的需求以及复杂的网络环境下，VPN的使用场景越来越多，不同类型的vpn用于不同的场景，例如，ssl，l2tp,pptp，openvpn这种vpn主要用于翻墙，企业远程办公等场景；ipsec vpn或者gre over ipsec vpn被用于企业多办公地点的内网打通；
在云计算火热的今天，vpn的隧道技术亦被应用于云计算基础网络架构之中，公有云的浮动IP，VPC SDN网络的建设，无不是利用vpn隧道来屏蔽底层交换机，机架的物理位置带来的限制。


## 背景
在创业或者小型企业的发展过程中，应用比较多的应该是ipsec或者gre over ipsec vpn，创业型的企业，发展初期很难有有自己的机房，内部的系统基本都会在公有云上建设，但是有一些内部系统又不希望通过公网直接访问，甚至到一定阶段会多个办公地点以及有部分员工远程办公的需求，这就需要用到vpn来解决这些问题。


创业企业由于资金问题，在创业初期办公环境不会使用商用网络，而是使用相对便宜的民用网络,所以一旦出现多个办公地点，没有办法直接建立vpn，需要通过公有云服务器打通多个办公地点的内网，同时通过公有云服务器，为远程办公的人员提供接入点

## 拓扑图
简易拓扑图如下

<div style="height: 500px;" id="canvas"/>

<script type="text/javascript" >
    var graph = new Q.Graph('canvas');

    var hello = graph.createNode("Hello", -100, -50);
    hello.image = Q.Graphs.server;
    var qunee = graph.createNode("Qunee", 100, 50);
    var edge = graph.createEdge("Hello\nQunee", hello, qunee);
    edge.setStyle(Q.Styles.LABEL_OFFSET_Y, -10);
    edge.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_TOP);
    edge.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_BOTTOM);
    edge.setStyle(Q.Styles.LABEL_BORDER, 1);
    edge.setStyle(Q.Styles.LABEL_POINTER, true);
    edge.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(2, 5));
    edge.setStyle(Q.Styles.LABEL_BACKGROUND_GRADIENT,
            Q.Gradient.LINEAR_GRADIENT_VERTICAL);
</script>