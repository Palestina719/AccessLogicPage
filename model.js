var mongo = require('mongodb');
var conf = require('./conf');

module.exports = function Model(){
	// Data about connection is in the file conf.json
	var dataMongo = conf.mongoDB,
	self = this,
	Server = mongo.Server,
	Db = mongo.Db,
	ObjectId = mongo.ObjectID,
	conn;
}