/*
 * database.js
 */

module.exports = function (type, settings,mongoose,cb) {
    /*
     * Initialize required modules
    */
    var mongoose = mongoose;

    /*
     * Vars
     */
    var collection = settings.collection;

    console.log('Specified motor database : ' + type);

    mongoose.connect('mongodb://localhost:27017/'+ collection, function(err, res) {  
        if(err) {
            cb(true);
        }
        else{
            console.log('Connected to the database', collection);
            cb(false);
        }
    });
}