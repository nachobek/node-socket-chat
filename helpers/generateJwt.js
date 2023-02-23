const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {

    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {    // Callback function. Action our Promise will take depending on the sign() response.
            if (err) {
                console.log(err);
                reject('Could not generate token');
            }

            resolve(token);
        });
    });
}

module.exports = {
    generateJWT
}