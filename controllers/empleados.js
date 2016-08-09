var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 
var Regex = require("regex");
var async = require('async');
var PDFDocument = require('pdfkit');
var fs = require('fs');
//Models
var Entradas     = mongoose.model('entradas'),
    Eventos      = mongoose.model('eventos'),
    Incidencias  = mongoose.model('incidencias'),
    Logins       = mongoose.model('logins'),
    Salidas      = mongoose.model('salidas'),
    Tarjetas     = mongoose.model('tarjetas'),
    TEmpleados   = mongoose.model('tipos_empleados'),
    TIncidencias = mongoose.model('tipos_incidencias'),
    Empleados    = mongoose.model('empleados');


//GET - Obtiene la vista de calendario
exports.calendar = function(req, res) {  
  findUserActive(req, function(err, empleado){
    if (err)
      res.send(500, err.message);
    res.status(200).render('calendario',{user: empleado}); //, { message: req.flash('message') }
  });
};

//GET - Obtiene la vista de los horarios
exports.horario = function(req, res) {  
  findUserActive(req, function(err, empleado){
    if (err)
      res.send(500, err.message);
    res.status(200).render('horario',{user: empleado}); //, { message: req.flash('message') }
  });
};

//GET - Obtiene la vista de los usuarios registrados
exports.users = function(req, res) {  
  var emps = [];
  findUserActive(req, function(err, empleado){
    if (err)
      res.send(500, err.message);
    if(empleado.isAdmin){
      findAllEmpleados(function(err,emps){
        if(err)
          res.send(500, err.message);
        if(req.session.errDel){
          res.status(200).render('list_users',{user: empleado, users:emps, message: req.flash('message'),messageNoUsers : false, messageLogin:true}); 
        }
        else{
          res.status(200).render('list_users',{user: empleado, users:emps});   
        }
      });
    }
    else {
      res.redirect('/');
    }
  });
};

//GET - Obtiene la vista para agregar un usuario
exports.addUserView = function(req, res) {  
  findUserActive(req, function(err, empleado){
    if (err)
      res.send(500, err.message);
    if(empleado.isAdmin){
      Tarjetas.find({"estado":"inactivo"},function(err, tarj){
        if(err)
          res.send(500, err.message);
        TEmpleados.find({}, function(err, tEmps){
          if(err)
            res.send(500, err.message);
          res.status(200).render('addUser',{user: empleado, cards:tarj, puestos:tEmps});
        });
      });
    }
    else {
      res.redirect('/');
    }
  });
};

//GET - Obtiene la vista para mostrar las incidencias
exports.incidencias = function(req, res) {  
  findUserActive(req, function(err, empleado){
    if (err)
      res.send(500, err.message);
    if(empleado.isAdmin){
      findIncidencias( function(err, incidencias){
        if(err)
          res.send(500, err.message);
        for(var x=0; x<incidencias.length; x++){
          var fecha = new Date(incidencias[x].fecha);
          fecha = formatDate(fecha);
          incidencias[x].date=fecha;
        }      
        res.status(200).render('incidencias',{user: empleado, incidencias: incidencias}); 
      });
    }
    else{
      findIncidenciasByUserId(empleado._id, function(err, incidenciaInd){
        if(err)
          res.send(500, err.message);
        for(var x=0; x<incidenciaInd.length; x++){
          var fecha = new Date(incidenciaInd[x].fecha);
          fecha = formatDate(fecha);
          incidenciaInd[x].date=fecha;
        }      
        res.status(200).render('incidencias',{user: empleado, incidencias: incidenciaInd}); 
      })
    }
  });
};

//Funcion para dar formato a una fecha
function formatDate(fecha){
  var mes = fecha.getUTCMonth() +1;     // 11
  var dia = fecha.getUTCDate();      // 29
  var anio = fecha.getUTCFullYear();
  var diaSemana = fecha.getUTCDay();
  var h = fecha.getUTCHours();
  var m = fecha.getUTCMinutes();
  var s = fecha.getUTCSeconds();
  
  if(dia > 0 && dia < 10)
    dia = "0"+dia;
  if(h >= 0 && h < 10)
    h = "0"+h;
  if(m >= 0 && m < 10)
    m = ""+0+m;
  if(s >= 0 && s < 10)
    s = "0"+s;
  var hora = h+":"+m+":"+s;

  switch(diaSemana){
    case 0: 
    diaSemana = "Domingo";
    break;
    case 1: 
    diaSemana = "Lunes";
    break;
    case 2: 
    diaSemana = "Martes";
    break;
    case 3: 
    diaSemana = "Miércoles";
    break;
    case 4: 
    diaSemana = "Jueves";
    break;
    case 5: 
    diaSemana = "Viernes";
    break;
    case 6: 
    diaSemana = "Sábado";
    break;
  }
  switch(mes){
    case 1: 
    mes = "Enero";
    break;
    case 2: 
    mes = "Febrero";
    break;
    case 3: 
    mes = "Marzo";
    break;
    case 4: 
    mes = "Abril";
    break;
    case 5: 
    mes = "Mayo";
    break;
    case 6: 
    mes = "Junio";
    break;
    case 7: 
    mes = "Julio";
    break;
    case 8: 
    mes = "Agosto";
    break;
    case 9: 
    mes = "Septiembre";
    break;
    case 10: 
    mes = "Octubre";
    break;
    case 11: 
    mes = "Noviembre";
    break;
    case 12: 
    mes = "Diciembre";
    break;
  }
  var f = diaSemana +", " +dia+ " de "+mes+" del "+ anio+", a las "+hora;
  return f;
}
//Busqueda
exports.search = function(req, res) {  
  var emps = [];
  var param = req.body.search;
  //console.log(param);
  findUserActive(req, function(err, empleado){
    if (err)
      res.send(500, err.message);
    if(empleado.isAdmin){
      findUserByName(param, function(err,emps){
      //findAllEmpleados(function(err,emps){
        if(err){
          console.log(err);
          res.send(500, err.message);
        }
        //console.log(emps);
        if(emps == null){
          res.status(200).render('list_users',{user: empleado, users:emps,message: req.flash('message'), messageNoUsers : true, messageLogin:false}); 
        }
        else{
          res.status(200).render('list_users',{user: empleado, users:emps});   
        }
      });
    }
    else {
      res.redirect('/');
    }
  });
};

//POST - Generar un reporte de incidencias
exports.report = function(req,res){
  findUserActive(req, function(err, empleado){
    if (err)
      res.send(500, err.message);
    var fechaHoy = new Date();
    fechaHoy = fechaHoy.toLocaleDateString();
   
    var doc = new PDFDocument;
    doc.pipe(fs.createWriteStream('output.pdf'));
    doc.pipe(res);
    //Header (logo y titulo)
    doc
    .image('public/img/logoamerica.png',25, 25, {width: 100})
    .fontSize(25)
    .text('Reporte de Incidencias', 150, 40)
    .fontSize(20)
    .text(fechaHoy,150,70);
    if(empleado.isAdmin){
     var xNombre = 40;
     var yNombre = 180;
     var xTipoI = 230;
     var yTipoI = 180;
     var xFechaHora = 400;
     var yFechaHora = 180;
      //Se muestra un titulo general
      doc
      .fontSize(20)
      .text("Incidencias de todos los empleados", 150, 100)
      .fontSize(15)
      .text("Nombre",xNombre,yNombre)
      .text("Tipo de Incidencia",xTipoI,yTipoI)
      .text("Fecha y Hora",xFechaHora,yFechaHora);

      findIncidencias( function(err, incidencias){
        if(err)
          res.send(500, err.message);
        for(var x=0; x<incidencias.length; x++){
          var fecha = new Date(incidencias[x].fecha);
          fecha = formatDate(fecha);
          incidencias[x].date=fecha;
          yNombre += 30;
          yTipoI += 30;
          yFechaHora += 30;
          doc
          .fontSize(10)
          .text(incidencias[x].iEmpleado.nombre + " " +incidencias[x].iEmpleado.apPaterno + " "+ incidencias[x].iEmpleado.apMaterno, xNombre, yNombre )
          .text(incidencias[x].idTIncidencia.nombre, xTipoI, yTipoI )
          .text(fecha, xFechaHora, yFechaHora )
        }      
        doc.end();
      });
    }
    else{
      var xNombre = 40;
      var yNombre = 180;
      var xTipoI = 40;
      var yTipoI = 180;
      var xFechaHora = 210;
      var yFechaHora = 180;
      //Se muestra el nombre del empleado
      doc
      .fontSize(20)
      .text("Incidencias de: " , 150, 100)
      .fontSize(23)
      .text(empleado.nombre +" "+empleado.apPaterno+" "+empleado.apMaterno, 300,100)
      .fontSize(15)
      .text("Tipo de Incidencia",xTipoI,yTipoI)
      .text("Fecha y Hora",xFechaHora,yFechaHora);
      findIncidenciasByUserId(empleado._id, function(err, incidenciaInd){
          if(err)
            res.send(500, err.message);
          for(var x=0; x<incidenciaInd.length; x++){
            var fecha = new Date(incidenciaInd[x].fecha);
            fecha = formatDate(fecha);
            incidenciaInd[x].date=fecha;
            yTipoI += 30;
            yFechaHora += 30;
            doc
            .fontSize(10)
            .text(incidenciaInd[x].idTIncidencia.nombre, xTipoI, yTipoI )
            .text(fecha, xFechaHora, yFechaHora )
          }      
          doc.end();
        })
      
    }
  });
}

//GET - Obtiene la vista para actualizar un usuario
exports.updateEmpleadoView = function(req, res) {
  findUserActive(req, function(err, empleado){
    if (err)
      res.send(500, err.message);
    if(empleado.isAdmin){
      var id = req.params.id;
      findUserById(id, function(err, empleadoModSend){
        if (err)
          res.send(500, err.message);
        
        var fecha = new Date(empleadoModSend.fechaNac);
        var mes = fecha.getMonth() +1;     // 11
        var dia = fecha.getDate()+1;      // 29
        var anio = fecha.getFullYear();
        if(dia > 0 && dia < 10)
          dia = "0"+dia;
        if(mes > 0 && mes < 10)
          mes = "0"+mes;
        //anio="19"+anio;
        fecha = anio +"-"+mes+"-"+dia;
        empleadoModSend.fNac = fecha;
        findTipoEmpleados(function(err,tEmps){
           if(err)
            res.send(500, err.message);
          findCards(function(err, tarj){
            if(err)
              res.send(500, err.message);
            tarj.push(empleadoModSend.iTarjeta);
            //console.log(empleadoModSend);
            res.status(200).render('modificarEmpleado',{userModificar: empleadoModSend, user:empleado, cards: tarj, puestos:tEmps});
          })
        })
      });
    }
    else {
      res.redirect('/');
    }
  });
};

//Obtiene todos los empleados
function findAllEmpleados(cb) {  
  Empleados.find({})
    .populate("tEmpleado")
    .populate("iLogin")
    .populate("iTarjeta")
    .exec(function(err, empleados) {
      if(err)
        cb(true)
      cb(false, empleados);
  });
};

//Obtiene el empleado activo
function findUserActive (req, cb) {  
  var id = req.user._id;
  Empleados.findOne()
    .where("iLogin", ObjectId(id))
    .populate("tEmpleado")
    .populate("iLogin")
    .populate("iTarjeta")
    .exec(function(err, empleado) {
    if(err)
      cb(true);
    req.session.errorlogin = false;
    req.session.idUserActive = empleado._id;
    cb(false, empleado);
  });
};

//Obtiene un empleado en base a un id
function findUserById (id, cb) {  
  var idd = id;
  Empleados.findOne({"_id":ObjectId(idd)})
    
    .populate("tEmpleado")
    .populate("iLogin")
    .populate("iTarjeta")
    .exec(function(err, empleado) {
    if(err)
      cb(true);
    cb(false, empleado);
  });
};

//Obtiene un empleado en base al nombre o apellidos
function findUserByName (param, cb) {  
  var param = param;
  var regex = new Regex('^'+param+'$', "i");
  Empleados.find(
    { $or : [{"nombre":{$regex: new RegExp('^' + param, 'i')}},{"apPaterno":{$regex: new RegExp('^' + param, 'i')}}, {"apMaterno": {$regex: new RegExp('^' + param, 'i')}}]} )
    .populate("tEmpleado")
    .populate("iLogin")
    .populate("iTarjeta")
    .exec(function(err, empleado) {
    if(err)
      cb(true);
    cb(false, empleado);
  });
};

//Encontrar los tipos de empleados
function findTipoEmpleados(cb){
  TEmpleados.find({}, function(err, tEmps){
    if(err)
      cb(true);
    cb(false,tEmps)
  });
}

//Encontrar un tipo de empleado por nombre
function findTipoEmpleadosByName(nombre, cb){
  TEmpleados.findOne({"nombre":nombre}, function(err, tEmp){
    if(err)
      cb(true);
    cb(false,tEmp)
  });
}

//Encontrar todas las incidencias
function findIncidenciasByUserId(id, cb){
  Incidencias.find( {"iEmpleado": ObjectId(id) })
  .populate("idTIncidencia")
  .populate("iEmpleado")
  .exec(function(err, incidencia) {
    if(err)
      cb(true);
    cb(false, incidencia);
  });
}

//Encontrar todas las incidencias
function findIncidencias(cb){
  Incidencias.find({})
  .populate("idTIncidencia")
  .populate("iEmpleado")
  .exec(function(err, incidencias) {
    if(err)
      cb(true);
    cb(false, incidencias);
  });
}

//Encontrar un login en base a un nombre de usuario
function findLoginById(id, cb){
  Logins.findOne({"_id": ObjectId(id)}, function(err, login){
    if(err)
      cb(true);
    cb(false,login)
  });
}

//Encontrar las tarjetas
function findCards(cb){
  Tarjetas.find({"estado":"inactivo"}, function(err, cards){
    if(err)
      cb(true);
    cb(false,cards)
  });
}

//Encontrar la tarjeta por serie
function findCardBySerie(serie, cb){
  Tarjetas.findOne({"serie": serie}, function(err, card){
    if(err)
      cb(true);
    cb(false,card)
  });
}

//Encontrar la tarjeta por id
function findCardById(id, cb){
  Tarjetas.findOne({"_id": id}, function(err, card){
    if(err)
      cb(true);
    cb(false,card)
  });
}
//POST - Guarda un empleado
exports.addEmpleado = function(req, res) {
   findUserActive(req, function(err, empleado){
    if (err)
      res.send(500, err.message);
    if(empleado.isAdmin){
      var serieTarjeta = req.body.serieTarjeta;
      var tipoEmpleado = req.body.tEmpleado;
      var isAdmin = req.body.isAdmin;
      if(isAdmin == "No")
        isAdmin = false;
      else
        isAdmin = true;
      findCardBySerie(serieTarjeta, function(err, card){
        if(err)
          res.send(500, err.message);
        findTipoEmpleadosByName(tipoEmpleado, function(err, tEmp){
          if(err)
            res.send(500, err.message);
          //console.log(req.body);
          var l = new Logins({
            usuario   : req.body.username,
            password  : req.body.password
          });
          l.save(function(err){
            if(err)
              res.send(500, err.message);
            card.estado = "activo";
            card.save(function(err, card){
              if(err)
                res.send(500, err.message);
              var empleado = new Empleados({
                nombre    : req.body.nombre,
                apPaterno : req.body.apPaterno,
                apMaterno : req.body.apMaterno,
                direccion : req.body.direccion,
                telefono  : req.body.telefono,
                email     : req.body.email,
                fechaNac  : req.body.fechaNac,
                tEmpleado : tEmp._id,
                iLogin    : l._id,
                iTarjeta  : card._id,
                isAdmin   : isAdmin
              });
              //console.log(empleado);
              empleado.save(function(err){
                if(err){
                  console.log("hubo errror ", err);
                  res.send(500, err.message);
                }
                res.redirect("/users");
              });
            });
          });
        });
      });
    }
    else{
      res.redirect("/");
    }
  });
}

//PUT - Actualiza un empleado existente
exports.updateEmpleado = function(req, res) {
   findUserActive(req, function(err, empleado){
    if (err)
      res.send(500, err.message);
    if(empleado.isAdmin){  
      var id = req.params.id;
      var tipoEmpleado = req.body.tEmpleado;
      var serieCard = req.body.serieTarjeta;
      var username = req.body.username;
      var password = req.body.password;
      var isAdmin = req.body.isAdmin;
      if(isAdmin == "No")
        isAdmin = false;
      else
        isAdmin = true;
      findUserById(id, function(err, user){
        var idLogin = user.iLogin._id;
        var idTarjeta = user.iTarjeta._id;
        findTipoEmpleadosByName(tipoEmpleado, function(err, tipoEmp){
          if(err)
              return res.status(500).send(err.message);
          var idTipoEmpleado = tipoEmp._id;
          findCardBySerie(serieCard, function(err, card){ //tarjeta elegida
            if(err)
              return res.status(500).send(err.message);
            var idCard = card._id;
            findCardById(idTarjeta, function(err, tarj){ //tarjeta actual user
              if(err)
                  return res.status(500).send(err.message);
              findLoginById(idLogin, function(err,login){
                if(err)
                  return res.status(500).send(err.message);
                //console.log(user, isAdmin);
                user.nombre = req.body.nombre;
                user.apPaterno = req.body.apPaterno;
                user.apMaterno = req.body.apMaterno;
                user.direccion = req.body.direccion;
                user.telefono = req.body.telefono;
                user.email = req.body.email;
                user.fechaNac = req.body.fechaNac;
                user.tEmpleado = idTipoEmpleado;
                user.isAdmin = isAdmin;
                user.iTarjeta = idCard;
                if(String(idTarjeta) !=  String(idCard))
                  tarj.estado = "inactivo";
                else
                 tarj.estado = "activo"; 
                card.estado = "activo";
                login.usuario = username;
                login.password = password;
                login.save(function(err){
                  if(err)
                    return res.status(500).send(err.message);
                  user.save(function(err){
                    if(err)
                      return res.status(500).send(err.message);
                    card.save(function(err){
                      if(err)
                        return res.status(500).send(err.message);
                      tarj.save(function(err){
                        if(err)
                          return res.status(500).send(err.message);
                        //console.log(req.user.id, user._id);
                        if(req.user._id == user.iLogin._id){
                          if((user.iLogin.usuario != username) || (user.iLogin.password != password)){
                            req.logout();
                            res.redirect('/');
                          }
                          else
                            res.redirect("/users");
                        }
                        else
                          res.redirect("/users");
                      });
                    });
                  });
                });
              });
            });     
          });
        });
      });
    }
    else{
      res.redirect("/");
    }
  });
};

//DELETE - Delete a TVShow with specified ID
exports.deleteEmpleado = function(req, res) {  
  findUserActive(req, function(err, empleado) {
    if(err)
      res.send(500, err.message);
    if(empleado.isAdmin){
      if( req.session.idUserActive == req.params.id){
        req.session.errDel = true;
        return res.redirect('/users');
      }
      req.session.errDel=false;
      var idL = req.params.id;

      findUserById(idL, function(err, user){
        if(err)
          res.send(500, err.message);
        findLoginById(user.iLogin._id, function(err, login){
          if(err)
            res.send(500, err.message);
          login.remove(function(err){
            if(err)
              res.send(500, err.message);
            findCardById(user.iTarjeta._id, function(err, card){
              card.estado = "inactivo";
              card.save(function(err){
                if(err)
                  res.send(500, err.message);
                user.remove(function(err) {
                  if(err)
                    return res.status(500).send(err.message);
                  res.redirect("/users");
                });
              })
            })
          });
        });
      });
    }
    else{
      res.redirect("/");
    }
  });
};