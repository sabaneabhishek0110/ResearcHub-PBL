const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
require('dotenv').config();

passport.use(
  new GoogleStrategy( // Wrap options in GoogleStrategy
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/users/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email'],
      prompt: 'select_account consent',
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log('Google profile:', profile); // Debug log
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.findOne({ email: profile.emails?.[0]?.value });
          if (user) {
            // Link Google ID to existing user
            user.googleId = profile.id;
            await user.save();
          } else {
            // Create new user
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0]?.value || '',
            });
            await user.save();
          }
        }

        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '10h' }
        );

        return done(null, { ...user.toObject(), token });
      } catch (error) {
        console.error('Passport error:', error);
        return done(error, null);
      }
    }
  )
);