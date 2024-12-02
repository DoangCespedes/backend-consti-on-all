const {Router} = require('express');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosGetByName } = require('../controllers/user');
const { check } = require('express-validator');
const { esPerfilValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

//middlewares
const {
    validarCampos,
    validarJWT,
    esAdminPerfil,
    tienePerfil
} = require('../middlewares/index');



const router = Router()

router.post('/buscar', usuariosGetByName)

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('perfil').custom( esPerfilValido ),
    validarCampos
] ,usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser mas de 6 letras').isLength({min: 6}),
    check('correo', 'El valor ingresado no es valido').isEmail(),
    // check('perfil', 'No es un rol valido').isIn(['SUPERVISOR_CORPORATIVO','USUARIO_CORPORATIVO', 'USUARIO_ASEGURADO']),
    check('perfil').custom( esPerfilValido ),
    check('correo').custom( emailExiste ),
    validarCampos // Aqui ponemos el (MIDDLEWARE) para que valide los campos y si pasa la validacion del middleware lo dejamos pasar al controlador.
], usuariosPost);

router.delete('/:id',[
    //Nota: es importante saber que como declaramos la validacion del jwt ya establecemos la informacion que requerimos de el usuario y podemos encontrar en la req.usuario 
    validarJWT,
    esAdminPerfil,
    // tienePerfil('SUPERVISOR_CORPORATIVO', 'USUARIO_CORPORATIVO', 'USUARIO_ASEGURADO'), // De esta manera podemos recibir argumentos en nuestros middlewares
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
] , usuariosDelete );


module.exports = router