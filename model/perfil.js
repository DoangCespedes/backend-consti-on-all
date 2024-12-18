const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Perfil = db.define('Perfil', {
    perfil: {
        type: DataTypes.STRING,
        // allowNull: false, // Es equivalente a `required: true`
        // validate: {
        //     notEmpty: {
        //         msg: 'El perfil es obligatorio',
        //     },
        // },
    },
}, {
    tableName: 'Perfiles', // Nombre de la tabla en la base de datos
    timestamps: false, // Si no necesitas `createdAt` y `updatedAt`
});

module.exports = Perfil;