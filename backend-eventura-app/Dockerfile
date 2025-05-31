# Imagen base oficial de Node.js
FROM node:18-alpine

# Instalar dependencias del sistema
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
    build-base \
    bash

# Crear directorios necesarios
RUN mkdir -p /opt/oracle && \
    mkdir -p /app/wallet

# Descargar y configurar Oracle Instant Client
WORKDIR /opt/oracle
RUN curl -o instantclient.zip https://download.oracle.com/otn_software/linux/instantclient/219000/instantclient-basic-linux.x64-21.9.0.0.0dbru.zip && \
    unzip instantclient.zip && \
    rm instantclient.zip

WORKDIR /opt/oracle/instantclient_21_9
RUN rm -f *jdbc* *occi* *mysql* *jar libocijdbc* libnsl* && \
    ln -sf libclntsh.so.21.1 libclntsh.so && \
    ln -sf libocci.so.21.1 libocci.so

# Variables de entorno para Oracle
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_21_9:$LD_LIBRARY_PATH
ENV ORACLE_CLIENT_PATH=/opt/oracle/instantclient_21_9
ENV WALLET_PATH=/app/wallet
ENV TNS_ADMIN=/app/wallet

# Directorio de trabajo de la app
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias y recompilar bcrypt nativo
RUN npm install --omit=dev && npm rebuild bcrypt --build-from-source

# Copiar el resto del código fuente
COPY . .

# Exponer puerto
EXPOSE 8081

# Comando de inicio
CMD ["node", "server.js"]
