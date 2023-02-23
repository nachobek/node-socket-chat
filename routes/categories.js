// Node modules.


// 3rd party modules
// Extracting Router function from express.
const { Router } = require('express');
const { check } = require('express-validator');


// Own modules
const { validateJWT, paramsValidation, notCategoryExists, categoryNameExists, isAdmin } = require('../middlewares');
const { createCategory, getCategories, getCategoryById, updateCategoryById, deleteCategoryById } = require('../controllers/categories');
const { paginationValidation } = require('../helpers/dbValidation');


// Route development.

const router = Router();

router.get('/', [
    check('offset').custom(paginationValidation),
    check('limit').custom(paginationValidation),
    paramsValidation
], getCategories);


router.get('/:id', [
    check('id', 'Invalid ID').isMongoId(),
    paramsValidation,
    notCategoryExists // Last so it validates there is a valid MongoID to prevent app crash.
], getCategoryById);


router.post('/', [
    validateJWT,
    check('name', 'Name is mandatory').not().isEmpty(),
    paramsValidation,
    categoryNameExists  // Last so it validates there is a valid name before executing.
], createCategory);


router.put('/:id', [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('name', 'Name is mandatory').not().isEmpty(),
    // check('id').custom(categoryExists), // Validation moved to controller to return the proper HTTP status code.
    // check('name').custom(isCategoryUnique), // Validation moved to controller to return the proper HTTP status code.
    paramsValidation,
    notCategoryExists, // Last so it validates there is a valid MongoID to prevent app crash.
    categoryNameExists
], updateCategoryById);


router.delete('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'Invalid ID').isMongoId(),
    paramsValidation,
    notCategoryExists // Last so it validates there is a valid MongoID to prevent app crash.
], deleteCategoryById);


module.exports = router;