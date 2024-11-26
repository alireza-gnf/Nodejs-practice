const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");

const { saveUser } = require("../../models/users.model");

const googleConfig = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ["email", "profile"],
};

async function verifyCallback(accessToken, refreshToken, profile, done) {
  const user = {
    id: profile.id,
    firstName: profile.displayName?.split(" ")[0],
    lastName: profile.displayName?.split(" ")[1],
    email: profile.emails[0].value,
    accessToken,
  };
  await saveUser(user);
  done(null, user);
}

passport.use(
  new Strategy(
    {
      clientID: googleConfig.CLIENT_ID,
      clientSecret: googleConfig.CLIENT_SECRET,
      callbackURL: googleConfig.callbackURL,
      scope: googleConfig.scope,
    },
    verifyCallback
  )
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(function () {
    return cb(null, user);
  });
});

module.exports = passport;
