const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  register,
  login,
  refresh,
  logout,
  oauthCallback,
} = require('../controllers/authController');
const { authLimiter } = require('../config/rateLimiter');

// ─── Local Authentication ──────────────────────────
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// ─── Google OAuth 2.0 ──────────────────────────────
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/v1/auth/oauth-error',
  }),
  oauthCallback
);

// ─── GitHub OAuth 2.0 ──────────────────────────────
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false,
  })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: '/api/v1/auth/oauth-error',
  }),
  oauthCallback
);

// ─── OAuth Error Handler ──────────────────────────
router.get('/oauth-error', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'OAuth authentication failed. Please try again.',
  });
});

module.exports = router;
