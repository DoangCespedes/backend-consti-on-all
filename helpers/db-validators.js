
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

// user_id no existe
const existeUsuarioPorId = async(user_id) => {
    const existeUsuario = await usuario.findByPk(user_id)
    if (!existeUsuario) {
        throw new Error(`El id : ${ user_id } no existe`)
    }
}


module.exports = {esPerfilValido , emailExiste, existeUsuarioPorId}