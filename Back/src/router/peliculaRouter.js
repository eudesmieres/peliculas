const { Router } = require('express');

const router = Router();

// Endpoint para importar las películas desde un archivo CSV
router.post('/importar-peliculas', (req, res) => {
    res.send('ESTA ES LA RUTA DE PELICULAS');
});

// Endpoint para obtener los detalles de una película por su ID.El mismo debe
//permitir búsqueda por título y paginación.
router.get('/peliculas/:id', (req, res) => {
    res.send('ESTA ES LA RUTA DE PELICULAS ID');
});

// Endpoint de alta, baja, modificación y consulta para un registro de películas
router.get('/peliculas', (req, res) => {
    res.send('ESTA ES LA RUTA DE PELICULAS');
});




module.exports = router;