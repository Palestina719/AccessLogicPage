exports = module.exports = function(mongoose) {
	var mongoose = mongoose,  
	    Schema   = mongoose.Schema;

	var salidas = new Schema({  
	  horaSalida:     Date,
	  iEmpleado : { type: Schema.ObjectId, ref: 'empleados'},  
	});

	mongoose.model('salidas', salidas); 
}