var commentsModel = require('./../models/commentsModel.js');

module.exports = {

    create: function(req, res) {

        console.log('in commentsCtrl');
        console.log('in create');
        console.log('req.body = ', req.body);

        var newComments = new commentsModel(req.body);
        newComments.save(function(err, result) {
            if (err)
                return res.status(500).send(err);
            else
                res.send(result);
        });
    },
    
    read: function(req, res) {
        console.log('in commentsCtrl');
        console.log('in read');
        console.log('req.query', req.query);
        commentsModel
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
        console.log('in commentsCtrl');
        console.log('in update');
        console.log('req.params = ', req.params);
        commentsModel
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
        console.log('in commentsCtrl');
        console.log('in update');
        console.log('req.params = ', req.params);
        commentsModel
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
