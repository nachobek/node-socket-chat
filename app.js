// Node modules.

// 3rd party modules.
require('dotenv').config();

// Own modules.
const Server = require('./models/server');

// Application.
const server = new Server();


server.listen();