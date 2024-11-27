const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'
        this.authPath = '/api/auth'
        this.emailsPath = '/api/emails';

        //Conectar a base de datos
        this.conectarDB()
        //Middlewares 
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
        this.app.use(this.emailsPath, require('../routes/emailRoutes'));
    }

    listen(){
        this.app.listen(process.env.PORT, () => {
            console.log(`EL SERVIDOR ESTA CORRIENDO EN EL PUERTO : ${this.port}`);
        });
    }
}

module.exports = Server