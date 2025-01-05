const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    let token;
  
    // Check if there's an Authorization header with a Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    // If no token, proceed as a guest (allow browsing without authorization)
    if (!token) {
      return next();
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.SECRETKEY);
  
      // Determine the user type and fetch the user object
      let user;
      if (decoded.userId) {
        user = await User.findById(decoded.userId).select('-password');
      } else if (decoded.partnerId) {
        user = await Partner.findById(decoded.partnerId).select('-password');
      } else if (decoded.adminId) {
        user = await SuperAdmin.findById(decoded.adminId).select('-password');
      }
  
      // Attach the user object to the request only if a valid user is found
      if (user) {
        req.user = user;
      }

      req.user.role = user.Role
  
    } catch (err) {
      // If token is expired or invalid, simply allow guest access by doing nothing
      return next();
    }
  
    // Proceed with the request
    next();
  };
  

module.exports = protect;
