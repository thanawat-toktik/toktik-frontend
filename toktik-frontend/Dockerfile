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
ENV VUE_APP_S3_ACCESS_KEY_ID=${VUE_APP_S3_ACCESS_KEY_ID}
ENV VUE_APP_S3_SECRET_ACCESS_KEY=${VUE_APP_S3_SECRET_ACCESS_KEY}
ENV VUE_APP_S3_RAW_ENDPOINT=${VUE_APP_S3_RAW_ENDPOINT}
ENV VUE_APP_S3_BUCKET_NAME=${VUE_APP_S3_BUCKET_NAME}
ENV VUE_APP_S3_REGION=${VUE_APP_S3_REGION}
CMD ["nginx", "-g", "daemon off;"]
