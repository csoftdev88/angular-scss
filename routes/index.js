module.exports = function (app) {

    app.get('/cs-cz', function (req, res, next) {
        res.render('index-cs_CZ', {
            title: 'Express'
        });
    });

    app.get('/', function (req, res, next) {
        res.render('index-en_US', {
            title: 'Express'
        });
    });
};
