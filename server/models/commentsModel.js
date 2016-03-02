var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentsSchema = new Schema({
    body: {type: 'String', required: true},
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    postParent: {type: Schema.Types.ObjectId, ref: 'Posts'},
    commentParent: {type: Schema.Types.ObjectId, ref: 'Comments'},
    datePosted: {type: 'Date', default: Date.now}
});

module.exports =  mongoose.model('Comments', commentsSchema);
