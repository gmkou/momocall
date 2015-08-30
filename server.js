var express = require('express')
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server, {log:false, origins:'*:*'})
var moment = require("moment");

var PORT = 8888;
server.listen(PORT);

console.log("http://localhost:" + PORT);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use('/static', express.static(__dirname + '/static'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

var controller = {};
controller.index  = require('./controller/index.js');
controller.video = require('./controller/video.js');

require('./router.js')(app, controller);


io.sockets.on('connection', function (socket) {
  console.log(socket.id + ':connection');

  var status = ''
  var intervalId = null;
  var callJson = {};
  var callListIndex = 0;
  var delay = 20; // msec
  var lastPaused = 0;
  var start = 0;

  var timerFunc = function() {
    var callItem  = callJson.list[callListIndex];

    if (status == 'playing') {
      if (callItem != undefined && callItem.time < moment().format("x")-start) {
        socket.emit('event', {eventType:'message', eventAttr:callItem.call });
        callListIndex++;
        callItem  = callJson.list[callListIndex];
      }
    } 
  }

  socket.on('command', function(command) {
    console.log(socket.id + ':<' + command.commandType + ':' + command.commandAttr);
    status = command.commandType;
    switch (command.commandType) {
      case 'setVideoId' : videoId = command.commandAttr;
        callJson = require('./data/' + videoId + '.json');
        // console.log(callJson.list);
        break;
      case 'playing' :
        lastPaused = parseFloat(command.commandAttr) * 1000;
        start = moment().format("x") - lastPaused;
        intervalId = setInterval(timerFunc,delay);
        break;
      case 'buffering' :
      case 'cued' :
        break;
      case 'ended' :
      case 'paused' :
        clearInterval(intervalId);
        lastPaused = parseFloat(command.commandAttr) * 1000;
      break;
      default:
      /* do nothing */
      /* echo back
         socket.emit('event', {eventType:command.commandType});
       */
    }
  });

  socket.on('disconnect', function() {
    console.log(socket.id + ':disconnect');
  });

});


