var width = 0;
function moveBar() {
    var bar = document.getElementById("progressBar");   

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
    currentItem = 0;
    currentLvl = 0;
    document.getElementById("startingScreen").remove()
  }
}

function toNextItem() {
  var menuTitle = document.getElementById("menuTitle");
  var levelText = document.getElementById("panelText");
  var levelDiv = document.getElementById("panel");
  var mascot = document.getElementById("mascot");

  var lengthCurrentLvl = ticArray[currentLvl].length - 1;
  if (currentItem != lengthCurrentLvl) {
    currentItem++;
    menuTitle.innerHTML = "<b>" + ticTitleArray[currentLvl] + "</b>";
    levelText.innerHTML =  ticArray[currentLvl][currentItem];
  }
  else {
    //help beow doesnt work
    levelDiv.backgroundColor = "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)";
    menuTitle.innerHTML = "<b>Level " + (currentLvl + 1) + " complete!</b>";
    levelText.innerHTML =  "Congratulations! You have completed <b>level " + (currentLvl + 1) + "</b>! Click on <b>level " + (currentLvl + 2) + "</b> in the level bar to move to the next."
    
    mascot.src = "../../media/mascotHappy.png"
    mascot.nextElementSibling.innerHTML = "<i> Good job! </i>";

    currentLvl++;
    currentItem = -1;
    //disable button temporarily
  }
}

function toPreviousItem() {
  var menuTitle = document.getElementById("menuTitle");
  var levelText = document.getElementById("panelText");
  
  var lengthCurrentLvl = ticArray[currentLvl].length - 1;
  if (currentItem < 0) {
    currentItem--;
    menuTitle.innerHTML = "<b>" + ticTitleArray[currentLvl] + "</b>";
    levelText.innerHTML =  ticArray[currentLvl][currentItem];
  }
  else {
    currentLvl--;
    currentItem = lengthCurrentLvl;
    //disable button temporarily
  }
}

function levelClick(e){
  var mascot = document.getElementById("mascot");
  var levelTarget = e;
  currentItem = 0;

  switch (levelTarget.innerHTML) {
    case "1":
      currentLvl = 0;
      e.style.backgroundColor = "white";
      e.style.color = "black";
      break;
    case "2":
      currentLvl = 1;
      mascot.src = "../../media/mascotConfused.png"
      mascot.nextElementSibling.innerHTML = "<i> Now doing level 2!</i>";
      e.style.backgroundColor = "white";
      e.style.color = "black";
      break;
    case "3":
      currentLvl = 2;
      mascot.src = "../../media/mascotDenied.png"
      mascot.nextElementSibling.innerHTML = "<i> You're not allowed here yet! </i>";
      e.style.backgroundColor = "white";
      e.style.color = "black";
      break;
    case "4":
      currentLvl = 3;
      mascot.src = "../../media/mascotConfused.png"
      mascot.nextElementSibling.innerHTML = "<i> I don't know what you are talking about? </i>";
      e.style.backgroundColor = "white";
      e.style.color = "black";
      break;
    case "5":
      currentLvl = 4;
      e.style.backgroundColor = "white";
      e.style.color = "black";
      break;
    case "6":
      currentLvl = 5;
      e.style.backgroundColor = "white";
      e.style.color = "black";
      break;
    case "7":
      currentLvl = 6;
      e.style.backgroundColor = "white";
      e.style.color = "black";
      break;
    case "8": 
      currentLvl = 7;
      e.style.backgroundColor = "white";
      e.style.color = "black";
      break;
  } 
  moveBar();
  toNextItem();
}