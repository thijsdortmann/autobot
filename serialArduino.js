var config = require('./config.js');

var seriallib = require('serialport');
var SerialLib = seriallib.SerialPort;
var serial = new SerialLib(config.serial.port, {
  baudrate: config.serial.baudrate,
  parser: seriallib.parsers.readline('\r')
}, false);

serial.open(function(error) {
  if (error) {
    console.error('PANIEK: Failed to open serial port ' + error);
  } else {
    console.log('Serial port ' + config.serial.port + ' open');
    serial.on('data', function(data) {
      console.log('data received: ' + data);
    });
  }
});

module.exports.newLine = function() {
  serial.write("\n", function(err, results) {
    if(err) console.log('err ' + err);
    // console.log('results ' + results);
  });
}

module.exports.sendLine = function(sendData) {
  serial.write(sendData+"\n", function(err, results) {
    if(err) console.log('err ' + err);
    // console.log('results ' + results);
  });
}

module.exports.sendLine = function(sendData, callback) {
  serial.write(sendData+"\n", function(err, results) {
    if(err) console.log('err ' + err);
    // console.log('results ' + results);
    callback(err, results);
  });
}

module.exports.send = function(sendData) {
  serial.write(sendData, function(err, results) {
    if(err) console.log('err ' + err);
    // console.log('results ' + results);
  });
}

module.exports.receiveListener = function(callback) {
  serial.on('data', function(data) {
    callback(data);
  });
}
