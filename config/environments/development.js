var express = require('express'),
    path = require('path');

module.exports = function (app) {
    app.configure('development', function () {
        app.use(function staticsPlaceholder(req, res, next) {
            return next();
        });

        // App sources and bower scripts
        app.use('/static/app', express.static(path.join(app.directory, '/build/app/')));
        app.use('/static/styles', express.static(path.join(app.directory, '/build/styles/')));
        app.use('/static/images', express.static(path.join(app.directory, '/build/images/')));
        app.use('/static/font', express.static(path.join(app.directory, '/build/font/')));
        app.use('/static/bower_components', express.static(path.join(app.directory, '/bower_components')));

        app.set('port', process.env.PORT || 9000);
        app.set('views', path.join(app.directory, '/build'));
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());

        app.use(function middlewarePlaceholder(req, res, next) {
          return next();
        });

        app.use(app.router);
        app.use(express.errorHandler());
    });
};
