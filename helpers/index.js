const dbValidation = require('./dbValidation');
const uploadFile = require('./uploadFile');
const generateJwt = require('./generateJwt');
const googleVerify = require('./googleVerify');
const validateJWT = require('./jwtValidation');


module.exports = {
    ...dbValidation,
    ...generateJwt,
    ...googleVerify,
    ...uploadFile,
    ...validateJWT
}