const Software = require('../models/Software')
const User = require('../models/User')
const getSoftwares = async (req, res) => {
    try{
        const softwares = await Software.find()
        .sort({createdAt : -1})
        if(!softwares){
            return res.status(400).json(({message: 'No softwares found...'}))
        }
        res.status(200).json({
            success: true,
            message: 'Softwares fetched successfully...',
            softwares
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

const getSoftwareById = async ( req, res) => {
    try{
        const softwareId = req.params.id
        const software = await Software.findById(softwareId)
        if(!software){
            return res.status(400).json({message: 'Software not found...'})
        }
        res.status(200).json({
            success: true,
            message: 'Softwares fetched successfully...',
            error: err.message
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

const downloadSoftware = async (req, res) => {
    try{
        const userId = req.user._id
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({message: 'User not found...'})
        }

        if(!user.isApproved){
            return res.status(400).json({message: 'User not approved...'})
        }

        const userAgent = req.headers['user-agent'];
        const isMobile = /mobile/i.test(userAgent);
        if (!isMobile) {
          return res.status(400).json({ error: 'Software downloads are only available on mobile devices' });
        }

        const dowloadUrl = `${process.env.SOFTWARE_URL}/watermark-editor.apk`

        res.status(200).json({
            success: true,
            message: 'Software available for download',
            downloadUrl: dowloadUrl
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        })
    }
}