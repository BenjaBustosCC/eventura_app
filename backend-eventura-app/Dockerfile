# Build stage
FROM node:18-alpine AS builder

# Instalar dependencias del sistema necesarias para la compilación
RUN apk add --no-cache \
    libaio \
    libc6-compat \
    gcompat \
    unzip \
    curl \
    python3 \
    make \
    g++ \
    gcc \
    build-base

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Production stage
FROM node:18-alpine

# Instalar solo las dependencias necesarias para producción
RUN apk add --no-cache libaio libc6-compat gcompat curl unzip

# Crear directorios necesarios
RUN mkdir -p /opt/oracle && \
    mkdir -p /app/wallet

# Configurar Oracle Instant Client
WORKDIR /opt/oracle
RUN curl -o instantclient.zip https://download.oracle.com/otn_software/linux/instantclient/219000/instantclient-basic-linux.x64-21.9.0.0.0dbru.zip && \
    unzip instantclient.zip && \
    rm instantclient.zip && \
    cd /opt/oracle && \
    if [ -d "instantclient_21_9" ]; then echo "Directory exists"; else echo "Directory does not exist, listing content:" && ls -la; fi

# Copiar node_modules del stage de build
COPY --from=builder /app/node_modules /app/node_modules

# Configurar el directorio de trabajo final
WORKDIR /app

# Copiar el código de la aplicación
COPY . .

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=8081
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_21_9
ENV ORACLE_CLIENT_PATH=/opt/oracle/instantclient_21_9
ENV ORACLE_HOME=/opt/oracle/instantclient_21_9
ENV TNS_ADMIN=/app/wallet
ENV WALLET_PATH=/app/wallet

# Inicializar Oracle Client en la aplicación (se usará en db.js)
ENV ORA_SDTZ=UTC

# Exponer puerto
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:8081/health || exit 1

# Volumen para wallet
VOLUME ["/app/wallet"]

# Crear y configurar el script de entrypoint
RUN printf '#!/bin/sh\necho "Verificando instalación de Oracle Client..."\nls -la /opt/oracle/instantclient_21_9\necho "LD_LIBRARY_PATH=$LD_LIBRARY_PATH"\necho "Iniciando aplicación..."\nexec "$@"\n' > /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Comando de inicio
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "server.js"]
