'use strict';

const fs = require('fs');
const Registry = require('winreg');

let arduinoCommand = null;

function getArduinoCommand() {
  if (arduinoCommand !== null) {
    return arduinoCommand;
  }

  let arduinoCommandGuesses = [];
  if (process.platform === 'darwin') {
    arduinoCommandGuesses.push('/Applications/Arduino.app/Contents/MacOS/Arduino');
  }
  else if (/^win/.test(process.platform)) {
    arduinoCommandGuesses.push('c:\\Program Files\\Arduino\\Arduino.exe', 'c:\\Program Files (x86)\\Arduino\\Arduino.exe');
  }
  
  arduinoCommandGuesses
    .filter(guess => fs.existsSync(guess))
    .forEach(guess => {
      console.log('Found Arduino command at ' + guess);
      arduinoCommand = guess;
    });
  
  if (arduinoCommand !== null) {
    return arduinoCommand;
  }

  console.log('Could not find Arduino command; hoping it is on the path!');
  arduinoCommand = "arduino";
  return arduinoCommand;
}

function guessPortName() {
  let portName = null;
  if (/^win/.test(process.platform)) {
    let key = new Registry({
      hive: Registry.HKLM,
      key: '\\HARDWARE\\DEVICEMAP\\SERIALCOMM'
    });
    key.values((err, items) => {
      if (err) {
        console.error(err);
        return;
      }
      portName = items[items.length - 1].value;
    });
  } else {
    let list = fs.readdirSync('/dev')
      .filter(f => f.startsWith('tty.') || f.startsWith('cu.'))
      .filter(f => f.indexOf('luetooth') === -1)
      .reverse();
    let cuList = list.filter(f => f.startsWith('cu.'));
    portName = '/dev/' + ((cuList.length > 0) ? cuList[0] : list[0]);
  }

  return portName;
}

module.exports = {
  getArduinoCommand: getArduinoCommand,
  guessPortName: guessPortName
}