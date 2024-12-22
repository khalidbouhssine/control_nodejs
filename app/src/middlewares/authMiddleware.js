const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  // Verify the token
  jwt.verify(token, 'd5ff7e4e9f4c4a48a8f6a58b6357c1c8', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Access Denied: Invalid Token' });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
