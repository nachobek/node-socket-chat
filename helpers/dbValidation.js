const Role = require('../models/role');
const User = require('../models/user');


// Custom validators.

const roleValidation = async (role = '') => {
    const roleExists = await Role.findOne({role}); // Same as: .findOne({role: role});
    if (!roleExists) {
        throw new Error('Invalid role'); // This throw will not halt the application. It will rather add the error to the list of errors collected by the check() middleware.
    }
}

const emailValidation = async (email) => {
    const emailExists = await User.findOne({email: email}); // Same as doing: .findOne({email});

    if (emailExists) {
        throw new Error('Email already exists');
    }
}

const userValidationById = async (id) => {
    const userExists = await User.findById(id);

    if (!userExists) {
        throw new Error('User not found with given ID');
    }
}

const userIsActiveById = async (id) => {
    const userIsActive = await User.findOne({_id: id, state: true});

    if (!userIsActive) {
        throw new Error('No Active user found with given ID');
    }
}

const paginationValidation = async (number = "") => {
    if (number != "") {
        if (number < 0 || !Number.isInteger(Number(number))) {
            throw new Error('Invalid pagination argument');
        }
    }
}

const validateCollectionAllowed = (collection = '', allowedCollections = []) => {
    const isCollectionAllowed = allowedCollections.includes(collection);

    if (!isCollectionAllowed) {
        throw new Error('Invalid Collection');
    }

    // Do to the way this function is being called, we must add a return true statement.
    // In the other validation functions above the return is implicit. (?) Although it would have been good practice to include it.
    return true;
}

module.exports = {
    roleValidation,
    emailValidation,
    userValidationById,
    paginationValidation,
    userIsActiveById,
    validateCollectionAllowed
}