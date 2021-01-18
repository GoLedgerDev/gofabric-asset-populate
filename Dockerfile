FROM node:carbon

COPY . /rest-server
ENV DOCKER=1
RUN rm /rest-server/Dockerfile
RUN cd /rest-server/ && npm install --only=prod
