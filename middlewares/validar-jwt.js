const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../model/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('consti-on-all-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No se encontró un token en la petición'
        });
    }

    try {
        // Verificar el token
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findByPk(uid); 

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en la base de datos'
            });
        }

        if (usuario.status != 'ENABLED') {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado: false'
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
};

module.exports = {
    validarJWT
};
