var express = require('express')
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)

var PORT = 8888;
server.listen(PORT);
var gSocket = null;

console.log("http://localhost:" + PORT);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use('/static', express.static(__dirname + '/static'));

var controller = {};
controller.index  = require('./controller/index.js');
controller.video = require('./controller/video.js');

require('./router.js')(app, controller);

io.sockets.on('connection', function (socket) {
  gSocket = socket;
  console.log("connection");
});


