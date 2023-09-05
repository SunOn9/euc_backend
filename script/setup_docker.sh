#!/usr/bin/bash
SCRIPT=$(pwd $0)

docker pull mysql
docker pull redis
docker pull elasticsearch

docker run -d --name ...