#include <NewRemoteTransmitter.h>

/*
 * AUTOBOT HOME AUTOMATION
 * Arduino software for sending codes to KAKU/COCO 433Mhz switches.
 * Uses generic, el-cheapo 433Mhz transmitter module.
 * 
 * Requires NewRemoteTransmitter Arduino library, available at https://bitbucket.org/fuzzillogic/433mhzforarduino/wiki/Home.
 * 
 * Connect transmitter to power (5V + GND) and data (PIN 11).
 * 
 * Author: Thijs Dortmann (github.com/thijsdortmann)
 * 2015
 */

// Enter KAKU/COCO address here:
long address = 9638086;

// Create new transmitter with on pin 11, 250us period
NewRemoteTransmitter transmitter(address, 11, 250);

String inputString = "";
boolean stringComplete = false;

void setup() {
  Serial.begin(9600);
  inputString.reserve(200);
  pinMode(13, OUTPUT);
}

void loop() {
  if(stringComplete) {
    int unit = inputString.charAt(0) + 0;
    
    if(inputString.charAt(1) == '1') {
      Serial.println("OK");
      transmitter.sendUnit(unit, true);
    }else if(inputString.charAt(1) == '0') {
      Serial.println("OK");
      transmitter.sendUnit(unit, false);
    }
    
    inputString = "";
    stringComplete = false;
  }
}

void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read(); 
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    } 
  }
}
