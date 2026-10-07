const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const RefreshToken = require('../models/RefreshToken');

/**
 * Generate a short-lived JWT access token (15 minutes)
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
};

/**
 * Generate a long-lived JWT refresh token (7 days)
 * Implements token family tracking for rotation detection
 */
const generateRefreshToken = async (user, family = null) => {
  const tokenFamily = family || uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const token = jwt.sign(
    {
      id: user._id,
      family: tokenFamily,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );

  // Store refresh token in database
  await RefreshToken.create({
    token,
    user: user._id,
    family: tokenFamily,
    expiresAt,
  });

  return { token, family: tokenFamily };
};

/**
 * Rotate refresh token: invalidate old, issue new in same family
 */
const rotateRefreshToken = async (oldToken, user) => {
  const decoded = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);

  // Find the old token record
  const existingToken = await RefreshToken.findOne({ token: oldToken });

  if (!existingToken) {
    // Token not found — possible reuse attack
    // Revoke entire token family
    await RefreshToken.updateMany(
      { family: decoded.family },
      { isRevoked: true }
    );
    throw new Error('Refresh token reuse detected. All sessions revoked.');
  }

  if (existingToken.isRevoked) {
    // Revoked token being reused — compromise detected
    await RefreshToken.updateMany(
      { family: decoded.family },
      { isRevoked: true }
    );
    throw new Error('Refresh token reuse detected. All sessions revoked.');
  }

  // Revoke the old token
  existingToken.isRevoked = true;

  // Generate new refresh token in the same family
  const newRefreshToken = await generateRefreshToken(user, decoded.family);

  existingToken.replacedBy = newRefreshToken.token;
  await existingToken.save();

  return newRefreshToken;
};

/**
 * Revoke all tokens in a family (logout)
 */
const revokeTokenFamily = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    await RefreshToken.updateMany(
      { family: decoded.family },
      { isRevoked: true }
    );
  } catch (error) {
    // Token might be expired, try to find and revoke by token string
    const existingToken = await RefreshToken.findOne({ token });
    if (existingToken) {
      await RefreshToken.updateMany(
        { family: existingToken.family },
        { isRevoked: true }
      );
    }
  }
};

/**
 * Revoke all tokens for a user (force logout all sessions)
 */
const revokeAllUserTokens = async (userId) => {
  await RefreshToken.updateMany(
    { user: userId },
    { isRevoked: true }
  );
};

/**
 * Set refresh token as httpOnly cookie
 */
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/v1/auth',
  });
};

/**
 * Clear refresh token cookie
 */
const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/api/v1/auth',
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
  revokeTokenFamily,
  revokeAllUserTokens,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
