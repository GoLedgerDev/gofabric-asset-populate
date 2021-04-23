#!/usr/bin/env bash

# Clear unused images and volumes
docker ps -a | grep "gofabric-populate" | awk '{print $1}' | xargs docker stop
docker ps -a | grep "gofabric-populate" | awk '{print $1}' | xargs docker rm
docker rmi $(docker images --quiet --filter "dangling=true")
docker volume rm $(docker volume ls -qf dangling=true)

# Start API
docker-compose -f docker-compose.yaml -p rest-audit up -d