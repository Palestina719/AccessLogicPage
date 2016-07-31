module.exports = function (app,router,ctrl,passport){
	var ctrlEmpleados = ctrl.empleados;
	var ctrlLogin = ctrl.login;

	// Login //
	router.get("/dashboard", function (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	} , function(req, res){
		ctrlLogin.dashboard(req,res);
	});

	router.route("/login-failure")
	.get(ctrlLogin.failure);

	router.route("/")
	.get(ctrlLogin.homeLogin);

	//Post login
	router.route("/login")
	.post(passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/login-failure'
	}));

	//Get Calendar
	router.get("/calendario", function (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	} , function(req, res){
		ctrlEmpleados.calendar(req,res);
	});

	//Get Horario
	router.get("/horario", function (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	} , function(req, res){
		ctrlEmpleados.horario(req,res);
	});

	//Post Search
	router.post("/search", function (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	} , function(req, res){
		ctrlEmpleados.search(req,res);
	});

	//Get Search
	router.get("/search", function (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	} , function(req, res){
		ctrlEmpleados.users(req,res);
	});

	//Get Incidencias
	router.get("/incidencias", function (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	} , function(req, res){
		ctrlEmpleados.incidencias(req,res);
	});


	//Get Usuarios
	router.get("/users", function (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	} , function(req, res){
		ctrlEmpleados.users(req,res);
	});

	//Get add-Usuario
	router.get("/add-user", function (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	} , function(req, res){
		ctrlEmpleados.addUserView(req,res);
	});

	//Post add-Usuario
	router.post("/add-user", function (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	} , function(req, res){
		ctrlEmpleados.addEmpleado(req,res);
	});

	//Delete user
	router.delete('/users/:id', function (req, res,next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
    }, function(req,res){
    	ctrlEmpleados.deleteEmpleado(req,res);
    });

    //Get user
	router.get('/users/:id', function (req, res,next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
    }, function(req,res){
    	ctrlEmpleados.updateEmpleadoView(req,res);
    });


	//Put user
	router.put('/users/:id', function (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	},function(req,res){
		//console.log('DELETE');
       ctrlEmpleados.updateEmpleado(req,res);
    });

	///Cerrar sesión
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}