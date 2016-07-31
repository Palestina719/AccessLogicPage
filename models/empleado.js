exports = module.exports = function(mongoose) {
  var mongoose = mongoose,
      Schema   = mongoose.Schema;

  var tEmpleado = mongoose.model('tipos_empleados');
  var Logins       = mongoose.model('logins');
  var Tarjetas     = mongoose.model('tarjetas');
  var empleado = new Schema({  
    nombre:     String ,
    apPaterno:  String ,
    apMaterno:  String ,
    direccion:  String ,
    telefono:   Number ,
    email:      String ,
    fechaNac:   Date,
    tEmpleado : { type: Schema.ObjectId, ref: 'tipos_empleados'},
    iLogin : { type: Schema.ObjectId, ref: 'logins' },
    iTarjeta: { type: Schema.ObjectId, ref: 'tarjetas' },
    isAdmin: Boolean
  },{versionKey:false});

  mongoose.model('empleados', empleado); 
}