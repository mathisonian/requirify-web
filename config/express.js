
/**
 * Module dependencies.
 */

var session = require('express-session');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var swig = require('swig');
var slashes = require('connect-slashes');
var serveStatic = require('serve-static');

var flash = require('connect-flash');
var helpers = require('view-helpers');
var pkg = require('../package.json');
var path = require('path');

var env = process.env.NODE_ENV || 'development';

/**
 * Expose
 */

module.exports = function (app) {

    // Compression middleware (should be placed before express.static)
    app.use(compression({
        threshold: 512
    }));

    // Don't log during tests
    // Logging middleware
    // if (env !== 'test') app.use(morgan(log));

    console.log(path.resolve(__dirname + '/../public'));
    app.use(serveStatic(path.resolve(__dirname + '/../public/')));

    // app.use(slashes());


    // Swig templating engine settings
    if (env === 'development' || env === 'test') {
        swig.setDefaults({
            cache: false
        });
    }

    // set views path, template engine and default layout
    // app.engine('html', swig.renderFile);
    app.set('view engine', 'jade');

    app.use(function (req, res, next) {
        next();
    });


    // expose package.json to views
    app.use(function (req, res, next) {
        res.locals.pkg = pkg;
        res.locals.env = env;
        next();
    });
    

    // cookieParser should be above session
    app.use(cookieParser());


    // bodyParser should be above methodOverride
    app.use(bodyParser.json());    
    app.use(bodyParser.urlencoded({ extended: true}));


    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));
    // express/mongo session storage
    // app.use(session({
    //     secret: pkg.name,
    //     // store: new mongoStore({
    //     //     url: config.db,
    //     //     collection : 'sessions'
    //     // }),
    //     saveUninitialized: true,
    //     resave: true
    // }));

    // use passport session
    // app.use(passport.initialize());
    // app.use(passport.session());

    // connect flash for flash messages - should be declared after sessions
    // app.use(flash());


    // should be declared after session and flash
    app.use(helpers(pkg.name));

    // adds CSRF support
    if (process.env.NODE_ENV !== 'test') {
        // app.use(csrf());

        // // This could be moved to view-helpers :-)
        // app.use(function(req, res, next){
        //     res.locals.csrf_token = req.csrfToken();
        //     next();
        // });
    }
};
