
FROM node:alpine as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . ./

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /var/www

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]
