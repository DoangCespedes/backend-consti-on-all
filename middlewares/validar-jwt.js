
const { request, response} = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../model/usuario')

const validarJWT = async(req= request, res = response , next) =>{
    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
       
        const usuario = await Usuario.findById(uid)
        
        //Verificar si el uid existe o es undefined
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe DB'
            })
        }

        //Verificar si el uid tiene estado true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            })
        }
        
        
        req.usuario = usuario;
        next();
        
        // Aqui me trae todo el payload del token
        // const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        // console.log(payload)
    } catch (error) {
       console.log(error)
       res.status(401).json({
            msg: 'Token no valido'
       }) 
    }
}



module.exports = {
    validarJWT
}