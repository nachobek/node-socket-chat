// Node modules.


// 3rd party modules.


// Own modules.
const Product = require('../models/product');


//Controller development

// Custom function to validate if a string value is null, blank or whitespaces.
// function isEmptyOrSpaces(str){
//     return str === null || (/^ *$/).test(str) !== null || (/^\s*$/).test(str) !== null;
// }

const getProducts = async (req, res) => {
    const {offset = 0, limit = 5} = req.query;

    const products = await Product
                        .find({active: true})
                        .skip(offset)
                        .limit(limit)
                        .populate("user", "name")
                        .populate("category", "name")
    ;

    if (!products || (Array.isArray(products) && !products.length)) {
        return res.status(404).json({
            msg: "No Active Products found"
        });
    }

    console.log(req);

    return res.status(200).json({products});
}


const getProduct = async (req, res) => {
    const product = await Product.findOne({_id: req.params.id, active: true})
                        .populate("user", "name")
                        .populate("category", "name")
    ;

    return res.status(200).json({product});
}


const createProduct = async (req, res) => {
    const name = req.body.name.toUpperCase();

    const {price, category, description} = req.body;

    const data = {
        name,
        active: true,
        user: req.authenticatedUser._id,
        price,
        category,
        description,
        isAvailable: true
    }
    
    // Product already exists but it's deleted (inactive), then we'll assume the client wants it to be created again.
    const deletedProduct = await Product.findOne({name, active: false});

    if (deletedProduct) {
        const updatedProduct = await Product.findByIdAndUpdate(deletedProduct._id, data, {new: true});

        return res.status(201).json({
            product: updatedProduct
        });
    }

    const product = await Product(data).save();

    return res.status(201).json({product});
}


const updateProduct = async (req, res) => {
    const {name, price, category, description, isAvailable} = req.body;

    let product = await Product.findById(req.params.id);

    if (name) {
        product.name = name.toUpperCase();
    }

    if (price) {
        product.price = price;
    }

    if (category) {
        product.category = category;
    }

    if (description) {
        product.description = description;
    }

    if (isAvailable) {
        product.isAvailable = isAvailable;
    }

    product.user = req.authenticatedUser._id;

    product = await Product.findByIdAndUpdate(req.params.id, product, {new: true});

    return res.status(200).json({product});
}


const deleteProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, {active: false}, {new: true});

    return res.status(200).json({product});
}








module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}