FROM golang:1.21.1 

# Crea un directorio de trabajo en el contenedor
WORKDIR /app

# Instala utilidades básicas (procps) que incluye el comando "kill"
RUN apt-get update && apt-get install -y procps

# Copia los archivos del proyecto al directorio de trabajo
COPY main.go .
COPY go.mod .
COPY go.sum .

# Compila el proyecto Go
RUN go build main.go

# Expone el puerto 8080 que utiliza tu aplicación
EXPOSE 8080

# Ejecuta la aplicación cuando se inicia el contenedor
CMD ["./main"]