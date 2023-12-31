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


// Variable global para almacenar todas las películas importadas
let importadas = [];

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

        })
        .on('end', async () => {
            csvFile.shift();

            try {
                const sequelize = await Pelicula.sequelize.sync();

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

router.get('/search', async (req, res) => {

    const { id, pagina } = req.query;
    const itemsPorPagina = 10; // Número de películas por página



    try {
        // Buscar película en el arreglo por ID
        const peliculaEncontrada = importadas.find((pelicula) => pelicula.id === id);

        if (!peliculaEncontrada) {
            res.status(404).json('No se encontró la película');
            return;
        }

        // Obtener todas las películas para el listado completo
        const totalPeliculas = importadas.length;

        // Calcular el número total de páginas
        const totalPaginas = Math.ceil(totalPeliculas / itemsPorPagina);

        // Validar y calcular la página actual
        const paginaActual = parseInt(pagina) || 1;
        if (paginaActual < 1 || paginaActual > totalPaginas) {
            res.status(400).json('Página inválida');
            return;
        }

        // Calcular el índice inicial y final para el paginado
        const inicio = (paginaActual - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;

        // Obtener las películas en el rango de la página actual
        const peliculasPaginadas = importadas.slice(inicio, fin);

        // Enviar la respuesta con la película encontrada y el listado paginado
        res.status(200).json({
            peliculaEncontrada,
            peliculasPaginadas,
            paginaActual,
            totalPaginas,
        });
    } catch (error) {
        console.error('Error al buscar la película:', error);
        res.status(500).json('Error al buscar la película');
    }
});



module.exports = router;