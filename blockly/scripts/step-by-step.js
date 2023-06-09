var menuTitle;
var levelText;
var levelDiv;
var mascot;
var nextButton;
var previousButton;
var bar;
var lvlFinish;
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
      bar.style.width = width * 9.8 + '%'; 
      bar.innerHTML = width * 10  + '%';
    }
    if (width > 0) {
      bar.style.color = "white";
    }
  }


/* Level system */

/* 
  todo: change lvl-1 to a done colour, move to next
  make end level do smth else
  restrict level clicking
  add sounds
  make mascot be correspondant
  add <b> where needed
  check over colours
  add anim to progressbar?
*/




const ticTitleArray = 
[
  "Step 1: Define the variables",
  "Step 2: Set up the hardware in the <b>setup</b> function",
  "Step 3: Create the main <b>loop</b> in the loop function",
  "Step 4: Implement the checkJoystickMovement function",
  "Step 5: Implement the checkJoystickPress function",
  "Step 6: Implement the setLed function",
  "Step 7: Implement the setCursor function",
  "Step 8: Test the program"

]

const ticArray =
[
  [
    "Create a variable block for <b>buttonPin</b> and set its value to 13.",
    "Create variable blocks for <b>xPin</b> and <b>yPin</b> and set their values to 0 and 1, respectively.",
    "Create a list variable block for <b>board</b> and set its initial values to {0, 0, 0, 0, 0, 0, 0, 0, 0}.",
    "Create a list variable block for <b>leds</b> and set its initial values to {3, 5, 6, 2, 7, 10, 4, 8, 9}.",
    "Create a variable block <b>for cursor</b> and set its initial value to 0.",
    "Create variable blocks for the timing variables (<b>prevTime, joyStickTime, player2Count,</b> and <b>cursorCount<b>).",
    "Create variable blocks for <b>lastButtonState</b> and <b>player</b> and set their initial values to 1."
  ],
  [
    "Create a <b>setup</b> block.",
    "Inside the <b>setup</b> block, use a loop block to iterate over the <b>leds</b> list variable and set each pin as an output using the <b>pinMode</b> function block.",
    "Use the <b>pinMode</b> function block to set the <b>buttonPin</b> as an input with pull-up resistor."
  ],
  [
    "Create a <b>loop</b> block.",
    "Inside the loop block, use function call blocks to call the checkJoystickMovement and checkJoystickPress functions.",
    "Use a loop block to iterate over the leds list variable and set the LEDs according to the board values using the setLed function block.",
    "Call the setCursor function block to update the cursor LED.",
    "Use math and comparison blocks to decrement and check the values of player2Count and cursorCount, and reset them if necessary."
  ],
  [
    "Create a function block for checkJoystickMovement.",
    "Inside the function block, read the analog values of xAxis and yAxis using the analogRead function blocks.",
    "Use if-else if blocks with comparison and logical operators to check the joystick position and update the cursor variable accordingly.",
    "Use the Serial.println function block to print the joystick movement direction."
  ],
  [
    "Create a function block for checkJoystickPress.",
    "Inside the function block, read the digital state of the button using the digitalRead function block.",
    "Use if blocks with logical operators to detect button press and release.",
    "Inside the press block, update the lastButtonState, board, and player variables according to the given conditions.",
    "Inside the release block, update the lastButtonState variable."
  ],
  [
    "Create a function block for setLed with input parameters for led and state.",
    "Inside the function block, use if-else if blocks to set the LED brightness based on the state value.",
    "Use the analogWrite function block to control the LED brightness."
  ],
  [
    "Create a function block for setCursor.",
    "Inside the function block, use if-else blocks to determine the cursor LED brightness based on the cursorCount value.",
    "Use the analogWrite function block to control the cursor LED brightness."
  ],
  [
    "Connect your microcontroller board to power or upload the Blockly code to the board.",
    "The LEDs should light up and the cursor LED should blink according to the specified conditions."
  ]
]

const simonTitleArray = []

const simonArray = []

var currentLvl;
var currentItem;

function pickSimonSays() {
  levelAdjustment("simon");
}

function pickTicTacToe() {
  levelAdjustment("tic");
}

function levelAdjustment(type) {
  if (type == "simon") {
    document.getElementById("startingScreen").remove()
  }
  if (type == "tic") {
    currentItem = -1;
    currentLvl = 0;
    document.getElementById("startingScreen").remove()
  }
}

function toNextItem() {
  getValues();
  
  var lengthCurrentLvl = ticArray[currentLvl].length - 1;
  var lengthLvl = ticTitleArray.length - 1;
  if (currentItem == 0){
    previousButton.style.visibility = "visible";
  }

  if (currentItem != lengthCurrentLvl) {
    levelFinish = false;
    currentItem++;
    menuTitle.innerHTML = "<b>" + ticTitleArray[currentLvl] + "</b>";
    levelText.innerHTML =  ticArray[currentLvl][currentItem];
  }
  else if (currentLvl == lengthLvl && currentItem == lengthCurrentLvl) {
    nextButton.innerHTML = "Finish";
    levelFinish = true;
    levelDiv.style.backgroundColor = "#2ecc71";
    menuTitle.innerHTML = "<b>Game complete!</b>";
    levelText.innerHTML =  "Congratulations! You have completed the game! Click on <b>Finish</b> to return to the home page."
  }
  else {
    levelFinish = true;
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
    currentLvl--;
    currentItem = ticArray[currentLvl].length;
  }
  if (!(currentItem <= 0) || levelFinish == true) {
    levelFinish = false;
    currentItem--;
    menuTitle.innerHTML = "<b>" + ticTitleArray[currentLvl] + "</b>";
    levelText.innerHTML =  ticArray[currentLvl][currentItem];
  }
  if (currentItem == 0) {
    previousButton.style.visibility = "hidden";
  }
  if (currentItem == ticArray[currentLvl].length - 1) {
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
  moveBar();
  toNextItem();
}