exports = module.exports = function(mongoose) {
	var mongoose = mongoose,  
	    Schema   = mongoose.Schema;

	var incidencias = new Schema({  
	  fecha:     String 
	});

	mongoose.model('incidencias', incidencias); 
}