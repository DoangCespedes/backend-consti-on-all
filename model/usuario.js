const { Schema, model } = require('mongoose')
// const { unique } = require('next/dist/build/utils')

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El usuario es obligatorio'],
        unique: true
    },
    correo: {
        type: String,
        unique: true
    },
    telefono: {
        type: String,
    },
    password: {
        type: String,
        require: [ true, 'La contrasena es obligatorio'],
    },
    perfil: {
        type: String,
        require: true,
        emun: ['SUPERVISOR_CORPORATIVO', 'USUARIO_CORPORATIVO', 'USUARIO_ASEGURADO']//USUARIO_CORPORATIVO
    },
    estado: {
        type: Boolean,
        default: true
    }
})

UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema)