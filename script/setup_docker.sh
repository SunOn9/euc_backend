#!/usr/bin/bash
SCRIPT=$(pwd $0)

docker pull elasticsearch
docker pull mysql
docker pull redis

docker run -d --name ...