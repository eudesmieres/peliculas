const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser"); // Importa body-parser
const router = require('./router/peliculaRouter');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json()); // Usa body-parser para analizar el cuerpo de la solicitud como JSON

app.get('/', (req, res) => {
    res.send("Hola Soy Express y estoy en app.js");
});

app.use('/', router);


module.exports = app;