var usersModel = require('./../models/usersModel.js'),
    _ = require('lodash');

module.exports = {

    create: function(req, res) {
        var newUser = new usersModel();
        req.body.preferences = {};
        newUser = _.extend(newUser, req.body);
        newUser.save(function(err, result) {
              if(err) return res.status(500).send(err);
              result.password = null;
              res.status(200).send(result);
            });

    },

    filter: function(req, res) {
       for (var item in req.query) {
            req.query[item] = req.query[item].slice(1, req.query[item].length -1);
            req.query[item] = req.query[item].split(',');
            req.query[item] = {$in: req.query[item]};
       }
       usersModel
       .find(req.query, '_id')
       .exec(function(err, result) {
             console.log('err', err);
             console.log('result', result);
             if (err) {
                 console.log('in error routine');
                 return res.status(500).send(err);
             }
             else {
                 res.send(result);
             }
       });
    },

    autocomplete: function(req, res) {
       var fieldname = req.query.fieldname;
       var ac_regex = new RegExp(req.query.ac_query);
       req.query = {};
       req.query[fieldname] = {$regex: ac_regex};
       // req.query[fieldname] = {$regex: /jq/};
       /* req.query[fieldname] = 'jquery'; */
       console.log('req.query after processing', req.query);
       usersModel
       .find(req.query, fieldname)
       .sort({datePosted: 'desc'})
       .exec(function(err, result) {
             console.log('err', err);
             console.log('result', result);
             if (err) {
                 console.log('in error routine');
                 return res.status(500).send(err);
             }
             else {
                 res.send(result);
             }
       });
    },

    read: function(req, res) {
        usersModel
        .find(req.query)
        .exec(function(err, result) {
             console.log('err', err);
             console.log('result', result);
             if (err) {
                 console.log('in error routine');
                 return res.status(500).send(err);
             }
             else {
                 res.send(result);
             }
        });
    },

    update: function(req, res) {
      usersModel.findById(req.params.id, function(err, user){
        if(err) res.status(500).send(err);
        user = _.extend(user, req.body);
        user.save(function(err, result){
            if(err) res.status(500).send('DB Operation Error: ', err);
                else res.status(200).send(result);
        });
      });
    },

    delete: function(req, res) {
        usersModel
        .findByIdAndRemove(req.params.id)
        .exec(function(err, result) {
            console.log('err', err);
            console.log('result', result);
            if (err) {
                console.log('in error routine');
                return res.status(500).send(err);
            }
            else {
                res.send(result);
            }
        });
    }


};
