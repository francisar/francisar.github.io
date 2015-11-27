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
var ip1 = "WanIp:100.1.100.1 \n LanIP:10.1.10.1";
var ip2 = "WanIp:100.1.100.2 \n LanIP:10.1.10.2";
var ip3 = "WanIp:100.1.100.3 \n LanIP:10.1.10.3";
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