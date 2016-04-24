var crontab = require('node-crontab');
var config = require('./config');
var getJSON = require('get-json');
var db = require('./db.js');
var connection = db();
var arduinoComm = require('./arduinoComm');
var unitState = require('./unitState');
var pusher = require('./pusher');
var fs = require('fs');

var jobs = [];
var jobs_descr = []; // Jobs are also stored here, but in text form to display on front page.
var job_makeSchedule = crontab.scheduleJob('0 55 16 * * *', function() {
  makeSchedule();
});

makeSchedule();
setTimeout(runSchedule, 5000);
setInterval(runSchedule, 60000);

module.exports.makeSchedule = function() {
  makeSchedule();
}

module.exports.currentJobs = function() {
  return jobs_descr;
}

module.exports.currentJobsRaw = function() {
  return jobs;
}

function makeSchedule() {
  getJSON("http://api.sunrise-sunset.org/json?lat=" + config.sunrisesunset.latitude + "&lng=" + config.sunrisesunset.longitude + "&formatted=0", function(error, response) {
    if (error) console.error(error);

    var tempDateSunrise = new Date(response.results.sunrise);
    var tempDateSunset = new Date(response.results.sunset);

    var sunriseToday = tempDateSunrise.toLocaleTimeString("nl-NL" ,{hour12 : false});
    var sunsetToday = tempDateSunset.toLocaleTimeString("nl-NL" ,{hour12 : false});

    console.log("Sunrise:\t" + sunriseToday + "\nSunset:\t\t" + sunsetToday);

    var splitTime = /(\d\d):(\d\d):(\d\d)/
    var sunriseTodayArray = splitTime.exec(sunriseToday);
    var sunsetTodayArray = splitTime.exec(sunsetToday);

    connection.query("SELECT s.scheduleId, s.newState, s.weekday, s.isWeekly, s.isDaily, s.useSunset, s.useSunrise, s.hour, s.min, s.sec, u.unitId, u.kakuId, u.unitName FROM unit u, schedule s WHERE s.unitId = u.unitId", function(err, rows) {
      if (err) {
        console.error(err);
      } else {

        jobs_descr = [];

        for (var i = 0; i < rows.length; i++) {
          var weekday;
          var hour;
          var min;
          var sec;

          var unitName = rows[i].unitName;
          var unitId = rows[i].unitId;
          var newState = rows[i].newState;

          // Generate hour, minute and second for job.
          if (rows[i].useSunset) {
            //console.log(sunsetTodayArray[1])
            hour = parseInt(sunsetTodayArray[1])+parseInt(rows[i].hour);
            min = parseInt(sunsetTodayArray[2])+parseInt(rows[i].min);
            sec = parseInt(sunsetTodayArray[3])+parseInt(rows[i].sec);
          } else if (rows[i].useSunrise) {
            hour = parseInt(sunriseTodayArray[1])+parseInt(rows[i].hour);
            min = parseInt(sunriseTodayArray[2])+parseInt(rows[i].min);
            sec = parseInt(sunriseTodayArray[3])+parseInt(rows[i].sec);
          } else {
            hour = rows[i].hour;
            min = rows[i].min;
            sec = rows[i].sec;
          }

          weekday = rows[i].isWeekly ? rows[i].weekday : -1;

          jobs_descr.push({
            hour: hour,
            min: min,
            weekday: weekday,
            unitId: unitId,
            unitName: unitName,
            newState: newState
          });

          console.log("-------------------\nScheduled new job:\nWeekday: " + weekday + "\nHour: " + hour + "\nMinute: " + min + "\nUnit name: "+unitName+"\nUnit ID: " + unitId + "\nNew state: " + newState + "\n-------------------");

        }
      }
    });
  });
}

function runSchedule() {
  console.log("JOB: Running schedule...");

  var jobs_runnow = [];
  var date = new Date();

  var current_weekday = date.getDay();
  var current_hour = date.getHours();
  var current_minute = date.getMinutes();

  for(var i = 0; i<jobs_descr.length; i++) {
    if((jobs_descr[i].weekday == '-1' || jobs_descr[i].weekday == current_weekday) && jobs_descr[i].hour == current_hour && jobs_descr[i].min == current_minute) {
      jobs_runnow.push(jobs_descr[i]);
      console.log("JOB: Queuing job " + i);
    }
  }

  function doNext() {
    if(jobs_runnow.length > 0) {
      var todo = jobs_runnow.shift();
      Job_changeState(todo.unitId, todo.newState, todo.unitName);
      setTimeout(doNext, 1500);
    }
  }

  doNext();
}

function Job_changeState(_unitId, _newState, _unitName) {
  var unitId = _unitId;
  var newState = _newState;
  var unitName = _unitName;

  connection.query("UPDATE unit SET ? WHERE unitId = ?", [{'unitState':newState}, unitId], function(err) {
    if(err) {
      console.log(err);
      console.error("PANIEK: Can't write state to database in automation.js.");
    }
  });
  unitState.changeState(unitId, newState);
  console.log("JOB: State changed for unit "+unitId+" ("+unitName+").");
  pusher.sendNotification("AUTOBOT: " + unitName + " " + (newState ? "turned on." : "turned off."), "Unit with Kaku ID " + unitId + " changed it's state to " + newState + ".");
}