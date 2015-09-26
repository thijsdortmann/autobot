var db = require('./db');
var connection = db();
var arduinoComm = require('./arduinoComm');

var states = [];

connection.query("SELECT unitId, kakuId, unitState FROM unit", function(err, rows) {
  if (err) {
    console.log(err);
    console.error("PANIEK: Error loading states from database.");
    process.exit();
  }
  for(i = 0; i < rows.length; i++) {
    rows[i].unitState = rows[i].unitState == 1 ? true : false;
    states[rows[i].unitId] = rows[i];
  }
});

module.exports.localStates = function() {
  return states;
}

module.exports.changeState = function(unitId, newState) {
  for (var i in states) {
    if (states[i].unitId == unitId) {
      states[i].unitState = newState;
      break; //Stop this loop, we found it!
    }
  }
  arduinoComm.changeState(states[unitId].kakuId, newState);
}
