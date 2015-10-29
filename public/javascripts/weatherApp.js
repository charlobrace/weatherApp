var socket = io('http://localhost:3000');
var curr_api = "Forecast.io";
var APIKey_WU = '237e4187f131fdd8';
var WEEKLENGTH = 7;

socket.on('weather data', function(data) {
	setWeather(data, 'Forecast.io');
})

$(document).ready(function() {
	if (curr_api == 'Forecast.io') {
		socket.emit("get weather", { API: curr_api });
	} else if (curr_api == "WeatherUnderground") {
		setWeather(null, 'WeatherUnderground')
	}
	
});

$("#chooseAPI").change(function() {
	var selected = $('input[name=APIChooser]:checked', '#chooseAPI').val();
	curr_api = selected;
	if (curr_api == 'Forecast.io') {
		socket.emit("get weather", { API: curr_api });
	} else if (curr_api == "WeatherUnderground") {
		setWeather(null, 'WeatherUnderground');
	}
});

function setWeather(data, api) {
	if (api == 'Forecast.io') {
		var temp_str = "Currently, it is: " + data.curr.temp + " &#186F";
		document.getElementById("curr_weather").innerHTML = temp_str; 
		document.getElementById("summary").innerHTML = "Summary: " + data.summary;
		picIconForForecastIO(data.curr.icon);
		for (var i = 0; i < WEEKLENGTH; i++) {
			var id_str = "day" + i;
			var min_str = "min" + i;
			var max_str = "max" + i;
			document.getElementById(id_str).innerHTML = data.daily[i].day;
			document.getElementById(min_str).innerHTML = 'Low: ' + Math.round(data.daily[i].minTemp);
			document.getElementById(max_str).innerHTML = 'High: ' + Math.round(data.daily[i].maxTemp);
		}
	} else if (api == 'WeatherUnderground') {
		$.ajax({
		  url : "http://api.wunderground.com/api/" + APIKey_WU + "/geolookup/forecast10day/q/NY/NewYork.json",
		  dataType : "jsonp",
		  success : function(parsed_json) {
		  var location = parsed_json['location']['city'];
		  
		  var forecastArray = parsed_json['forecast']['simpleforecast']['forecastday'];
		  for (var i = 0; i < WEEKLENGTH; i++) {
		  	var id_str = "day" + i;
			var min_str = "min" + i;
			var max_str = "max" + i;
			document.getElementById(id_str).innerHTML = forecastArray[i].date.weekday_short;
			document.getElementById(min_str).innerHTML = 'Low: ' + Math.round(forecastArray[i].low.fahrenheit);
			document.getElementById(max_str).innerHTML = 'High: ' + Math.round(forecastArray[i].high.fahrenheit);
		  }
		  
		}

 	 	});
		$.ajax({
		  url : "http://api.wunderground.com/api/" + APIKey_WU + "/geolookup/conditions/q/NY/NewYork.json",
		  dataType : "jsonp",
		  success : function(parsed_json) {
		  var location = parsed_json['location']['city'];
		  var temp_f = parsed_json['current_observation']['temp_f'];
		  var weather = parsed_json['current_observation']['weather'];
		  var weather_str = "Summary: " + weather;
		  picIconForWeatherUnderground(weather);
		  
		  temp_str = "Currently, it is: " + temp_f + " &#186F";
		  document.getElementById("curr_weather").innerHTML = temp_str; 
		  document.getElementById("summary").innerHTML = weather_str;
		}
		});
	}
}

function picIconForForecastIO(icon) {
	// Forecast.io provides an "icon" attribute for the weather,
	// so use a switch on that icon to detemrine which picture to 
	// display on the dashboard
	
	var picStr = "";
	switch(icon) {
		case "clear-day":
			picStr = "/images/sunny.png";
			break;
		case "partly-cloudy-day":
			picStr = "/images/mostly_sunny.png";
			break;
		case "rain":
			picStr = "/images/rainy.png";
			break;
		case "partly-cloudy-night":
			picStr = "/images/partly_cloudy_night.png";
			break;
		case "snow":
			picStr = "/images/snow.png";
			break;
		case "sleet":
			picStr = "/images/rainy.png";
			break;
		case "fog": 
			picStr = "/images/fog.png";
			break;
		default:
			picStr = "/images/sunny.png";
			break;
	}
	document.getElementById("icon_img").src = picStr;
	document.getElementById("icon_img").alt = icon;
}

function picIconForWeatherUnderground(icon) {
	var picStr = "";
	switch(icon) {
		case "Partly Cloudy":
			picStr = "/images/mostly_sunny";
			break;
		case "Light Rain":
			picStr = "/images/rainy.png";
			break;
		case "Rain":
			picStr = "/images/rainy.png";
		default:
			picStr = "/images/sunny.png";
			break;
	}
	document.getElementById("icon_img").src = picStr;
	document.getElementById("icon_img").alt = icon;
}
