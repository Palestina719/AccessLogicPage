var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var logins = new Schema({  
  usuario:     String,
  password: String 
},{versionKey:false});

logins.plugin(passportLocalMongoose);
	
module.exports = mongoose.model('logins', logins); 