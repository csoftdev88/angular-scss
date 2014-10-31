module.exports = function (app) {
    // TODO: routes should be generated dynamically according to available
    // locales
    app.get('/cs-cz', function (req, res, next) {
        res.render('index-cs_CZ', {
            title: 'Express'
        });
    });

    app.get('/en-us', function (req, res, next) {
        res.render('index-en_US', {
            title: 'Express'
        });
    });

    app.get('/', function (req, res, next) {
        res.render('index-en_CA', {
            title: 'Express'
        });
    });

    app.get('/hotels', function (req, res, next) {
        res.render('index-en_US', {
            title: 'Express'
        });
    });
    app.get('/hotels/*', function (req, res, next) {
        res.render('index-en_US', {
            title: 'Express'
        });
    });
    app.get('/hotels/*/rooms/*', function (req, res, next) {
        res.render('index-en_US', {
            title: 'Express'
        });
    });
    app.get('/reservation', function (req, res, next) {
      res.render('index-en_US', {
        title: 'Express'
      });
    });
    app.get('/reservation/*', function (req, res, next) {
      res.render('index-en_US', {
        title: 'Express'
      });
    });
};
