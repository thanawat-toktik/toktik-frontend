FROM node:16 as build-stage
WORKDIR /app

COPY /package*.json ./

RUN yarn install
COPY / ./
RUN yarn build

FROM nginx:stable-alpine-slim as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
ENV VUE_APP_BACKEND_HOST=${VUE_APP_BACKEND_HOST}
CMD ["nginx", "-g", "daemon off;"]
