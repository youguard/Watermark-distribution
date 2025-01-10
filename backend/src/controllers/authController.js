const jwt = require('jsonwebtoken')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv').config()
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: { // Your email
        pass: process.env.EMAIL_PASSWORD
    }
});

const signup = async(req, res) => {
    try{
        const { fullName, username, email, phoneNumber, password, region } = req.body
    const user = await User.findOne({ email })
    if(user){
        return res.status(400).json('User already exists...')
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
        fullName,
        username,
        email,
        phoneNumber,
        password: hashedPassword,
        region,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000
    })
    const savedUser = await newUser.save()

    verifyTemplate = 
    `
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="padding: 40px 30px; text-align: center; background-color: #2563eb;">
                <h1 style="color: #ffffff; margin: 0;">YouGuard</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <h2 style="color: #333333; margin-bottom: 20px;">Verify Your Email Address</h2>
                <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                    Thank you for creating an account with YouGuard. To complete your registration, please use the verification code below:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; display: inline-block;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</span>
                    </div>
                </div>
                <div style="margin: 30px 0; padding: 20px; background-color: #f8f8f8; border-radius: 5px;">
                    <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0;">
                        Important:
                        <br>• This code will expire in 10 minutes
                        <br>• Do not share this code with anyone
                        <br>• Enter this code on the verification page to complete your registration
                    </p>
                </div>
                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
                    If you did not create an account, no further action is required.
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px 30px; background-color: #f8f8f8; text-align: center; font-size: 12px; color: #666666;">
                <p style="margin: 0;">
                    This is an automated message, please do not reply to this email.
                    <br>
                    &copy; 2025 YouGuard. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>

    `

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verify Your Email',
        html: verifyTemplate
    };

    await transporter.sendMail(mailOptions);

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
        Approved: savedUser.isApproved,
        Region: savedUser.region,
        Role: savedUser.role

    })

    res.status(201).json({
        success: true,
        message: 'User created successfully. An OTP has been sent to your email for verification.',
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

const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found...' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        const payload = {
            userId : savedUser._id
        }
        const secretKey = process.env.SECRETKEY
        const options = {
            expiresIn : '6hrs'
        }
    
        const token = jwt.sign(payload, secretKey, options)
    
        const userInfo = ({
            FullName: user.fullName,
            Email: user.email,
            Username: user.username,
            PhoneNumber: user.phoneNumber,
            Approved: user.isApproved,
            Region: user.region,
            Role: user.role
    
        })

        res.status(200).json({
            success: true,
            message: 'Email verified successfully.',
            token,
            userInfo
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        });
        console.log(err);
    }
};

const login = async(req, res) => {
    try{
        const { usernameOrEmail, password } = req.body

        let user;
        if(usernameOrEmail.includes('@')){
            //treat as email
            user = await User.findOne({ email: usernameOrEmail.toLowerCase()})
        } else {
            // treat as username
            user = await User.findOne({username: usernameOrEmail})
        }

        if(!user){
            return res.status(400).json({message: 'User Not Found...'})
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

        const userRole = user.role

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            userRole
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
            return res.status(400).json({ message: 'User Not Found...'}) 
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
    changePassword,
    verifyEmail
}