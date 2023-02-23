// Node modules.
const path = require('path');


// 3rd party modules
const {v4: uuidv4} = require('uuid');


// Own modules


//Helper development

// The "files" argument reprensts the "req.files" used by express-fileupload. Which is an object of name given in the form-data (Api Body)
// By default, our app allows 1 file to be sent in a parameter called "file". That's why we destructure file from files.
const uploadFile = (files, allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'], uploadFolder = '') => {
    return new Promise((resolve, reject) => {
        const {file} = files;

        if (!file) {
            return reject('No files to upload were found');
        }

        const fileSplit = file.name.split('.');
        const fileExtension = fileSplit[fileSplit.length - 1];

        // Validate file extension
        if (!allowedExtensions.includes(fileExtension)) {
            return reject('File extension not allowed');
        }

        const tempFileName = uuidv4() + '.' + fileExtension;

        // -------------------------------------------------
        // By default __dirname points to the current working directory. The "helpers" one in this case.
        // const uploadPath = __dirname + '/uploads/' + file.name);

        // We can use path Node module to recreate the new path taking the current directory as a reference.
        const uploadPath = path.join(__dirname, '../uploads/', uploadFolder, tempFileName);
        // -------------------------------------------------

        file.mv(uploadPath, (err) => {
            if (err) {
                console.log('Error while moving the file.\n', err);
                reject("Error while moving the file. See console log.");
            }

            // resolve(uploadPath);
            resolve(tempFileName); // Returning the new file name rather than the full path in the server.
        });

    });
}

module.exports = {
    uploadFile
}