const { response } = require('express');
const Usuario = require('../model/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { serialize } = require('cookie');
const { verify } = require('jsonwebtoken');

const login = async(req, res = response) => {
    const { user_name , password } = req.body;

    try {
        // Verificar si el usuario existe
        const usuario = await Usuario.findOne({ 
            where: { user_name },
            attributes: ['user_id', 'user_name', 'password', 'status', 'profile_id'],
        });

        console.log('Usuario Encontrado:', usuario);
        if (!usuario) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - NOMBRE'
            });
        }

        // Si el usuario está activo
        if (usuario.status !== 'ENABLED') {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - Status: DISABLED'
            });
        }

        // Verificar la contraseña
        const validPassword = await bcryptjs.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - PASSWORD'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.user_id,  usuario.user_name, usuario.profile_id, usuario.status);

        console.log('Token generado:', token);

        // Configurar la cookie correctamente
        const serialized = serialize('My-CookieTest', token,{
            httpOnly: true, // Protege la cookie del acceso desde JavaScript
            secure: false,  //process.env === 'production', // Solo en HTTPS si está en producción
            sameSite: 'Strict', // Restringe el envío de cookies a solicitudes del mismo sitio
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: '/'
        });

        res.setHeader('Set-Cookie', serialized);

        console.log('Cookie generada correctamente');

        // Enviar la respuesta JSON
        return res.status(200).json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const { parse } = require('cookie'); // Asegúrate de usar el parse de 'cookie'

// En tu función profile
const profile = async (req, res) => {
    // Acceder a las cookies desde los encabezados de la solicitud
    const cookies = parse(req.headers.cookie || '');
    // console.log(cookies, 'PRUEBA123'); // ahora deberías ver las cookies aquí

    // Ejemplo de cómo acceder a la cookie específica
    const myCookie = cookies['My-CookieTest'];
    // console.log('Valor de la cookie My-CookieTest:', myCookie);


    try {
        
        const user = verify(myCookie, process.env.SECRETORPRIVATEKEY);
        
        return res.json({
            user_id: user.uid,
            profile: user.profile_id,
            name: user.user_name,
            status: user.status
        });
    } catch (error) {
        return res.status(404).json({ error: 'invalid token' });
    }


    
    // Respuesta
    // res.json({
    //     user: 'user123',
    //     cookieValue: myCookie // Muestra el valor de la cookie
    // });
}

const logout = (req, res) => {

    const cookies = parse(req.headers.cookie || '');
    const myCookie = cookies['My-CookieTest'];

    if (!myCookie) {
        return res.status(401).json({error: 'no token'});
    }

    try {
        verify(myCookie, process.env.SECRETORPRIVATEKEY);
        const serialized = serialize('My-CookieTest', null,{
            httpOnly: true, 
            secure: false,
            sameSite: 'Strict', // Restringe el envío de cookies a solicitudes del mismo sitio
            maxAge: 0,
            path: '/'
        });

        res
        .setHeader('Set-Cookie', serialized)
        .status(200).json('Logout succesfully');

    } catch (error) {
        res.status(401).json({error: 'invalid token'});
    }
}

module.exports = {
    login,
    profile,
    logout
};
