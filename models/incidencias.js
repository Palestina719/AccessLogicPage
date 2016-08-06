exports = module.exports = function(mongoose) {
	var mongoose = mongoose,  
	    Schema   = mongoose.Schema;
	var empleados = mongoose.model('empleados');
	var tipo_incidencias = mongoose.model('tipos_incidencias');

	var incidencias = new Schema({  
	  fecha:     String,
	  idTIncidencia: { type: Schema.ObjectId, ref: 'tipos_incidencias'},
	  iEmpleado: { type: Schema.ObjectId, ref: 'empleados'}
	});

	mongoose.model('incidencias', incidencias); 
}