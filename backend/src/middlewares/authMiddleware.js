const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    try {
        // Extract token from headers
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided. Unauthorized.' });
        }
        
        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if it's a user or admin
        let account;
        if (decoded.role === 'Admin') {
            account = await Admin.findById(decoded.id);
        } else if (decoded.role === 'User') {
            account = await User.findById(decoded.id);
        }

        // If no account is found
        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        // Attach account to req object
        req.user = account;
        req.user.role = decoded.role; // Attach role to differentiate later

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token. Unauthorized.', error: err.message });
    }
};

module.exports = protect;
