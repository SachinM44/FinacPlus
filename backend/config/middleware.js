const jwt = require("jsonwebtoken");
require('dotenv').config();
const { JWT_SECRET } = process.env;

const middleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            msg: "Authorization header is missing or invalid"
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (e) {
        return res.status(403).json({
            msg: "Invalid or expired token"
        });
    }
};

module.exports = middleware;