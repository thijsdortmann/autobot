var express = require('express');
var router = express.Router();
var db = require('../db');
var connection = db();
var unitState = require('../unitState');
var automation = require('../automation');

router.get("/reload_schedule", function(req, res, next) {
  automation.makeSchedule();
  res.send({ result: "ok" })
});

router.get("/show_schedule", function(req, res, next) {
  res.send(automation.currentJobs());
});

router.get("/show_schedule_raw", function(req, res, next) {
  res.send(automation.currentJobsRaw());
});

module.exports = router;
