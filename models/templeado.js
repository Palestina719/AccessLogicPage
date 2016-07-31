exports = module.exports = function(mongoose) {
	var mongoose = mongoose,  
	    Schema   = mongoose.Schema;

	var tEmpleado = new Schema({  
	  nombre:     String 
	});

	mongoose.model('tipos_empleados', tEmpleado); 
}