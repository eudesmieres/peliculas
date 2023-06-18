const { Sequelize } = require('sequelize');
require('dotenv').config();


//variables de entorno
const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
} = process.env;


// Option 1: Passing a connection URI 'mysql://root:3306/database'
const sequelize = new Sequelize(`mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/peliculas`, {
    logging: false,
});

// Sincronización del modelo con la base de datos
(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Modelo sincronizado correctamente con la base de datos.');
    } catch (error) {
        console.error('Error al sincronizar el modelo:', error);
    }
})();




module.exports = sequelize;