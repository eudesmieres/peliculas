const express = require("express");
const morgan = require("morgan");
const router = require('./router/peliculaRouter');

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send("Hola Soy Express y estoy en app.js");
});

app.use('/', router);


module.exports = app;