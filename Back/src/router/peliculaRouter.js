const { Router } = require('express');

const router = Router();

// Endpoint para obtener la lista de películas
router.get('/peliculas', (req, res) => {
    res.send('ESTA ES LA RUTA DE PELICULAS');
});

// Endpoint para obtener los detalles de una película por su ID
router.get('/peliculas/:id', (req, res) => {
    res.send('ESTA ES LA RUTA DE PELICULAS ID');
});

// Endpoint para importar las películas desde un archivo CSV
router.post('/importar-peliculas', (req, res) => {
    res.send('ESTA ES LA RUTA DE PELICULAS');
});


module.exports = router;