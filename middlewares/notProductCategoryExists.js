const Category = require('../models/category');


const notProductCategoryExists = async (req, res, next) => {
    if (req.method === 'PUT' && !req.body.category) {
        return next();
    }

    const categoryExists = await Category.findOne({_id: req.body.category, active: true});

    if (!categoryExists) {
        return res.status(404).json({
            msg: `No Active Category found with ID: ${req.body.category}`
        });
    }

    next();
}


module.exports = {
    notProductCategoryExists
}