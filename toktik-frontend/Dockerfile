FROM node:16-slim as build-stage
WORKDIR /app

COPY /package*.json ./

RUN yarn install
COPY / ./
RUN yarn build

FROM nginx:stable-alpine-slim as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
