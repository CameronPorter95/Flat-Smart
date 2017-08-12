var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');

//Set the template engine
app.set('view engine', 'pug');
//Enable static file serving
app.use(express.static(path.join(__dirname, 'public')));

var suburbs = JSON.parse(fs.readFileSync("data/suburbs.json", 'utf8'));

var regions = JSON.parse(fs.readFileSync("data/regions.json", 'utf8'));

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
  //res.render(<pug file>, parameters: {title: <page title>, resultsName: <Title for results table>});
  res.render('results', {title: 'Results',
  	resultsName: 'Test Table:',
		suburb_id: id,
  });
});
