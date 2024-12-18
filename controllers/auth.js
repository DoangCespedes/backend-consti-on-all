const { response } = require('express');
const Usuario = require('../model/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');


const login = async(req, res = response) => {

    const { user_name , password } = req.body;

    try {

        //Verificar si el NOMBRE existe
        const usuario = await Usuario.findOne({ where: {user_name}})
        if (!usuario) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - NOMBRE'
            })
        }
        //Si el usuario esta activo
        if (!usuario.status) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - ESTADO: FALSE'
            })
        }
        // verificar la contrasena 
        const validPassword = await bcryptjs.compare( password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - PASSWORD'
            })
        }
        
        // generar el JWT
        const token = await generarJWT( usuario.id);


        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
   
}

module.exports = {
    login
}