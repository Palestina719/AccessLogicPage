/*
 * database.js
 */

module.exports = function (settings,mongoose,cb) {
    /*
     * Initialize required modules
    */
    var mongoose = mongoose;

    /*
     * Vars
     */
    var motordb     = settings.db,
        collection  = settings.mongodb.collection,
        host        = settings.mongodb.host,
        port        = settings.mongodb.port;

    console.log('Specified motor database : ' + motordb);

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://'+host+":"+port+"/"+ collection, function(err, res) {  
        if(err) {
            cb(err);
        }
        else{
            console.log('Connected to the database', collection);
            cb(false);
        }
    });
}