const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.authenticate = async (req, res, next) => {

  const token = req.headers['x-access-token']; 
  console.log("🚀 ~ exports.authenticate= ~ req.headers:", token)
  

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select('-password'); // Exclude password
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied1' });
  }
  next();
};

exports.authorizeEmployee = (req, res, next) => {
  if (req.user.role !== 'employee') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
