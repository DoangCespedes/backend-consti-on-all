const { DataTypes } = require('sequelize');
const { db } = require('../database/config'); // Asegúrate de importar correctamente tu conexión

const User = db.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true, // Validación para asegurar que sea un email válido
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: true, // Asegura que el valor sea numérico
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profile_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    id_persona: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true, // Asegura que no haya valores duplicados
    },
}, {
    tableName: 'Users', // Especifica el nombre de la tabla en la base de datos
    timestamps: false, // Desactiva las columnas de timestamps (createdAt, updatedAt) si no las usas
});

module.exports = User;