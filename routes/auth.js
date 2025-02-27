const {Router} = require('express');
const { check } = require('express-validator');

const { login, profile, logout } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router()

router.post('/login',[
    check('user_name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contrasena es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.get('/profile', profile);

router.get('/logout', logout);

module.exports = router;