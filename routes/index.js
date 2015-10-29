var express = require('express');
var router = express.Router();
var Forecast = require('forecast.io');
var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

var options = {
  APIKey: '809c5f3d3ad4092f797d00da48472dc6'
};

var forecast = new Forecast(options);

var LAT = 40.730610;
var LON = -73.935342;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Weather App' });
});

function getWeather(latitude, longitude, API, socket) {
	var weatherData = {
		curr: {
			temp: 0,
			wind_speed: 0,
			icon: 0
		}, daily: [],
		summary: ""
	};

	if (API == 'Forecast.io') {
		console.log("In Forecast.io");
		forecast.get(LAT, LON, function(err, res, data) {
			if (err) throw err;
			weatherData.curr.temp = data.currently.temperature;
			weatherData.curr.wind_speed = data.currently.windSpeed;
			weatherData.curr.icon = data.currently.icon;
			weatherData.summary = data.currently.summary;

			console.log('temp: ' + data.currently.temperature);
			console.log('wind speed: ' + data.currently.windSpeed);

			console.log('icon: ' + data.currently.icon);
			console.log('time: ' + data.currently.time);
			for (var i = 0; i < data.daily.data.length; i++) {
				temp_date = new Date(1000*data.daily.data[i].time);
				min_temp = data.daily.data[i].temperatureMin;
				max_temp = data.daily.data[i].temperatureMax;
				console.log(temp_date + ': min is ' + min_temp + ', max is ' + max_temp);
				
				var day_str = days[temp_date.getDay()];
				weatherData.daily.push({day: day_str, minTemp: min_temp, maxTemp: max_temp});
			}
			socket.emit('weather data', weatherData);
		});
	}
	
}

module.exports = function(io) {
	
	io.on('connection', function(socket) {
		console.log('A user connected');
		socket.emit('news', 'Hey there!');

		socket.on("get weather", function(data) {
			console.log('API: ' + data.API);
			getWeather(LAT, LON, data.API, socket);
		});
	});

	return router;
};
