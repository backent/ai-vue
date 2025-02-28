# FROM node:fermium-alpine3.12 as build-stage
# RUN npm install -g npm@7.20.3
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY ./ .
# RUN npm run build

FROM nginx:stable-alpine as production-stage
RUN mkdir /app
COPY ./dist /app
COPY nginx.conf /etc/nginx/nginx.conf
