const Category = require('../models/category');


const categoryNameExists = async (req, res, next) => {
    const name = req.body.name.toUpperCase();

    const categoryNameExists = await Category.findOne({name, active: true});
    
    if (categoryNameExists) {
        return res.status(400).json({
            msg: `Category ${req.body.name} already exists`
        })
    }

    next();
}


module.exports = {
    categoryNameExists
}