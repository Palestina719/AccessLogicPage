exports = module.exports = function(mongoose) {
	var mongoose = mongoose,  
	    Schema   = mongoose.Schema;

	var tincidencias = new Schema({  
	  nombre:     String
	});

	mongoose.model('tipos_incidencias', tincidencias); 
}