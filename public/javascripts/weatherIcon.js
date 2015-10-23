function picIconForForecastIO(icon) {
	// Forecast.io provides an "icon" attribute for the weather,
	// so use a switch on that icon to detemrine which picture to 
	// display on the dashboard
	
	var picStr = "";
	switch(icon) {
		case "clear-day":
			picStr = "sunny.png";
			break;
		case "partly-cloudy-day":
			picStr = "mostly_sunny.png";
			break;
		case "rain":
			picStr = "rainy.png";
			break;
	}
}

function picIconFromText(text) {

}