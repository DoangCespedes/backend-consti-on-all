const { Schema, model} = require('mongoose')

const PerfilSchema = Schema({
    perfil:{
        type: String,
        required: [true, 'El perfil es obligatorio']
    }
})

module.exports = model('Perfil', PerfilSchema)