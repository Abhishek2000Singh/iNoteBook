const mongoose = require('mongoose')

const { Schema } = mongoose;

const UserSchema = new Schema({
    // name: String,   //can be written in this form too
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now,
    },
});
// const User = mongoose.model('user', UserSchema)
// User.createIndexes();

const User = mongoose.model('user', UserSchema);
module.exports = User;