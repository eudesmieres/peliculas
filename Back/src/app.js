const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hola Soy Express y estoy en app.js");
});

module.exports = app;