var express = require('express');
var router = express.Router();
var db = require('../db');
var connection = db();
var pusher = require('../pusher');

router.get("/test", function(req, res, next) {
  connection.query("SELECT * FROM unit", function(err, rows) {
    res.send(rows);
  })
});

module.exports = router;
