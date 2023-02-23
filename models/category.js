const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: {type: String, required: [true, 'Name is mandatory.'], unique: true},
    active: {type: Boolean, default: true, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'User reference is mandatory to manipulate a Category.']}
});

CategorySchema.methods.toJSON = function() {
    const { __v, _id, name, active, ...userRest} = this.toObject();

    let user;

    // If there is an access against the DB with .populate(), then userRest will have additional keys/attributes that we need to hide and format.
    // Else, we send the user as is.
    if (userRest && userRest.user._id) {
        user = {
            "uid": userRest.user._id,
            "name": userRest.user.name,
            "email": userRest.user.email,
            "role": userRest.user.role,
            // "state": userRest.user.state,
            "googleLinked": userRest.user.googleLinked
        }
    } else {
        user = userRest.user;
    }

    return {
        "uid": _id,
        name,
        // active,
        user
    };
}


module.exports = model('Category', CategorySchema);