// This is to consolidate all the custom middlewares in a single file.
// We assign each middleware .js file to a constant and then export them.
// Since each .js middleware file can export multiple functions, we destructure each constant so everything is passed back to the caller of this index.js file.

const paramsValidation = require('../middlewares/paramsValidation');
const jwtValidation = require('../middlewares/jwtValidation');
const userRoleValidation = require('../middlewares/userRoleValidation');
const notCategoryExists = require('../middlewares/notCategoryExists');
const categoryNameExists = require('./categoryNameExists');
const productNameExists = require('./productNameExists');
const notProductCategoryExists = require('./notProductCategoryExists');
const notProductExists = require('./notProductExists');
const fileToUploadExists = require('./fileToUploadExists');


module.exports = {
    ...paramsValidation,
    ...jwtValidation,
    ...userRoleValidation,
    ...notCategoryExists,
    ...categoryNameExists,
    ...productNameExists,
    ...notProductCategoryExists,
    ...notProductExists,
    ...fileToUploadExists
}