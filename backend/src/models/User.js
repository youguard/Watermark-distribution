const mongoose = require('mongoose')
const { deflateSync } = require('zlib')
const Schema = mongoose.Schema
const Region = require('./Region')

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
    createdAt: {
        type: Date,
        defaul: Date.now
    },
    region: {
        type: mongoose.Schema.ObjectId,
        ref: 'Region'
    },
    role: {
        type: String,
        enum: ['User', 'user'],
        default: 'User'
    },
    otp: {
        type: Number
    },
    otpExpires: {
        type: Date
    },
    isVerified : {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User