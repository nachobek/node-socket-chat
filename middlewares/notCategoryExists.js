const Category = require('../models/category');


const notCategoryExists = async (req, res, next) => {
    const categoryExists = await Category.findOne({_id: req.params.id, active: true});

    if (!categoryExists) {
        return res.status(404).json({
            msg: `No Active Category found with ID: ${req.params.id}`
        });
    }

    next();
}


module.exports = {
    notCategoryExists
}