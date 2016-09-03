### Welcome to CyberDuino

CyberDuino is a **web-based visual programming editor for [Arduino](http://www.arduino.cc/)**.

CyberDuino is originally a fork of [BlocklyDuino](https://github.com/BlocklyDuino/BlocklyDuino)

BlocklyDuino is based on [Blockly](https://developers.google.com/blockly/), the web-based, graphical programming editor. Provide static type language blocks and code generators for Arduino programming.

### Why create a fork?

I created this fork of the BlocklyDuino project because there were a number of personal improvements I wanted to make on the project.
If the original author wants to merge them into their repository, they are of course very welcome to do so!

### Features

* Programming Arduino with visually drag and drop code blocks
* Generate fully compatible Arduino source code
* Interactive Arduino board with multiple sensor blocks
* Load different on-site examples with url parameters

### Run locally on your web browser

CyberDuino is built with NodeJS, so you need only run the command `npm start`, and then you can open your web browser to [http://localhost:8080/](http://localhost:8080/).

### Usage

1. Open browser to CyberDuino, drag and drop blocks to make an Arduino program.
2. Select the 'Arduino' tab and press the 'Upload' button. (press the 'Reset' button to upload an empty program)

### ChangeLog

Check changelog [here](https://github.com/Cyberlane/CyberDuino/blob/master/CHANGELOG.txt)

### Authors and Contributors

Author of CyberDuino and all the changes in this fork: Justin Nel (@cyberlane) .

Original author of BlocklyDuino: Fred Lin (@gasolin) .

Thanks Neil Fraser, Q.Neutron from Blockly https://developers.google.com/blockly/
Thanks Dale Low (gumbypp) for contribute the python server to pipe BlocklyDuino source to arduino board.
Thanks Arduino and Seeeduino guys for Arduino and Grove blocks.

The project is also inspired by [arduiblock](https://github.com/taweili/ardublock) and [modkit](http://www.modk.it/)

### License

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
