# Usar una imagen base de Node.js
FROM node:16

# Crear un directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json (si existe) al directorio de trabajo
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install

# Copiar todo el contenido de la aplicación al directorio de trabajo
COPY . .

# Exponer un puerto en el contenedor (por ejemplo, el puerto 3000)
EXPOSE 5000

# Comando para ejecutar la aplicación (ajústalo según tu aplicación)
CMD ["node", "app.js"]
