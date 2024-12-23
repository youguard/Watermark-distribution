const Message = require('../models/Message')
const User = require('../models/User')
const Admin = require('../models/Admin')

const sendMessage = async (req, res) => {
    try{
        const {content} = req.body
        const userId = req.user._id
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({message: 'User not authenticated..'})
        }

        const admin = await Admin.findOne()
        if(!admin){
            return res.status(400).json({message: 'No admin found...'})
        }

        const message = new Message({
            sender: user,
            senderType: 'User',
            receiver: admin,
            receiverType: 'Admin',
            content
        })
        await message.save()

        res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            content: content
        }
        )
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

const getMessages = async (req, res) => {
   try {
        const userId = req.user._id
        const user = await User.findById(userId)
    
        const messages = await Message.find({
            $or: [
                {receiver: userId, receiverType: 'User', senderType:'Admin'},
                {sender: userId, senderType: 'User', receiverType: 'Admin'}
            ]
        })
        .populate('sender', 'nickname')
        .populate('receiver', 'name')
        if(!messages){
            return res.status(400).json({message: 'No messages found...'})
        }
        res.status(200).json({
            success:true,
            message: 'Messages retrieved successfully',
            messages
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message: 'Internal Server Error',
            error: err.message
        })
    }
}