var app = require('./middleware/app');
app.use(require('prerender-node').set('prerenderToken', 'i5yOvEEIyhpbWHoBfeG2').set('protocol', 'https'));

require('http').createServer(app).listen(app.get('port'), '0.0.0.0', function () {
  console.log('Express (' + app.get('env') + ') server listening on port ' + app.get('port'));
});
