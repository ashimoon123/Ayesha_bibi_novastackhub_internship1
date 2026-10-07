const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

const configurePassport = () => {
  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth 2.0 Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists
            let user = await User.findOne({
              provider: 'google',
              providerId: profile.id,
            });

            if (user) {
              return done(null, user);
            }

            // Check if email already registered locally
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
              // Link Google to existing account
              user.provider = 'google';
              user.providerId = profile.id;
              user.avatar = profile.photos[0]?.value || null;
              await user.save();
              return done(null, user);
            }

            // Create new user
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              provider: 'google',
              providerId: profile.id,
              avatar: profile.photos[0]?.value || null,
              role: 'Employee', // Default role for OAuth users
            });

            done(null, user);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
  }

  // GitHub OAuth 2.0 Strategy
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: process.env.GITHUB_CALLBACK_URL,
          scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await User.findOne({
              provider: 'github',
              providerId: profile.id,
            });

            if (user) {
              return done(null, user);
            }

            const email =
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : `${profile.username}@github.local`;

            user = await User.findOne({ email });

            if (user) {
              user.provider = 'github';
              user.providerId = profile.id;
              user.avatar = profile.photos[0]?.value || null;
              await user.save();
              return done(null, user);
            }

            user = await User.create({
              name: profile.displayName || profile.username,
              email,
              provider: 'github',
              providerId: profile.id,
              avatar: profile.photos[0]?.value || null,
              role: 'Employee',
            });

            done(null, user);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
  }
};

module.exports = configurePassport;
