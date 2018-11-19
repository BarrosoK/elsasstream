var express = require('express'),
  app = express(),
  port = process.env.PORT || 4242,
  bodyParser = require('body-parser'),
  animeList = require('./api/controllers/animesController'),
  fs = require('fs'),
  https = require('https');

  app.use(function (req, res, next) {
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type', ' Content-Security-Policy-Report-Only');
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);
      // Pass to next layer of middleware
      next();
  });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/animesRoutes'); //importing route
routes(app); //register the route

var options = {
  key: fs.readFileSync( './localhost.key' ),
  cert: fs.readFileSync( './localhost.cert' ),
  requestCert: false,
  rejectUnauthorized: false
};

var server = https.createServer( options, app );

server.listen( 4343, function () {
    console.log( 'Express server listening on port ' + server.address().port );
} );


animeList.load();

app.listen(port);


console.log('todo list RESTful API server started on: ' + port);
