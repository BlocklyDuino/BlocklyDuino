Blocks with Beau (based on BlocklyDuino)
=======================

Introduction
-----------------

Blocks with Beau is based on Blockly, the web-based, graphical programming editor. Provides language blocks and code generators for arduino programming.

* Blockly https://developers.google.com/blockly/
* Arduino http://www.arduino.cc/

Install
-----------------

-Extract the ZIP file and place the BlockyDuino-gh-pages folder in a directory.

-Copy the directory of the folder

-Open command prompt on windows and run the following command: "cd [PASTE DIRECTORY HERE] & python arduino_web_server.py"
	Like in the following example: cd C:\xampp\htdocs\BlocklyDuino-gh-pages & python arduino_web_server.py

-You can now open Blocks with Beau in a web browser by opening the following address: 127.0.0.1:8080

Usage 
-----------------

1. Open browser to Blocks with Beau, Drag and Drop blocks to make arduino program.
2. Click on the Beau the robot to get guidance in coding the arduino applications
3. Select 'Arduino' tab to view the arduino code
4. press 'upload to arduino' button to burn the code into arduino
5. press the XML tab to view XML code, this can be used to save blocks for later use
6. Click the 'SAVE' button to save XML code
7. Click the 'OPEN' button to open XML code, or alteratively copy&paste xml code in the 'XML' tab
8. The erase button will delete all blocks.
9. Pressing the menu button will reveal some more buttons including 'reset arduino' which will
	reset the arduino by removing the code currently uploaded to it.
10. 'save arduino code' lets you save arduino code to be opened by Arduino IDE

Programming solutions
-----------------

The zip file includes a folder named 'Solutions' here you can find the solutions to the two programming problems on 
the website. Open them by clicking the open button to open the XML file, or copy-and-paste the text from the .txt files 
in the XML tab on the Blocks with Beau website.

Credit
-----------------

Fred Lin is the creator of BlocklyDuino.

Thanks Neil Fraser, Q.Neutron from Blockly http://code.google.com/p/blockly/
Arduino and Seeeduino guys for Arduino and Grove blocks.

The project is inspired by arduiblock https://github.com/taweili/ardublock and modkit http://www.modk.it/

License
-----------------
Copyright (C) 2012 Fred Lin gasolin+arduino@gmail.com

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
