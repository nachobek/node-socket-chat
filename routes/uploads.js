// Node modules.


// 3rd party modules
const {Router} = require('express');
const {check} = require('express-validator');


// Own modules
const { paramsValidation, fileToUploadExists } = require('../middlewares');
const { fileUpload, imageUpdate, imageDisplay, imageUpdateCloudinary } = require('../controllers/uploads');
const { validateCollectionAllowed } = require('../helpers');


// Route development.

const router = Router();

router.post('/', [
    fileToUploadExists
], fileUpload);


// Replacing the local image update with Cloudinary hosting.
// router.put('/:collection/:id', [
//     fileToUploadExists,
//     check('id', 'Invalid Product ID').isMongoId(),
//     check('collection').custom(c => validateCollectionAllowed(c, ['products', 'users'])),
//     paramsValidation
// ], imageUpdate);


router.put('/:collection/:id', [
    fileToUploadExists,
    check('id', 'Invalid Product ID').isMongoId(),
    check('collection').custom(c => validateCollectionAllowed(c, ['products', 'users'])),
    paramsValidation
], imageUpdateCloudinary);


router.get('/:collection/:id', [
    check('id', 'Invalid Product ID').isMongoId(),
    check('collection').custom(c => validateCollectionAllowed(c, ['products', 'users'])),
    paramsValidation
], imageDisplay)

module.exports = router;