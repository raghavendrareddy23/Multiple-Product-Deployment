const jwt = require('jsonwebtoken');
const User = require('../vendorModel/UserModel');

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Please authenticate' });
        }
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Only admins have access" });
    }
    next();
};

const isVendor = (req, res, next) => {
    if (!req.user || req.user.role !== 'vendor') {
        return res.status(403).json({ message: "Forbidden: Only vendors have access" });
    }
    next();
};

const isDelivery = (req, res, next) => {
    if (!req.user || req.user.role !== 'delivery') {
        return res.status(403).json({ message: "Forbidden: Only delivery personnel have access" });
    }
    next();
};

module.exports = { isAuthenticated, isAdmin, isVendor, isDelivery };
