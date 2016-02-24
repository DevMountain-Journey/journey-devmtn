var postsModel = require('./../models/postsModel.js');

module.exports = {

    create: function(req, res) {

        console.log('in postsCtrl');
        console.log('in create');
        console.log('req.body = ', req.body);

        var newPosts = new postsModel(req.body);
        newPosts.save(function(err, result) {
            if (err)
                return res.status(500).send(err);
            else
                res.send(result);
        });
    },

    filter: function(req, res){
       console.log('in postsCtrl');
       console.log('in filter');
       console.log('req.query before processing', req.query);
       for (var item in req.query) {
                req.query[item] = req.query[item].slice(1, req.query[item].length -1);
                req.query[item] = req.query[item].split(',');
//                if (item === 'positiveScale') {
//                    for (var i = 0; i < req.query[item].length; i++) {
//                        req.query[item][i] = Number(req.query[item][i]);
//                    }
//                }
                req.query[item] = {$in: req.query[item]};
        }
        console.log('req.query after processing', req.query);
        postsModel
        .find(req.query)
        // .find({ user: { '$in': ['56cb4697eed2e7e03c406a18', '56c9ed011471537425e5a3c2'] } })
        .populate('user', 'firstName lastName')
        //.select('-__v -password')
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
        if (req.query.pagesize && req.query.pagenumber) {
            if (req.query.filterType && req.query.filterValue) {
                var qPropType = req.query.filterType;
                var qPropVal  = req.query.filterValue;
                postsModel
                .find({qPropType: qPropVal})
                .populate('user', 'firstName lastName')
                //.select('-__v -password')
                .limit(req.query.pagesize)
                .skip(req.query.pagesize * (req.query.pagenumber - 1))
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
            }
            else {
                postsModel
                .find({})
                .populate('user', 'firstName lastName')
                //.select('-__v -password')
                .limit(req.query.pagesize)
                .skip(req.query.pagesize * (req.query.pagenumber - 1))
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
            }
        }
        else {
            postsModel
            .find({})
            .populate('user', 'firstName lastName')             
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
