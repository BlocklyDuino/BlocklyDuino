/**
 * Based on
 *
 * Blockly Demos: CodeFactory
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly's Code demo.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var CodeFactory = {};

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
CodeFactory.LANGUAGE_NAME = {
    'ar': 'العربية',
    'ca': 'Català',
    'de': 'Deutsch',
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'ja': '日本語'
};

/**
 * List of RTL languages.
 */
CodeFactory.LANGUAGE_RTL = ['ar', 'fa', 'he'];

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
CodeFactory.getLang = function () {
    var val = location.search.match(new RegExp('[?&]lang=([^&]+)'));
    var lang = val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : '';

    if (CodeFactory.LANGUAGE_NAME[lang] === undefined) {
        // Default to English.
        lang = 'en';
    }
    return lang;
};

/**
 * Is the current language (CodeFactory.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
CodeFactory.isRtl = function () {
    return CodeFactory.LANGUAGE_RTL.indexOf(CodeFactory.LANG) != -1;
};

/**
 * User's language (e.g. "en").
 * @type string
 */
CodeFactory.LANG = CodeFactory.getLang();

/**
 * Initialize the block factory language.
 */
CodeFactory.initLanguageBlockFactory = function () {
    document.title = Blockly.Msg.BF_title;
    document.getElementById('span_factory_preview').innerText = Blockly.Msg.BF_preview;
    document.getElementById('span_factory_help').innerHTML = Blockly.Msg.BF_help;
    document.getElementById('span_BF_divBlocks').innerText = Blockly.Msg.BF_divBlocks;
    document.getElementById('span_BF_divGenerators').innerText = Blockly.Msg.BF_divGenerators;
    
    $("#toolbox_factory").find("category").each(function () {
        $(this).attr('id', $(this).attr('name'));
        $(this).attr('name', Blockly.Msg[$(this).attr('name')]);
    });

};

// Load Factory's language strings.
document.write('<script src="msg/' + CodeFactory.LANG + '.js"></script>\n');
window.addEventListener('load', CodeFactory.initLanguageBlockFactory);
