var timerInterval;
var focustimes = "10"
var popupTimeout;

function startTimer() {
    var timerElement = document.getElementById('timer');
    var time = 0.0;

    timerInterval = setInterval(function () {
    time += 0.1;
    timerElement.innerText = time.toFixed(1);
    if (time >= focustimes) {
        clearInterval(timerInterval);
        showPopup();
    }
    }, 100);
}

function changeSelect() {
    pausetimes = document.getElementById("pausetime").value;
    focustimes = document.getElementById("focustime").value;
}

function showPopup() {
    var popupElement = document.getElementById('popup');
    var pausetimes = "5000"

    popupElement.style.display = 'block';
    popupTimeout = setTimeout(function () {
    resetTimer();
    }, pausetimes);
}

function hidePopup() {
    var popupElement = document.getElementById('popup');
    popupElement.style.display = 'none';
}

function resetTimer() {
    var timerElement = document.getElementById('timer');

    hidePopup();
    clearInterval(timerInterval);
    clearTimeout(popupTimeout);
    timerElement.textContent = '0.0';
    startTimer();
}