const jwt = require('jsonwebtoken')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv').config()

const signup = async(req, res) => {
    try{
        const { fullName, username, email, phoneNumber, password } = req.body
    const user = await User.findOne({ email })
    if(user){
        res.status(400).json('User already exists...')
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = bcrypt.hash(password, sale)

    const newUser = new User({
        fullName,
        username,
        email,
        phoneNumber,
        password: hashedPassword
    })

    const savedUser = await newUser.save()

    const payload = {
        userId : savedUser._id
    }
    const secretKey = process.env.SECRETKEY
    const options = {
        expiresIn : '6hrs'
    }

    const token = jwt.sign(payload, secretKey, options)

    const userInfo = ({
        FullName: savedUser.fullName,
        Email: savedUser.email,
        Username: savedUser.username,
        PhoneNumber: savedUser.phoneNumber,
        Approved: savedUser.isApproved

    })

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        token,
        userInfo
    }) 
    } catch(err){
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        })
        console.log(err)
    }  
}

const login = async(req, res) => {
    try{
        const { email, password } = req.body
        const user = await User.findOne({email})
        if(!user){
            res.status(400).json({message: 'User Not Found...'})
        }
        const matchedPassword = await bcrypt.compare(password, user.password)
        if(!matchedPassword){
            res.status(400).json({ message: 'Incorrect Credentials.. Please try again.'})
        }

        const payload = {
            userId : user._id
        }
        const secretKey = process.env.SECRETKEY
        const options = {
            expiresIn : '6hrs'
        }

        const token = jwt.sign(payload, secretKey, options)

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        })
        console.log(err)
    }
}

const forgotPassword = async (req, res) => {
    try{
        const { email } = req.body
        const user = await User.findOne(email)
        if(!user){
            res.status(400).json({ message: 'User Not Found...'}) 
        }

         // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    console.log('Generated Reset Token:', resetToken); // Debug log

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    console.log('Hashed Reset Token:', user.resetPasswordToken); // Debug log

    // Set expire time to 10 minutes from now
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('Reset URL:', resetUrl);

    // email sending to come in later
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

const resetPassword = async (req, res) => {
    try {
      // Get hashed token
      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');
  
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid token' });
      }
  
      //hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      // Set new password
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
  
      // Create new token
      const token = user.getSignedJwtToken();
  
      res.status(200).json({ message : "Password Changed Successfully",  success: true, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };

const changePassword = async (req, res) => {
    try{
        const userId = req.user_id
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({message: 'User not authenticated'})
        }

        const {password, newPassword} = req.body
        const matchedPassword = await bcrypt.compare(password, user.password)
        if(!matchedPassword){
            return res.status(400).json({message: 'Current Password Not Correct'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        user.password = hashedPassword
        await user.save()
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
    changePassword
}