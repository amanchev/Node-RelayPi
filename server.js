const express = require('express');
const app = express();
const http = require('http');
const port = 3000;
const Gpio = require('onoff').Gpio;
const relays = [new Gpio(17, 'high'), new Gpio(18, 'high'),new Gpio(27, 'high'),new Gpio(22, 'high')];
const server = app.listen(port);
const io = require('socket.io').listen(server);

app.get('/status/:relayNumber', function (req, res) {
  let relayNumber = parseInt(req.params.relayNumber); 
  let status;
  console.log('Get status of relay #' + relayNumber);
  status = relays[relayNumber].readSync();
  console.log((status === 0 ? 'ON':'OFF'));
  res.send({
    message:'Status of relay #'+ relayNumber + ' = ' + (status === 0 ? 'ON':'OFF'),
    relayStatus: (status === 0 ? 'ON':'OFF')
  });
});

app.post('/on/:relayNumber', function (req, res) {
  let relayNumber = parseInt(req.params.relayNumber);  
  console.log('Turn ON relay #' + relayNumber);
  relays[relayNumber].writeSync(0);
  io.emit('message', 'Relay #' + (relayNumber+1) + ' was turned ON');
  res.send('Relay #' + (relayNumber+1) + ' was turned ON');;
});

app.post('/off/:relayNumber', function (req, res) {
  let relayNumber = parseInt(req.params.relayNumber);
  console.log('Turn OFF relay #' + relayNumber);
  relays[relayNumber].writeSync(1);
  io.emit('message', 'Relay #' + (relayNumber+1) + ' was turned OFF');
  res.send('Relay #' + (relayNumber+1) + ' was turned OFF');
});

app.use(express.static('public'));
app.use('/libs', express.static('node_modules'));



// Sockets
// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });
io.sockets.on('connection', function (socket) {
    socket.emit('message', 'You are connected!');
    socket.broadcast.emit('message', 'Another client has just connected!');

    socket.on('message', function (message) {
        console.log('A client is speaking to me! They\'re saying: ' + message);
    }); 
});