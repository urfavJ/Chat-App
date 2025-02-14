FROM node:20 AS node
WORKDIR /app
COPY package.json package-lock.json
RUN npm install
copy . . 
RUN npm run build

FROM nginx:alpine
COPY --from=node /app/dist/Client /usr/share/nginx/html

