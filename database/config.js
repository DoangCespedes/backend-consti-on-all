const { Sequelize } = require('sequelize');
const { DB_DATABASES, DB_USER, DB_PASSWORD, DB_HOST } = require('../config');

// Configuración de la conexión a MySQL
const db = new Sequelize(DB_DATABASES, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql', 
    // logging: false, 
});



module.exports = {
    db
};
