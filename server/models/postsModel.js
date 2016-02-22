var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
    title: {type: 'String', required: true},
	body: {type: 'String'},
	private: {type: 'Boolean'},
	positiveScale: {type: 'Number', min: 1, max: 10},
	user: {type: Schema.Types.ObjectId, ref: 'Users'},
	tags: [{type: 'String'}],
	datePosted: {type: 'Date', required: true}
})

module.exports =  mongoose.model('Posts', postsSchema);