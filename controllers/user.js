const { response, request } = require('express');
const Usuario = require('../model/usuario');
const { encriptarPasswor } = require('../helpers/ecriptar-password');

const usuariosGetByName = async (req = request, res = response) => {
    const { user_name } = req.body;

    try {
        // Validar que "nombre" no sea undefined, nulo o vacío
        if (!user_name || typeof user_name !== 'string') {
            return res.status(400).json({
                msg: 'El campo "user name" es obligatorio y debe ser un string válido.'
            });
        }

        // Buscar usuario por nombre
        const usuario = await Usuario.findOne({
            where: { user_name },
        });

        if (!usuario) {
            return res.status(404).json({
                msg: `No se encontró un usuario con el user name: ${user_name}`,
            });
        }

        res.json({
            msg: 'Usuario encontrado',
            usuario,
        });
    } catch (error) {
        console.error('Error en usuariosGetByName:', error);
        res.status(500).json({
            msg: 'Error al buscar el usuario. Contacte al administrador.',
        });
    }
};

const usuariosGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    try {
        const queryEstado = { status: "ENABLED" };

        const [total, usuarios] = await Promise.all([
            Usuario.count({ where: queryEstado }), // Contar usuarios
            Usuario.findAll({
                where: queryEstado,
                offset: Number(desde),
                limit: Number(limite),
            }), // Obtener usuarios con paginación
        ]);

        res.json({ total, usuarios });
    } catch (error) {
        console.error('Error en usuariosGet:', error);
        res.status(500).json({
            msg: 'Error al obtener usuarios. Contacte al administrador.',
        });
    }
};

const usuariosPut = async (req, res = response) => {
    const { user_id } = req.params;
    const { password, ...resto } = req.body;

    try {
        if (password) {
            // Encriptar contraseña si se envía
            resto.password = await encriptarPasswor(password);
        }

        // Actualizar el usuario
        const usuario = await Usuario.update(resto, {
            where: { user_id },
            returning: true, // Devuelve el usuario actualizado
        });

        res.json({
            msg: 'Se actualizó con éxito',
            usuario,
        });
    } catch (error) {
        console.error('Error en usuariosPut:', error);
        res.status(500).json({
            msg: 'Error al actualizar el usuario. Contacte al administrador.',
        });
    }
};

const usuariosPost = async (req, res = response) => {
    const { user_name, email, password, profile_id, first_name } = req.body;

    try {
        // Validar si el user_name ya existe
        const userExists = await Usuario.findOne({
            where: { user_name },
        });

        if (userExists) {
            return res.status(400).json({
                msg: `El user_name "${user_name}" ya está en uso.`,
            });
        }

        // Crear usuario
        const usuario = Usuario.build({
            status: "ENABLED",
            user_name,
            first_name,
            email,
            password: await encriptarPasswor(password), // Encriptar contraseña
            profile_id,
        });

        // Guardar en la base de datos
        await usuario.save();

        res.json({
            msg: 'Usuario creado con éxito',
            usuario,
        });
    } catch (error) {
        console.error('Error en usuariosPost:', error);
        res.status(500).json({
            msg: 'Error al crear el usuario. Contacte al administrador.',
        });
    }
};

const usuariosDelete = async (req, res = response) => {
    const { id } = req.body; // Se recibe el ID del usuario desde el cuerpo de la petición

    try {
        // Actualizar el status del usuario a "DISABLED"
        const [affectedRows] = await Usuario.update(
            { status: 'DISABLED' }, // Campos a actualizar
            { where: { user_id: id } } // Condición de búsqueda
        );

        // Verificar si se actualizó algún registro
        if (affectedRows === 0) {
            return res.status(404).json({
                msg: `No se encontró un usuario con el ID: ${id}`,
            });
        }

        res.json({
            msg: 'Usuario deshabilitado con éxito',
            user_id: id,
        });
    } catch (error) {
        console.error('Error en usuariosDelete:', error);
        res.status(500).json({
            msg: 'Error al deshabilitar el usuario. Contacte al administrador.',
        });
    }
};



module.exports = {
    usuariosGetByName,
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
};
