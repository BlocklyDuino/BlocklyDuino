var timerInterval;
var focustimes = "10"
var popupTimeout;

function startTimer() {
    var button = document.getElementById("startBtn")
    var timerElement = document.getElementById('timer');
    var time = 0.0;
    button.disabled = true;
    button.style.backgroundColor = "#a55a19";

    timerInterval = setInterval(function () {
    time += 0.1;
    timerElement.textContent = time.toFixed(1)
    if (time >= focustimes) {
        clearInterval(timerInterval);
        showPopup();
        }
    }, 100);
}

function changeSelect() {
    pausetimes = document.getElementById("pausetime").value;
    focustimes = document.getElementById("focustime").value;
    PaymentRequestUpdateEvent()
}

function showPopup() {
    var popupElement = document.getElementById('popup');
    var pausetimes = document.getElementById("pausetime").value
    playsoundpause();
    var pausetimes = document.getElementById("pausetime").value
    playsoundpause();
    popupElement.style.display = 'block';
    popupTimeout = setTimeout(function () {
    resetTimer();
    hidePopup()
    }, pausetimes)
    hidePopup()
    }, pausetimes)
}

function hidePopup() {
    var popupElement = document.getElementById('popup');
    popupElement.style.display = 'none';
    playsoundfocus();
}

function playsoundpause() {
    var audioElement = new Audio ("testaudiopause.mp3")
    audioElement.play()
    playsoundfocus();
}

function playsoundfocus() {
    var audioElement = new Audio ("testaudiofocus.wav")
    audioElement.play()
}
function playsoundpause() {
    var audioElement = new Audio ("testaudiopause.mp3")
    audioElement.play()
}
function playsoundfocus() {
    var audioElement = new Audio ("testaudiofocus.wav")
    audioElement.play()
}
function resetTimer() {
    var timerElement = document.getElementById('timer');

    ////hidePopup();
    clearInterval(timerInterval);
    clearTimeout(popupTimeout);
    timerElement.textContent = '0.0';
    startTimer();
}