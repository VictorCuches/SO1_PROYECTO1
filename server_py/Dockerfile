# Utiliza una imagen base de Python
FROM python:3.8-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de tu aplicación al directorio de trabajo en el contenedor
COPY app.py /app

# Instala las dependencias de tu aplicación (si las tienes en un archivo requirements.txt)
# COPY requirements.txt /app
# RUN pip install -r requirements.txt

# Expone el puerto en el que se ejecutará tu aplicación Flask
EXPOSE 5000

# Define el comando para ejecutar tu aplicación cuando se inicie el contenedor
CMD ["python", "app.py"]
