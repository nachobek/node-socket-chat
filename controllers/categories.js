// Node modules.


// 3rd party modules.
const { request, response } = require('express');


// Own modules.
const { Category } = require('../models');


//Categories Controller

const getCategories = async (req, res) => {
    const { offset = 0, limit = 5 } = req.query;

    const categories = await Category
        .find({active: true})
        .skip(Number(offset))
        .limit(Number(limit))
        .populate("user");

    return res.status(200).json({ categories });
}


const getCategoryById = async (req, res) => {
    const category = await Category.findOne({_id: req.params.id, active: true}).populate("user");

    // if (!category) {
    //     return res.status(404).json({
    //         msg: `Category: ${req.params.id} Not Found`
    //     });
    // }

    return res.status(200).json({category});
}


const createCategory = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    // const categoryDb = await Category.findOne({name});

    // if (categoryDb && categoryDb.active) {
    //     return res.status(400).json({
    //         msg: `Category ${req.body.name} already exists`
    //     })
    // }

    const data = {
        name,
        active: true,
        user: req.authenticatedUser._id
    }

    // Category already exists but it's deleted (inactive), then we'll assume the client wants it to be created again.
    const deletedCategory = await Category.findOne({name, active: false});

    if (deletedCategory) {
        const updatedCategory = await Category.findByIdAndUpdate(deletedCategory._id, data, {new: true});

        return res.status(201).json({
            category: updatedCategory
        });
    }

    const category = new Category(data);

    await category.save();

    return res.status(201).json({category});
}


const updateCategoryById = async (req, res) => {
    const name = req.body.name.toUpperCase();
    // const categoryId = req.params.id;

    // const categoryExists = await Category.findOne({_id: req.params.id, active: true});

    // if (!categoryExists) {
    //     return res.status(400).json({
    //         msg: 'No Active Category found with given ID'
    //     })
    // }

    // const categoryNameNotUnique = await Category.findOne({name});

    // if (categoryNameNotUnique) {
    //     return res.status(400).json({
    //         msg: `Category ${req.body.name} already exists`
    //     })
    // }

    const data = {
        name,
        user: req.authenticatedUser._id
    }

    const category = await Category.findByIdAndUpdate(req.params.id, data, {new: true});

    return res.status(200).json({category});
}


const deleteCategoryById = async (req, res) => {
    // const category = await Category.findOne({_id: req.params.id, active: true});

    // if (!category) {
    //     return res.status(400).json({
    //         msg: 'No Active Category found with given ID'
    //     })
    // }

    const category = await Category.findByIdAndUpdate(req.params.id, {active: false, user: req.authenticatedUser._id}, {new: true});

    return res.status(200).json({
        msg: "Category successfully deleted",
        category
    });
}

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategoryById,
    deleteCategoryById
}