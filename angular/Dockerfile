# Etapa 1: Construir Angular
FROM node:20 AS build
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código y compilar Angular
COPY . .
RUN npm run build --prod

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/skeleton /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
