const { Router } = require('express');
const path = require('path');
const multer = require('multer');
const axios = require('axios');
const Pelicula = require('../model/Pelicula');
const csv = require('fast-csv');
const fs = require('fs');
const router = Router();




// Configuración de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/Users/eudesmieres/desktop/peliculas/Back/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.csv');
    }
});

const upload = multer({ storage: storage });


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
    })
    .get(async (req, res) => {
        const { id, pagina } = req.query;
        const itemsPorPagina = 3; // Número de películas por página

        try {
            let query = 'SELECT * FROM Peliculas';

            if (id) {
                query += ` WHERE id LIKE '%${id}%'`;
            }

            const countQuery = 'SELECT COUNT(*) AS total FROM Peliculas'; // Consulta para obtener el recuento total
            const [countResult] = await Pelicula.sequelize.query(countQuery);
            const totalPeliculas = countResult[0][0].total; // Recuento total de películas

            const totalPaginas = Math.ceil(totalPeliculas / itemsPorPagina); // Cálculo del número total de páginas

            const paginaActual = parseInt(pagina) || 1; // Página actual (predeterminada: 1)
            const offset = (paginaActual - 1) * itemsPorPagina; // Cálculo del desplazamiento (offset)
            query += ` LIMIT ${itemsPorPagina} OFFSET ${offset}`;

            const [peliculas, _] = await Pelicula.sequelize.query(query);

            if (peliculas.length === 0) {
                res.status(404).json('No se encontraron películas');
                return;
            }

            // Envío del encabezado x-total-count en la respuesta
            res.setHeader('x-total-count', totalPeliculas);

            // Envío de la respuesta con las películas y la información de paginación
            res.status(200).json({
                peliculas,
                paginaActual,
                totalPaginas,
            });
        } catch (error) {
            console.error('Error al obtener las películas:', error);
            res.status(500).json('Error al obtener las películas');
        }
    });



// Endpoint para subir el archivo CSV y persistir las películas en la base de datos
router.post('/importarPeliculas', upload.single('csvFile'), async (req, res) => {
    console.log(req.file.path);
    uploadCsv(req, res, __dirname + "/uploads/" + req.file.fieldname);
});

function uploadCsv(req, res, path) {
    let stream = fs.createReadStream(req.file.path);
    let csvFile = [];
    let fileStream = csv
        .parse({ delimiter: ';' }) // Agregamos el separador ';' al parser de CSV
        .on('data', (data) => {
            csvFile.push(data);
            console.log('Fila leída:', data);
        })
        .on('end', async () => {
            csvFile.shift();

            try {
                const sequelize = await Pelicula.sequelize.sync();
                const importadas = [];
                for (const row of csvFile) {
                    const [id, description, premiere] = row;

                    const existingPeliculaQuery = `SELECT * FROM Peliculas WHERE id = '${id}'`;
                    const [existingPelicula, _] = await sequelize.query(existingPeliculaQuery);

                    if (existingPelicula.length > 0) {
                        console.log(`Película con el ID ${id} ya existe en la base de datos. Se descartará.`);
                        continue;
                    }

                    const createPeliculaQuery = `INSERT INTO Peliculas (id, description, premiere) VALUES ('${id}', '${description}', '${premiere}')`;
                    await sequelize.query(createPeliculaQuery);

                    importadas.push({
                        id: id,
                        description: description,
                        premiere: parseInt(premiere)
                    });
                }

                console.log('Importación de películas completada.');
                res.status(200).json({ importadas });
            } catch (error) {
                console.error('Error al importar las películas:', error);
                res.status(500).json({ error: 'Error al importar las películas' });
            }
        });

    stream.pipe(fileStream);
}



module.exports = router;