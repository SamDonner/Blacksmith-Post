const LocalStrategy = require('passport-local').Strategy;

const User = require('../database/index.js').User;

module.exports = passport => {
  passport.serializeUser((user, cb) => {
    cb(null, user,id)
  });
  passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
      cb(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    passReqToCallback: true
  },
  (req, email, password, cb) => {
    process.nextTick(() => {
      User.findOne({'local.username': email}, (err, user) => {
        if (err) return cb(err);
        if (user) return(null, false, req.flash('signupMessage', 'Email already taken'));
        else {
          let newUser = new User();
          newUser.local.username = email;
          newUser.local.password = password;
          newUser.save(err => {
            if (err) throw err;
            return cb(null, newUser);
          });
        }
      });
    });
  }));
};