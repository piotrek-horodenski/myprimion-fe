FROM node:21 AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build

FROM nginx:alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY entrypoint.sh /entrypoint.sh


RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]


