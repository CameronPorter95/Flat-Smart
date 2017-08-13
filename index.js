var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');

//Set the template engine
app.set('view engine', 'pug');
//Enable static file serving
app.use(express.static(path.join(__dirname, 'public')));

var suburbs = JSON.parse(fs.readFileSync("data/suburbs.json", 'utf8'));

var suburbAverages = JSON.parse(fs.readFileSync("data/averages.json", 'utf8'));

var regions = JSON.parse(fs.readFileSync("data/regions.json", 'utf8'));

var crimerates = {};
var wellingtonCrime = 38613/471315;
var otherCrime = 999999999/471315;
crimerates['wellington'] = [];
crimerates['screw_this_place'] = [];
crimerates.wellington.push(wellingtonCrime);
crimerates.screw_this_place.push(otherCrime);

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

var findSuburb = function(suburb_id){
	var suburb = {
		suburb_id: null,
		name: null,
		average: null,
		crimerate: null
	}
	var suburbs = JSON.parse(suburbs);
	var suburbAverages = JSON.parse(suburbAverages);
	suburbs.forEach(obj => {
		if(obj.suburb_id = suburb_id){
			suburb.suburb_id = obj.suburb_id;
			suburb.name = obj.name;
		}
	});
	suburbAverages.forEach(obj => {
		if(obj.suburb_id = suburb_id){
			suburb.average = obj.average;
		}
	});
	suburb.crimerates = crimerates.wellington[1]
	return suburb;
};

app.get('/', function (req, res) {
  //res.render(<pug file>, parameters: {title: <page title>, resultsName: <Title for results table>});
  res.render('search', {title: 'Search',
		regionsArray: regions,
  	suburbsArray: suburbs
		crimerateArray: crimerates
  });
});

app.get('/results/:suburb_id', function (req, res) {
	if (!req.params.suburb_id) return res.json("suburb_id not supplied");
	var id = req.params.suburb_id;

	var suburbToPass = findSuburb(id);
	//get the details of the relevant suburb
	//searchedSuburbArray = [];

	//res.render(<pug file>, parameters: {});
	res.render('results', {title: 'Results for '+ suburb_id,
		suburb: suburbToPass
  });
});
