var serialArduino = require('./serialArduino');

module.exports.changeState = function(kakuId, newState) {
  var newStateInt = newState ? 1 : 0;
  serialArduino.sendLine(kakuId.toString()+newStateInt.toString(), function(err, results) {
    if(err) console.error(err);
    console.log("Sent serial command to Arduino: "+kakuId.toString()+newStateInt.toString()+".\nResult from command: "+results);
  });
}
