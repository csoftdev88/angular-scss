var app = require('./app');

require('http').createServer(app).listen(app.get('port'), '0.0.0.0', function () {
  console.log('Express (' + app.get('env') + ') server listening on port ' + app.get('port'));
});
