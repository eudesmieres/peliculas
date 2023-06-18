const { Router } = require('express');
const axios = require('axios');
const Pelicula = require('../model/Pelicula');
const router = Router();



// // Endpoint para importar las películas desde un archivo CSV
// router.post('/importar-peliculas', (req, res) => {
//     res.send('ESTA ES LA RUTA DE PELICULAS');
// });

// // Endpoint para obtener los detalles de una película por su ID.El mismo debe
// //permitir búsqueda por título y paginación.
// router.get('/peliculas/:id', (req, res) => {
//     res.send('ESTA ES LA RUTA DE PELICULAS ID');
// });

// // Endpoint de alta, baja, modificación y consulta para un registro de películas
// router.get('/peliculas', (req, res) => {
//     res.send('ESTA ES LA RUTA DE PELICULAS');
// });


// router.post('/peliculas', async (req, res) => {
//     const { id, description, premiere } = req.body;

//     try {
//         const existingPeliculaQuery = `SELECT * FROM Peliculas WHERE id = '${id}'`;
//         const [existingPelicula, _] = await Pelicula.sequelize.query(existingPeliculaQuery);

//         if (existingPelicula.length > 0) {
//             res.status(400).json('Ya existe una película con el mismo título');
//             return;
//         }

//         const createPeliculaQuery = `INSERT INTO Peliculas (id, description, premiere) VALUES ('${id}', '${description}', ${premiere})`;
//         await Pelicula.sequelize.query(createPeliculaQuery);

//         res.status(201).json('Película agregada correctamente');
//     } catch (error) {
//         console.error('Error al agregar la película:', error);
//         res.status(500).json('Error al agregar la película');
//     }
// });

// router.get('/peliculas/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const getPeliculaQuery = `SELECT * FROM Peliculas WHERE id = '${id}'`;
//         const [pelicula, _] = await Pelicula.sequelize.query(getPeliculaQuery);

//         if (pelicula.length === 0) {
//             res.status(404).json('No se encontró ninguna película con el ID proporcionado');
//             return;
//         }

//         res.status(200).json(pelicula);
//     } catch (error) {
//         console.error('Error al obtener la película:', error);
//         res.status(500).json('Error al obtener la película');
//     }
// });

// router.get('/peliculas', async (req, res) => {
//     try {
//         const getAllPeliculasQuery = 'SELECT * FROM Peliculas';
//         const [peliculas, _] = await Pelicula.sequelize.query(getAllPeliculasQuery);

//         res.status(200).json(peliculas);
//     } catch (error) {
//         console.error('Error al obtener las películas:', error);
//         res.status(500).json('Error al obtener las películas');
//     }
// });


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