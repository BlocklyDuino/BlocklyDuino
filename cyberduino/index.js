'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const exec = require('child_process').execSync;
const arduino = require('./arduino');

const app = express();

app.use(bodyParser.text());
app.use('/blockly', express.static('../blockly'));
app.use('/media', express.static('../blockly/media'));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/assets', express.static('assets'));

app.head('/', (req, res) => {
  res.status(200);
  res.set('content-type', 'text/html;charset=utf-8');
  res.set('Access-Control-Allow-Origin', '*');
  res.end();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.post('/', (req, res) => {
  if (req.get('Content-Length') == 0) {
    res.status(400);
    res.end();
    return;
  }

  const text = req.body;
  const sketchName = path.join(__dirname + '/upload/upload.ino');
  fs.writeFileSync(sketchName, text);
  const arduinoApp = arduino.getArduinoCommand();
  let compileArgs = [
    '--upload',
    '--port',
    arduino.guessPortName(),
    sketchName
  ];
  const arduinoCommand = arduinoApp + ' ' + compileArgs.join(' ');
  console.log(arduinoCommand);
  let uploadResult = exec(arduinoCommand, {stdio: [0, 1, 2]});
  console.log(uploadResult);
  res.status(200);
  res.set('Access-Control-Allow-Origin', '*');
  res.end();
})

app.listen(8080, () => console.log('Listening to port 8080'));