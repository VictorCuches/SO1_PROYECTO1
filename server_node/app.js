const express = require('express'); 
const cors = require('cors');
const app = express();
const port = 5000;
 
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('¡Hola, Mundo desde Node!');
});

//Routes
app.use(require('./routes/consultas.js'));

app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});
