const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    // Normalize allowed roles (capitalize first letter, lowercase rest)
    const normalizedRoles = roles.map(r => r.charAt(0).toUpperCase() + r.slice(1).toLowerCase());
    return (req, res, next) => {
        const userRole = req.user && req.user.role ? req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1).toLowerCase() : '';
        if (!normalizedRoles.includes(userRole)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
