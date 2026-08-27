title:  "比特币中的密码学"
date:   2023/02/07 14:41
categories: 区块链
tag: 区块链 比特币
---

### 思维导图



<script>
function HFlexEdgeUI(edge, graph){
    Q.doSuperConstructor(this, HFlexEdgeUI, arguments);
}

HFlexEdgeUI.prototype = {
    drawEdge: function(path, fromUI, toUI, edgeType, fromBounds, toBounds){
        var from = fromBounds.center;
        var to = toBounds.center;
        var cx = (from.x + to.x) / 2;
        var cy = (from.y + to.y) / 2;
        path.quadTo(cx, to.y + 0.1);
    }
}

Q.extend(HFlexEdgeUI, Q.EdgeUI);
window.HFlexEdgeUI = HFlexEdgeUI;
Q.loadClassPath(HFlexEdgeUI, "HFlexEdgeUI");

var graph = new Q.Graph(canvas);
graph.moveToCenter(0);
graph.zoomOut(0,0);
graph.zoomOut(0,0);
graph.editable = false;
graph.enableDoubleClickToOverview = false;
var transparent = '#ff000000';


function createEdge(name, from, to){
    var edge = graph.createEdge(name, from, to);
    edge.setStyle(Q.Styles.ARROW_TO, Q.Consts.SHAPE_TRIANGLE);
    edge.setStyle(Q.Styles.ARROW_TO_SIZE, 5);
    edge.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, "#444");
    edge.setStyle(Q.Styles.ARROW_TO_STROKE, 1);
    edge.setStyle(Q.Styles.ARROW_TO_STROKE_STYLE, "#444");
    edge.uiClass = HFlexEdgeUI;
}

function createText(text, x, y){
    var node = graph.createNode(text, x, y);
    node.image = null;
    node.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#2898E0");
    node.setStyle(Q.Styles.LABEL_BACKGROUND_GRADIENT, new Q.Gradient(Q.Consts.GRADIENT_TYPE_LINEAR, ['#00d4f9', '#1ea6e6'], null, Math.PI/2));
    node.setStyle(Q.Styles.LABEL_COLOR, "#FFF");
    node.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(5, 10));
    node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_BORDER, 0.5);
    node.setStyle(Q.Styles.LABEL_BORDER_STYLE, "#1D4876");
    node.setStyle(Q.Styles.SELECTION_COLOR, "#0F0");
    return node;
}

function localToGlobal(x, y, canvas){
    x += window.pageXOffset;
    y += window.pageYOffset;
    var clientRect = canvas.getBoundingClientRect();
    return {x: x + clientRect.left, y: y + clientRect.top};
}

var layouter = new Q.TreeLayouter(graph);


layouter.vGap = 20;


cryptography = createText("Cryptography(密码学)");
cryptography.tooltipType = "text";
cryptography.data = data;
level = level || 0;
cryptography.level = level;
cryptography.parentChildrenDirection = data.parentChildrenDirection;
cryptography.layoutType = data.layoutType;


graph.callLater(function(){
    layouter.doLayout();
    graph.zoomToOverview();
})
</script>

