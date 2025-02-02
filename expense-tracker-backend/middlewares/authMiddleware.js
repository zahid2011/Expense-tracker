const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Access Denied: No token provided' });
    }

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.userId = verified.userId;  // Attach the user ID to the request object
        next();  // Pass control to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ error: 'Invalid Token' });
    }
};

module.exports = authenticate;
