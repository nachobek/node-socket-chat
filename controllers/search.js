
// Node modules.


// 3rd party modules
const {ObjectId} = require('mongoose').Types;


// Own modules
const {Category, Product, User} = require('../models');


// Controller development.

const allowedCollections = [
    'categories',
    'products',
    'roles',
    'users'
];


const searchCategories = async (searchTerm, res) => {
    const isMongoID = ObjectId.isValid(searchTerm);

    if (isMongoID) {
        const category = await Category.findOne({_id: searchTerm, active: true}).populate('user', 'name');

        if (!category) {
            return res.status(404).json({results: []});
        }

        return res.status(200).json({results: [category]});
    }

    const searchTermRegex = new RegExp(searchTerm, 'i');

    const categories = await Category.find({name: searchTermRegex, active: true}).populate('user', 'name');

    if (!categories.length) {
        return res.status(404).json({results: []});
    }

    return res.status(200).json({results: categories});
}


const searchProducts = async (searchTerm, res) => {
    const isMongoID = ObjectId.isValid(searchTerm);

    if (isMongoID) {
        const product = await Product.findOne({_id: searchTerm, active: true}).populate('user', 'name').populate('category', 'name');

        if (!product) {
            return res.status(404).json({results: []});
        }

        return res.status(200).json({results: [product]});
    }

    if (searchTerm.toLowerCase() === "true" || searchTerm.toLowerCase() === "available") {
        const products = await Product.find({isAvailable: true, active: true});

        if (!products.length) {
            return res.status(404).json({results: []});
        }
        
        return res.status(200).json({results: products});
    }

    const searchTermRegex = new RegExp(searchTerm, 'i');

    const products = await Product.find({
        $or: [{name: searchTermRegex}, {description: searchTermRegex}],
        $and: [{active: true}]
    })
    .populate('user', 'name').populate('category', 'name');

    if (!products.length) {
        return res.status(404).json({results: []});
    }

    return res.status(200).json({results: products});
}


const searchUsers = async (searchTerm = '', res) => {
    const isMongoID = ObjectId.isValid(searchTerm);

    if (isMongoID) {
        const user = await User.findOne({_id: searchTerm, state: true});

        // return res.json({
        //     results: user ? [user] : [] // Ternary operator. If User has data, return it as an array. Else, return an empty array.
        // });

        if (!user) {
            return res.status(404).json({ results: [] });
        }

        return res.status(200).json({results: [user]});
    }

    const searchTermRegex = new RegExp(searchTerm, 'i');

    const users = await User.find({
        $or: [{name: searchTermRegex}, {email: searchTermRegex}],
        $and: [{state: true}]
    });

    if (!users.length) {
        return res.status(404).json({ results: users });
    }

    return res.json({results: users});
}


const search = (req, res) => {
    const {collection, searchTerm} = req.params;

    if (!allowedCollections.includes(collection)) {
        return req.res.status(400).json({
            msg: 'Invalid collection requested.'
        });
    }

    switch (collection) {
        case 'categories':
            searchCategories(searchTerm, res);
            break;

        case 'products':
            searchProducts(searchTerm, res);
            break;

        case 'users':
            searchUsers(searchTerm, res);            
            break;
    
        default:
            return res.status(500).json({
                msg: `Search for ${collection} not implemented.`
            });
            // break;
    }
}

module.exports = {
    search
}