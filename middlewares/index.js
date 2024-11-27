

const validaCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaPerfiles = require('../middlewares/validar-perfil');

module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaPerfiles,
}