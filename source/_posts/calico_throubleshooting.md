title:  "metric server部署问题排查"
date:   2015/12/13 14:41
categories: K8S
tag: K8S metrics server
---

## 

查看calico node日志
<!--lang:bash-->
    crictl ps

    CONTAINER           IMAGE               CREATED             STATE               NAME                ATTEMPT             POD ID              POD
    63acc9016d719       5f5175f39b19e       34 hours ago        Running             calico-node         0                   da931628d63e7       calico-node-d4zxg
    
    crictl logs 63acc9016d719
    touch: cannot touch '/var/log/calico/cni/config': Read-only file system
    ./run: line 5: /var/log/calico/cni/config: Read-only file system
    ./run: line 6: /var/log/calico/cni/config: Read-only file system
    svlogd: warning: unable to lock directory: /var/log/calico/cni: read-only file system
    svlogd: fatal: no functional log directories.

    2022-09-21 03:12:49.496 [INFO][114] felix/watchercache.go 194: Failed to perform list of current data during resync ListRoot="/calico/resources/v3/projectcalico.org/kubernetesservice" error=connection is unauthorized: Unauthorized
    2022-09-21 03:12:49.496 [INFO][114] felix/watchercache.go 194: Failed to perform list of current data during resync ListRoot="/calico/resources/v3/projectcalico.org/kubernetesendpointslices" error=connection is unauthorized: Unauthorized
    2022-09-21 03:12:49.496 [INFO][114] felix/watchercache.go 194: Failed to perform list of current data during resync ListRoot="/calico/resources/v3/projectcalico.org/nodes" error=connection is unauthorized: Unauthorized
    2022-09-21 03:12:49.496 [INFO][114] felix/watchercache.go 194: Failed to perform list of current data during resync ListRoot="/calico/resources/v3/projectcalico.org/profiles" error=connection is unauthorized: Unauthorized
    2022-09-21 03:12:49.496 [INFO][114] felix/watchercache.go 194: Failed to perform list of current data during resync ListRoot="/calico/resources/v3/projectcalico.org/kubernetesnetworkpolicies" error=connection is unauthorized: Unauthorized
    


查看apiserver-audit日志
<!--lang:bash-->
    {"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"Metadata","auditID":"4998220b-d5f1-4b53-b01d-b8f4ee39ae09","stage":"ResponseStarted","requestURI":"/apis/crd.projectcalico.org/v1/bgpconfigurations?limit=500\u0026resourceVersion=8942985\u0026resourceVersionMatch=NotOlderThan","verb":"list","user":{},"sourceIPs":["10.x.x.x"],"userAgent":"Go-http-client/2.0","objectRef":{"resource":"bgpconfigurations","apiGroup":"crd.projectcalico.org","apiVersion":"v1"},"responseStatus":{"metadata":{},"status":"Failure","reason":"Unauthorized","code":401},"requestReceivedTimestamp":"2022-09-21T03:16:09.593700Z","stageTimestamp":"2022-09-21T03:16:09.610291Z"}
    {"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"Metadata","auditID":"e50fb629-cdd0-4b61-8ea9-3bf1b803a98c","stage":"ResponseStarted","requestURI":"/apis/networking.k8s.io/v1/networkpolicies?limit=500\u0026resourceVersion=9269250\u0026resourceVersionMatch=NotOlderThan","verb":"list","user":{},"sourceIPs":["10.x.x.x"],"userAgent":"Go-http-client/2.0","objectRef":{"resource":"networkpolicies","apiGroup":"networking.k8s.io","apiVersion":"v1"},"responseStatus":{"metadata":{},"status":"Failure","reason":"Unauthorized","code":401},"requestReceivedTimestamp":"2022-09-21T03:16:09.636907Z","stageTimestamp":"2022-09-21T03:16:09.653331Z"}
    {"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"Metadata","auditID":"80248d89-941b-4648-956d-a023df326ba9","stage":"ResponseStarted","requestURI":"/apis/discovery.k8s.io/v1/endpointslices?limit=500\u0026resourceVersion=9069772\u0026resourceVersionMatch=NotOlderThan","verb":"list","user":{},"sourceIPs":["10.x.x.x"],"userAgent":"Go-http-client/2.0","objectRef":{"resource":"endpointslices","apiGroup":"discovery.k8s.io","apiVersion":"v1"},"responseStatus":{"metadata":{},"status":"Failure","reason":"Unauthorized","code":401},"requestReceivedTimestamp":"2022-09-21T03:16:09.636880Z","stageTimestamp":"2022-09-21T03:16:09.653339Z"}
    {"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"Metadata","auditID":"deceeb71-87a4-46b9-ab7c-3d8ca81454c3","stage":"ResponseStarted","requestURI":"/apis/crd.projectcalico.org/v1/hostendpoints?limit=500\u0026resourceVersion=9269253\u0026resourceVersionMatch=NotOlderThan","verb":"list","user":{},"sourceIPs":["10.x.x.x"],"userAgent":"Go-http-client/2.0","objectRef":{"resource":"hostendpoints","apiGroup":"crd.projectcalico.org","apiVersion":"v1"},"responseStatus":{"metadata":{},"status":"Failure","reason":"Unauthorized","code":401},"requestReceivedTimestamp":"2022-09-21T03:16:09.644403Z","stageTimestamp":"2022-09-21T03:16:09.660827Z"}
    {"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"Metadata","auditID":"e52fd99b-689f-40d0-a030-4f5aacb16e04","stage":"ResponseStarted","requestURI":"/apis/crd.projectcalico.org/v1/bgpconfigurations?limit=500\u0026resourceVersion=8942985\u0026resourceVersionMatch=NotOlderThan","verb":"list","user":{},"sourceIPs":["10.x.x.x"],"userAgent":"Go-http-client/2.0","objectRef":{"resource":"bgpconfigurations","apiGroup":"crd.projectcalico.org","apiVersion":"v1"},"responseStatus":{"metadata":{},"status":"Failure","reason":"Unauthorized","code":401},"requestReceivedTimestamp":"2022-09-21T03:16:09.699502Z","stageTimestamp":"2022-09-21T03:16:09.715845Z"}
    {"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"Metadata","auditID":"4806e24f-7039-413c-9d1d-ac7513ae515f","stage":"ResponseStarted","requestURI":"/apis/crd.projectcalico.org/v1/felixconfigurations?limit=500\u0026resourceVersion=9269237\u0026resourceVersionMatch=NotOlderThan","verb":"list","user":{},"sourceIPs":["10.x.x.x"],"userAgent":"Go-http-client/2.0","objectRef":{"resource":"felixconfigurations","apiGroup":"crd.projectcalico.org","apiVersion":"v1"},"responseStatus":{"metadata":{},"status":"Failure","reason":"Unauthorized","code":401},"requestReceivedTimestamp":"2022-09-21T03:16:09.710565Z","stageTimestamp":"2022-09-21T03:16:09.727257Z"}
    {"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"Metadata","auditID":"d3d49793-ae7c-4b34-9b17-42fc5d1c6ce1","stage":"ResponseStarted","requestURI":"/apis/crd.projectcalico.org/v1/networkpolicies?limit=500\u0026resourceVersion=9269253\u0026resourceVersionMatch=NotOlderThan","verb":"list","user":{},"sourceIPs":["10.x.x.x"],"userAgent":"Go-http-client/2.0","objectRef":{"resource":"networkpolicies","apiGroup":"crd.projectcalico.org","apiVersion":"v1"},"responseStatus":{"metadata":{},"status":"Failure","reason":"Unauthorized","code":401},"requestReceivedTimestamp":"2022-09-21T03:16:09.722319Z","stageTimestamp":"2022-09-21T03:16:09.738673Z"}
    {"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"Metadata","auditID":"17f60f0f-16b3-491f-aede-6942139e5e3b","stage":"ResponseStarted","requestURI":"/apis/crd.projectcalico.org/v1/ipamblocks?limit=500\u0026resourceVersion=9066444\u0026resourceVersionMatch=NotOlderThan","verb":"list","user":{},"sourceIPs":["10.x.x.x"],"userAgent":"Go-http-client/2.0","objectRef":{"resource":"ipamblocks","apiGroup":"crd.projectcalico.org","apiVersion":"v1"},"responseStatus":{"metadata":{},"status":"Failure","reason":"Unauthorized","code":401},"requestReceivedTimestamp":"2022-09-21T03:16:09.788846Z","stageTimestamp":"2022-09-21T03:16:09.805174Z"}


修改前
<!--lang:yaml-->
    - name: cni-log-dir
      mountPath: /var/log/calico/cni
      readOnly: true

修改后
<!--lang:yaml-->
    - name: cni-log-dir
      mountPath: /var/log/calico/cni
      readOnly: false
