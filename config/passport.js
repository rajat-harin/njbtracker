//to be refactored
const LocalStrategy = require("passport-local").Strategy;
const connection = require("../connection");
//const bcrypt = require('bcrypt');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      (username, password, done) => {
        //match user
        connection.query(
          "SELECT * FROM login WHERE username=$1",
          [username],
          (err, result) => {
            if (!err) {
              if (result.rows.length != 0) {
                if (password == result.rows[0].password) {
                  return done(null, result.rows[0]);
                } else {
                  return done(null, false, { message: "Incorrect Password!" });
                }
              } else {
                return done(null, false, { message: "Invalid User!" });
              }
            } else {
              console.log(err);
            }
          }
        );
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    connection.query("SELECT * FROM login WHERE id=$1", [id], (err, result) => {
      done(err, result.rows[0]);
    });
  });
};
