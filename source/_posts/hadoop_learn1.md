title:  "hadoop snappy压缩"
date:   2016/04/09 12:49
categories: hadoop
tag: hadoop hdfs snappy java 
---


hdfs dfs -du -s -h /lagou/logs/lg-main-nginx/20160401
28.2 G  56.6 G  /lagou/logs/lg-main-nginx/20160401
hdfs dfs -ls -h /lagou/logs/backup/lg-main-nginx/201604
-rw-r--r--   2 root supergroup       9.7 G 2016-04-09 12:40 /lagou/logs/backup/lg-main-nginx/201604/access.20160401.snappy
real    7m28.633s
user    2m7.403s
sys     1m7.918s

64Mb/s




real    10m47.011s
user    1m42.091s
sys     0m49.264s



