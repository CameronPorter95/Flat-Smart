var express = require('express');
var app = express();
var request = require('request');

var Suburbs = [];
var regions = [];

var suburb_averages = [];
var average_out = [];

const trademeKey = {
  consumerKey: "E434B9CF4549C3F016FC9FA13E024A04",
  consumerSecret: "82822352A8CF174E123A12F00466116C"
};

const trademeApiUrl = 'https://api.tmsandbox.co.nz/v1/Localities.json';
const trademeListingsUrl = 'https://api.tmsandbox.co.nz/v1/Search/Property/Rental.json?page=1';

var options = {
    url: trademeApiUrl,
    method: 'GET',
    headers: {
      'Authorization' : `OAuth oauth_consumer_key="${trademeKey.consumerKey}", oauth_signature_method="PLAINTEXT", oauth_signature="${trademeKey.consumerSecret}&"`
    }
  };
  var optionsListings = {
      url: trademeListingsUrl,
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
              console.log(regions);
        } else if (error) {
            console.error(error);
        } else {
            console.log(body);
            return null;
        }
    });
};

var getListings = function(){
  var promiseArray = [];
  for(var page = 1; page <= 30; page++){
      promiseArray.push(new Promise((resolve,reject) => {
        const trademeListingsUrl = 'https://api.tmsandbox.co.nz/v1/Search/Property/Rental.json?page=' + page;
        request(optionsListings, (error, response, body) => {
          if (!error && response.statusCode == 200) {
              var data = JSON.parse(body);
              data.List.forEach(listing => {
                var listingData = {
                  listing_id: listing.ListingId,
                  suburb_id: parseInt(listing.SuburbId),
                  price: parseInt(listing.PriceDisplay.replace(/,/g , "").substring(1,10))
                }
                if(!suburb_averages[listingData.suburb_id]){
                  suburb_averages[listingData.suburb_id] = {
                    suburb_id: listingData.suburb_id,
                    priceSum: listingData.price,
                    count: 1
                  }
                }
                else{
                  suburb_averages[listingData.suburb_id] = {
                    suburb_id: suburb_averages[listingData.suburb_id].suburb_id,
                    priceSum: suburb_averages[listingData.suburb_id].suburb_id + listingData.price,
                    count: suburb_averages[listingData.suburb_id].count + 1
                  }
                }
                console.log(listingData);
              });
              resolve();
          } else if (error) {
              console.error(error);
              reject();
          } else {
              reject();
              return null;
          }
      });
    }));
  }
  Promise.all(promiseArray)
    .then(() => {
      suburb_averages.forEach(obj => {
        if(obj){
          var average = {
            suburb_id: obj.suburb_id,
            average: obj.priceSum / obj.count
          }
          average_out.push(average);
          console.log(average);
        }
      });
      console.log(average_out);
      var fs = require('fs');
        fs.writeFile("averages.json", JSON.stringify(average_out), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
}

app.get('/', function (req, res) {
   //getSuburbs();
   //getRegions();
   getListings().then(()=> {});
  //res.send(Suburbs);
  //res.send(regions);
});

app.listen(3000, function () {
});
