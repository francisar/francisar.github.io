title:  "K8S证书"
date:   2015/12/13 14:41
categories: K8S
tag: K8S 证书
---


### x509证书信息说明

以下是kube-apiserver的证书示例 
<!--lang:bash-->

    Certificate:
        Data:
            Version: 3 (0x2)              # 版本号 
            Serial Number: 12 (0xc)       # 序列号 对于所有的版本，同一个CA颁发的证书序列号都必须是唯一的。
            Signature Algorithm: sha256WithRSAEncryption           # ID签名算法
            Issuer: C = BJ, O = Tech, OU = SRE, CN = www.ca.com    # 颁发者名称
            Validity                                               # 有效期 
                Not Before: Aug 14 10:01:46 2022 GMT
                Not After : Aug 11 10:01:46 2032 GMT
            Subject: C = BJ, ST = BJ, L = BJ, O = Tech, OU = SRE, CN = system:api-server
            Subject Public Key Info:                    # 主题公钥信息
                Public Key Algorithm: rsaEncryption     # 公钥算法
                    RSA Public-Key: (2048 bit)          # 公钥
                    Modulus:
                Exponent: 65537 (0x10001)
            X509v3 extensions:
                X509v3 Authority Key Identifier:        
                    DirName:/C=BJ/O=Tech/OU=SRE/CN=www.ca.com
                    serial:BB:A3:04:8F:CF:8C:F8:99
                X509v3 Basic Constraints:      # 用于指示一份证书是不是CA证书。
                    CA:FALSE
                X509v3 Key Usage:     # 指定了这份证书包含的公钥可以执行的密码操作
                    Digital Signature, Non Repudiation, Key Encipherment, Data Encipherment
                X509v3 Extended Key Usage:    # 典型用法是指定叶子证书中的公钥的使用目的。它包括一系列的OID，每一个都指定一种用途
                    TLS Web Server Authentication, TLS Web Client Authentication
                X509v3 Subject Alternative Name:     # 描述可以使用的主机名，IP地址等
                    DNS:www.kubernetes.com, DNS:master01.kubernetes.com, DNS:master02.kubernetes.com, IP Address:172.20.0.1   # 除了apiserver向外部暴露的域名，apiserver在集群内部对应的service ip，与需要加到这里
        Signature Algorithm: sha256WithRSAEncryption  # 证书签名算法

### kube-apiserver 证书相关配置


<!--lang:bash-->
      --etcd-certfile string                   
      --cert-dir string                      
      --tls-cert-file string                  
      --tls-private-key-file string           
      --tls-sni-cert-key namedCertKey         
      --client-ca-file string                           
      --oidc-ca-file string                              
      --requestheader-allowed-names strings             
      --requestheader-client-ca-file string              
      --kubelet-certificate-authority string        
      --kubelet-client-certificate string           
      --proxy-client-cert-file string             
      --proxy-client-key-file string               

对应以下几种需要证书通信的配置

1. client(kubectl，restapi等)：普通用户作为client与apiserver之间的通信，对各类资源进行操作
  * apiserver本身是一个http服务器，需要tls证书，对应以下两个配置
    * --tls-cert-file
    * --tls-private-key-file
  * apiserver也需要对client进行验证，但是client过多，因此需要统一的ca签发client证书
    * --client-ca-file
    * 除此以外，apiserver需要通过证书确认client的身份，通过CN和O来识别用户，开启RBAC的用户要配置CN和O做一些授权
      * CN：Common Name，kube-apiserver 从证书中提取作为请求的用户名 (User Name)；浏览器使用该字段验证网站是否合法；
      * O：Organization，kube-apiserver 从证书中提取该字段作为请求用户所属的组 (Group)
  * kubelet，kubeproxy：master与node之间的通信，存在两种模式，1是kubelet，kubeproxy作为client，去访问apiserver，2是apiserver作为client，去访问1是kubelet
    * kubelet，kubeproxy作为client，去访问apiserver(与上述client 访问模式类似)
    * apiserver作为client，去访问kubelet的相关配置
      * --kubelet-client-certificate  apiserver 作为client的证书
      * --kubelet-client-key apiserver 作为client的证书密钥
      * --kubelet-preferred-address-types  
      * --kubelet-certificate-authority  kubelet server证书的ca
    * kubelet 作为server的证书配置(以下3个命令行配置在后续版本会挪到--config指定的配置文件中)，
      * --tls-cert-file  kubelet 作为server的证书(在实际的部署过程中，该证书不建议手动生成，由集群统一签发，签发到--cert-dir= 参数指定的路径)
      * --tls-private-key-file  kubelet 作为server的证书密钥
      * --client-ca-file
2. etcd：k8s的存储库,主要是apiserver作为client，去访问etcd server
    * apiserver作为client的配置
      * --etcd-cafile etcd server证书的ca
      * --etcd-certfile etcd server的证书
      * --etcd-keyfile  etcd server证书的密钥
    * etcd 作为server的相关配置
      * --cert-file etcd 作为server的证书
      * --key-file etcd 作为server的证书密钥
3. webhook：这里指apiserver提供的admission-webhook，在数据持久化前调用webhook
4. aggregation layer：扩展apiserver, 需要将自定义的api注册到k8s中，相比CRD性能更新
    * aggregation 访问流程
      <div style="height: 700px;width: 900px" id="canvas"/>
5. pod: 在pod中调用apiserver (在pod中通过serviceacount认证，pod需要认证apiserver的证书，其他几种需要client和server双向认证。)
    * serviecaccount同样在apiserver有两个证书配置
      * --service-account-key-file  (service account issue的公钥，用于验证service account)
      * --service-account-signing-key-file (service-account-key-file 对应的密钥)
    * 对应controller也有一个配置项
      * --service-account-private-key-file  (service-account-key-file 对应的密钥，与apiserver --service-account-signing-key-file 配置相同的密钥文件，用来实际签署service account tokens)
  






<script>
var graph = new Q.Graph(canvas);
graph.moveToCenter(0);
graph.zoomOut(0,0);
graph.zoomOut(0,0);
var transparent = '#ff000000';
function createNode(name, x, y, color){
    var node = graph.createText(name, x, y);
    node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, color);
    node.setStyle(Q.Styles.LABEL_SIZE, new Q.Size(90, 50));
    node.setStyle(Q.Styles.LABEL_RADIUS, 0);
    node.setStyle(Q.Styles.LABEL_FONT_SIZE, 18);
    node.setStyle(Q.Styles.LABEL_COLOR, "#555");
    node.setStyle(Q.Styles.BORDER, 1);
    node.setStyle(Q.Styles.BORDER_COLOR, "#555");
    node.setStyle(Q.Styles.BORDER_RADIUS, 0);
    return node;
}

function createLabel(name, x, y){
    var node = graph.createText(name, x, y);
    node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    node.setStyle(Q.Styles.LABEL_RADIUS, 0);
    node.setStyle(Q.Styles.LABEL_FONT_SIZE, 16);
    node.setStyle(Q.Styles.BORDER, 0);
    return node;
}

function createTextArea(text, x, y){
    var textArea = graph.createText(text, x, y);
    textArea.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, Colors.yellow);
    textArea.setStyle(Q.Styles.LABEL_SIZE, new Q.Size(90, 30));
    textArea.setStyle(Q.Styles.LABEL_RADIUS, 0);
    textArea.setStyle(Q.Styles.LABEL_FONT_SIZE, 14);
    textArea.setStyle(Q.Styles.BORDER, 1);
    textArea.setStyle(Q.Styles.BORDER_COLOR, "#555");
    textArea.setStyle(Q.Styles.BORDER_RADIUS, 0);
    return textArea;
}

function createEdge(from, to, arrow_to, arrow_from){
    var edge = graph.createEdge(from, to);
    edge.setStyle(Q.Styles.ARROW_TO, arrow_to);
    edge.setStyle(Q.Styles.ARROW_FROM, arrow_from);
    return edge;
}

function createExtendRightEdge(from, to, arrow_to, arrow_from) {
    var edge = createEdge(from, to, arrow_to, arrow_from);
    edge.edgeType = Q.Consts.EDGE_TYPE_EXTEND_RIGHT;
    edge.setStyle(Q.Styles.EDGE_EXTEND, 50);
    return edge;
}


function createEdgeByCoordinates(point1X,point1Y,point2X,point2Y) {
    var point1 = createNode('',point1X,point1Y, transparent);
    var point2 = createNode('',point2X,point2Y, transparent);
    if (point1X === point2X) {
        var edge = createExtendRightEdge(point1,point2, true, false);
        return edge;
    } 
    var edge = createEdge(point1,point2, true, false);
    return edge
}

var line1X = 50;
var line2X = 500;
var line3X = 950;
var height = 850;

var topY = 50;
var bottomY = topY + height;




var user = createNode('User/Client',line1X,topY, transparent);
var userShadow = createNode('User/Client',line1X,bottomY, transparent);
var apiserver = createNode('Kube-apiserver/aggregator',line2X,topY, transparent);
var apiserverShadow = createNode('Kube-apiserver/aggregator',line2X,bottomY, transparent);
var aggregatedServer = createNode('aggregated apiserver',line3X,topY, transparent);
var aggregatedServerShadow  = createNode('aggregated apiserver',line3X,bottomY, transparent);





var userEdge = createEdge(user, userShadow, false, false);
var apiserverEdge = createEdge(apiserver, apiserverShadow, false,false);
var aggregatedServerEdge = createEdge(aggregatedServer, aggregatedServerShadow,false, false);



var clientToApiserver = createEdgeByCoordinates(line1X, 100, line2X, 100); 

var apiserverAuthentication = createEdgeByCoordinates(line2X, 170, line2X, 200);
var apiserverAuthenticationLabel = createLabel("Authentication",line2X+45, 160);

var apiserverAuthorization = createEdgeByCoordinates(line2X, 270, line2X, 300);
var apiserverAuthorizationLabel = createLabel("Authorization",line2X+45, 260);

var apiserverToAggregatedServer = createEdgeByCoordinates(line2X, 370, line3X, 370); 

var aggregatedServerAuthentication = createEdgeByCoordinates(line3X, 570, line3X, 600); 
var aggregatedServerAuthenticationLabel = createLabel("Authentication",line3X+45, 560);
var aggregatedServerAuthorization = createEdgeByCoordinates(line3X, 680, line2X, 680); 
var aggregatedServerAuthorizationLabel = createLabel("Authorization",(line3X - line2X)/2+line2X, 670);

var aggregatedServerAdmisson = createEdgeByCoordinates(line3X, 750, line3X, 780); 
var aggregatedServerAdmissonLabel = createLabel("Admisson",line3X+45, 740);



var step1Text = '1.客户端携带认证信息请求kube apiserver(比如客户端证书，token等)';
var step2Text = '2.kube apiserver对客户端请求进行认证(authentication)';
var step3Text = '3.kube apiserver对客户端请求的uri进行授权(authorization)(比如通过RBAC)';
var step4Text = '4.kube apiserver/aggregator 对aggregated server发起请求，\n发起请求时使用\n--proxy-client-cert-file，\n--proxy-client-key-file\n配置的证书信息对请求的uri进行加密';
var step5Text = '5.kube apiserver/aggregator 对aggregated server的请求头里携带\n --requestheader-extra-headers-prefix,\n--requestheader-group-headers，\n--requestheader-username-headers配置的信息';
var step6Text = '6.aggregated server 对来源请求通过代理认证模式进行认证(authentication):\n 1) 验证请求中的客户端证书是否为有效的代理客户端证书;\n2) 验证请求头里的user,group信息是否为有效用户';
var step7Text = '7.aggregated server 基于header中携带的user和group，\n对kube apiserver发起SubjectAccessReview进行授权(authorization)';
var step8Text = '8.对于资源修改的请求(Mutating requests)，Aggregated server 会进一步做准入检查';


var step1 = createTextArea(step1Text, (line2X - line1X)/2+line1X, 100+30);
var step2 = createTextArea(step2Text, line2X, 230);
var step3 = createTextArea(step3Text, line2X, 330);
var step4 = createTextArea(step4Text, (line3X - line2X)/2+line2X, 420);
var step5 = createTextArea(step5Text, (line3X - line2X)/2+line2X, 500);
var step6 = createTextArea(step6Text, line3X-30, 635);
var step7 = createTextArea(step7Text, (line3X - line2X)/2+line2X, 710);
var step8 = createTextArea(step8Text, line3X-30, 810);
</script>

