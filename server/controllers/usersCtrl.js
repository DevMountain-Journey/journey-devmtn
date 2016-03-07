var usersModel = require('./../models/usersModel.js'),
    _ = require('lodash');

module.exports = {

    create: function(req, res) {

        console.log('in usersCtrl');
        console.log('in create');
        console.log('req.body = ', req.body);

        var newUser = new usersModel();
        req.body.preferences = {};
        newUser = _.extend(newUser, req.body);
        newUser.save(function(err, result) {
              if(err) return res.status(500).send(err);
              result.password = null;
              res.status(200).json(result);
            });

    },

    filter: function(req, res) {
       console.log('in usersCtrl');
       console.log('in filter');
       console.log('req.query before processing', req.query);
       for (var item in req.query) {
            req.query[item] = req.query[item].slice(1, req.query[item].length -1);
            req.query[item] = req.query[item].split(',');
            req.query[item] = {$in: req.query[item]};
       }
       console.log('req.query after processing', req.query);
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
       console.log('in usersCtrl');
       console.log('in read');
       console.log('req.query before processing', req.query);
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
        console.log('in usersCtrl');
        console.log('in read');
        console.log('req.query', req.query);
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
        console.log('in usersCtrl');
        console.log('in update');
        console.log('req.params = ', req.params);
        usersModel
        .findById(req.params.id)
        .exec(function(err, result) {
            console.log('err', err);
            console.log('result', result);
            if (err) {
                console.log('in error routine');
                return res.status(500).send(err);
            }
            else {
                for (var p in req.body) {
                      if (req.body.hasOwnProperty(p)) {
                          result[p] = req.body[p];
                      }
                }
                result.save(function(er, re) {
                    if (er)
                        return res.status(500).send(er);
                    else
                        res.send(re);
                });

             }
        });
    },

    delete: function(req, res) {
        console.log('in usersCtrl');
        console.log('in update');
        console.log('req.params = ', req.params);
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
