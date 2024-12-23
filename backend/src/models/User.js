const mongoose = require('mongoose')
const { deflateSync } = require('zlib')
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    region: {
        enum: ['Region-A', 'Region-B', 'Region-C', 'Region-D', 'Region-E', 'Region-F'],
        default: 'Region A'
    },
    createdAt: {
        type: Date,
        defaul: Date.now
    }
})

const User = mongoose.Model('User', userSchema)

module.exports = User