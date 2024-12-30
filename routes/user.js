const { Router } = require('express');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosGetByName } = require('../controllers/user');
const { check } = require('express-validator');
const { existeUsuarioPorId } = require('../helpers/db-validators');

// Middlewares
const {
    validarCampos,
    validarJWT,
    esAdminPerfil,
    tienePerfil,
} = require('../middlewares');

const router = Router();

// OBTENER USUARIO POR NOMBRE
router.post('/buscar', [
    validarJWT,
    tienePerfil(1,4),
], usuariosGetByName);


// OBTENER USUARIOS
router.get('/', [
    validarJWT,
    tienePerfil(1,4),
], usuariosGet);


// ACTUALIZAR USUARIOS
router.put('/:user_id', [
    check('user_id', 'No es un ID válido').isInt(), 
    check('user_id').custom(existeUsuarioPorId), 
    validarJWT,
    tienePerfil(1,4),
    validarCampos,
], usuariosPut);


// CREAR USUARIOS
router.post('/', [
    check('user_name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener más de 6 caracteres').isLength({ min: 6 }),
    check('email', 'El valor ingresado no es válido').isEmail(),
    validarCampos,
], usuariosPost);

// Ruta para cambiar el status a DISABLED
router.post('/eliminar', [
    validarJWT,
    esAdminPerfil,
    check('id', 'El ID del usuario es obligatorio').isInt(),
    validarCampos,
], usuariosDelete);

module.exports = router;