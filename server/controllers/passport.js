var localStrategy = require('passport-local').Strategy,
    User = require('../models/usersModel.js'),
    Devmtn = require('devmtn-auth'),
    DevmtnAuthConfig = require('../config/config').auth,
    DevmtnStrategy = Devmtn.Strategy;


module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        console.log("user = ", user);
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log("id = ", id);
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

        
    // LOCAL AUTH

    passport.use('local-login', new localStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

          // find a user whose email is the same as the forms email
          // we are checking to see if the user trying to login already exists
          
          // convert email to lowercase so that it matches 
          email = email.toLowerCase();
          User.findOne({ 'email' :  email }, function(err, user) {
              // if there are any errors, return the error
              if (err) return done(err);

              // check to see if theres already a user with that email
              if (user) {
                if (user.validPassword(password)) {
                    return done(null, user);
                } else {
                    return done('Invalid Password', false);
                }
              } else {
                  // if there is no user with that email
                  return done('User not found', false);
              }

          });

        });

    }));

    // DEVMOUNTAIN AUTH
    
    passport.use('devmtn', new DevmtnStrategy(DevmtnAuthConfig, function (jwtoken, user, done) {
        console.log("DEV USER: ", user);
        finishLoginFunction(jwtoken, user, done, user.cohort);
     }));
    
    
    var finishLoginFunction = function (jwtoken, user, done, newId) {

        User.findOne({ devmtnId: user.id }, function (findErr, foundUser) {
            console.log("Here is the user being passed from the User Collection in our db " + foundUser)
            if (findErr) return done(findErr, false);

            // If we can't find a user in our db then create one
            if (!foundUser) {
                var newUser = {
                    firstName: user.first_name,
                    lastName:  user.last_name, 
                    email: user.email,
                    cohort: user.cohortId,
                    devmtnId: user.id
                };
                newUser.preferences = {};
                User.create(newUser, function (createErr, createdUser) {
                    if (createErr) return done(createErr, null);
                    console.log("Welcome to our new user, ", createdUser);
                    return done(null, createdUser);
                });
            } else {
                //Existing user found in my database
                console.log('Welcome back, ' + foundUser.firstName + ' ' + foundUser.lastName);
                console.log('USER DATA: ', user);
                foundUser.devmtnId = user.devmtnId;
                var needToUpdate = false;
                // Update fields from DevMountain user records
                if (user.cohortId) {
                    if (foundUser.cohort !== user.cohortId) {
                        foundUser.cohort = user.cohortId;
                        needToUpdate = true;
                    }
                }
                if (user.first_name) {
                    if (foundUser.firstName.toLowerCase() !== user.first_name.toLowerCase()) {
                        foundUser.firstName.toLowerCase() = user.first_name.toLowerCase();
                        needToUpdate = true;
                    }
                }
                if (user.last_name) {
                    if (foundUser.lastName.toLowerCase() !== user.last_name.toLowerCase()) {
                        foundUser.lastName = user.last_name;
                        needToUpdate = true;
                    }
                }
                if (user.email) {
                    if (foundUser.email.toLowerCase() !== user.email.toLowerCase()) {
                        foundUser.email = user.email;
                        needToUpdate = true;
                    }
                }
                if (needToUpdate) {
                    foundUser.save(function(er, re) {
                        if (er) {
                            console.error('Error updating the user roles: ', er);
                            return done(null, foundUser);
                        }
                        else {
                            console.log('Successfully updated user roles: ', re);
                            return done(null, foundUser);
                        }
                    });
                }
                else {
                    return done(null, foundUser);
                }

             }
        });
    };

};
