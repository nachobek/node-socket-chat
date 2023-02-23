// Node modules.
const path = require('path');
const fs = require('fs');

// 3rd party modules
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// Own modules
const {User, Product} = require('../models');
const { uploadFile } = require("../helpers");


// Controller development.

const fileUpload = async (req, res) => {
    try {
        const uploaedFileName = await uploadFile(req.files, undefined, 'default');

        return res.json({file: uploaedFileName});
    } catch (msg) {
        return res.status(400).json({msg});
    }
}


// Updating images locally in our own server. We will use Cloudinary as a hosting for our images though. But this still serves as an example.
const imageUpdate = async (req, res) => {
    const {collection, id} = req.params;

    let model;

    switch (collection) {
        case 'products':
            model = await Product.findOne({_id: id, active: true});

            if (!model) {
                return res.status(404).json({
                    msg: `No Active Product found with ID: ${id}`
                });
            }

            break;

        case 'users':
            model = await User.findOne({_id: id, state: true});

            if (!model) {
                return res.status(404).json({
                    msg: `No Active User found with ID: ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({
                msg: "Endpoint not implemented."
            });
    }

    // Cleanup previous image.
    if (model.image) {
        // Obtain image path - Based on hor app, the path should be /uploads/collection/imageName
        const imagePath = path.join(__dirname, '../uploads', collection, model.image);

        // Validate if the image still exists in the server. Then delete id.
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }


    try {        
        model.image = await uploadFile(req.files, undefined, collection); // Uploads file to our server and returns back the file name.

        await model.save(); // Save changes in the DB.

        return res.json({results: model});
    } catch (error) {
        return res.status(400).json({error});
    }
}


const imageUpdateCloudinary = async (req, res) => {
    const {collection, id} = req.params;

    let model;

    switch (collection) {
        case 'products':
            model = await Product.findOne({_id: id, active: true});

            if (!model) {
                return res.status(404).json({
                    msg: `No Active Product found with ID: ${id}`
                });
            }

            break;

        case 'users':
            model = await User.findOne({_id: id, state: true});

            if (!model) {
                return res.status(404).json({
                    msg: `No Active User found with ID: ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({
                msg: "Endpoint not implemented."
            });
    }

    // Cleanup previous image.
    if (model.image) {
        // Assuming all images are hosted in Cloudniray.
        const imageUrlSplit = model.image.split('/');
        const fullImageName = imageUrlSplit[imageUrlSplit.length - 1];

        // -------------------------------
        // Now, I can create another array and grab the first element.
        // const imageNameSplit = fullImageName.split('.');
        // const imageName = imageNameSplit[0];

        // Or grab the first element directly using destructuring
        const [imageName] = fullImageName.split('.');
        // -------------------------------

        cloudinary.uploader.destroy(imageName); // We don't do await here, so it continues with the code execution while the delete is running.
    }

    try {
        const {tempFilePath} = req.files.file;

        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

        model.image = secure_url;

        await model.save();

        return res.json({results: model})
    } catch (error) {
        console.log('Cloudinary Upload Error: \n', error);

        return res.status(500).json({
            msg: 'Error while uploading image to hosting. See console log.'
        });
    }
}


const imageDisplay = async (req, res) => {
    const {collection, id} = req.params;

    let model;

    switch (collection) {
        case 'products':
            model = await Product.findOne({_id: id, active: true});

            if (!model) {
                return res.status(404).json({
                    msg: `No Active Product found with ID: ${id}`
                });
            }

            break;

        case 'users':
            model = await User.findOne({_id: id, state: true});

            if (!model) {
                return res.status(404).json({
                    msg: `No Active User found with ID: ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({
                msg: "Endpoint not implemented."
            });
    }

    // Cleanup previous image.
    if (model.image) {
        // Obtain image path - Based on hor app, the path should be /uploads/collection/imageName
        const imagePath = path.join(__dirname, '../uploads', collection, model.image);

        // Validate if the image still exists in the server. Then delete id.
        if (fs.existsSync(imagePath)) {
            return res.status(200).sendFile(imagePath);
        }
    }

    // Return sample image if no image is found.
    return res.status(404).sendFile(path.join(__dirname, '../assets/no-image.jpg'));
}


module.exports = {
    fileUpload,
    imageUpdate,
    imageDisplay,
    imageUpdateCloudinary
}