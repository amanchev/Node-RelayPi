
const express = require('express');
const app = express();
const port = 3000;
const Gpio = require('onoff').Gpio;
const relays = [new Gpio(17, 'high'), new Gpio(18, 'high'),new Gpio(27, 'high'),new Gpio(22, 'high')];

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
  res.send('Relay #' + (relayNumber+1) + ' was turned ON');;
});

app.post('/off/:relayNumber', function (req, res) {
  let relayNumber = parseInt(req.params.relayNumber);
  console.log('Turn OFF relay #' + relayNumber);
  relays[relayNumber].writeSync(1);
  res.send('Relay #' + (relayNumber+1) + ' was turned OFF');
});

app.use(express.static('public'));

app.listen(port, () => console.log(`Rellay app listening on port ${port}!`));