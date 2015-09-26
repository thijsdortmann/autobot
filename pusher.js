var config = require('./config');
var PushBullet = require('pushbullet');
var pusher = new PushBullet(config.pushbullet.key);

module.exports.pusher = pusher;

module.exports.sendNotification = function(notificationTitle, notificationText) {
  pusher.note({}, notificationTitle, notificationText, function(error, response) {
    if(error) console.log("Pusher error: " + error);
  })
};
