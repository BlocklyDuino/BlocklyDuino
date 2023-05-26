### Welcome to ADHDuino

(BlocklyDuino README can be found in blockly/apps\blocklyduino/README.txt)

Specification:
- Python 2.7.18
- Arduino IDE version 1.8.19
- port COM5, Arduino UNO board.

(note: the index.html file was split into index.html, index.css and index.js to reduce clutter. Any new js or css files are in scripts and styles)

Simply opening the index.html file via directory or terminal (cd (whatever folder the zip is in)/ADHDuino/blockly/blocklyduino/index.html) should work.

To upload code to the Arduino, make sure it's port is COM5 and Arduino IDE is installed (and findable) and click the 'Upload' button. The code should now run.

---------------------
ADHDuino is an interactive web-based programming environment for Arduino's for children aged 12, specifically catered towards kids with ADHD. To help them concentrate, one of the interaction techniques applied is a pop-up system.
To start the Pomodoro timer, select your desired focus and pause time (it's in seconds for demonstartion purposes). Then, click the start button. The timer will start running (displayed in green for demonstration purposes) and after your focus time is up, a pop up will appear promting the user to take their pause time. This pop-up will disappear once time is up. If they were too focussed and want to continue, they can click the 'Continue' button. The timer will then restart again.

Other techniques in the workings is the step-by-step guide + gamification. The 'levels' and sidebar are already here to get an idea as to where these would be placed. This technique also includes a progressbar, which is also implemented, yet not paired with any functions yet. To demo the progress bar, hit the demo button.
