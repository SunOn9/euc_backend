#!/usr/bin/bash
SCRIPT=$(pwd $0)

docker pull mysql:8.1.0
# docker pull redis:7.2.0
# docker pull elasticsearch:8.9.0

docker run -d --name euc-mysql -p 3306:3306 \
    --env MYSQL_ROOT_PASSWORD=190501 \
    -v /Volumes/ImageDisk/docker/mysql:/var/lib/mysql \
    mysql:8.1.0

# docker run -d --name euc-redis -p 6379:6379 \
#     --volume=/Volumes/ImageDisk/docker/redis:/data \
#     redis:7.2.0

# docker run -d --name euc-elasticsearch -p 9200:9200 -p 9300:9300 \
#     --env ELASTIC_PASSWORD=190501 \
#     -e discovery.type="single-node" -e ES_JAVA_OPTS="-Xms256m -Xmx512m" \
#     elasticsearch:8.9.0