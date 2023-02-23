// This helper is used to validate the JWT token when it's sent from the Front-End via socket. Returning the user if it's ok.


// Node modules.


// 3rd party modules.
const jwt = require('jsonwebtoken');

// Own modules.
const {User} = require('../models/index');


// Helper development.

const validateJWT = async (token = '') => {
    try {
        if (token.length <= 10) {
            return null;
        }

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY); // If this validation fails, it jumps to the catch.

        const user = await User.findOne({_id: uid, state: true});

        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        return null;
    }
}

module.exports = {
    validateJWT
}