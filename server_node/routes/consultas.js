
const express = require('express') 
const axios = require('axios');
const dotenv = require('dotenv')
const router = express.Router();
const mysql = require('mysql2/promise');

dotenv.config()

const { MYSQLDB_HOST, MYSQLDB_ROOT_PASSWORD, MYSQLDB_DATABASE, MYSQLDB_DOCKER_PORT, API_GO_URL } = process.env;

const dbConfig = {
    host: MYSQLDB_HOST,
    port: MYSQLDB_DOCKER_PORT,
    user: 'root',
    password: MYSQLDB_ROOT_PASSWORD,
    database: MYSQLDB_DATABASE,
};

const ipServidores = {
    'VM1' : process.env.API_GO_URL,
    'VM2' : process.env.API_GO_URL_VM2,
    'VM3' : process.env.API_GO_URL_VM2,
    'VM4' : process.env.API_GO_URL_VM2,
}

// Función para conectar a la base de datos
async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        throw err;
    }
}

router.get('/prueba', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const [rows, fields] = await connection.execute('SELECT * FROM prueba');
        res.json(rows);
        connection.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
});

router.get('/infoRam/:maquina', async (req, res) => {
    const maquina = req.params.maquina;
    const IP_API_GO = await ipServidores[maquina];
    
    console.log(`NODE: infoRam ${maquina} `)
    try {
        const response = await axios.get(`http://${IP_API_GO}:8080/infoRam`);
        res.json(response.data);
    } catch (error) { 
        console.error('Error al obtener datos infoRam:', error.message);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

router.get('/infoCpu/:maquina', async (req, res) => {
    const maquina = req.params.maquina;
    const IP_API_GO = await ipServidores[maquina];
    console.log(`NODE: infoCpu ${maquina} `)
    try {
        const response = await axios.get(`http://${IP_API_GO}:8080/infoCpu`);
        res.json(response.data);
    } catch (error) { 
        console.error('Error al obtener datos infoCpu:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

router.get('/cpu_porcentaje', async (req, res) => {
    try {
        const response = await axios.get(`http://${API_GO_URL}:8080/cpu_porcentaje`);        
        const arregloPorcentaje = response.data.porcentajeCPU
            .replace(/\[|\]|\s/g, "")
            .split(",")
            .map(Number);

        const sumaCPU = arregloPorcentaje.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
        res.json({ sumaCPU : sumaCPU }); 

    } catch (error) { 
        console.error('Error al obtener datos cpu_porcentaje:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

router.get('/porcentaje_uso_cpu/:maquina', async (req, res) => {
    const maquina = req.params.maquina;
    const IP_API_GO = await ipServidores[maquina];
    console.log(`NODE: porcentaje_uso_cpu ${maquina} `)
    try {
        const response = await axios.get(`http://${IP_API_GO}:8080/porcentaje_uso_cpu`);
        res.json(response.data);
    } catch (error) { 
        console.error('Error al obtener datos cpu_porcentaje:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

router.post('/killProcess', async (req, res) => {
    const pid_App = req.body.pid_App;
    const maquina = req.body.maquina;
    const IP_API_GO = await ipServidores[maquina];
    console.log(`NODE: killProcess ${maquina} `)
    try {
        const response = await axios.post(`http://${IP_API_GO}:8080/killProcess`, { "pid_App": pid_App }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        res.json(response.data);
    } catch (error) { 
        console.error('Error al obtener datos killProcess:', error.message);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

router.post('/saveHistory', async (req, res) => {
    // console.log(req.body)
    const { ram, cpu, maquina } = req.body;
    console.log(`NODE: saveHistory ${maquina} `)

    try {
        const connection = await connectToDatabase();

        const [result] = await connection.execute(
            'INSERT INTO monitoreo(fecha, ram, cpu, maquina) VALUES (NOW(), ?, ?, ?)',
            [ram, cpu, maquina]
        );

        if (result.affectedRows > 0) {
            res.json({ message: 'Datos guardados con éxito' });
        } else {
            console.log('No se pudo insertar el registro en la base de datos.');
            res.status(500).json({ error: 'No se pudo guardar el registro en la base de datos' });
        }

        connection.end();
    } catch (error) {
        console.error('Error al guardar datos en la base de datos:', error);
        res.status(500).json({ error: 'Error al guardar datos en la base de datos' });
    }
});


router.get('/dataHistory/:maquina', async (req, res) => {
    const maquina = req.params.maquina;
    console.log(`NODE: dataHistory ${maquina} `)
    try {
        const connection = await connectToDatabase();

        const [rows] = await connection.execute(
            `SELECT id_history, DATE_FORMAT(fecha, '%d/%m/%Y %H:%i') AS fecha, ram, cpu, maquina FROM monitoreo 
            WHERE maquina = ?`,
            [maquina]
        );
        res.json(rows);

        connection.end();
    } catch (error) {
        console.error('Error al obtener datos dataHistory:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});


module.exports = router;