// Node modules.



// 3rd party modules
// Extracting Router function from express.
const { Router } = require('express');
const { check } = require('express-validator');



// Own modules
// Importing usersGet Controller.
const { usersGet, usersPut, usersPost, usersDelete } = require('../controllers/users');

//----------------------------------
// Replacing multiple middleware files import with a single index.js file which contains all of them.
// const { paramsValidation } = require('../middlewares/paramsValidation');
// const { validateJWT } = require('../middlewares/jwtValidation');
// const { isAdmin, hasRole } = require('../middlewares/userRoleValidation');
const { paramsValidation, validateJWT, isAdmin, hasRole } = require('../middlewares'); // Same as ../middlewares/index
//----------------------------------

const { roleValidation, emailValidation, userValidationById, paginationValidation, userIsActiveById } = require('../helpers/dbValidation');


// Application routing development.

const router = Router();



// The path here is just "/" so it points to the root of our path already defined in server.js when importing this module, which is /api/users
// Replaced the callback function/controller with a controller defined in its own file users.js in the Controller directory.
// router.get('/', (req, res) => {
//     res.json({
//         verb: 'GET',
//         msg: 'Hello from /api/users'
//     });
// });

router.get('/', [
    check('offset').custom(paginationValidation),
    check('limit').custom(paginationValidation),
    paramsValidation
], usersGet);
// --------------------------------------------------------------

// Adding mandatory parameters to the route. Any optional param "?" is already handled automatically by express.
router.put('/:id', [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(userValidationById),
    check('role').custom(roleValidation),
    paramsValidation
], usersPut);


// Adding middleware to the Post route.
// If more than one middleware is needed, they must be added as an array, in square brackets.
// The "check" middleware comes from express-validator package.
router.post('/', [
    check('name', 'Name is mandatory').not().isEmpty(),
    check('password', 'Password is mandatory. At least 6 characters long').isLength({min: 6}),
    check('email', 'Invalid email address').isEmail(),
    check('email').custom(emailValidation),
    // check('role', 'Invalid role').isIn(['ADMIN_ROLE', 'USER_ROLE']), // Changed to custom validation below.
    // check('role', 'Invalid role').custom((role) => roleValidation(role)), // When there is a function/callback function, which argument being received is the same being passed. Then it can be simplfied by only specifying the reference to the function as shown below.
    // The first argument being generated by the custom() function is the same one, which will be passed to roleValidation().
    check('role').custom(roleValidation),
    paramsValidation
], usersPost);




router.delete('/:id', [
    validateJWT,
    // isAdmin, // This function forces an admin role to continue.
    hasRole('ADMIN_ROLE', 'SALES_ROLE'), // This is a direct execution of function, with custom arguments rather (there is no req, res, next). Therefore it executes the classic middle function inside.
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(userValidationById),
    check('id').custom(userIsActiveById),
    paramsValidation
], usersDelete);



module.exports = router;