var express = require('express');
var app = express();
var bodyParser = require("body-parser");

 app.use(bodyParser.urlencoded({ extended: false }));
 
app.post('/CI', function(req, res) {

	console.log(req.body)
	res.send("!!!!")
});
app.get('/CI', function(req, res) {

	console.log(req,"HELLO GET")
	res.send("!!!!")
});
 
console.log('start...');

var server = app.listen(3001, function () {
  var host = "vm-webdev-4";//server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

