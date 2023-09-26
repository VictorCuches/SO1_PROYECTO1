# Usamos una imagen base de Node.js para construir la aplicación React
FROM node:14

# Establecemos el directorio de trabajo en /app
WORKDIR /app_frontend

# Copiamos el archivo package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos los archivos de la aplicación React al directorio de trabajo en el contenedor
COPY . .

# Construimos la aplicación React
RUN npm run build

# Configuramos un servidor web ligero para servir la aplicación React
RUN npm install -g serve

# Exponemos el puerto en el que se ejecutará el servidor web
EXPOSE 3000

# Comando para iniciar la aplicación cuando se ejecute el contenedor
CMD ["serve", "-s", "build", "-l", "3000"]
