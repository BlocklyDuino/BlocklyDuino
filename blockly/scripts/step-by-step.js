function move() {
    var button = document.getElementById("progressButton")
    button.disabled = true;
    button.style.backgroundColor = "#a55a19";
    
    var bar = document.getElementById("progressBar");   
    var width = 0;
    var id = setInterval(frame, 50);
    
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        button.disabled = false;
        button.style.backgroundColor = "#e67e22";
      } else {
        bar.style.backgroundColor = "#008184";
        width++; 
        bar.style.width = width * 0.98 + '%'; 
        bar.innerHTML = width * 1  + '%';
      }
      if (width > 0) {
        bar.style.color = "white";
      }
    }
  }