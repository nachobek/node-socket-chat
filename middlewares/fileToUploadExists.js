// Node modules.

// 3rd party modules

// Own modules


//Middleware development

const fileToUploadExists = (req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            msg: "No files to upload were found."
        });
    }

    next();
}


module.exports = {
    fileToUploadExists
}