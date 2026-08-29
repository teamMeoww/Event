const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, role, organizationId) => {
  return jwt.sign({ userId, role, organizationId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
