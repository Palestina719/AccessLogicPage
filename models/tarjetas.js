exports = module.exports = function(mongoose) {
	var mongoose = mongoose,  
	    Schema   = mongoose.Schema;

	var tarjetas = new Schema({  
	  serie:     String,
	  estado: String
	});

	mongoose.model('tarjetas', tarjetas); 
}