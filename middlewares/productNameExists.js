const Product = require('../models/product');


const productNameExists = async (req, res, next) => {
    const {name} = req.body;
    
    if (req.method === 'PUT' && !name) {
        return next();
    }

    const productNameExists = await Product.findOne({name: name.toUpperCase(), active: true});
    
    if (productNameExists) {
        return res.status(400).json({
            msg: `Product ${req.body.name} already exists`
        })
    }

    next();
}


module.exports = {
    productNameExists
}