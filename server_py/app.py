from flask import Flask

# Crea una instancia de la aplicación Flask
app = Flask(__name__)

# Define una ruta que retornará "Hola mundo" cuando se acceda
@app.route('/')
def hola_mundo():
    return 'Hola mundo 201807307'

# Si ejecutas este script directamente, inicia la aplicación en el puerto 5000 por defecto
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)
