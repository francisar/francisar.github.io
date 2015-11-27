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

## 正文
言归正传，先上图
简易拓扑图如下

<div style="height: 500px;" id="canvas"/>
<script>
var graph = new Q.Graph(canvas);
graph.moveToCenter(0);
graph.zoomOut(0,0);
graph.zoomOut(0,0);
function createSubGroup(name,x, y,network, renderColor){
    var group = createGroup();
    group.name = name;
    if(renderColor){
        group.setStyle(Q.Styles.RENDER_COLOR, renderColor);
    }
    var a = createImageNode("Router", 49 + x, 100 + y,"router.png" , group);
    var b = createImageNode("Switch", 191 + x, 100 + y,"exchange.png" , group);
    var c = createImageNode( "PC", 313 + x, 100 + y,"pc.png", group);
    createText(network, 191 + x, 160 + y, 14, Colors.dark, group);
    createEdge("",a, b, "#45E");
    createEdge("",c, b, "#45E");
    return a;
}

var VPNFlexEdgeUI = function(edge, graph){
    Q.doSuperConstructor(this, VPNFlexEdgeUI, arguments);
}
VPNFlexEdgeUI.prototype = {
    drawEdge: function(path, fromUI, toUI, edgeType, fromBounds, toBounds){
        var from = fromBounds.center;
        path.curveTo(from.x, from.y, internet.x, internet.y);
    }
}
Q.extend(VPNFlexEdgeUI, Q.EdgeUI);
var cloud_group = createGroup(100);
graph.styles = {};
graph.styles[Q.Styles.LABEL_FONT_SIZE] = 16;



//var qunee = createCVMNode("Qunee", 100, 50);
var ip1 = "Database \n WanIp:100.1.100.1 \n LanIP:10.1.10.1";
var ip2 = "WebServer \n WanIp:100.1.100.2 \n LanIP:10.1.10.2";
var ip3 = "GateWay \n WanIp:100.1.100.3 \n LanIP:10.1.10.3";
var cloud_server1 = createServerNode(ip1,140,0,cloud_group);
var cloud_server2 = createServerNode(ip2,340,0,cloud_group);
var cloud_server3 = createServerNode(ip3,340,200,cloud_group);
var cloud_switch = createSwitchNode("Switch",140,200,cloud_group);
createText("Public Cloud", 250, -80, 24, Colors.dark, cloud_group);
createEdge("",cloud_server1, cloud_switch, "#45E");
createEdge("",cloud_server2, cloud_switch, "#45E");
createEdge("",cloud_server3, cloud_switch, "#45E");

var internet = createImageNode( "Internet", 600, 295,graphs.group_cloud);
internet.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
internet.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
internet.setStyle(Q.Styles.LABEL_FONT_SIZE, 24);
internet.setStyle(Q.Styles.LABEL_FONT_STYLE, "bold");
internet.size = {width: 200};


remote = createTerminal("Remote Access",900,-50);


createEdge("",cloud_group, internet, "#45E");

sub1 = createSubGroup("Beijing",700,100,"192.168.2.0/24")
sub2 = createSubGroup("Tianjin",700,300,"192.168.3.0/24")

createEdge("",sub1, internet, "#45E");
createEdge("",sub2, internet, "#45E");
createEdge("",remote, internet, "#45E");


createEdge("IPsec",sub1, cloud_server3, "#F80", true).uiClass = VPNFlexEdgeUI;
createEdge("IPsec",sub2, cloud_server3, "#F80", true).uiClass = VPNFlexEdgeUI;
createEdge("OPENVPN \n 172.16.1.0/24",remote, cloud_server3, "#F80", true).uiClass = VPNFlexEdgeUI;
</script>

|      位置     |    设备   |     公网IP     |  内网IP/网段  |   VIP/网段   |
|:-------------:|:---------:|:--------------:|:-------------:|:------------:|
|     公有云    |  GateWay  |   100.1.100.3  |    10.1.10.3  |172.16.1.1    |
|     公有云    |  WebServer|   100.1.100.2  |    10.1.10.2  |              |
|     公有云    |  Database |   100.1.100.1  |    10.1.10.1  |              |
|   北京办公区  |  Router   |       随机     | 192.168.2.0/24|              |
|   天津办公区  |  Router   |       随机     | 192.168.3.0/24|              |
|   远程办公    |    PC     |       随机     |      随机     |172.16.0.1/24 |

如上图以及表格所示：
1、北京办公区和天津办公区域与公有云GateWay服务器建立ipsec VPN ，感兴趣流设置为<font color=red>192.168.2.0/24，192.168.3.0/24，172.16.0.1/24</font>（为了与远程办公实现内网通信）
2、远程办公与 GateWay建立openvpn隧道，服务器给客户端推送路由<font color=red>192.168.2.0/24，192.168.3.0/24</font>
3、在日常开发的过程中，会涉及到线上数据库的只读访问，如果直接开放数据库的公网访问权限，会很不安全，此时可以在GateWay服务器上通过DNAT+SNAT的方法，给办公网的用户以及远程办公的用户虚拟一个172.16.2.0/24的网段用以以内网的形式访问公有云中除GateWay其他的云计算的资源
<font color=red>
注：
1、远程办公选用openvpn，一是因为openvpn是加密的vpn，更重要的是openvpn可以由服务端给客户端推送路由；
2、以上第三点只用作日常开发使用，不可用于业务
</font>

通过此方案，即可在一个小的创业公司建立起公司的内网办公体系，当然，如果使用了公有云的私有网络功能，则不需要这么麻烦，可以由更优雅的解决方案。