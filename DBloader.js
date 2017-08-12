var mongoose = require('mongoose');
var express = require('express');
var app = express();
var request=require('request');
var port = process.env.PORT || 8080;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//connect to MongoDB
mongoose.connect('mongodb://heroku_khwjm57z:5e7v1vdpgpluug4e3vd4cgm242@ds143131.mlab.com:43131/heroku_khwjm57z');

//-------------
//API Routes
//-------------
var article = require('./api/article');

var articles = [93441299, 93681661, 93669138, 93665676, 93675453,
                93622407, 93633007, 93683361, 93661060, 93671241, 93663558];

for (i=0; i<articles.length; i++) {
    var url = 'http://www.stuff.co.nz/_json/'+articles[i]+'/';
    console.log('Getting URL: ' + url);
    request.get({
      url: url,
      json: true,
      headers: {'User-Agent': 'curl/7.53.1'}
    }, (err, res, data) => {
      if (err) {
        console.log('Error:', err);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode, ' resbody:', res.body);
      } else {
        // data is already parsed as JSON:
        //console.log(data);
        var newdata={};
        newdata.articleID=data.id;
        newdata.title=data.title;
        if (/^\s+/.test(data.intro)) {
          newdata.intro=data.alt_intro;
        }
        else {
          newdata.intro=data.intro;
        };
        newdata.URL=data.url;
        newdata.body=data.body;
        newdata.tags=[data["section-top-level"], data["section-home"]];
        newdata.photos={};
        newdata.photos.smallcaption=data.images[0].caption;
        newdata.photos.smallurl=data.images[0].variants[0].src;
        newdata.photos.caption=data.images[1].caption;
        newdata.photos.url=data.images[1].variants[0].src;
        article.postArticle(newdata)
        .then((message) => {
            console.log(message);
        })
        .catch((err) => {
            console.log(err);
        });
      }
    });
  };
