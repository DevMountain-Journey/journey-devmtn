var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var preferencesSchema = new Schema({
  viewPreferences: {type: 'String', lowercase: true, required: true, default: 'timeline', enum: ['timeline', 'standard', 'graph']},
	communicationPreferences: {type: 'String', lowercase: true, required: true, default: 'all', enum: ['none', 'newComment', 'weeklySummary', 'all']},
	privacyPreferences: {type: 'String', lowercase: true, required: true, default: 'allPublic', enum: ['allPrivate', 'postsPrivate', 'statsPrivate', 'allPublic']},
});

module.exports = preferencesSchema;
