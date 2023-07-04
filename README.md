# Welcome to ADHDuino
=======================

-----------------
## Introduction
-----------------

ADHDino is an interactive web-based programming environment for Arduino's for children aged 16, specifically catered towards kids with ADHD.

ADHDino is based on [BlocklyDuino] (https://github.com/BlocklyDuino/BlocklyDuino)

* [Blockly] (https://developers.google.com/blockly/)
* [Arduino] (http://www.arduino.cc/)
* [Grove] (http://www.seeedstudio.com/wiki/GROVE_-_Starter_Kit_V1.1b)

Features:
* Programming Arduino with visually drag and drop code blocks
* Generate fully compatible Arduino source code
* Interactive Arduino board with 10+ predefined Grove sensor blocks
* Load different on-site examples with url parameters
* A step-by-step guide for 2 different programming use cases
* A Pomodoro timer
-----------------
## Installation
-----------------

Requirements:
- Python 2.7.18
- Arduino IDE version 1.8.19
- port COM5, Arduino UNO board
- A running local webserver

To install locally, follow these steps:

- Extract the ZIP file and place the ADHDino folder in a directory.

- Copy the directory of the folder

- Open command prompt or terminal on windows and run the following command: `cd [PASTE DIRECTORY HERE] & python arduino_web_server.py`
Example: `cd C:\xampp\htdocs\ADHDino python arduino_web_server.py`

- You can now open ADHDino in a web browser by opening the following address in a webbrowser: 127.0.0.1:8080 or http://127.0.0.1:8080/ 

> (note: the index.html file was split into index.html, index.css and index.js to reduce clutter. Any new js or css files are in scripts and styles)


-----------------
## General Usage
-----------------
1. Drag and drop blocks in the workspace to make an Arduino program. 
   1a. To view your code, press the 'Arduino' tab. 
   1b. To view XML code, or the code which consists the data of the block configuration, press the 'XML' tab	
   1c. To open an example project in blocks, click 'Load XML' and select any to open a project in Blockly.	
   1d. To save your project in blocks, click 'Save XML'	
   1e. To save your project in Arduino code, click 'Save Arduino code'	
   1f. To rid the workspace, click 'Discard'

2. To upload code to the Arduino, make sure it's port is COM5 and Arduino IDE is installed (and findable). If 'arduino_web_server.py is running: click the 'Upload' button. The code should now run.
   2a. If not, select the 'Arduino' tab and copy the displayed code into an existing or new project in Arduino IDE. Then, press the 'Upload' button within Arduino IDE to send the code to the connected Arduino. 	
   2b. To reset code sent to the Arduino board, press the 'Reset' button

-----------------
## Specific Usage (ADHD catered)
-----------------
To help kids with ADHD concentrate, one of the interaction techniques applied is a pop-up system.
1. To start the Pomodoro timer, select your desired focus and pause time.
2. Click the start button. The timer will start running.
3. After the focus time is up, a pop up will appear promting the user to take their pause time. This pop-up will disappear once time is up. If the user wants to continue due to being in 'flow', they can click the 'Continue' button. The timer will then restart again.

The other technique is the step-by-step guide and the progressbar. The levels on top of the website indicate how many levels this use case consists of. On the left is a panel in which the levels will be explained step-by-step, with the Dino mascot on top. 
1. On startup, the user will be promted to pick one of two use cases. To start the use case, pick the desired case and press the 'Next' button in the step-by-step guide panel.
2. To progress in the level, the user will need to press next untill the final step is finished.
3. When finished with a level, the user can now go to the next level, unlocked in the level display at the top of the website. To continue, press the button of the corresponding next level in this display.

> Note: the user can choose to go forward and backwards within a level, and progress to the next when the level is finished or 'clicked through completely'. The user can access previously completed levels in the level bar on the top.
The progressbar will move according to how many levels have been completed.


-----------------
## Where to find relevant files
-----------------

- Base solutions of the use cases are found under: ADHDino\blockly\apps\ADHDino\case solutions
- Javascript files are found under: ADHDino\blockly\scripts
- CSS files are found under: ADHDino\blockly\styles
- Any audio or image found under: ADHDino\blockly\media
- The main website can manually be accessed under: ADHDino\blockly\apps\ADHDino\index.html
 
-----------------
## Credits
-----------------
Fred Lin is the creator of BlocklyDuino.

Thanks Neil Fraser, Q.Neutron from Blockly 
http://code.google.com/p/blockly/
Arduino and Seeeduino guys for Arduino and Grove blocks.

The project is based and inspired by BlocklyDuino
https://github.com/BlocklyDuino/BlocklyDuino

(For reference, the original BlocklyDuino README can be found in blockly/blocklyduino/README.txt)

-----------------
## License
-----------------
Copyright (C) 2012 Fred Lin gasolin+arduino@gmail.com

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0

