// Node modules.


// 3rd party modules
// Extracting Router function from express.
const { Router } = require('express');
const { check } = require('express-validator');


// Own modules
const { validateJWT, paramsValidation, productNameExists, notProductCategoryExists, notProductExists, isAdmin } = require('../middlewares');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { paginationValidation } = require('../helpers/dbValidation');


// Route development.

const router = Router();

router.get('/', [
    check('offset').custom(paginationValidation),
    check('limit').custom(paginationValidation),
    paramsValidation
], getProducts);


router.get('/:id', [
    check('id', 'Invalid Product ID').isMongoId(),
    paramsValidation,
    notProductExists
], getProduct);


router.post('/', [
    validateJWT,
    check('name', 'Name is mandatory').not().isEmpty(),
    check('category', 'Invalid Category ID').isMongoId(),
    paramsValidation,
    productNameExists,
    notProductCategoryExists
], createProduct);


router.put('/:id', [
    validateJWT,
    // check('name', 'Name is mandatory').not().isEmpty(),
    check('id', 'Invalid Product ID').isMongoId(),
    check('category', 'Invalid Category ID').optional().isMongoId(),
    paramsValidation,
    notProductExists,
    productNameExists,
    notProductCategoryExists
], updateProduct);


router.delete('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'Invalid Product ID').isMongoId(),
    paramsValidation,
    notProductExists
], deleteProduct);


module.exports = router;