// Node modules.


// 3rd party modules
const {Router} = require('express');


// Own modules
const { search } = require('../controllers/search');


// Route development.

const router = Router();


router.get('/:collection/:searchTerm', search);


module.exports = router;