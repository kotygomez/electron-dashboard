// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

require('simpleWeather');
let moment = require('moment');
let underscore = _ = require('underscore');

var loadCinemaGraphs = function(weather) {
	var cinemagraphs = require('./cinemagraphs.js');
	var max = cinemagraphs.length - 1;
	var min = 0;
	var iframe = $('#main_frame');

	// Get season
		// spring = March 1 to May 31
		// summer = June 1 to August 31
		// fall = September 1 to November 30
		// winter = December 1 to February 28/29
		var season = 'winter';
		var date = moment();

		if( date.isBetween( moment().month('March').startOf('month'), moment().month('May').endOf('month') ) ) {
			season = 'spring';
		}

		if( date.isBetween( moment().month('June').startOf('month'), moment().month('August').endOf('month') ) ) {
			season = 'summer';
		}

		if( date.isBetween( moment().month('September').startOf('month'), moment().month('November').endOf('month') ) ) {
			season = 'fall';
		}

		if( date.isBetween( moment().month('December').startOf('month'), moment().month('February').endOf('month') ) ) {
			season = 'winter';
		}

	graphics = _.filter(cinemagraphs, function(cg) {
		return _.indexOf(cg.seasons, season) !== -1;
	});

	graphics = _.filter(graphics, function(cg) {
		var min = cg.temp_range[0];
		var max = cg.temp_range[1];
		return weather.temp >= min && weather.temp <= max;
	});

	var random = _.random(0, graphics.length - 1);
	var graphic = graphics[random];
	console.log( graphic );

	// Get temperature

	var url = 'https://media.flixel.com/cinemagraph/' + graphic.hash + '?hd=true';
	iframe.attr('src', url);

	setInterval(function () {
		var rand = Math.floor(Math.random() * (max - min + 1)) + min;
	  	var cinemagraph = cinemagraphs[rand];
	  	var url = 'https://media.flixel.com/cinemagraph/' + cinemagraph.hash + '?hd=true';
	  	iframe.attr('src', url);
	}, 	50000); 
}

// TODO: need to set interval to refresh weather as well
function loadSimpleWeather(loadCinemaGraphs) {

 	$.simpleWeather({
      	//woeid: woeid, //2357536
      	location: 'Vancouver',
      	unit: 'c',
    	success: function(weather) {
	      	var html = '<h2>'+weather.temp+'&deg;'+weather.units.temp+'</h2>';
	      	html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
	      	html += '<li class="currently">'+weather.currently+'</li>';
	      	html += '<li>'+weather.alt.temp+'&deg;F</li></ul>';

	     	$("#weather").html(html);

	     	loadCinemaGraphs(weather);
	 	},
	  	error: function(error) {
	    	$("#weather").html('<p>'+error+'</p>');
	  	}
  	});
}

$(document).ready(function() {
	loadSimpleWeather(loadCinemaGraphs);
	//loadCinemaGraphs();
});
