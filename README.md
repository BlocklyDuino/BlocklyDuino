> **Note :** cette version est désormais la branche `v2` du dépôt unifié [BlocklyDuino/BlocklyDuino](https://github.com/BlocklyDuino/BlocklyDuino/tree/v2). Le dépôt historique [BlocklyDuino-v2](https://github.com/BlocklyDuino/BlocklyDuino-v2) reste disponible pour la démo GitHub Pages.

# ![enter image description here](https://raw.githubusercontent.com/BlocklyDuino/BlocklyDuino2Electron/master/src/app.png) Welcome to BlocklyDuino2

BlocklyDuino is a **web-based program for editing and visual block programming editor for [Arduino](http://www.arduino.cc/)** electronic boards.

BlocklyDuino is based on [Blockly](https://developers.google.com/blockly/), the web-based graphical programming editor.

![](https://raw.githubusercontent.com/BlocklyDuino/BlocklyDuino-v2/master/blocklyduino/media/logo_built_on.png)

This new v2 version is also based on the work done on [STudio4Education](https://github.com/A-S-T-U-C-E/STudio4Education), a similar project for [STmicroelectronics](https://www.st.com/) boards, and inspired by all fork of BlocklyDuino's original Gasolin's work.

It provides static type language blocks and code generators for simple Arduino programming.

BlocklyDuino also supports some [Grove](https://wiki.seeedstudio.com/Grove_System/) blocks to easily get started with microcontroller-based experimentation and learning.

## BlocklyDuino's Demo

BlocklyDuino2 is a simple webware, you can give it a try [here.](https://blocklyduino.github.io/BlocklyDuino-v2/)

You can download it [here](https://github.com/BlocklyDuino/BlocklyDuino-v2) and launch `index.html`.

## Features

* Programming Arduino with visually drag and drop code blocks
* Generate fully compatible Arduino source code
* Multiple Arduino boards choice for automatic selection of pin functions
* Interact Arduino board with dozen of sensor blocks
* Load different on-site examples with url parameters
* Keyboard navigation and accessibility helpers
* Theme choice
* Block render choice
* Multi language
* Keyboard navigation

### Accessibility

You can enter _accessibility_ mode by **hitting Shift + Ctrl + k**.

Official documentation: [https://developers.google.com/blockly/guides/configure/web/keyboard-nav](https://developers.google.com/blockly/guides/configure/web/keyboard-nav)

Key mapping is customizable by activating 'open key mappings' option.

Some basic commands for moving around are below.  


### Workspace Navigation

-   W: Previous block/field/input at the same level.
-   A: Up one level (Field (or input) -> Block -> Input (or field) -> Block -> Stack -> Workspace).
-   S: Next block/field/input at the same level.
-   D: Down one level (Workspace -> Stack -> Block -> Input (or field) -> Block -> Field (or input)).
-   T: Will open the toolbox. Once in there you can moving around using the WASD keys. And insert a block by hitting Enter.
-   X: While on a connection hit X to disconnect the block after the cursor.

### Cursor 
The cursor controls how the user navigates the blocks, inputs, fields and connections on a workspace. Two different cursors:  

-   **Default Cursor**: Allow the user to go to the previous, next, in or out location.
-   **Basic Cursor**: Using the pre order traversal allows the user to go to the next and previous location.


## Run locally on your web browser

If you want to install it locally, get code from github and open `index.html` in your browser.

The prefered way is to put the BlocklyDuino/web folder into a web server and open the url like localhost/index.html for use.

### Usage

1. Open BlocklyDuino and select your Arduino board, your language, your favorite theme + renderer.
2. Drag and drop blocks to make an Arduino program.
3. Copy all of the source code into an existing or new project in the Arduino IDE.
4. Configure your Arduino IDE with the rght board and communication port.
5. Press the 'Upload' button in the Arduino IDE to burn the code into a connected Arduino board.

## Integrated Arduino upload

You can try an [Electron](https://www.electronjs.org/) version with [arduino-cli](https://github.com/arduino/arduino-cli) embbeded for an off-line version: [https://github.com/BlocklyDuino/BlocklyDuino2Electron](https://github.com/BlocklyDuino/BlocklyDuino2Electron)

## ChangeLog

Check changelog [here](https://github.com/BlocklyDuino/BlocklyDuino-v2/blob/master/CHANGELOG.txt)

## Tools used

[Ace editor](https://ace.c9.io/)


## Authors and Contributors

Sébastien CANET ([scanet@libreduc.cc](scanet@libreduc.cc)) for this reboot and Electron version.

Fred Lin (@gasolin) for original [BlocklyDuino](https://github.com/BlocklyDuino/BlocklyDuino).

Thanks Neil Fraser, Q.Neutron from Blockly https://developers.google.com/blockly/

Thanks Arduino and Seeeduino guys for Arduino and Grove blocks.

The BlocklyDuino project is also inspired by [ardublock](https://github.com/taweili/ardublock) and [modkit](http://www.modk.it/)

This BlocklyDuino2 project is also inspired by [Blockly@rduino](https://github.com/technologiescollege/Blockly-at-rduino),  [ardublockly](https://github.com/carlosperate/ardublockly), [Blocklino](https://github.com/fontainejp/blocklino) and [STudio4Education](https://github.com/A-S-T-U-C-E/STudio4Education).


## License

Copyright (C) 2020 Sébastien CANET scanet@libreduc.cc & Fred Lin gasolin@gmail.com
-   Licensed under the GNU General Public License v3.0 (the "License").
-   You may not use this project or any file except in compliance with the License.
-   You may obtain a copy of the License at [https://www.gnu.org/licenses/#GPL](https://www.gnu.org/licenses/#GPL).

Code from Blockly is licensed under the Apache 2.0 license.
Code from STudio4Education is licensed under the BSD 3-Clause license.


# Blockly [![Build Status]( https://travis-ci.org/google/blockly.svg?branch=master)](https://travis-ci.org/google/blockly)


Google's Blockly is a web-based, visual programming editor.  Users can drag blocks together to build programs.  All code is free and open source.

**The project page is https://developers.google.com/blockly/**

![](https://camo.githubusercontent.com/2b4c453a05d72a3201ad8cbfed77cb3d37fbb462/68747470733a2f2f646576656c6f706572732e676f6f676c652e636f6d2f626c6f636b6c792f696d616765732f73616d706c652e706e67)

Blockly has an active [developer forum](https://groups.google.com/forum/#!forum/blockly). Please drop by and say hello. Show us your prototypes early; collectively we have a lot of experience and can offer hints which will save you time.

Help us focus our development efforts by telling us [what you are doing with Blockly](https://developers.google.com/blockly/registration). The questionnaire only takes
a few minutes and will help us better support the Blockly community.

Want to contribute? Great! First, read [our guidelines for contributors](https://developers.google.com/blockly/guides/modify/contributing).


# Links and thanks

Tools without which nothing would have been possible (*and millions of thanks to their creators!*) :

- [Blockly](https://developers.google.com/blockly)
- [BlocklyDuino](https://github.com/BlocklyDuino/BlocklyDuino)
- [Blockly@rduino](https://github.com/technologiescollege/Blockly-at-rduino)
- [Blocklino](https://github.com/fontainejp/blocklino)
- [STudio4Education](https://github.com/A-S-T-U-C-E/STudio4Education)
- [Font Awesome](http://fontawesome.io)