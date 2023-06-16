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

const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexion exitosa.');
    } catch (error) {
        console.error('fallo la base', error);
    }

}

connect();