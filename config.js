try { // Load config
  var config = require('./config/config.json');
} catch(e) { // If loading fails, give error.
  console.error(e.message);
  console.error("Config file is not found. Please create config file in /config/config.json.");
  process.exit(e.code);
}

module.exports = config;
