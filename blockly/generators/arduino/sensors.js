Blockly.Arduino.temp_TMP36 = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var dropdown_unit = this.getFieldValue('Unit');
  if (dropdown_unit == 'Celcius') {
    var code = '(((analogRead(' + dropdown_pin + ') * 5.0) / 1024.0) - 0.5) * 100';
  } else {
    var code = '(((((analogRead(' + dropdown_pin + ') * 5.0) / 1024.0) - 0.5) * 100) * 9.0 / 5.0) + 32.0';
  } 
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
