### Welcome to BlocklyDuino

> Check [BlockDuino v2](https://github.com/BlocklyDuino/BlocklyDuino-v2)

BlocklyDuino is a **web-based visual programming editor for [Arduino](http://www.arduino.cc/)**.

BlocklyDuino is based on [Blockly](https://developers.google.com/blockly/), the web-based, graphical programming editor. Provide static type language blocks and code generators for Arduino programming.

BlocklyDuino also support [Grove](http://www.seeedstudio.com/wiki/GROVE_System) blocks to easily get started with microcontroller-based experimentation and learning.

### Features

* Programming Arduino with visually drag and drop code blocks
* Generate fully compatible Arduino source code
* Interactive Arduino board with 10+ predefined Grove sensor blocks
* Load different on-site examples with url parameters

### Demo

BlocklyDuino is a web tool. You can give it a try at
[Web](http://blocklyduino.github.io/BlocklyDuino/blockly/apps/blocklyduino/) to see the working BlocklyDuino.

You can link directly to examples
* [demo 1](http://blocklyduino.github.io/BlocklyDuino/blockly/apps/blocklyduino/index.html?url=examples/blink.xml) make default LED blink
* [demo 2](http://blocklyduino.github.io/BlocklyDuino/blockly/apps/blocklyduino/index.html?url=examples/servo_potentio.xml) control servo with potentio rotator
* [demo 3](http://blocklyduino.github.io/BlocklyDuino/blockly/apps/blocklyduino/index.html?url=examples/click_color.xml) click button to change LED colors

Or watch the [video demos](http://www.youtube.com/watch?v=_swiyXcUvNY)

### Run locally on your web browser
If you want to install it locally. Get code from github and open `blockly/apps/blocklyduino/index.html` in your browser. 

The preffered way is to put the `BlocklyDuino/web` folder into a web server and open the url like `localhost/public/blockly/apps/blocklyduino/index.html` for use.

### Integrated Arduino upload
To avoid the tedious step of manually pasting code to the Arduino IDE, you can run a mini webserver that uses
the [Arduino IDE](https://www.arduino.cc/en/Main/Software) to upload the code to a connected Arduino board on Windows, Mac OS X and Linux systems.
Invoke this command from the BlocklyDuino root folder:
```
python arduino_web_server.py 
```

You can optionally specify the port with `--port=COM3` (or `--port=/dev/tty.foo` on Linux and Mac); 
if you don't, it will try and guess which port to use.

When the webserver is running, you can access BlocklyDuino itself on [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

### Usage
1. Open browser to BlocklyDuino, drag and drop blocks to make an Arduino program
2. Select the `Arduino` tab and copy all of the source code into an existing or new project in the Arduino IDE
3. Press the `Upload` button in the Arduino IDE to burn the code into a connected Arduino board

OR (if running `arduino_web_server.py`):
1. Open browser to BlocklyDuino, drag and drop blocks to make an Arduino program.
2. Select the `Arduino` tab and press the `Upload` button. (press the `Reset` button to upload an empty program)

In GNU/Linux OS (i.e. Ubuntu 18.04x64) 
1. Open one terminal, go the BlocklyDuino path and run:   
python arduino_web_server.py --port=/dev/ttyUSB0   
2. Open a new terminal and run:   
firefox http://127.0.0.1:8080/ 
3. Once BlocklyDuino is open in the browser, drag and drop blocks to make an Arduino program or 
load an example by clicking on `LoadXML` (e.g. /blocky/apps/blockyduino/examples/blink.xml or other in the same path)
4. Press `Upload` and wait until you see `Program uploaded ok` and press OK!
5. Close terminals with `Ctrl+c` or `Ctrl+d`

### ChangeLog

Check changelog [here](https://github.com/BlocklyDuino/BlocklyDuino/blob/master/CHANGELOG.txt)

### Authors and Contributors
Fred Lin (@gasolin).

Thanks Neil Fraser, Q.Neutron from Blockly https://developers.google.com/blockly/
Thanks Dale Low (gumbypp) for contribute the python server to pipe BlocklyDuino source to arduino board.
Thanks Arduino and Seeeduino guys for Arduino and Grove blocks.

The project is also inspired by [arduiblock](https://github.com/taweili/ardublock) and [modkit](http://www.modk.it/)

### License

Copyright (C) 2012~2015 Fred Lin gasolin+blockly@gmail.com

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
