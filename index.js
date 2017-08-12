var express = require('express');
var app = express();
var path = require('path');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  //res.send('Hello World!');
  res.render('index', {title: 'Hey', message: 'Hello there!'});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
