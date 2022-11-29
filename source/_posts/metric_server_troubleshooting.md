title:  "metric server部署问题排查"
date:   2015/12/13 14:41
categories: K8S
tag: K8S metrics server
---

## 

开启调试模式
<!--lang:bash-->

    --v=0	Generally useful for this to ALWAYS be visible to an operator.
    --v=1	A reasonable default log level if you don’t want verbosity.
    --v=2	Useful steady state information about the service and important log messages that may correlate to significant changes in the system. This is the recommended default log level for most systems.
    --v=3	Extended information about changes.
    --v=4	Debug level verbosity.
    --v=6	Display requested resources.
    --v=7	Display HTTP request headers.
    --v=8	Display HTTP request contents

    I0921 12:16:09.553440       1 request.go:1181] Response Body: {"kind":"SubjectAccessReview","apiVersion":"authorization.k8s.io/v1","metadata":{"creationTimestamp":null,"managedFields":[{"manager":"Go-http-client","operation":"Update","apiVersion":"authorization.k8s.io/v1","time":"2022-09-21T04:16:09Z","fieldsType":"FieldsV1","fieldsV1":{"f:spec":{"f:groups":{},"f:nonResourceAttributes":{".":{},"f:path":{},"f:verb":{}},"f:user":{}}}}]},"spec":{"nonResourceAttributes":{"path":"/apis/metrics.k8s.io/v1beta1","verb":"get"},"user":"system:anonymous","groups":["system:unauthenticated"]},"status":{"allowed":false}}
    E0921 15:10:14.898275       1 scraper.go:140] "Failed to scrape node" err="Get \"https://10.131.66.67:10250/metrics/resource\": x509: cannot validate certificate for 10.131.66.67 because it doesn't contain any IP SANs" node="sg5-shopee-toc-monitor-live-10-131-66-67"




kube-apiserver 中指定的
  --requestheader-client-ca-file= 对应metric-server中--client-ca-file 
  --proxy-client-cert-file= 需要用--requestheader-client-ca-file= 指定的ca签名

https://blog.csdn.net/u012986012/article/details/105746492


kubelet server证书问题


