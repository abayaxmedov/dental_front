FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=/api
ARG VITE_API_ORIGIN=
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_ORIGIN=${VITE_API_ORIGIN}

RUN npm run build

FROM nginx:stable-alpine

ARG VITE_API_BASE_URL=/api
ARG VITE_API_ORIGIN=
ENV APP_API_BASE_URL=${VITE_API_BASE_URL}
ENV APP_API_ORIGIN=${VITE_API_ORIGIN}
ENV NGINX_API_UPSTREAM=http://backend:8000

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.d/40-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh

EXPOSE 80
