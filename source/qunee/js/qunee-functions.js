var graph = new Q.Graph(canvas);
//graph.zoomToOverview();
graph.moveToCenter(0.8);




function createGroup(padding){
    var group = graph.createGroup();
    group.groupImage = graphs.group_cloud;
    group.padding = padding || 30;
    return group;
}
function createImageNode(name, x, y, image, group){
    var node = graph.createNode(name, x, y);
    if(image){
        node.image = "source/qunee/images/" + image;
    }
    node.setStyle(Q.Styles.BORDER, 2);
    node.setStyle(Q.Styles.BORDER_COLOR, "#2898E0");
    node.setStyle(Q.Styles.PADDING, new Q.Insets(10, 20));
    if(group){
        group.addChild(node);
    }
    return node;
}

function createServerNode(name,x, y, group){
    //var node = graph.createNode(name, x, y);
    //node.image = Q.Graphs.server;
    //return node;
    return createImageNode(name, x, y,"server.png", group)
}
function createCVMNode(name,x, y, group){
    var node = graph.createNode(name, x, y);
    node.image = Q.Graphs.server;
    return node;
}

function createRouterNode(name, x, y, group){
    return createImageNode(name, x, y,"router.png", group)
}

function createSwitchNode(name, x, y, group){
    return createImageNode(name, x, y,"exchange.png", group)
}

function createFirewallNode(name, x, y, group){
    return createImageNode(name, x, y,"firewall.png", group)
}


function createSwitch2Node(name, x, y, group){
    return createImageNode(name, x, y,"exchange2.png", group)
}

function createEdge(a, b, angle){
    var edge = graph.createEdge(a, b);
    edge.setStyle(Q.Styles.ARROW_TO, false);
    edge.angle = angle;
    return edge;
}

function createText(name, x, y, fontSize, color, parent){
    var text = graph.createText(name, x, y);
    text.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    text.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
    text.setStyle(Q.Styles.LABEL_FONT_SIZE, fontSize);
    text.setStyle(Q.Styles.LABEL_COLOR, color);
    text.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, null);
    if(parent){
        parent.addChild(text);
    }
    return text;
}

function createTerminal(name, x, y){
    var node = graph.createNode(name, x, y);
    node.image = Q.Shapes.getShape(Q.Consts.SHAPE_RECT, 30, 15);
    node.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#888");
    return node;
}