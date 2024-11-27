
const Perfil = require('../model/perfil')
const usuario = require('../model/usuario')

const esPerfilValido = async(perfil = '') => {
    const existePerfil = await Perfil.findOne({ perfil })

    if (!existePerfil) {
        throw new Error(`El perfil ${ perfil } no esta registrado en DB`)
    }
}

// correo existe
const emailExiste = async(correo = '') => {
    const existeEmail = await usuario.findOne({correo})
    if (existeEmail) {
        throw new Error(`El correo ${ correo } ya existe`)
    }
}

// id no existe
const existeUsuarioPorId = async(id) => {
    const existeUsuario = await usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id : ${ id } no existe`)
    }
}


module.exports = {esPerfilValido , emailExiste, existeUsuarioPorId}