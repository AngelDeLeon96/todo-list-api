FROM node:alpine3.20 AS build

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
# Limpiamos cualquier instalación previa para evitar conflictos
RUN rm -rf node_modules
RUN pnpm install

COPY . .
RUN pnpm run build

FROM node:alpine3.20

WORKDIR /app

# Copiamos solo los archivos necesarios para producción
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Instalamos solo las dependencias de producción
RUN npm install -g pnpm
RUN pnpm install --prod

# Instalamos netcat para poder comprobar la disponibilidad de la base de datos
RUN apk add --no-cache netcat-openbsd

# Creamos script de entrada para verificar la disponibilidad de la base de datos
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'echo "Esperando a que la base de datos esté disponible..."' >> /app/entrypoint.sh && \
    echo 'while ! nc -z db 3306; do' >> /app/entrypoint.sh && \
    echo '  sleep 3' >> /app/entrypoint.sh && \
    echo '  echo "Esperando a que la base de datos esté disponible..."' >> /app/entrypoint.sh && \
    echo 'done' >> /app/entrypoint.sh && \
    echo 'echo "Base de datos disponible! Iniciando aplicación..."' >> /app/entrypoint.sh && \
    echo 'exec node dist/main' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

EXPOSE 3000

CMD ["/app/entrypoint.sh"]