const Product = require('../models/product');


const notProductExists = async (req, res, next) => {
    const productExists = await Product.findOne({_id: req.params.id, active: true});

    if (!productExists) {
        return res.status(404).json({
            msg: `No Active Product found with ID: ${req.params.id}`
        });
    }

    next();
}


module.exports = {
    notProductExists
}