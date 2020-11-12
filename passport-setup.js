const passport = require('passport');
const User = require('./models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
require("dotenv").config({ path: "./config/config.env" });

passport.serializeUser( (user, done) => done(null, user.email));

passport.deserializeUser(async (email, done) => done(null, await User.findOne({email})));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://${process.env.HOSTNAME}:${process.env.PORT}/api/oauth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log(profile);

    const { 
      sub,
      email,
      name,
      picture,
    } = profile._json;

    let user = await User.findOne({ email });

    if(!user) {
  
      const username = `gUser${sub}`.substring(0,20);
      const profileName = name;
      const profilePic = picture;
      const userType = 'GOOGLE';
      const emailConfirmation = true;

      user = new User({
        username,
        email,
        profileName,
        profilePic,
        userType,
        emailConfirmation,
      });
      
      user.save();
    }

    done(null, user);
  }
));

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `http://${process.env.HOSTNAME}:${process.env.PORT}/api/oauth/facebook/callback`,
    profileFields: [
      'id',
      'first_name',
      'last_name',
      'gender', 
      'picture.type(large)', 
      'email'
    ],
  },
  async (accessToken, refresToken, profile, done) => {
    console.log(profile);

    const { 
      id,
      email,
      first_name,
      middle_name,
      last_name,
    } = profile._json;

    let user = await User.findOne({ email });

    if(!user) {
  
      const username = `facebookUser${id}`.substring(0,20);
      console.log(username);
      const profileName = `${first_name}${middle_name ? ` ${middle_name} `: ` `}${last_name}`;
      const profilePic = profile.photos[0].value;
      const userType = 'FACEBOOK';
      const emailConfirmation = true;

      user = new User({
        username,
        email,
        profileName,
        profilePic,
        userType,
        emailConfirmation
      });
      
      user.save();
    }

    done(null, user);
    done(null, profile);
  }
));
