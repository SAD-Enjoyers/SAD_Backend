const jwt = require('jsonwebtoken');
const { error } = require('../../utils');
const JWT_SECRET = process.env.JWT_SECRET;

async function authenticateToken(req, res, next) {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (!token) return res.status(401).json(error('Access token missing.', 401));

		const decoded = jwt.verify(token, JWT_SECRET);
		req.userId = decoded.userId;
		req.role = req.headers['Role'];

		next();
	} catch (err) {
		return res.status(403).json(error('Invalid or expired token.', 403));
	}
}

module.exports = authenticateToken;
