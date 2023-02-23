const mongoose = require('mongoose');


const dbConnection = async() => {
    try {
        // The connect() function returns a promise, so I could grab it in a .then. However, since our dbConnection function is async, we can catch it with await instead.
        // await mongoose.connect(process.env.MONGODB_CNN, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     useCreateIndex: true,
        //     useFindAndModify: false
        // });
        await mongoose.connect(process.env.MONGODB_CNN);

        console.log('Successfully connected to the DB.');
    } catch (error) {
        console.log(error);
        throw new Error('Error while connecting to the DB.');
    }
}

module.exports = {
    dbConnection
}