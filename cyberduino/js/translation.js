// Most of this stuff is reversed engineered from this demo:
// https://blockly-demo.appspot.com/static/demos/code/index.html?lang=nb
//
// I'm not ashamed of it, I'm in a hurry!

var translation = (function () {
  var LANGUAGE_NAME = {
    'ar': 'العربية',
    'be-tarask': 'Taraškievica',
    'br': 'Brezhoneg',
    'ca': 'Català',
    'cs': 'Česky',
    'da': 'Dansk',
    'de': 'Deutsch',
    'el': 'Ελληνικά',
    'en': 'English',
    'es': 'Español',
    'et': 'Eesti',
    'fa': 'فارسی',
    'fr': 'Français',
    'he': 'עברית',
    'hrx': 'Hunsrik',
    'hu': 'Magyar',
    'ia': 'Interlingua',
    'is': 'Íslenska',
    'it': 'Italiano',
    'ja': '日本語',
    'ko': '한국어',
    'mk': 'Македонски',
    'ms': 'Bahasa Melayu',
    'nb': 'Norsk Bokmål',
    'nl': 'Nederlands, Vlaams',
    'oc': 'Lenga d\'òc',
    'pl': 'Polski',
    'pms': 'Piemontèis',
    'pt-br': 'Português Brasileiro',
    'ro': 'Română',
    'ru': 'Русский',
    'sc': 'Sardu',
    'sk': 'Slovenčina',
    'sr': 'Српски',
    'sv': 'Svenska',
    'ta': 'தமிழ்',
    'th': 'ภาษาไทย',
    'tlh': 'tlhIngan Hol',
    'tr': 'Türkçe',
    'uk': 'Українська',
    'vi': 'Tiếng Việt',
    'zh-hans': '简体中文',
    'zh-hant': '正體中文'
  };

  function changeLanguage(lang) {
    // Store the blocks for the duration of the reload.
    // This should be skipped for the index page, which has no blocks and does
    // not load Blockly.
    // MSIE 11 does not support sessionStorage on file:// URLs.
    if (typeof Blockly != 'undefined' && window.sessionStorage) {
      var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
      var text = Blockly.Xml.domToText(xml);
      window.sessionStorage.loadOnceBlocks = text;
    }

    var newLang = encodeURIComponent(lang);
    var search = window.location.search;
    if (search.length <= 1) {
      search = '?lang=' + newLang;
    } else if (search.match(/[?&]lang=[^&]*/)) {
      search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
    } else {
      search = search.replace(/\?/, '?lang=' + newLang + '&');
    }

    window.location = window.location.protocol + '//' +
      window.location.host + window.location.pathname + search;
  }

  function getLang() {
    var lang = getStringParamFromUrl('lang', '');
    if (LANGUAGE_NAME[lang] === undefined) {
      // Default to English.
      lang = 'en';
    }
    return lang;
  }

  function setCustomTranslation() {
    console.log(Blockly.Msg);
    var table = [
      // Tab bar
      {id: "tab_blocks", key: Blockly.Msg.CUSTOM_BLOCKS},
      {id: "tab_arduino", key: Blockly.Msg.CUSTOM_ARDUINO},
      {id: "upload_to_arduino", key: Blockly.Msg.CUSTOM_UPLOAD_TO_ARDUINO},
      {id: "reset_arduino", key: Blockly.Msg.CUSTOM_RESET_ARDUINO},
      {id: "reset_sketch", key: Blockly.Msg.CUSTOM_RESET_SKETCH},
      {id: "save_arduino_code", key: Blockly.Msg.CUSTOM_SAVE_ARDUINO_CODE},
      {id: "save_sketch", key: Blockly.Msg.CUSTOM_SAVE_SKETCH},
      {id: "fakeload", key: Blockly.Msg.CUSTOM_FAKELOAD},

      // Side bar
      {id: ":1.label", key: Blockly.Msg.CUSTOM_LOGIC},
      {id: ":2.label", key: Blockly.Msg.CUSTOM_CONTROL},
      {id: ":3.label", key: Blockly.Msg.CUSTOM_MATH},
      {id: ":4.label", key: Blockly.Msg.CUSTOM_TEXT},
      {id: ":5.label", key: Blockly.Msg.CUSTOM_VARIABLES},
      {id: ":6.label", key: Blockly.Msg.CUSTOM_FUNCTIONS},
      {id: ":8.label", key: Blockly.Msg.CUSTOM_INPUT_OUTPUT},
      {id: ":9.label", key: Blockly.Msg.CUSTOM_DIGITAL},
      {id: ":a.label", key: Blockly.Msg.CUSTOM_ANALOG},
      {id: ":b.label", key: Blockly.Msg.CUSTOM_SERIAL},
      {id: ":c.label", key: Blockly.Msg.CUSTOM_TONE},
      {id: ":d.label", key: Blockly.Msg.CUSTOM_LED},
      {id: ":e.label", key: Blockly.Msg.CUSTOM_TUNES},
      {id: ":f.label", key: Blockly.Msg.CUSTOM_OLED}
    ];

    table.forEach(function (t) {
      var element = document.getElementById(t.id);
      if (element) {
        element.innerHTML = t.key;
      } else {
        console.log('Cannot find: ', t.id);
      }
    });
  }

  function loadInitialTranslation(andThen) {
    var translationPath = filepath["msg_" + getStringParamFromUrl('lang', 'en')];
    loadScript(translationPath, function () {
      if (andThen) {
        andThen();
      }
    });
  }

  function init(andThen) {
    // Set the HTML's language and direction.
    document.head.parentElement.setAttribute('lang', getLang());
    loadInitialTranslation(function () {
      setCustomTranslation();

      if (andThen) {
        andThen();
      }
    });
  }

  return {
    changeLanguage: changeLanguage,
    setCustomTranslation: setCustomTranslation,
    init: init
  }
}());