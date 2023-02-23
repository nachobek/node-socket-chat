// Node modules.


// 3rd party modules.
const jwt = require('jsonwebtoken');


// Own modules.
const User = require('../models/user');


const validateJWT = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Invalid authorization token'
        });
    }

    // Token validation - If the token is invalid, the .verify() method throws an error, so we need to catch it and return 401.
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const authenticatedUser = await User.findOne({_id: uid, state: true});

        if (!authenticatedUser) {
            return res.status(401).json({
                msg: 'Invalid user'
            });
        }

        req.authenticatedUser = authenticatedUser;
        next();
        
    } catch (error) {
        console.log(error);

        return res.status(401).json({
            msg: 'Invalid authorization token'
        });
    }
}


module.exports = {
    validateJWT
}