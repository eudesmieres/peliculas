const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Pelicula =
    sequelize.define('Pelicula',
        {
            id: { //titulo de la pelicula
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                unique: true, // Añade esta opción para hacer el campo único
            },
            description: {
                type: DataTypes.TEXT,//texto mas largo
                allowNull: false,
            },
            premiere: {
                type: DataTypes.STRING,//numeros enteros
                allowNull: false,
            },
        },
        {
            timestamps: false //para sacar createdAT/updatedAt de la tabla
        }
    );
module.exports = Pelicula;
