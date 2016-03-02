var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
	body: {type: 'String'},
	private: {type: 'Boolean', default: false},
	positiveScale: {type: 'Number', min: 1, max: 10, required: true},
	user: {type: Schema.Types.ObjectId, ref: 'Users'},
	tags: [{type: 'String', lowercase: true}],
	datePosted: {type: 'Date', default: Date.now},
    numComments: {type: 'Number', default: 0}
});

module.exports =  mongoose.model('Posts', postsSchema);
