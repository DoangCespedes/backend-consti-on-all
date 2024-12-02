const { response, request, query } = require('express')
const Usuario = require('../model/usuario');
const { encriptarPasswor } = require('../helpers/ecriptar-password');


const usuariosGetByName = async (req = request, res = response) => {
    const { nombre } = req.body; // Obtener el nombre desde el body de la petición

    try {
        // Validar que el nombre no sea undefined o vacío
        if (!nombre) {
            return res.status(400).json({
                msg: 'El campo "nombre" es obligatorio en el body.'
            });
        }

        // Buscar usuario por nombre
        const usuario = await Usuario.findOne({ nombre });

        if (!usuario) {
            // Si no se encuentra el usuario, retornar un mensaje
            return res.status(404).json({
                msg: `No se encontró un usuario con el nombre: ${nombre}`
            });
        }

        // Retornar los datos del usuario si existe
        res.json({
            msg: 'Usuario encontrado',
            usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al buscar el usuario. Contacte al administrador.'
        });
    }
};



const usuariosGet = async(req = request, res = response) => { 

    // const {q , nombre= 'No name', apikey, page = 1, limit} = req.query
    const {limite = 5, desde = 0} = req.query;
    const queryEstado = { estado: true}
    
    // const usuarios = await Usuario.find(queryEstado)
    // .skip(Number(desde))    
    // .limit(Number(limite))

    // const total = await Usuario.countDocuments( queryEstado );

    // cada metodo llevava un tiempo de ejecucion , creamos la promesa para hacer los dos metodos en asincronia y el await nos va a aguardar a que las dos esten completas para poder retornar.
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(queryEstado),
        Usuario.find(queryEstado)
        .skip(Number( desde ))
        .limit(Number(limite))
    ])

    
    res.json({
        total,
        usuarios
    });  
}

const usuariosPut = async(req, res = response) => { 

    const { id } = req.params
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar contra base de datos
    if (password) {
        // Encriptar la contraseña
        resto.password = await encriptarPasswor(password);

    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.json({
        msg: 'Se actualizo con exito',
        usuario
    });   
}

const usuariosPost = async(req, res = response) => { 

    
    // const body = req.body;  de esta manera recibiremos cualquier cosa que me quiera enviar el usuario, 
    const {nombre , correo, password, perfil} = req.body; //encambio de esta manera ignoro cualquier cosa que me envie el usuario que yo no este esperando
    
    const usuario = new Usuario( {nombre , correo, password, perfil} )

    //Verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo})
    if (existeEmail) {
        return res.status(400).json({
            msg: 'El correo ya esta registrado'
        })
    }
    // Encriptar la contraseña
    usuario.password = await encriptarPasswor(password);

    //Guardar en db

    await usuario.save();

    res.json({
        asd: 'post API',
        // body
        //nombre,
        usuario
    });  
}

const usuariosDelete = async(req, res = response) => { 

    const { id } = req.params

    //fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false})

    const usuarioAutenticado = req.usuario

    res.json({
        usuario,
        usuarioAutenticado

    });   
}



module.exports = {
    usuariosGetByName,
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}