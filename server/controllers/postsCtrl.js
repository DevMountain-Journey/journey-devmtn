var postsModel = require('./../models/postsModel.js');
var moment = require('moment');

module.exports = {

    create: function(req, res) {
        var newPost = new postsModel(req.body);
        newPost.save(function(err) {
            postsModel.populate(newPost, {path: 'user', select: 'firstName lastName email'}, function(err, post){
              if(err) return res.status(500).send(err);
              res.send(post);
            });
        });
    },

   filter: function(req, res) {
       console.log('in postsCtrl');
       console.log('in read');
       console.log('req.query before processing', req.query);
       for (var item in req.query) {
            req.query[item] = req.query[item].slice(1, req.query[item].length -1);
            req.query[item] = req.query[item].split(',');
            if (item !== 'datePosted') {
                req.query[item] = {$in: req.query[item]};
            }
            else // datePosted
                req.query[item] = {"$gte": moment(new Date(req.query[item][0])), "$lt": moment(new Date(req.query[item][1])).add(1, 'days')};
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
