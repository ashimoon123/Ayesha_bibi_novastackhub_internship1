const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
  revokeTokenFamily,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require('../utils/tokenUtils');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user with local credentials
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Only allow Employee role via public registration
    // SuperAdmin and Manager roles must be assigned by a SuperAdmin
    const allowedRole = 'Employee';

    const user = await User.create({
      name,
      email,
      password, // Hashed by pre-save hook in User model
      role: allowedRole,
      provider: 'local',
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Set refresh token as httpOnly cookie
    setRefreshTokenCookie(res, refreshToken.token);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration.',
    });
  }
};

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login with email and password
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Find user with password field included
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      const lockTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account is locked due to multiple failed login attempts. Try again in ${lockTime} minutes.`,
      });
    }

    // Check if user registered via OAuth (no password)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: `This account uses ${user.provider} login. Please use the ${user.provider} login option.`,
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await user.incrementFailedAttempts();

      const remainingAttempts = Math.max(0, 5 - user.failedLoginAttempts);
      return res.status(401).json({
        success: false,
        message: `Invalid email or password. ${remainingAttempts} attempt(s) remaining before account lockout.`,
      });
    }

    // Reset failed attempts on successful login
    await user.resetFailedAttempts();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Set refresh token as httpOnly cookie
    setRefreshTokenCookie(res, refreshToken.token);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          provider: user.provider,
          avatar: user.avatar,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
    });
  }
};

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token using refresh token rotation
 * @access  Public (requires valid refresh token cookie)
 */
const refresh = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found. Please login again.',
      });
    }

    // Decode the token to get user ID
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: 'User not found or account deactivated.',
      });
    }

    // Rotate refresh token
    const newRefreshToken = await rotateRefreshToken(oldRefreshToken, user);

    // Generate new access token
    const accessToken = generateAccessToken(user);

    // Set new refresh token cookie
    setRefreshTokenCookie(res, newRefreshToken.token);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully.',
      data: { accessToken },
    });
  } catch (error) {
    clearRefreshTokenCookie(res);

    if (error.message.includes('reuse detected')) {
      return res.status(401).json({
        success: false,
        message: error.message,
        code: 'TOKEN_REUSE_DETECTED',
      });
    }

    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token. Please login again.',
    });
  }
};

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout and revoke refresh token
 * @access  Public
 */
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await revokeTokenFamily(refreshToken);
    }

    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    clearRefreshTokenCookie(res);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  }
};

/**
 * OAuth callback handler - issues tokens after successful OAuth
 */
const oauthCallback = async (req, res) => {
  try {
    const user = req.user;

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken.token);

    // Redirect to frontend with access token
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientUrl}/auth/callback?token=${accessToken}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientUrl}/auth/error?message=Authentication failed`);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  oauthCallback,
};
