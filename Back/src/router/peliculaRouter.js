const { Router } = require('express');
const axios = require('axios');
const Pelicula = require('../model/Pelicula');
const router = Router();


//http://localhost:3001/searchByName?id=Juana de arcos&pagina=1
//http://localhost:3001/searchByName?pagina=1
//Endpoint de búsqueda por título y paginación.
router.get('/searchByName', async (req, res) => {
    const { id, pagina } = req.query;
    const itemsPorPagina = 10; // Número de películas por página

    try {
        let query = 'SELECT * FROM Peliculas';

        if (id) {
            query += ` WHERE id LIKE '%${id}%'`;
        }

        const offset = (pagina - 1) * itemsPorPagina;
        query += ` LIMIT ${itemsPorPagina} OFFSET ${offset}`;

        const [peliculas, _] = await Pelicula.sequelize.query(query);

        if (peliculas.length === 0) {
            res.status(404).json('No se encontraron películas');
            return;
        }

        res.status(200).json(peliculas);
    } catch (error) {
        console.error('Error al obtener las películas:', error);
        res.status(500).json('Error al obtener las películas');
    }
});


//http://localhost:3001/peliculas
// Endpoint para realizar todas las operaciones (Alta, baja, modificación y consulta para un registro de películas) en un solo Endpoint
router.route('/peliculas')
    .post(async (req, res) => {
        const { id, description, premiere } = req.body;

        try {
            const existingPeliculaQuery = `SELECT * FROM Peliculas WHERE id = '${id}'`;
            const [existingPelicula, _] = await Pelicula.sequelize.query(existingPeliculaQuery);

            if (existingPelicula.length > 0) {
                res.status(400).json({ error: 'Ya existe una película con el mismo título' });
                return;
            }

            const createPeliculaQuery = `INSERT INTO Peliculas (id, description, premiere) VALUES ('${id}', '${description}', ${premiere})`;
            await Pelicula.sequelize.query(createPeliculaQuery);

            res.status(201).json({ message: 'Película agregada correctamente' });
        } catch (error) {
            console.error('Error al agregar la película:', error);
            res.status(500).json({ error: 'Error al agregar la película' });
        }
    })
    .put(async (req, res) => {
        const { id, description, premiere } = req.body;

        try {
            const updatePeliculaQuery = `UPDATE Peliculas SET description = '${description}', premiere = ${premiere} WHERE id = '${id}'`;
            const [_, updatedRows] = await Pelicula.sequelize.query(updatePeliculaQuery);

            if (updatedRows === 0) {
                res.status(404).json('No se encontró una película con el ID proporcionado');
                return;
            }

            res.status(200).json('Película modificada correctamente');
        } catch (error) {
            console.error('Error al modificar la película:', error);
            res.status(500).json('Error al modificar la película');
        }
    })
    .delete(async (req, res) => {
        const { id } = req.body;

        try {
            const deletePeliculaQuery = `DELETE FROM Peliculas WHERE id = '${id}'`;
            const [_, deletedRows] = await Pelicula.sequelize.query(deletePeliculaQuery);

            if (deletedRows === 0) {
                res.status(404).json('No se encontró una película con el ID proporcionado');
                return;
            }

            res.status(200).json('Película eliminada correctamente');
        } catch (error) {
            console.error('Error al eliminar la película:', error);
            res.status(500).json('Error al eliminar la película');
        }
    })
    .get(async (req, res) => {

        try {
            const getPeliculaQuery = 'SELECT * FROM Peliculas';;
            const [peliculas, _] = await Pelicula.sequelize.query(getPeliculaQuery);

            if (peliculas.length === 0) {
                res.status(404).json('No se encontró una película con el ID proporcionado');
                return;
            }

            res.status(200).json(peliculas);
        } catch (error) {
            console.error('Error al obtener la película:', error);
            res.status(500).json('Error al obtener la película');
        }
    });

module.exports = router;