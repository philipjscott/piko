var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static('public'));

//logs
io.set('log level', 1);

io.sockets.on('connection', function (socket) {
    socket.on('mousemove', function (data) {
        socket.broadcast.emit('moving', data);
    });
});

var port = process.env.PORT || 8080;
http.listen(port, function() {
  console.log('listening!');
});
