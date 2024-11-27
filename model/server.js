const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'
        this.authPath = '/api/auth'

        //Conectar a base de datos
        this.conectarDB()
        //Middlewares (los middlewares son funciones que se ejecuta antes de llamar ya sea a un controlador o seguir con la ejecucion de mis peticiones. )
        this.middlewares()
        //Rutas de mi app
        this.routes();
        
    }

    async conectarDB(){
        dbConnection()
    }

    middlewares(){
        //CORS
        this.app.use( cors()) ;

        //lectura y parseo del body
        this.app.use(express.json() );

        //Directorio Publico
        this.app.use(express.static('public'));
    }
s
    routes(){
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usuariosPath, require('../routes/user'))
    }

    listen(){
        this.app.listen(process.env.PORT, () => {
            console.log(`EL SERVIDOR ESTA CORRIENDO EN EL PUERTO : ${this.port}`);
        });
    }
}

module.exports = Server