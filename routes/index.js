var glob = require('glob');

module.exports = function(app) {
  var basePath = './src/locales/';
  glob(basePath + '*.json', function(er, files) {
    var baseConfig = null;
    files.forEach(function(file) {
      // glob is relative path in which server started
      // require is relative to current file path
      var config = require('.' + file);

      if (config && config.locale && config.data && config.data.base_href) {
        if (config.data.base_href === '/') {
          baseConfig = config;
        } else {
          installRoute(config);
        }
      }
    });

    app.route('/:url(static)/*').get(function(req, res) {
      res.status(404).end();
    });

    app.get('/404', function(req, res, next) {
      res.status(404);
      res.render('404');
    });

    if (baseConfig) {
      installRoute(baseConfig);
    }
  });

  function installRoute(config) {
    var route = config.data.base_href + '*';
    var indexFile = 'index-' + config.locale;
    app.get(route, function(req, res, next) {
      res.render(indexFile, {
        title: 'Express'
      });
    });
  }
};
