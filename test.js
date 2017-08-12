var express = require('express');
var app = express();
var request = require('request');

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

var getListings = function() {
    request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            data.forEach(obj => {
              obj.Districts.forEach(obj2 => {
                obj2.Suburbs.forEach(obj3 =>{
                    console.log(obj3);
                });

              });
            });
        } else if (error) {
            console.error(error);
        } else {
            console.log(body);
            return null;
        }
    });
};

app.get('/', function (req, res) {
   getListings();
  res.send('Hello World');
});

app.listen(3000, function () {
});
