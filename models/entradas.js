exports = module.exports = function(mongoose) {
	var mongoose = mongoose,  
	    Schema   = mongoose.Schema;

	var entradas = new Schema({  
	  horaEntrada:     Date 
	});

	mongoose.model('entradas', entradas); 
}