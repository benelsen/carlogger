'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path');

var app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

server.listen( process.env.PORT || 3001 );

// all environments
// app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
// app.use(require('less-middleware')({ src: __dirname + '/public', compress: true, optimization: 2 }));
app.use(express.static(path.join(__dirname, 'public')));

io.set('log level', 2);

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  res.render('index', { title: 'Express' });
});

app.get('/status', function(req, res) {
  res.send(200);
});

// server.listen( app.get('port') );
// server.listen( app.get('port'), '::' );

module.exports = {
  app: app,
  server: server,
  io: io
};
