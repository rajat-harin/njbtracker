//to be refactored
const LocalStrategy = require('passport-local').Strategy;
const connection = require('../connection');
const bcrypt = require('bcrypt');

module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
        //match user
        connection.query('SELECT * FROM login WHERE username=?',
            [username],
            (err, result, fields) => {
                if (!err) {
                    if (result.length == 1) {
                        bcrypt.compare(password, result[0].password,  (err, isMatch) =>{
                            if (!err) {
                                if (isMatch) {
                                    return done(null, result[0]);
                                }
                                else {
                                    return done(null, false, { message: 'Incorrect Password!' });
                                }
                            }
                            else {
                                console.log(err);
                            }
                        });
                    }
                    else {
                        return done(null, false, { message: 'Invalid User!' });
                    }
                }
                else {
                    console.log(err);
                }
            });
        
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        connection.query('SELECT * FROM login WHERE id=?',
            [id],
            (err, result, fields) => {
            done(err, result[0]);
        });
    });
}