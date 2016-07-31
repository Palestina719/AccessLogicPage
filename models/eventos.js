exports = module.exports = function(mongoose) {
	var mongoose = mongoose,  
	    Schema   = mongoose.Schema;

	var eventos = new Schema({  
	  nombreEvento:     String,
	  descripcion: 		String,
	  fechaInicioEvento: Date,
	  fechaFinEvento: 	Date  
	});

	mongoose.model('eventos', eventos); 
}