# AutoBot
Fully responsive, web technology-based Home Automation Software developed using Node.js, Express.js and Angular.js with Angular Material. Uses Arduino with generic el-cheapo transmitter to send commands to KAKU/COCO 433 Mhz switches. Can schedule based on sunrise and sunset.

## Compatibility
Tried and tested with Mac OS X 10.10, Windows 10 and Ubuntu with Arduino Uno. Does (currently) not work on Synology, because of issues with the serial library.

## Installation

### Arduino
#### Hardware
* Connect [a generic, three-pin 433Mhz transmitter](http://www.hobbyelectronica.nl/product/433mhz-rf-ontvanger-zender-set/) to power (5V and GND) and data (PIN 11).

#### Software
* Grab the [NewRemoteSwitch library](https://bitbucket.org/fuzzillogic/433mhzforarduino/wiki/Home) and [install it](https://www.arduino.cc/en/Guide/Libraries).
* Open the `autobot_Arduino` sketch from the `arduino` folder.
* Upload it to the Arduino.

Connect the Arduino to the machine that will run AutoBot. Use Arduino software to find serial port that the Arduino is connected to. This will be needed during configuration of AutoBot later on.

### Database
AutoBot uses a standard MySQL database. Adding units has to be done by hand in the current version, but will be possible from the GUI in a later version.

* Create a MySQL database and user for AutoBot.
* Import `autobot.sql`.
* Add rows to table `unit` to add units to AutoBot.
  * `unitId`: ID of unit. Leave empty, since this  column will auto increment.
  * `kakuId`: ID of KAKU/COCO switch within address
  * `unitState`: Current state of switch. `0` means off, `1` means on.
  * `unitName`: Name of the unit as shown in AutoBot.
  * `unitDescr`: Description of unit, as shown in AutoBot.

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
