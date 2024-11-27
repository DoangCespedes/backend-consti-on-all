const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        console.log('Clave secreta:', process.env.SECRETORPRIVATEKEY);


        jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{
            expiresIn: '5h'
        }, (err, token) => {
            if (err) {
                console.log(err)
                reject( 'No se pudo generar el token')
            }else {
                resolve( token )
            }
        })
    })
}

module.exports = {
    generarJWT
}