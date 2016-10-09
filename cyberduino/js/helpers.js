/**
 * Guess what, this gets a string parameter from the URL!
 * @param name  The bloody name of the parameter you want, come on!
 * @param defaultValue  If you managed to fail finding a parameter, get this!
 * @returns {string}  A value, either what you were looking for or something else
 */
function getStringParamFromUrl(name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
}

function loadScript(path, andThen) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = 'msg';
  script.src = path;
  var firstScript = document.getElementsByTagName('head')[0].appendChild(script);
  firstScript.parentNode.insertBefore(script, firstScript);
  script.onload = function (e) {
    if (andThen) {
      andThen();
    }
  };
}