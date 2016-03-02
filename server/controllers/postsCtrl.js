var postsModel = require('./../models/postsModel.js');
var usersModel = require('./../models/usersModel.js');
var moment = require('moment');
var mongoose = require('mongoose');

module.exports = {

    create: function(req, res) {
        var newPost = new postsModel(req.body);
        newPost.save(function(err) {
            if (err)
                return res.status(500).send(err);
                postsModel.populate(newPost, {path: 'user', select: 'firstName lastName email'}, function(err, post){
                    if (err)
                        return res.status(500).send(err);
                    else
                        res.send(post);
                });
        });
    },

   filter: function(req, res) {
       console.log('in postsCtrl');
       console.log('in filter');
       console.log('req.query before processing', req.query);
       for (var item in req.query) {
            req.query[item] = req.query[item].slice(1, req.query[item].length -1);
            req.query[item] = req.query[item].split(',');
            if (item !== 'datePosted') {
                req.query[item] = {$in: req.query[item]};
            }
            else // datePosted
                req.query[item] = {"$gte": moment(new Date(req.query[item][0])), "$lt": moment(new Date(req.query[item][1]))};
       }
       console.log('req.query after processing', req.query);
       postsModel
       .find(req.query)
       .populate('user', 'firstName lastName email')
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

   autocomplete: function(req, res) {
       console.log('in postsCtrl');
       console.log('in autocomplete');
       console.log('req.query before processing', req.query);
       var fieldname = req.query.fieldname;
       var ac_regex = new RegExp(req.query.ac_query);
       req.query = {};
       req.query[fieldname] = {$regex: ac_regex};
       // req.query[fieldname] = {$regex: /jq/};
       /* req.query[fieldname] = 'jquery'; */
       console.log('req.query after processing', req.query);
       postsModel
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

   findAvg: function(req, res) {
       console.log('in postsCtrl');
       console.log('in findAvg');
       console.log('req.query ', req.query);
       var avgType = req.query.type;
       var userId = req.query.user;
       var cohort = req.query.cohort;
       var users = [];
       if ((avgType === 'cohort' || avgType === 'cohortPerWeek') && cohort) {
           usersModel
           .find({cohort: cohort}, '_id')
           .exec(function(err, result) {
                console.log('err', err);
                console.log('result', result);
                if (err) {
                    console.log('in error routine');
                    return res.status(500).send(err);
                }
                else {
                    for (var i = 0; i < result.length; i++) {
                        users.push(result[i]._doc._id);
                    }
                    completeProcess();
                }
           });
       }
       else
           completeProcess();


       function completeProcess() {

           var matchCriteria = {};
           switch(avgType) {
               case 'user' :
                   matchCriteria = {user: mongoose.Types.ObjectId(userId)}; // cast to object because aggregate feature will not automatically do the casting for a ref.
                   break;
               case 'cohort' :
                   matchCriteria = {user: {$in: users}};
                   break;
               case 'userPerWeek' :
                   matchCriteria = {user: mongoose.Types.ObjectId(userId), datePosted: {"$gte": new Date(moment(new Date()).subtract(7, 'day')), "$lt": new Date(moment(new Date()))}}; // cast back to Date object because aggregate feature cannot handle moment objects.
                    break;
               case 'cohortPerWeek' :
                    matchCriteria = {user: {$in: users}, datePosted: {"$gte": new Date(moment(new Date()).subtract(7, 'day')), "$lt": new Date(moment(new Date()))}};
                    break;
           }

           postsModel.aggregate([
               {$match: matchCriteria},
               {$group: {
                   _id: null,
                   avg: {$avg: "$positiveScale"},
                   count: {$sum: 1}
                }}
           ], function(err, result) {
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
   },

   read: function(req, res) {
        console.log('in postsCtrl');
        console.log('in read');
        console.log('req.query', req.query);
        postsModel
        .find(req.query)
        .populate('user', 'firstName lastName email')
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

    readOne: function(req, res) {
        console.log('in postsCtrl');
        console.log('in readOne');
        console.log('req.params', req.params);
        postsModel
        .findById(req.params.id)
        .populate('user')
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

    postCount: function(req, res) {
        console.log('in postsCtrl');
        console.log('in count');
        postsModel
        .count({}, function(err, result) {
             console.log('errCount', err);
             console.log('resultCount', result);
             if (err) {
                 console.log('in error routine');
                 return res.status(500).send(err);
             }
             else {
                 res.json(result);
             }
        });
    },

    update: function(req, res) {
        console.log('in postsCtrl');
        console.log('in update');
        console.log('req.params = ', req.params);
        postsModel
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
        console.log('in postsCtrl');
        console.log('in update');
        console.log('req.params = ', req.params);
        postsModel
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
