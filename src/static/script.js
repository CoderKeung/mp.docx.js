function clock() {
  var json = 1;
  var interval = window.setInterval(function(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:4000/meipian/work", true)
    xhr.send();
    xhr.onreadystatechange = function() {
      const json = xhr.responseText;
      console.log(json.toString)
    }
  },100)
}
function start() {
  window.setTimeout(clock, 1000)
}

const btn = document.querySelector("#start")
btn.addEventListener('click', start)
