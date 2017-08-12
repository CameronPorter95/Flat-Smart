var express = require('express');
var app = express();
var request = require('request');

var Suburbs = [];
var regions = [];

const trademeKey = {
  consumerKey: "E434B9CF4549C3F016FC9FA13E024A04",
  consumerSecret: "82822352A8CF174E123A12F00466116C"
};

const trademeApiUrl = 'https://api.tmsandbox.co.nz/v1/Localities.json';

var options = {
    url: trademeApiUrl,
    method: 'GET',
    headers: {
      'Authorization' : `OAuth oauth_consumer_key="${trademeKey.consumerKey}", oauth_signature_method="PLAINTEXT", oauth_signature="${trademeKey.consumerSecret}&"`
    }
  };



var getSuburbs = function() {
    request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            console.log("{");
            data.forEach(obj => {
              obj.Districts.forEach(obj2 => {
                obj2.Suburbs.forEach(obj3 =>{
                    var suburb = {
                      region_id: obj2.DistrictId,
                      suburb_id: obj3.SuburbId,
                      name: obj3.Name
                    }
                    Suburbs.push(suburb);
                });
              });
            });
            var fs = require('fs');
              fs.writeFile("suburbs.json", JSON.stringify(Suburbs), function(err) {
                  if(err) {
                      return console.log(err);
                  }

                  console.log("The file was saved!");
              });
              console.log(Suburbs)
        } else if (error) {
            console.error(error);
        } else {
            console.log(body);
            return null;
        }
    });
};

var getRegions = function() {
    request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            console.log("{");
            data.forEach(obj => {
              obj.Districts.forEach(obj2 => {
                var region = {
                  region_id: obj2.DistrictId,
                  name: obj2.Name
                }
                regions.push(region)
              });
            });
            var fs = require('fs');
              fs.writeFile("regions.json", JSON.stringify(regions), function(err) {
                  if(err) {
                      return console.log(err);
                  }
                  console.log("The file was saved!");
              });
              console.log(regions)
        } else if (error) {
            console.error(error);
        } else {
            console.log(body);
            return null;
        }
    });
};

app.get('/', function (req, res) {
   getSuburbs();
   getRegions();
  res.send(Suburbs);
  res.send(regions);
});

app.listen(3000, function () {
});
