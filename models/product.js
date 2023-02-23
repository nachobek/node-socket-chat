const { Schema, model } = require('mongoose');


const ProductSchema = Schema({
    name: {type: String, required: [true, 'Name is mandatory.'], unique: true},
    active: {type: Boolean, default: true, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'User reference is mandatory to manipulate a Product.']},
    price: {type: Number, default: 0},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: [true, 'The product Category is required.']},
    description: {type: String},
    isAvailable: {type: Boolean, default: true},
    image: {type: String}
});


ProductSchema.methods.toJSON = function() {
    const { __v, _id, active, ...data} = this.toObject();


    // const { __v, _id, name, active, ...userRest} = this.toObject();

    // let user;

    // if (userRest && userRest.user._id) {
    //     user = {
    //         "uid": userRest.user._id,
    //         "name": userRest.user.name,
    //         "email": userRest.user.email,
    //         "role": userRest.user.role,
    //         // "state": userRest.user.state,
    //         "googleLinked": userRest.user.googleLinked
    //     }
    // } else {
    //     user = userRest.user;
    // }

    data.uid = _id;

    return data;
}


module.exports = model('Product', ProductSchema);