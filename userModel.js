const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    chatId: {
        type: Number,
        required: true,
        unique: true
    },
    currentValue: {
        type: Number
    }, 
    prevValue: {
        type: Number
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', UserSchema)

module.exports = {User};