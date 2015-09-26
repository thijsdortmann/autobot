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

    var sunriseToday = tempDateSunrise.toLocaleTimeString();
    var sunsetToday = tempDateSunset.toLocaleTimeString();

    console.log("Sunrise:\t" + sunriseToday + "\nSunset:\t\t" + sunsetToday);

    var splitTime = /(\d\d):(\d\d):(\d\d)/
    var sunriseTodayArray = splitTime.exec(sunriseToday);
    var sunsetTodayArray = splitTime.exec(sunsetToday);

    connection.query("SELECT s.scheduleId, s.newState, s.weekday, s.isWeekly, s.isDaily, s.useSunset, s.useSunrise, s.hour, s.min, s.sec, u.unitId, u.kakuId, u.unitName FROM unit u, schedule s WHERE s.unitId = u.unitId", function(err, rows) {
      if (err) {
        console.error(err);
      } else {

        Job_stopAndClearAll();

        //console.log(rows);

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
            console.log(sunsetTodayArray[1])
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

          var weekday = rows[i].isWeekly ? rows[i].weekday : "*";

          /*
          1    2    3    4    5    6
          *    *    *    *    *    *
          ┬    ┬    ┬    ┬    ┬    ┬
          │    │    │    │    │    |
          │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
          │    │    │    │    └───── month (1 - 12)
          │    │    │    └────────── day of month (1 - 31)
          │    │    └─────────────── hour (0 - 23)
          │    └──────────────────── minute (0 - 59)
          └───────────────────────── second (0 - 59, OPTIONAL)
          */

          //console.log(sec+' '+min+' '+hour+' * * '+weekday);

          jobs.push(crontab.scheduleJob(sec + ' ' + min + ' ' + hour + ' * * ' + weekday, function(_unitId, _newState, _unitName) {
            Job_changeState(_unitId, _newState, _unitName);
          }, [unitId, newState, unitName]));

          /*jobs.push(new CronJob(sec + ' ' + min + ' ' + hour + ' * * ' + weekday, function(unitId, newState, unitName) {
            console.log("Cron unitId: "+unitId);
            Job_changeState(unitId, newState, unitName);
          }, null, true));*/

          //                          1      2       3      4 5   6
          //Jobs.push(cron.scheduleJob(sec+' '+min+' '+hour+' * * '+weekday, Job_changeState(kakuId, newState, unitName)));

          console.log("-------------------\nScheduled new job:\nWeekday: " + weekday + "\nHour: " + hour + "\nMinute: " + min + "\nSecond: " + sec + "\nUnit name: "+unitName+"\nUnit ID: " + unitId + "\nNew state: " + newState + "\n-------------------");

          jobs_descr.push({
            hour: hour,
            min: min,
            sec: sec,
            weekday: weekday,
            unitId: unitId,
            unitName: unitName,
            newState: newState
          });

        }
      }
    });
  });
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

function Job_stopAndClearAll() {
  for (var i = 0; i < jobs.length; i++) {
    crontab.cancelJob(jobs[i]);
    console.log("Stopped job "+i+".");
  }
  jobs = [];
  jobs_descr = [];
  console.log("Cleared job array.");
}
