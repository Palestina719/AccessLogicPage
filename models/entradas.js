exports = module.exports = function(mongoose) {
	var mongoose = mongoose,  
	    Schema   = mongoose.Schema;

	var entradas = new Schema({  
	  horaEntrada:     Date,
	  iEmpleado : { type: Schema.ObjectId, ref: 'empleados'}, 
	});

	mongoose.model('entradas', entradas); 
}