var graph = new Q.Graph(canvas);
//graph.zoomToOverview();
graph.moveToCenter(0.8);
var imagepath = "/qunee/images/"

var Colors = {
        blue: "#2898E0",
        yellow: "#fcfb9b",
        red: "#E21667",
        dark: "#1D4876",
        gray: "#888"
    }

function createGroup(padding){
    var group = graph.createGroup();
    group.groupImage = graphs.group_cloud;
    group.padding = padding || 30;
    return group;
}
function createImageNode(name, x, y, image, group){
    var node = graph.createNode(name, x, y);
    if(Q.isString(image)){
            image = imagepath + image;
    }
    node.image = image;
    if(group){
        group.addChild(node);
    }
    return node;
}

function createServerNode(name,x, y, group){
    var node =  createImageNode(name, x, y,"server.png", group)
    //node.image = Q.Graphs.server;
    //return node;
    node.setStyle(Q.Styles.BORDER, 2);
    node.setStyle(Q.Styles.BORDER_COLOR, "#2898E0");
    node.setStyle(Q.Styles.PADDING, new Q.Insets(10, 5));
    return node;
}
function createCVMNode(name,x, y, group){
    var node = graph.createNode(name, x, y);
    node.image = Q.Graphs.server;
    node.setStyle(Q.Styles.BORDER, 2);
    node.setStyle(Q.Styles.BORDER_COLOR, "#2898E0");
    node.setStyle(Q.Styles.PADDING, new Q.Insets(10, 5));
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

function createEdge(name,a, b, color, dashed){
    var edge = graph.createEdge(name, a, b);
    if(dashed){
        edge.setStyle(Q.Styles.EDGE_LINE_DASH, [8, 5]);
    }
    edge.setStyle(Q.Styles.EDGE_WIDTH, 3);
    edge.setStyle(Q.Styles.EDGE_COLOR, color);
    edge.setStyle(Q.Styles.ARROW_TO, false);
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

function createTerminal(name, x, y,image,group){
    var node = graph.createNode(name, x, y);
    //images = Q.Shapes.getShape(Q.Consts.SHAPE_RECT, 30, 15);
    if(Q.isString(image)){
           node.image = imagepath + image;
    }
    if(group){
        group.addChild(node);
    }
    node.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#888");
    return node;
}