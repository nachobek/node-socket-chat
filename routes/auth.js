// Node modules.


// 3rd party modules
// Extracting Router function from express.
const { Router } = require('express');
const { check } = require('express-validator');


// Own modules
const { login, googleSignIn, renewToken } = require('../controllers/auth');

const { paramsValidation, validateJWT } = require('../middlewares');
// const { paramsValidation } = require('../middlewares/paramsValidation');


// Routes development.

const router = Router();


router.post("/login", [
    check('email', 'Email is mandatory').not().isEmpty(),
    check('email', 'Invalid email address').isEmail(),
    check('password', 'Password is mandatory').not().isEmpty(),
    paramsValidation
], login);


router.post("/google", [
    check('id_token', 'ID_TKEN needed to sign in with Google').not().isEmpty(),
    paramsValidation
], googleSignIn);


router.get("/", validateJWT, renewToken);


module.exports = router;