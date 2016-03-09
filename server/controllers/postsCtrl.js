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
       .populate('user', 'firstName lastName email cohort assignedMentor usersFollowing')
       .sort({datePosted: 'desc'})
       .exec(function(err, result) {
             console.log('err', err);
            //  console.log('result', result);
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
            //  console.log('result', result);
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
       var group = '',
           duration = '';
       if (req.query.group)
            group = req.query.group;
       else
            group = 'user';
       if (req.query.duration)
            duration = req.query.duration;
       else
            duration = 'allTime';
       var user = req.query.user;
       var breakOutTags = (req.query.tags === 'true');
       var cohort = 0;
       var assignedMentor = '';
       var users = [];
       var queryUsers = true;
       if (group && group !== 'user') {
           usersModel
           .findById(user, 'cohort assignedMentor usersFollowing')
           .exec(function(err, result) {
                console.log('err', err);
                // console.log('result', result);
                if (err) {
                    console.log('in error routine');
                    return res.status(500).send(err);
                }
                else {
                    var queryObj = {};
                    switch (group) {
                        case 'following':
                           for (var i = 0; i < result._doc.usersFollowing.length; i++) {
                                users.push(result._doc.usersFollowing[i]);
                            }
                            completeProcess();
                            queryUsers = false;
                            break;
                        case 'mentor':
                            assignedMentor = result._doc.assignedMentor;
                            queryObj.assignedMentor = assignedMentor;
                            break;
                        case 'cohort':
                            cohort = result._doc.cohort;
                            queryObj.cohort = cohort;
                            break;
                        default:
                            cohort = result._doc.cohort;
                            queryObj.cohort = cohort;
                            break;
                    }
                    if (queryUsers) {
                        usersModel
                        .find(queryObj, '_id')
                        .exec(function(er, re) {
                            console.log('er', er);
                            // console.log('re', re);
                            if (er) {
                                console.log('in error routine');
                                return res.status(500).send(er);
                            }
                            else {
                                for (var i = 0; i < re.length; i++) {
                                    users.push(re[i]._doc._id);
                                }
                                completeProcess();
                            }
                        });
                    }
                }
           });
       }
       else {
           users.push(mongoose.Types.ObjectId(user)); // cast to object because aggregate feature will not automatically do the casting for a ref.
           completeProcess();
       }

       function completeProcess() {

           var matchCriteria = {};
           switch(duration) {
               case 'day' :
                   matchCriteria = {user: {$in: users}, datePosted: {"$gte": new Date(moment(new Date()).subtract(1, 'day')), "$lt": new Date(moment(new Date()))}}; // cast back to Date object because aggregate feature cannot handle moment objects.
                   break;
               case 'week' :
                   matchCriteria = {user: {$in: users}, datePosted: {"$gte": new Date(moment(new Date()).subtract(7, 'day')), "$lt": new Date(moment(new Date()))}};
                    break;
               case 'month' :
                    matchCriteria = {user: {$in: users}, datePosted: {"$gte": new Date(moment(new Date()).subtract(1, 'month')), "$lt": new Date(moment(new Date()))}};
                    break;
               case 'allTime' :
                     matchCriteria = {user: {$in: users} };
                     break;
               default :
                    matchCriteria = {user: {$in: users} };
                    break;
           }

           if (!breakOutTags) {
               postsModel.aggregate([
                   {$match: matchCriteria},
                   {$group: {
                       _id: null,
                       avg: {$avg: '$positiveScale'},
                       count: {$sum: 1}
                    }}
               ], function(e, r) {
                   console.log('err', e);
                  //  console.log('result', r);
                   if (e) {
                       console.log('in error routine');
                       return res.status(500).send(e);
                   }
                   else {
                       res.send(r);
                   }
               });
           }
           else { // break out tags
               postsModel.aggregate([
                   {$match: matchCriteria},
                   {$unwind: '$tags'},
                   {$group: {
                       _id: '$tags',
                       avg: {$avg: '$positiveScale'},
                       count: {$sum: 1}
                    }}
               ], function(e, r) {
                   console.log('err', e);
                  //  console.log('result', r);
                   if (e) {
                       console.log('in error routine');
                       return res.status(500).send(e);
                   }
                   else {
                       res.send(r);
                   }
               });
           }
       }
   },

    findPosts: function(req, res) {
       console.log('in postsCtrl');
       console.log('in findPosts');
       console.log('req.query ', req.query);
       var group = req.query.group;
       var duration = req.query.duration;
       var user = req.query.user;
       var cohort = 0;
       var assignedMentor = '';
       var users = [];
       var queryUsers = true;
       if (group && group !== 'user') {
           usersModel
           .findById(user, 'cohort assignedMentor usersFollowing')
           .exec(function(err, result) {
                console.log('err', err);
                // console.log('result', result);
                if (err) {
                    console.log('in error routine');
                    return res.status(500).send(err);
                }
                else {
                    var queryObj = {};
                    switch (group) {
                        case 'following':
                           for (var i = 0; i < result._doc.usersFollowing.length; i++) {
                                users.push(result._doc.usersFollowing[i]);
                            }
                            completeProcess();
                            queryUsers = false;
                            break;
                        case 'mentor':
                            assignedMentor = result._doc.assignedMentor;
                            queryObj.assignedMentor = assignedMentor;
                            break;
                        case 'cohort':
                            cohort = result._doc.cohort;
                            queryObj.cohort = cohort;
                            break;
                    }
                    if (queryUsers) {
                        usersModel
                        .find(queryObj, '_id')
                        .exec(function(er, re) {
                            console.log('er', er);
                            // console.log('re', re);
                            if (er) {
                                console.log('in error routine');
                                return res.status(500).send(er);
                            }
                            else {
                                for (var i = 0; i < re.length; i++) {
                                    users.push(re[i]._doc._id);
                                }
                                completeProcess();
                            }
                        });
                    }
                }
           });
       }
       else {
           users.push(mongoose.Types.ObjectId(user)); // cast to object because aggregate feature will not automatically do the casting for a ref.
           completeProcess();
       }

       function completeProcess() {

           var queryCriteria = {};
           switch(duration) {
               case 'day' :
                   queryCriteria = {user: {$in: users}, datePosted: {"$gte": new Date(moment(new Date()).subtract(1, 'day')), "$lt": new Date(moment(new Date()))}}; // cast back to Date object because aggregate feature cannot handle moment objects.
                   break;
               case 'week' :
                   queryCriteria = {user: {$in: users}, datePosted: {"$gte": new Date(moment(new Date()).subtract(7, 'day')), "$lt": new Date(moment(new Date()))}};
                    break;
               case 'month' :
                    queryCriteria = {user: {$in: users}, datePosted: {"$gte": new Date(moment(new Date()).subtract(1, 'month')), "$lt": new Date(moment(new Date()))}};
                    break;
               case 'allTime' :
                    queryCriteria = {user: {$in: users} };
                    break;
           }
           postsModel
           .find(queryCriteria, 'positiveScale datePosted')
           .sort({datePosted: 'desc'})
           .exec(function(e, r) {
                console.log('e', e);
                // console.log('r', r);
                if (e) {
                    console.log('in error routine');
                    return res.status(500).send(e);
                }
                else {
                    res.send(r);
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
        .populate('user', 'firstName lastName email cohort assignedMentor usersFollowing')
        .sort({datePosted: 'desc'})
        .exec(function(err, result) {
             console.log('err', err);
            //  console.log('result', result);
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
            //  console.log('result', result);
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
            //  console.log('resultCount', result);
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
            // console.log('result', result);
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
            // console.log('result', result);
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
