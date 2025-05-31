# Imagen base con Node.js
FROM node:18-alpine

# Instalar herramientas necesarias
#RUN apt-get update && apt-get install -y \
  #git \
  #watchman \
  #ffmpeg \
  #&& apt-get clean

# No instalamos expo-cli globalmente, usaremos la versión local

# Carpeta de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json yarn.lock* ./

# Instalar dependencias del proyecto
RUN yarn global add expo-cli


# Copiar el resto del proyecto
COPY . .

# Exponer los puertos de desarrollo de Expo
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Comando que arranca Expo (usando el script definido en package.json)
CMD ["yarn", "start", "--tunnel"]
