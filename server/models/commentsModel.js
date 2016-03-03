var mongoose = require('mongoose');
var postsModel = require('./postsModel.js');
var Schema = mongoose.Schema;

var commentsSchema = new Schema({
    body: {type: 'String', required: true},
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    postParent: {type: Schema.Types.ObjectId, ref: 'Posts'},
    commentParent: {type: Schema.Types.ObjectId, ref: 'Comments'},
    datePosted: {type: 'Date', default: Date.now}
});

commentsSchema.post('save', function(comment){
  postsModel
    .findById(comment.postParent)
    .exec(function(err, result){
      if(err) return err;
      result.numComments++;
      result.save(function(err, result){
        if(err) return err;
        return comment;
      });
    });
});

module.exports =  mongoose.model('Comments', commentsSchema);
