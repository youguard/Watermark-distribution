const mongoose = require('mongoose')
const { deflateSync } = require('zlib')
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
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
    },
    role: {
        enum: ['User', 'user'],
        default: 'User'
    }
})

const User = mongoose.Model('User', userSchema)

module.exports = User