module.exports = function (conf) {
    var self = this;
    self.conf = conf;
    self.conn = false;
    self.collection = false;

    var mongo = require('mongodb');
    var ObjectID = mongo.ObjectID;

    /*
     * Initialize the connection.
     * @param {object} conf - Database settings
     * @param {function} callback - Callback function to routes.js
     */
    self.connect = function (callback) {
        if (self.conn) {
            callback(false, self.conn);
            return;
        }
        var conf = self.conf;
        var server = new mongo.Server(conf.host, conf.port, conf.options);
        var db = new mongo.Db(conf.collection, server);
        db.open(function (err, connection) {
            if (err) {
               	console.log('Unable to connect to the MongoDB database');
                callback(true);
                return;
            }
            self.conn = connection;
            self.collection = conf.collection;
            console.log('Connected to the database', self.conn);
            callback(false, self.conn);
        });
    }; // connect()
}