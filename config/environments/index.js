var express = require('express'),
  path = require('path'),
  basicAuth = require('basic-auth-connect'),
  favicon = require('serve-favicon'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorhandler = require('errorhandler');

module.exports = function(app) {
  app.use(function staticsPlaceholder(req, res, next) {
    return next();
  });

  // App sources and bower scripts
  var directory = process.env.NODE_ENV === 'production' ? 'compile' : 'build';
  app.use('/static/app', express.static(path.join(app.directory, '/' + directory + '/app/')));
  app.use('/static/styles', express.static(path.join(app.directory, '/' + directory + '/styles/')));
  app.use('/static/images', express.static(path.join(app.directory, '/build/images/')));
  app.use('/static/font', express.static(path.join(app.directory, '/build/font/')));
  app.use('/static/bower_components', express.static(path.join(app.directory, '/bower_components')));

  app.set('port', process.env.PORT || 9000);
  app.set('views', path.join(app.directory, '/' + directory));
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  //app.use(basicAuth('mobius', 'mobius'));
  //app.use(favicon());
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.use(function middlewarePlaceholder(req, res, next) {
    return next();
  });

  app.use(errorhandler());

  var env = process.env.NODE_ENV || 'development';
  require('./' + env)(app);
};
