var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');

//Set the template engine
app.set('view engine', 'pug');
//Enable static file serving
app.use(express.static(path.join(__dirname, 'public')));

var suburbs = [];
var getSuburb = function(){
	fs.readFile("data/suburbs.json", 'utf8', function(err,data){
		if(err) throw err;
		suburbs = JSON.parse(data);
	})
};

var regions = [];
var getRegion = function(){
	fs.readFile("data/regions.json", 'utf8', function(err,data){
		if(err) throw err;
		suburbs = JSON.parse(data);
	})
};

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
	getSuburb();
	getRegion();
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
