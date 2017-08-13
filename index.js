var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var request = require('request');

//Set the template engine
app.set('view engine', 'pug');
//Enable static file serving
app.use(express.static(path.join(__dirname, 'public')));

var suburbs = JSON.parse(fs.readFileSync("data/suburbs.json", 'utf8'));

var suburbAverages = JSON.parse(fs.readFileSync("data/averages.json", 'utf8'));

var regions = JSON.parse(fs.readFileSync("data/regions.json", 'utf8'));

var crimerates = {};
var wellingtonCrime = 38613/471315;
var aucklandCrime = 31718/1415550;
crimerates['Wellington'] = [];
crimerates['Auckland City'] = [];
crimerates.Wellington.push(wellingtonCrime);
crimerates['Auckland City'].push(aucklandCrime);

//Checks if the app is running on Heroku
if(process.env.NODE && ~process.env.NODE.indexOf("heroku")){
	//Do basic HTTP server setup, Heroku will handle HTTPS
	port = process.env.PORT || 8080;
	app.listen(port, function () {
 	console.log('App listening on port '+port);

});}
else {
 app.listen(3000, function () {
  console.log('Listening');
 });
};

//IN ORDER TO GET DISTANCES FROM GOOGLE MAPS API
var getSuburbs = function(from, to, cb) {
		var options = {
	    url: 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' + from + ',' + to + ',NZ&destinations=' + to + '&key=AIzaSyCClGYz48FWxlO2aZvIYvXXuFmWv7QK9cs',
	    method: 'GET'
	  };
		request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            var distance = data.rows[0].elements[0].distance.text;
						var length = data.rows[0].elements[0].duration.text;
						console.log("getSuburbs:" + distance);
						cb(distance);
        } else if (error) {
            console.error(error);
        } else {
            console.log(body);
            return null;
        }
    });
};

var findSuburb = function(suburb_id, cb){
	var suburb = {
		suburb_id: null,
		name: null,
		average: null,
		crimerate: null,
		region: null,
		region_name: "",
		distance: ""
	}
	var suburbs = JSON.parse(fs.readFileSync("data/suburbs.json", 'utf8'));
	var regions = JSON.parse(fs.readFileSync("data/regions.json", 'utf8'));
	var suburbAverages = JSON.parse(fs.readFileSync("data/averages.json", 'utf8'));
	suburbs.forEach(obj => {
		if(obj.suburb_id == suburb_id || obj.name == suburb_id){
			suburb.suburb_id = obj.suburb_id;
			suburb.name = obj.name;
			suburb.region = obj.region_id;
		}
	});
	suburbAverages.forEach(obj => {
		if(obj.suburb_id == suburb_id || obj.suburb_id == suburb.suburb_id){
			suburb.average = Math.round(obj.average * 100) / 100;
		}
	});
	regions.forEach(obj => {
		if(obj.region_id == suburb.region){
			suburb.region_name = obj.name;
		}
	});
	console.log(suburb.region_name);
	suburb.crimerate = crimerates[suburb.region_name];
	var distance = getSuburbs(suburb.name, "wellington", (b) => {suburb.distance = b; cb(suburb);});
};


app.get('/', function (req, res) {
  //res.render(<pug file>, parameters: {title: <page title>, resultsName: <Title for results table>});
  res.render('search', {title: 'Search',
		regionsArray: regions,
  	suburbsArray: suburbs
  });
});

app.get('/results/:suburb_id', function (req, res) {
	if (!req.params.suburb_id) return res.json("suburb_id not supplied");
	var id = req.params.suburb_id;

	findSuburb(id, suburb => {res.render('results', {title: 'Results for '+ suburb.name,
		suburb: suburb
  });});
	//get the details of the relevant suburb
	//searchedSuburbArray = [];

	//res.render(<pug file>, parameters: {});

});
