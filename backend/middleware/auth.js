const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_foryou_2026_change_in_production');
      
      req.admin = await Admin.findById(decoded.id).select('-passwordHash');
      if (!req.admin) {
        return res.status(401).json({ message: 'Unauthorized: Admin user not found' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing authorization header' });
  }
};

module.exports = { protectAdmin };
