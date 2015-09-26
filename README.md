# AutoBot
Home Automation Software bosed on Node.js, Express.js and Angular.js. Uses Arduino with generic el-cheapo transmitter to send commands to KAKU/COCO 433 Mhz switches.

## Compatibility
Tried and tested with Mac OS X 10.10, Windows 10 and Ubuntu. Does (currently) not work on Synology, because of issues with the serial library.

## Installation

### Arduino
Arduino source code and installation instructions will be provided soon.

### Database
AutoBot uses a standard MySQL database. Create a MySQL database and user for AutoBot, and import the provided SQL dump.

### Basic Installation
* Download project from GitHub.
* Navigate to directory of download.
* Execute `npm install` to install Node.js dependencies.
* Execute `bower install` to install client-side dependencies.
* Continue with configuration.

### Config file
Create /config/config.json and enter information like in the file below.

```json
{
  "mysql": {
    "host": "localhost",
    "port": 3306,
    "database" : "name of database",
    "user": "username for database",
    "password": "password for user"
  },
  "serial": {
    "port": "com port used by Arduino",
    "baudrate": 9600
  },
  "pushbullet": {
    "key": "pushbullet api key"
  },
  "sunrisesunset": {
    "latitude": "latitude for sunrise and sunset",
    "longitude": "longitude for sunrise and sunset"
  }
}
```

## Running
Run AutoBot by calling `node ./bin/www`.

For running AutoBot as a service, [PM2](https://github.com/Unitech/pm2) is recommended. After installing PM2 (`npm install pm2 -g`), AutoBot can be started by calling `pm2 start ./bin/www`.
