const { Router } = require('express');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosGetByName } = require('../controllers/user');
const { check } = require('express-validator');
const { existeUsuarioPorId } = require('../helpers/db-validators');

// Middlewares
const {
    validarCampos,
    validarJWT,
    esAdminPerfil,
} = require('../middlewares');

const router = Router();

router.post('/buscar', usuariosGetByName);

router.get('/', usuariosGet);

router.put('/:user_id', [
    check('user_id', 'No es un ID válido').isInt(), // Suponiendo que el ID es numérico
    validarCampos,
], usuariosPut);

router.post('/', [
    check('user_name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener más de 6 caracteres').isLength({ min: 6 }),
    check('email', 'El valor ingresado no es válido').isEmail(),
    validarCampos,
], usuariosPost);

// Ruta para cambiar el status a DISABLED
router.post('/eliminar', [
    // check('id', 'El ID del usuario es obligatorio').isInt(),
    // check('id').custom(existeUsuarioPorId), // Valida si el usuario existe en la BD
    validarCampos,
], usuariosDelete);

module.exports = router;