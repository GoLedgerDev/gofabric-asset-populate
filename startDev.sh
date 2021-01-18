#!/usr/bin/env bash

# Get env file
source .env

while getopts "g" opt; do
    case $opt in
        g)
            GENERATE_CERT=true
            ;;
    esac
done

# Clear unused images and volumes
docker ps -a | grep "gofabric-populate" | awk '{print $1}' | xargs docker stop
docker ps -a | grep "gofabric-populate" | awk '{print $1}' | xargs docker rm
docker rmi $(docker images --quiet --filter "dangling=true")
docker volume rm $(docker volume ls -qf dangling=true)

# Start API
docker-compose -f docker-compose.yaml -p rest-audit up -d
