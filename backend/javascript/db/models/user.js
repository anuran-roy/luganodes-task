const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: uuidv4(),
        unique: true,
        required: true,
    },
    walletAddress: {
        type: String,
        required: false,
        unique: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    username: {
        type: String,
        required: false,
        unique: true
    },
    passwordSalt: {
        type: String,
        required: false,
    },
    passwordHash: {
        type: String,
        required: false,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        require: true,
    },
    phone_number: {
        type: String,
        required: false,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;