var postsModel = require('./../models/postsModel.js');

module.exports = {
    
    create: function(req, res) {
        
        console.log('in postsCtrl');
        console.log('in create');
        console.log('req.body = ', req.body);
      
        var newPosts = new postsModel(req.body)
        newPosts.save(function(err, result) {
            if (err)
                return res.status(500).send(err);
            else 
                res.send(result);
        });
    },
    
    read: function(req, res) {
        console.log('in postsCtrl');
        console.log('in read');
        console.log('req.query', req.query)
        if (req.query.pagesize && req.query.pagenumber) {
            postsModel
            .find({})
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
                     res.send(result)
                 }
            })
        }
        else {
            postsModel
            .find({})
            .exec(function(err, result) {
                 console.log('err', err);
                 console.log('result', result);
                 if (err) {
                     console.log('in error routine');
                     return res.status(500).send(err);
                 }
                 else {
                     res.send(result)
                 }
            })
        }
        
    },
    
    readOne: function(req, res) {
        console.log('in postsCtrl');
        console.log('in readOne');
        console.log('req.params', req.params)
        surveysModel
        .findById(req.params.id)
        .exec(function(err, result) {
             console.log('err', err);
             console.log('result', result);
             if (err) {
                 console.log('in error routine');
                 return res.status(500).send(err);
             }
             else {
                 res.send(result)
             }
        })
    },
    
    
   
    update: function(req, res) {
        console.log('in postsCtrl');
        console.log('in update');
        console.log('req.params = ', req.params)
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
        console.log('req.params = ', req.params)
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
 
 
}