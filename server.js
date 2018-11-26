const passport = require('passport'),
  BasicStrategy = require('passport-http').BasicStrategy,
  key = require("./key.json"),
  express = require('express'),
  app = express(),
  http = require('http'),
  port = 3000,
  Gpio = require('onoff').Gpio,
  relays = [new Gpio(17, 'high'), new Gpio(18, 'high'), new Gpio(27, 'high'), new Gpio(22, 'high')],
  server = app.listen(port),
  io = require('socket.io').listen(server);

passport.use(new BasicStrategy(
  function(userid, password, done) {
    User.findOne({ username: userid }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

app.get('/status/:relayNumber', function (req, res) {
  let relayNumber = parseInt(req.params.relayNumber);
  let status;
  console.log('Get status of relay #' + relayNumber);
  status = relays[relayNumber].readSync();
  console.log((status === 0 ? 'ON' : 'OFF'));
  res.send({
    message: 'Status of relay #' + relayNumber + ' = ' + (status === 0 ? 'ON' : 'OFF'),
    relayStatus: (status === 0 ? 'ON' : 'OFF')
  });
});

app.post('/on/:relayNumber', function (req, res) {
  let relayNumber = parseInt(req.params.relayNumber);
  console.log('Turn ON relay #' + relayNumber);
  relays[relayNumber].writeSync(0);
  io.emit('message', 'Relay #' + (relayNumber + 1) + ' was turned ON');
  io.emit('statuschange', {
    relayNumber: relayNumber,
    relayStatus: 0
  });
  res.send('Relay #' + (relayNumber + 1) + ' was turned ON');;
});

app.post('/off/:relayNumber', function (req, res) {
  let relayNumber = parseInt(req.params.relayNumber);
  console.log('Turn OFF relay #' + relayNumber);
  relays[relayNumber].writeSync(1);
  io.emit('message', 'Relay #' + (relayNumber + 1) + ' was turned OFF');
  io.emit('statuschange', {
    relayNumber: relayNumber,
    relayStatus: 1
  });
  res.send('Relay #' + (relayNumber + 1) + ' was turned OFF');
});

app.use(express.static('public'));
app.use('/libs', express.static('node_modules'));

io.sockets.on('connection', function (socket) {

  for (index in relays) {
    io.emit('statuschange', {
      relayNumber: index,
      relayStatus: relays[index].readSync()
    });
  }
  socket.emit('message', 'You are connected!');
  socket.broadcast.emit('message', 'Another client has just connected!');

  socket.on('message', function (message) {
    console.log('A client is speaking to me! They\'re saying: ' + message);
  });
});
