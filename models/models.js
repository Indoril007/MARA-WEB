var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: String,
	email: {type: String, unique: true},
	sub: {type: String, unique: true},
});

var User = mongoose.model('User', userSchema);

model.exports = { 
					"User": User,
				};