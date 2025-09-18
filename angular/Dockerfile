# ---- Build Angular ----
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY angular.json ./
COPY tsconfig*.json ./
COPY .browserslistrc ./
COPY src ./src

RUN npm run build -- --configuration=production

# ---- Nginx para servir la SPA ----
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Tu angular.json usa "outputPath": "dist/skeleton"
COPY --from=build /app/dist/skeleton/ ./

# Config mínima de SPA (fallback); ESTE archivo debe estar en ANPR-VISION-FRONT/angular/default.conf
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
