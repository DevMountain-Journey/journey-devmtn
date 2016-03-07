var usersModel = require('./../models/usersModel.js'),
    _ = require('lodash');


var setSignupDefaults = function(user) {
    user.cohort = 350;
    user.startDate = new Date('November 30, 2015');
    user.assignedMentor = 'Joe Mentor';
    return user;
};

module.exports = {

    /* successRedirect: function(req, res) {
        if (checkRoles(req.user, 'admin'))
            res.redirect('/#/admin');
        else
            return res.status(403).send('Not authorized');
    }, */


    successRespond: function(req, res) {
        res.json(req.user);
    },

    localSignup: function(req, res, next) {
        var newUser = new usersModel();
        req.body = setSignupDefaults(req.body);
        req.body.preferences = {};
        newUser = _.extend(newUser, req.body);
        newUser.save(function(err, result) {
              if(err) return res.status(500).send(err);
              result.password = null;
              next();
            });
    },

    logout: function(req, res) {
        req.logout();
        res.redirect('/#/login');
    },

    current_user: function(req, res) {
        if (req.isAuthenticated())
            res.send(req.user);
        else
            res.status(401).send('Not logged in');
    },


    requireAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            return res.status(401).send('Not logged in');
        }
    }

};
