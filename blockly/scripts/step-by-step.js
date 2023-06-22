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
  todo: change lvl-1 to a done colour, move to next level
*/


const ticTitleArray = 
[
  "Step 1: Define the variables",
  "Step 2: Set up the hardware in the <b>setup</b> function",
  "Step 3: Create the main <b>loop</b> in the loop function",
  "Step 4: Implement the <b>checkJoystickMovement</b> function",
  "Step 5: Implement the <b>checkJoystickPress</b> function",
  "Step 6: Implement the <b>setLed</b> function",
  "Step 7: Implement the <b>setCursor</b> function",
  "Step 8: Test the program"

];

const ticArray = [
  [
    "Create a variable block for <b>buttonPin</b> and set its value to 13.",
    "Create variable blocks for <b>xPin</b> and <b>yPin</b> and set their values to 0 and 1, respectively.",
    "Create a list variable block for <b>board</b> and set its initial values to {0, 0, 0, 0, 0, 0, 0, 0, 0}.",
    "Create a list variable block for <b>leds</b> and set its initial values to {3, 5, 6, 2, 7, 10, 4, 8, 9}.",
    "Create a variable block <b>for cursor</b> and set its initial value to 0.",
    "Create variable blocks for the timing variables (<b>prevTime</b>, <b>joyStickTime</b>, <b>player2Count</b>, and <b>cursorCount</b>).",
    "Create variable blocks for <b>lastButtonState</b> and <b>player</b> and set their initial values to 1."
  ],
  [
    "Create a <b>setup</b> block.",
    "Inside the <b>setup</b> block, use a loop block to iterate over the <b>leds</b> list variable and set each pin as an output using the <b>pinMode</b> function block.",
    "Use the <b>pinMode</b> function block to set the <b>buttonPin</b> as an input with pull-up resistor."
  ],
  [
    "Create a <b>loop</b> block.",
    "Inside the <b>loop</b> block, use function call blocks to call the <b>checkJoystickMovement</b> and <b>checkJoystickPress</b> functions.",
    "Use a loop block to iterate over the <b>leds</b> list variable and set the LEDs according to the <b>board</b> values using the <b>setLed</b> function block.",
    "Call the <b>setCursor</b> function block to update the cursor LED.",
    "Use math and comparison blocks to decrement and check the values of <b>player2Count</b> and <b>cursorCount</b>, and reset them if necessary."
  ],
  [
    "Create a function block for <b>checkJoystickMovement</b>.",
    "Inside the function block, read the analog values of <b>xAxis</b> and <b>yAxis</b> using the <b>analogRead</b> function blocks.",
    "Use if-else if blocks with comparison and logical operators to check the joystick position and update the <b>cursor</b> variable accordingly.",
    "Use the <b>Serial.println</b> function block to print the joystick movement direction."
  ],
  [
    "Create a function block for <b>checkJoystickPress</b>.",
    "Inside the function block, read the digital state of the button using the <b>digitalRead</b> function block.",
    "Use if blocks with logical operators to detect button press and release.",
    "Inside the press block, update the <b>lastButtonState</b>, <b>board</b>, and <b>player</b> variables according to the given conditions.",
    "Inside the release block, update the <b>lastButtonState</b> variable."
  ],
  [
    "Create a function block for <b>setLed</b> with input parameters for <b>led</b> and <b>state</b>.",
    "Inside the function block, use if-else if blocks to set the LED brightness based on the <b>state</b> value.",
    "Use the <b>analogWrite</b> function block to control the LED brightness."
  ],
  [
    "Create a function block for <b>setCursor</b>.",
    "Inside the function block, use if-else blocks to determine the cursor LED brightness based on the <b>cursorCount</b> value.",
    "Use the <b>analogWrite</b> function block to control the cursor LED brightness."
  ],
  [
    "Connect your microcontroller board to power or upload the Blockly code to the board.",
    "The LEDs should light up and the cursor LED should blink according to the specified conditions."
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

var currentLvl;
var currentItem;

function pickSimonSays() {
  levelAdjustment("simon");
}

function pickTicTacToe() {
  levelAdjustment("tic");
}


var titleArray;
var contentArray;

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