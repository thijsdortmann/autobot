var express = require('express');
var router = express.Router();
var db = require('../db');
var connection = db();
var unitState = require('../unitState');
var getJSON = require('get-json');
var config = require('../config');

router.get("/units", function(req, res, next) {
  connection.query("SELECT * FROM unit", function(err, rows) {
    res.send(rows);
  });
});

router.get("/units", function(req, res, next) {
  connection.query("SELECT * FROM unit", function(err, rows) {
    res.json(rows);
  });
});

router.get("/units/:unit_id", function(req, res, next) {
  var unitId = connection.escape(req.params.unit_id);
  connection.query("SELECT * FROM unit WHERE unitId = " + unitId, function(err, rows) {
    if (err) res.send(err);
    res.json(rows);
  })
});

router.put("/units/:unit_id", function(req, res, next) {
  var query = connection.query('UPDATE unit SET ? WHERE unitId = ?', [req.body, req.params.unit_id], function(err) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.send({
        result: 'error',
        err: err.code
      });
    } else {
      connection.query('SELECT * FROM unit WHERE unitId = ?', req.params.unit_id, function(err, rows) {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.send({
            result: 'error',
            err: err.code
          });
        } else {
          unitState.changeState(req.params.unit_id, req.body.unitState);
          res.send({
            result: 'success',
            err: '',
            id: req.params.id,
            json: rows[0],
            length: 1
          });
        }
      })
    }
  })
});


router.get("/jobs", function(req, res, next) {
  connection.query("SELECT s.scheduleId, s.newState, s.isWeekly, s.isDaily, s.useSunset, s.useSunrise, s.weekday, s.hour, s.min, s.sec, u.unitId, u.unitName FROM schedule s, unit u WHERE s.unitId = u.unitId", function(err, rows) {
    if(err) console.log(err)
    res.send(rows);
  });
});

router.get("/jobs/:job_id", function(req, res, next) {
  var jobId = connection.escape(req.params.job_id);
  connection.query("SELECT s.scheduleId, s.newState, s.isWeekly, s.isDaily, s.useSunset, s.useSunrise, s.weekday, s.hour, s.min, s.sec, u.unitId, u.unitName FROM schedule s, unit u WHERE s.unitId = u.unitId AND scheduleId = " + jobId, function(err, rows) {
    if (err) res.send(err);
    res.json(rows[0]);
  })
});

router.delete("/jobs/:job_id", function(req, res, next) {
  var jobId = connection.escape(req.params.job_id);
  connection.query("DELETE FROM schedule WHERE scheduleId = " + jobId + " LIMIT 1", function(err, rows) {
    if (err) res.send(err);
    res.json(rows[0]);
  })
});

router.put("/jobs/:job_id", function(req, res, next) {
  var query = connection.query('UPDATE schedule SET ? WHERE scheduleId = ?', [req.body, req.params.job_id], function(err) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.send({
        result: 'error',
        err: err.code
      });
    } else {
      connection.query('SELECT * FROM schedule WHERE scheduleId = ?', req.params.job_id, function(err, rows) {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.send({
            result: 'error',
            err: err.code
          });
        } else {
          res.send({
            result: 'success',
            err: '',
            id: req.params.id,
            json: rows[0],
            length: 1
          });
        }
      })
    }
  })
});

router.post("/jobs", function(req, res, next) {
  connection.query('INSERT INTO schedule SET ?', req.body, function(err, result) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                } else {
                    res.send({
                        result: 'success',
                        err:    '',
                        id:     result.insertId
                    });
                }
            });
});


router.get("/sunrise_sunset", function(req, res, next) {
  getJSON("http://api.sunrise-sunset.org/json?lat=" + config.sunrisesunset.latitude + "&lng=" + config.sunrisesunset.longitude + "&formatted=0", function(error, response) {
    if (error) console.error(error);

    var tempDateSunrise = new Date(response.results.sunrise);
    var tempDateSunset = new Date(response.results.sunset);

    var sunriseToday = tempDateSunrise.toLocaleTimeString();
    var sunsetToday = tempDateSunset.toLocaleTimeString();

    res.json({ "sunrise" : sunriseToday, "sunset" : sunsetToday, "latitude" : config.sunrisesunset.latitude, "longitude" : config.sunrisesunset.longitude })
  });
});

module.exports = router
