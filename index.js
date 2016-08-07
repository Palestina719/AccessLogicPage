/*
 * Initialize required modules
 */
var express        = require("express"),  
    app            = express(),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    fs             = require('fs'),
    mongoose       = require('mongoose'),
    http 		   = require('http'),
    passport 	   = require('passport'),
    LocalStrategy  = require('passport-local').Strategy,
    path		   = require('path'),
    flash 		   = require('connect-flash'),
    https          = require('https');


/*
 * Conf file
 */
var conf       = require('./conf.json'),
	http_port  = conf.server.http_port,
	https_port = conf.server.https_port,
	cer        = conf.server.cer,
	key        = conf.server.key;

/*
 * Database conf
 */
var database = require('./db');

/*
 * Router 
 */
var router = express.Router();

/*
 * Use the middlewares
 */
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(methodOverride('_method'));
app.use(flash());
app.use(require('express-session')({
    secret: 'accesslogic',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));

/*
 * Import Models and controllers
 */
var models        = require('./models')(mongoose);
var controllers   = require('./controllers');

/*
 * passport config
 */
var Account = require('./models/logins');
var login = mongoose.model('logins');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
	  login.findOne({'usuario': username},
		function(err, user) { 
			if (err)
				return done(err);
			if (!user)
				return done(null, false);
			if (user.password != password)
				return done(null, false);
			return done(null, user);
		});
    });
  }
));

/*
 * Routes
 */
routes = require('./routes')(app,router,controllers, passport);

/*
 * Launch Server
 */
database(conf, mongoose, function(err){
	if(err){
		console.log('ERROR: connecting to Database. ' + err);
	}
	else{
		http.createServer(app).listen(http_port, function(){
			console.log('HTTP server listening on port %s in %s mode', http_port, app.get('env'));
		}); 
		if ( cer != '' && key != '')
		{		
			https.createServer({
				key : fs.readFileSync(key),
				cert : fs.readFileSync(cer)
			},app).listen(https_port, function(){
				console.log('HTTPS server listening on port %s in %s mode', https_port, app.get('env'));
			}); 
		}
	}
});

