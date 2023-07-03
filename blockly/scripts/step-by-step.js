var menuTitle;
var levelText;
var levelDiv;
var mascot;
var nextButton;
var previousButton;
var bar;
var levelFinish;
var gameFinish;
var currentItem;
var currentLvl;
var currentLvlDiv;
var titleArray;
var contentArray;

function getValues() {
  menuTitle = document.getElementById("menuTitle");
  levelText = document.getElementById("panelText");
  levelDiv = document.getElementById("panel");
  mascot = document.getElementById("mascot");
  nextButton = document.getElementById("next");
  previousButton = document.getElementById("previous");
  bar = document.getElementById("progressBar");
}
var width = 0;
function moveBar() {
    getValues();
    if (width >= 100) {
      clearInterval(id);
      button.disabled = false;
      button.style.backgroundColor = "#e67e22";
    } else {
      bar.style.backgroundColor = "#008184";
      width++; 
      bar.style.width = width * 12.25 + '%'; 
      bar.innerHTML = width * 12.5  + '%';
    }
    if (width > 0) {
      bar.style.color = "white";
    }
    if (bar.innerHTML == "100%") {
      bar.style.color = "black";
      bar.style.backgroundColor = "#2ecc71";
    }
  }

function playSoundLevelDone() {
    var audioElement = new Audio ("../../media/level_complete.mp3")
    audioElement.play()
}

function playSoundGameDone() {
  var audioElement = new Audio ("../../media/game_complete.wav")
  audioElement.play()
}

const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

/* Level system */

/* 
  todo: change lvl-1 to a done colour, move to next
*/


const ticTitleArray = 
[
  "Step 1: Defining variables",
  "Step 2: Pinmodes",
  "Step 3: Implement the <i>checkJoystickMovement</i> function",
  "Step 4: Implement the <i>checkJoystickPress</i> function",
  "Step 5: Implement the <i>setLed</i> function",
  "Step 6: Implement the <i>setCursor</i> function",
  "Step 7: Create the main loop",
  "Step 8: Test the program"
];

const ticArray = [
  [
    "In this level we're going to make all the variables we need to create the well-known game of Tic Tac Toe. Almost all the blocks you will need in this level are in the <b>Setup</b> category. Click next to continue.",
    "Create a variable called <i>joystickTime</i> using the <b>set unsigned long block</b>.",
    "Set <i>joystickTime</i> equal to 0.",
    "Create five variables with the following names: <i>cursor</i>, <i>player2Count</i>, <i>cursorCount</i>, <i>lastButtonState</i> and <i>player</i> using the <b>set int block</b>.",
    "Set the previous variables equal to 0, 200, 1000, 1 and 1 respectively.",
    "To keep track of all the LEDs in the game and their states, we need two lists. One list will hold information about the states of the LEDs in the game. The other list will hold information about how the LEDs are connected to pins on the Arduino. Click next to continue.",
    "Create two lists called <i>board</i> and <i>leds</i> using the <b>set list block</b>.", 
    "Set the previous lists equal to {0, 0, 0, 0, 0, 0, 0, 0, 0} and {3, 5, 6, 2, 7, 10, 4, 8, 9} respectively using the <b>create list with block</b> in <b>Lists</b>."
  ],
  [
    "In order to use the Arduino, we need to tell it what kind of hardware it is dealing with. Some hardware receives information from the Arduino, so the Arduino acts as an output. Other hardware sends information to the Arduino, so the Arduino acts as an input. Click next to continue.",
    "Think about whether an LED sends information to the Arduino or whether an LED receives information from the Arduino.",
    "Set each pinnumber in <i>leds</i> to either input or output using the <b>Pinmode block</b>.",
    "Think about whether a button sends information to the Arduino or whether a button receives information from the Arduino.",
    "Set pin 13 to either input or output using the <b>Pinmode block</b>."
  ],
  [
    "It is important to constantly monitor whether the joystick has been moved. To achieve this, we'll make a function. The movement of the joystick can be divided into an x-direction, i.e. from side to side, and a y-direction, i.e. up and down. Combining these values will tell us where the joystick is located. Click next to continue.",
    "Create a <b>function block</b> called <i>checkJoystickMovement</i> that returns nothing.",
    "Create a variable <i>xAxis</i> that stores the x-coordinate of the joystick by setting it equal to the <b>AnalogRead block</b> in <b>Input/Output</b> with a value of A0.",
    "Create a variable <i>yAxis</i> that stores the y-coordinate of the joystick by setting it equal to the <b>AnalogRead block</b> in <b>Input/Output</b> with a value of A1.",
    "We need to ensure that there is a delay between each joystick movement, otherwise errors may occur. Click next to continue.",
    "Create an <b>if-do block</b> that checks whether the current elapsed time minus <i>joystickTime</i> is greater or equal to 500.",
    "You should be able to use the joystick to navigate up, down, left, and right and move the cursor accordingly across the LED grid. So, we need to check each of these four conditions. Click next to continue.",
    "Create an <b>if-do-elseif-do-elseif-do-elseif-do</b> block using the mutator option.",
    "Check: yAxis is greater than 900 and cursor is not 0 and cursor is not 1 and cursor is not 2",
    "Check: yAxis is smaller than 100 and cursor is not 6 and cursor is not 7 and cursor is not 8",
    "Check: xAxis is greater than 900 and cursor is not 0 and cursor is not 3 and cursor is not 6",
    "Check: xAxis is smaller than 100 and cursor is not 2 and cursor is not 5 and cursor is not 8",
    "In each of the do-parts, do the following things respectively: cursor = cursor - 3, cursor = cursor + 3, cursor = cursor - 1, cursor = cursor + 1",
    "End each of the do-parts with <i>joystickTime = millis()</i> using the <b>code in loop block</b> in <b>Text</b>."
  ],
  [
    "In this level we will implement a function that determines whether the joystick button has been pressed. First, we need to read the pin that the button is connected to. Click next to continue.",
    "Create a <b>function block</b> called <i>checkJoystickPress</i> that returns nothing.",
    "Create a variable called <i>buttonState</i> and set it equal to the <b>DigitalRead block</b> with a value of 13.",
    "This variable <i>buttonState</i> will have a value of 0 if the button is pressed and 1 if it is not. To actually check that it has been pressed, we need to check that it has changed state, i.e. that it was not initially pressed, but is now pressed. Click next to continue.",
    "Create an <b>if-do block</b> that checks if <i>buttonState</i> is 0 and <i>lastButtonState</i> is 1.",
    "Inside the <b>if-do block</b> set the <i>lastButtonState</i> to 0.",
    "In the <i>board</i> list we need to change the state of the LED to indicate which player has pressed the button. Use the <b>in list set block</b> in <b>Lists</b> to set <i>cursor</i> to <i>player</i> in <i>board</i>.",
    "Now it is player 2's turn. Increment <i>player</i> by 1.",
    "We need to make sure that the variable <i>player</i> stays between 1 and 2 and alternates. Create an <b>if-do block</b> that checks if <i>player</i> is greater than 2. If it is, then set <i>player</i> back to 1.",
    "A button can be clicked, but it can also be released. When the button is released, we do not want anything special to happen, but we do want to know that it has happened. Create an <b>if-do block</b> under the previous <b>if-do block</b> that checks if <i>buttonstate</i> is 1 and <i>lastButtonState</i> is 0. If it is, then set <i>lastButtonState</i> to 1."
  ],
  [
    "In this level you will implement a function that determines whether an led is on, off or blinking depending on its state. Click next to continue.",
    "Create a <b>function block</b> called <i>setLed</i> with two parameters, <i>led</i> and <i>state</i>, which returns nothing.",
    "An LED can be in one of three states: 0, 1, or 2, and these are stored in the <i>board</i> list. We must therefore check each of these three states. Click next to continue.",
    "Create an <b>if-do block</b> that checks if <i>state</i> is 0. If it is, then turn <i>led</i> off using the <b>DigitalWrite block</b> in <b>Input/Output</b>.",
    "Create an <b>if-do block</b> that checks if <i>state</i> is 1. If it is, then turn <i>led</i> on.",
    "Create an <b>if-do block</b> that checks if <i>state</i> is 2. If it is, then check if <i>player2Count</i> is above 100. If it is, then turn <i>led</i> on. If it is not, then turn <i>led</i> off."
  ],
  [
    "In this level you will implement a function that determines where and how often the cursor LED blicks. Click next to continue.",
    "Create a <b>function block</b> called <i>setCursor</i> that returns nothing.",
    "Create an <b>if-do-else block</b> that checks if <i>cursorCount</i> is greater than 500. If it is, then turn the LED at the <i>cursor</i> position on. if it is not, then turn it off."
  ],
  [
    "Time to build the main loop. Every Arduino sketch has a main loop that runs continuously. This is where all the functions you have created are called. Click next to continue.",
    "Call the <i>checkJoystickMovement</i> and <i>checkJoystickPress</i> functions.",
    "Next we want to make sure that all the LEDs are lit properly. To do this we need to perform a task on each LED. There are 9 LEDs, so we need a loop that will run 9 times. Click next to continue.",
    "Create a <b>count with block</b> that goes from 0 to 8 inclusive.",
    "We want to set each LED correctly using the <i>setLed</i> function previously created, except for the LED at the <i>cursor</i> position. The light state of the <i>cursor</i> LED is handled seperately. Click next to continue.",
    "Create an <b>if-do block</b> that checks that <i>i</i> (iterator variable) is not equal to the <i>cursor</i>.",
    "Inside this <b>if-do block</b> we call the <i>setLed</i> function.",
    "Set the <i>led</i> parameter equal to the <b>in list get block</b> with the list <i>leds</i> and a value <i>i</i>.",
    "Set the <i>state</i> parameter equal to the <b>in list get block</b> with the list <i>board</i> and a value <i>i</i>.",
    "Outside the <b>count with block</b> call the <i>setCursor</i> function.",
    "Finally, we need some blocks to handle the LED blicking timing. The variable <i>player2Count</i> controls the blinking of the LEDs associated with player 2. The variable <i>cursorCount</i> controls the blinking of the LED associated with the cursor. Click next to continue.",
    "Decrement <i>player2Count</i> by 1. Create an <b>if-do block</b> that checks if <i>player2Count</i> is less than 0. If it is, then set <i>player2Count</i> back to 200.",
    "Decrement <i>cursorCount</i> by 1. Create an <b>if-do block</b> that checks if <i>cursorCount</i> is smaller than 0. If that the case, then set <i>cursorCount</i> back to 1000. "
  ],
  [
    "You are completely done! Connect your Arduino to your computer and click the upload button to upload your code to the Arduino.",
    "If you've followed all the steps correctly, one of the corner LEDs should start blinking."
  ]
];

const simonTitleArray = [
  "Step 1: Define Constants",
  "Step 2: Define Variables",
  "Step 3: Setup Function",
  "Step 4: Main Game Loop",
  "Step 5: Generate Sequence Function",
  "Step 6: Show Sequence Function",
  "Step 7: Play Sequence Function",
  "Step 8: Test the program"
];

const simonArray = [  
  [    
    "Add constant blocks to set the values for the following constants:",
    "<b>VRX_PIN</b>: A0 (analog pin for X-axis joystick input)",
    "<b>VRY_PIN</b>: A1 (analog pin for Y-axis joystick input)",
    "<b>SW_PIN</b>: 2 (digital pin for the switch input)",
    "<b>SIDE_THRESHOLD</b>: 200 (threshold value for joystick side movement)",
    "<b>CENTER</b>: 512 (center position value for joystick)",
    "<b>CENTER_THRESHOLD</b>: 100 (threshold value for joystick center position)",
  ],
  [    
    "Add variable blocks for the following variables:",
    "<b>ledA</b>, <b>ledB</b>, <b>ledC</b>, <b>ledD</b>, <b>ledE</b> (digital pins for the LEDs)",
    "<b>leds</b> (as a list/array with 5 elements) to store the LED pins",
    "<b>sequence</b> (as a list/array with 100 elements) to store the generated sequence",
    "<b>roundNr</b> (to keep track of the current round number)",
    "<b>waitTime</b> (duration of delay between LED sequence display)",
    "<b>seq</b> (a boolean variable to control the game sequence)",
    "<b>input</b> (to store the joystick input value)",
    "<b>xValue</b> (to store the X-axis joystick input value)",
    "<b>yValue</b> (to store the Y-axis joystick input value)"
  ],
  [    
    "Inside the setup function, add blocks to:",
    "Initialize the random number generator using a Random Seed block with a value of 0",
    "Configure each LED pin as output using a For Loop block iterating over the elements in the leds list/array",
    "Configure the switch pin as input with a pull-up resistor using a Set Pin Mode block for the SW_PIN",
    "Optionally, initialize the serial communication for debugging using a Serial Begin block with a baud rate of 9600"
  ],
  [    
    "Inside the loop function, add blocks to:",
    "Initialize the seq variable to true",
    "Set the roundNr variable to 0",
    "Generate the sequence using a custom generateSequence function",
    "Start a while loop with the condition set to seq",
    "Inside the while loop, add blocks to:",
    "Turn on the last LED (leds[4]) to indicate the player's turn",
    "Wait for the switch button press using a while loop and the digitalRead block for the SW_PIN",
    "Turn off the last LED (leds[4])",
    "Increment the roundNr variable by 1",
    "Show the generated sequence using a custom showSequence function",
    "Play the sequence entered by the player using a custom playSequence function",
    "End the while loop"
  ],
  [    
    "Create a custom function named generateSequence that fills the sequence array with random numbers between 0 and 3 using a for loop"
  ],
  [    
    "Create a custom function named showSequence that iterates over the sequence array up to roundNr and:",
    "Displays the LED sequence by turning on and off the corresponding LEDs with delays between each step"
  ],
  [    
    "Create a custom function named playSequence that iterates over the sequence array up to roundNr and:",
    "Waits for the player to input the correct sequence by monitoring the joystick input values and comparing them to the thresholds",
    "Displays the corresponding LED when a valid input is detected",
    "Checks if the player's input matches the sequence, and if not, sets seq to false to end the game"
  ],
  [    
    "Connect your microcontroller board to power or upload the Blockly code to the board.",
    "The LEDs should light up and the cursor LED should blink according to the specified conditions."
  ]
];

const imgArray = [
  "../../media/mascotType.png",
  //"../../media/mascotDenied.png",
  "../../media/mascotConfused.png",
]


function pickSimonSays() {
  levelAdjustment("simon");
}

function pickTicTacToe() {
  levelAdjustment("tic");
}

function levelAdjustment(type) {
  currentItem = -1;
  currentLvl = 0;
  document.getElementById("startingScreen").remove();
  if (type == "simon") {
    titleArray = simonTitleArray;
    contentArray = simonArray;
  } else if (type == "tic") {
    titleArray = ticTitleArray;
    contentArray = ticArray;
  }
}

function toNextItem() {
  getValues();

  var lengthCurrentLvl = contentArray[currentLvl].length - 1;
  var lengthLvl = titleArray.length - 1;
  if (currentItem == 0){
    previousButton.style.visibility = "visible";
  }

  if (currentItem != lengthCurrentLvl) {
    levelFinish = false;
    currentItem++;
    menuTitle.innerHTML = "<b>" + titleArray[currentLvl] + "</b>";
    levelText.innerHTML =  contentArray[currentLvl][currentItem];
  }
  else if (currentLvl == lengthLvl && currentItem == lengthCurrentLvl) {
    moveBar();
    nextButton.innerHTML = "Finish";
    nextButton.setAttribute("onclick", "reloadPage()");
    gameFinish = true;
    playSoundGameDone();
    levelDiv.style.backgroundColor = "#2ecc71";
    menuTitle.innerHTML = "<b>Game complete!</b>";
    levelText.innerHTML =  "Congratulations! You have completed the game! Click on <b>Finish</b> to return to the home page."
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    setTimeout(fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    }), 1000); 
  }
  else {
    levelFinish = true;
    moveBar();
    playSoundLevelDone();
    levelDiv.style.backgroundColor = "#2ecc71";
    nextButton.style.visibility = "hidden";
    menuTitle.innerHTML = "<b>Level " + (currentLvl + 1) + " complete!</b>";
    levelText.innerHTML =  "Congratulations! You have completed <b>level " + (currentLvl + 1) + "</b>! Click on <b>level " + (currentLvl + 2) + "</b> in the level bar to move to the next."
    
    mascot.src = "../../media/mascotHappy.png"
    mascot.nextElementSibling.innerHTML = "<i> Good job! </i>";

    currentLvlDiv = document.getElementById("lvl-" + (currentLvl + 1));
    currentLvlDiv.nextElementSibling.style.cursor = "pointer";
    currentLvlDiv.nextElementSibling.style.pointerEvents = "all";
    removeHoverEffect(currentLvlDiv.nextElementSibling);
    currentLvlDiv.nextElementSibling.addEventListener("mouseover", applyHoverEffect());
    currentLvlDiv.nextElementSibling.addEventListener("mouseout", removeHoverEffect());
    currentLvl++;
  }
  mascotChanger();
}

function applyHoverEffect(thisItem) {
  thisItem.classList.add("hover-effect");
  thisItem.classList.remove("non-hover");
}

function removeHoverEffect(thisItem) {
  thisItem.classList.remove("hover-effect");
  thisItem.classList.add("non-hover");
}

function toPreviousItem() {
  getValues();

  if (levelFinish == true) {
    //currentLvl--;
    currentItem = contentArray[currentLvl].length;
  }
  if (!(currentItem <= 0) || levelFinish == true) {
    levelFinish = false;
    currentItem--;
    menuTitle.innerHTML = "<b>" + titleArray[currentLvl] + "</b>";
    levelText.innerHTML =  contentArray[currentLvl][currentItem];
  }
  if (currentItem == 0) {
    previousButton.style.visibility = "hidden";
  }
  if (currentItem == contentArray[currentLvl].length - 1) {
    nextButton.style.visibility = "visible";
    levelDiv.style.backgroundColor = "#008184";
  }
} 

function levelClick(e){
  getValues();
  var levelTarget = e;
  currentItem = -1;
  currentLvl = levelTarget.innerHTML - 1;

  previousButton.style.visibility = "hidden";
  nextButton.style.visibility = "visible";
  levelDiv.style.backgroundColor = "#008184";
  toNextItem();
}


function mascotChanger(){
  getValues();

  var randomImg = Math.floor(Math.random() * (imgArray.length - 0) + 0);

  if (currentItem == 0 && currentLvl == 0) {
    mascot.src = "../../media/mascot.png"
    mascot.nextElementSibling.innerHTML = "<i> Let's get started! </i>";
  }
  else if (currentItem == 0) {
    mascot.src = "../../media/mascot.png"
    mascot.nextElementSibling.innerHTML = "<i> Let's get going to the next level!</i>";
  }
  else if (gameFinish == true) {
    mascot.src = "../../media/mascotFinish.png"
    mascot.nextElementSibling.innerHTML = "<i> Congrats! </i>";
  }
  else {
    mascot.src = imgArray[randomImg];
    mascot.nextElementSibling.innerHTML = "<i> ... </i>";
  }
}

function reloadPage() {
  location.reload();
};

/*
function loadXMLLvl() {
  var xml = Blockly.Xml.textToDom("../../examples/Tic Tac Toe v2.xml");
  Blockly.mainWorkspace.clear();
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
}
*/