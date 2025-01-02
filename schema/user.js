const mongoose = require('mongoose');
const { Schema } = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
    },
    name: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    dp:{
        type: String
    },
})

module.exports = mongoose.model('user', userSchema)