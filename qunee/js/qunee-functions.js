var graph = new Q.Graph(canvas);
graph.zoomToOverview();

function createImageNode(name, x, y, image){
    var node = graph.createNode(name, x, y);
    if(image){
        node.image = "/qunee/images/" + image;
    }
    return node;
}

function createServerNode(name,x, y){
    var node = graph.createNode(name, x, y);
    node.image = Q.Graphs.server;
    return node;
}

function createRouterNode(name, x, y){
    return createImageNode(name, x, y,"router.png")
}

function createSwitchNode(name, x, y){
    return createImageNode(name, x, y,"exchange.png")
}

function createFirewallNode(name, x, y){
    return createImageNode(name, x, y,"firewall.png")
}


function createSwitch2Node(name, x, y){
    return createImageNode(name, x, y,"exchange2.png")
}

function createEdge(a, b, angle){
    var edge = graph.createEdge(a, b);
    edge.setStyle(Q.Styles.ARROW_TO, false);
    edge.angle = angle;
    return edge;
}

function createTerminal(name, x, y){
    var node = graph.createNode(name, x, y);
    node.image = Q.Shapes.getShape(Q.Consts.SHAPE_RECT, 30, 15);
    node.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#888");
    return node;
}