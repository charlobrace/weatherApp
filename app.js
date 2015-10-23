var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Forecast = require('forecast.io');
//var bootstrap = require('bootstrap');
var socket_io = require('socket.io');
var io = socket_io();

var app = express();
app.io = io;

var routes = require('./routes/index')(io);
var users = require('./routes/users');

var options = {
  APIKey: '809c5f3d3ad4092f797d00da48472dc6'
};

var forecast = new Forecast(options);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

//var LAT = 41.8369;
//var LON = 87.6847;
/*forecast.get(LAT, LON, function(err, res, data) {
  if (err) throw err;
  //console.log('res: ' + JSON.parse(res));
  console.log('data: ' + data.currently.summary);
  console.log('temp: ' + data.currently.temperature);
  console.log('wind speed: ' + data.currently.windSpeed);
  console.log('icon: ' + data.currently.icon);
  console.log('time: ' + data.currently.time);
  for (var i = 0; i < data.daily.data.length; i++) {
    temp_date = new Date(1000*data.daily.data[i].time);
    min_temp = data.daily.data[i].temperatureMin;
    max_temp = data.daily.data[i].temperatureMax;
    console.log(temp_date + ': min is ' + min_temp + ', max is ' + max_temp);
  }
});*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
