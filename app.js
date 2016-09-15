var express = require('express'),
  path = require('path');

var app = express();
app.directory = __dirname;

require('./config/environments')(app);
require('./routes')(app);

module.exports = app;
