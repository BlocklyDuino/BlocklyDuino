Welcome to ADHDuino
=======================

-----------------
Introduction
-----------------

ADHDino is an interactive web-based programming environment for Arduino's for children aged 15, specifically catered towards kids with ADHD.

ADHDino is based on BlocklyDuino
https://github.com/BlocklyDuino/BlocklyDuino

* Blockly https://developers.google.com/blockly/
* Arduino http://www.arduino.cc/
* Grove http://www.seeedstudio.com/wiki/GROVE_-_Starter_Kit_V1.1b
* BlocklyDuino https://github.com/BlocklyDuino/BlocklyDuino

Features:
* Programming Arduino with visually drag and drop code blocks
* Generate fully compatible Arduino source code
* Interactive Arduino board with 10+ predefined Grove sensor blocks
* Load different on-site examples with url parameters
* A step-by-step guide for 2 different programming use cases
* A Pomodoro timer
-----------------
Installation
-----------------

Requirements:
- Python 2.7.18
- Arduino IDE version 1.8.19
- port COM5, Arduino UNO board
- A running local webserver

To install locally, follow these steps:

-Extract the ZIP file and place the ADHDino folder in a directory.

-Copy the directory of the folder

-Open command prompt or terminal on windows and run the following command: "cd [PASTE DIRECTORY HERE] & python arduino_web_server.py"
Example: cd C:\xampp\htdocs\ADHDino python arduino_web_server.py

-You can now open ADHDino in a web browser by opening the following address in a webbrowser: 127.0.0.1:8080 or http://127.0.0.1:8080/ 

(note: the index.html file was split into index.html, index.css and index.js to reduce clutter. Any new js or css files are in scripts and styles)


-----------------
General Usage
-----------------
1. Drag and drop blocks in the workspace to make an Arduino program. To view your code, press the 'Arduino' tab. To open an example project, click 'Load XML' and select any to open a project in Blockly.
2.a To upload code to the Arduino, make sure it's port is COM5 and Arduino IDE is installed (and findable). If 'arduino_web_server.py is running: click the 'Upload' button. The code should now run.
2.b. If not, select the 'Arduino' tab and copy the displayed code into an existing or new project in Arduino IDE. Then, press the 'Upload' button within Arduino IDE to send the code to the connected Arduino.

-----------------
Specific Usage (ADHD catered)
-----------------
//run the timer
//follow the step
To help them concentrate, one of the interaction techniques applied is a pop-up system.
To start the Pomodoro timer, select your desired focus and pause time (it's in seconds for demonstartion purposes). Then, click the start button. The timer will start running (displayed in green for demonstration purposes) and after your focus time is up, a pop up will appear promting the user to take their pause time. This pop-up will disappear once time is up. If they were too focussed and want to continue, they can click the 'Continue' button. The timer will then restart again.

Other techniques in the workings is the step-by-step guide + gamification. The 'levels' and sidebar are already here to get an idea as to where these would be placed. This technique also includes a progressbar, which is also implemented, yet not paired with any functions yet. To demo the progress bar, hit the demo button.


-----------------
Where to find relevant files
-----------------

- Base solutions of the use cases are found under:
- Javascript files are found under:
- CSS files are found under:
- Any audio or image found under:
- The main website can manually be accessed under:

-----------------
Credits
-----------------
Fred Lin is the creator of BlocklyDuino.

Thanks Neil Fraser, Q.Neutron from Blockly 
http://code.google.com/p/blockly/
Arduino and Seeeduino guys for Arduino and Grove blocks.

The project is based and inspired by BlocklyDuino
https://github.com/BlocklyDuino/BlocklyDuino

(For reference, the original BlocklyDuino README can be found in blockly/blocklyduino/README.txt)

-----------------
License
-----------------
Copyright (C) 2012 Fred Lin gasolin+arduino@gmail.com

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0

