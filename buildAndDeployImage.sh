#!/usr/bin/env bash

docker build . -t goledger/loadtest:latest
docker push goledger/loadtest:latest
