'use strict';

const express = require('express');
const app = express();
var path = require('path');

app.use('/blockly', express.static('../blockly'));
app.use('/media', express.static('../blockly/media'));
app.use('/js', express.static('js'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'));
})

app.listen(8080, () => console.log('Listening to port 8080'));