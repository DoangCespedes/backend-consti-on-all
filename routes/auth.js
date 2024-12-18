const {Router} = require('express');
const { check } = require('express-validator');

const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router()

router.post('/login',[
    check('user_name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contrasena es obligatoria').not().isEmpty(),
    validarCampos
], login);

module.exports = router;