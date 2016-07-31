exports = module.exports = function(mongoose) {
	var mongoose = mongoose,  
	    Schema   = mongoose.Schema;

	var salidas = new Schema({  
	  horaSalida:     Date 
	});

	mongoose.model('salidas', salidas); 
}