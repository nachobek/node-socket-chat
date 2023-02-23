// Node modules
const {createServer} = require('http');


//3rd party modules
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');


// Own modules
const { dbConnection } = require('../database/config');
const { socketController } = require('../controllers/socketController');

// Class development

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        // Installing socket.io in conjunction with Express.
        // this.server = require('http').createServer(this.app); // I can either do it in one line. Or destructure the createServer() function from 'http' and use it as shown below.
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);


        this.paths = {
            auth:       '/api/auth',
            categories: '/api/categories',
            products:   '/api/products',
            search:     '/api/search',
            uploads:    '/api/uploads',
            users:      '/api/users'
        }

        // Connect to the DB.
        this.dbConnect();

        //Middlewares
        this.middlewares();

        //Routes
        this.routes();

        //Sockets
        this.sockets();
    }

    async dbConnect(){
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Read and parse body data into Json. Any data received via POST, PUT, etc will be serialized to Json.
        this.app.use(express.json());

        // Public directory
        this.app.use(express.static('public'));

        //File upload (express-fileupload)
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));

        this.app.use(this.paths.categories, require('../routes/categories'));

        this.app.use(this.paths.products, require('../routes/products'));

        this.app.use(this.paths.search, require('../routes/search'));

        this.app.use(this.paths.uploads, require('../routes/uploads'));

        this.app.use(this.paths.users, require('../routes/users'));
    }

    sockets() {
        // this.io.on('connection', socketController);
        // This is updated so we can also pass "io", which is the whole socket server, to the controller.
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    // To use socket.io we listen to the server created out of the express app. Rather than listening directly to the express app.
    listen() {
        this.server.listen(this.port, () => {
            console.log('Listening at port:', this.port);
        });
    }
}

module.exports = Server;