'use strict';
/**
 * Module dependencies.
 */

// var mongoose = require('mongoose');
var home = require('../app/controllers/home');
var cors = require('cors');

/**
 * Expose
 */

module.exports = function (app) {
    app.options('/:varname/:modulename', function(req, res){
      console.log("writing headers only");
      res.header("Access-Control-Allow-Origin", "*");
      res.end('');
    });

    app.get('/:varname/:modulename', home.index);


    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        // error page
        res.status(500).render('500', { error: err.stack });
    });

    // assume 404 since no middleware responded
    app.use(function (req, res, next) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });
};
