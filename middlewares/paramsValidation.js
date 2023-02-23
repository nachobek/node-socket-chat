// Node modules.


// 3rd party modules.
const { validationResult } = require('express-validator');


// Own modules.



// Custom middleware developmnet.

const paramsValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next();
}

module.exports = {
    paramsValidation
}