/* Device card metadata only. Inline SVG artwork uses no remote assets.
 * actions is the flat union of group actions; helper blocks may have no device field.
 * referenceFields contains exceptions to the default DEVICE reference.
 * Storage Flash uses the memory family plus its flash-only erase action.
 * Melodies are reusable data definitions, not additional physical devices.
 */
(function () {
  'use strict';
  window.BlocklyDeviceCatalog = [
  {
    "type": "device_servo",
    "label": "Servo",
    "kind": "servo",
    "registry": "device",
    "hue": 210,
    "color": "#5b80a6",
    "description": "Set the angle of a hobby servo.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"Servo\"><title>Servo</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M42 67v10m8-10v10m8-10v10\" stroke=\"#a76d47\" stroke-width=\"3\"/><rect x=\"27\" y=\"26\" width=\"66\" height=\"40\" rx=\"5\" fill=\"#427cae\"/><path d=\"M28 34H16v12h12m64-12h12v12H92\" fill=\"#30658f\"/><rect x=\"35\" y=\"33\" width=\"49\" height=\"26\" rx=\"2\" fill=\"#5495c6\"/><circle cx=\"60\" cy=\"24\" r=\"9\" fill=\"#c9d7e0\"/><rect x=\"33\" y=\"18\" width=\"54\" height=\"9\" rx=\"4\" fill=\"#e3ebef\"/><circle cx=\"60\" cy=\"23\" r=\"3\" fill=\"#6d8394\"/><text x=\"60\" y=\"51\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"9\" font-weight=\"700\" fill=\"#eaf5ff\">SERVO</text></g></svg>",
    "actions": [
      "device_servo_write"
    ]
  },
  {
    "type": "device_stepper_driver",
    "label": "STEP/DIR stepper",
    "kind": "stepper",
    "registry": "device",
    "hue": 225,
    "color": "#5b6ea6",
    "description": "Move a motor with acceleration through a STEP/DIR driver.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"STEP/DIR stepper\"><title>STEP/DIR stepper</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"33\" cy=\"44\" r=\"22\" fill=\"#7e91a5\"/><circle cx=\"33\" cy=\"44\" r=\"16\" fill=\"#c8d2dc\"/><circle cx=\"33\" cy=\"44\" r=\"6\" fill=\"#566b80\"/><path d=\"M33 44V22\" stroke=\"#344e64\" stroke-width=\"5\"/><rect x=\"68\" y=\"20\" width=\"37\" height=\"48\" rx=\"4\" fill=\"#578970\"/><rect x=\"77\" y=\"31\" width=\"19\" height=\"22\" rx=\"2\" fill=\"#2b3e41\"/><path d=\"M56 35H65M56 47H65M75 25h23M75 62h23\" stroke=\"#d8c582\" stroke-width=\"3\"/><text x=\"86\" y=\"80\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"7\" font-weight=\"700\" fill=\"#4c6375\">STEP / DIR</text></g></svg>",
    "actions": [
      "device_stepper_move",
      "device_stepper_run",
      "device_stepper_setting",
      "device_stepper_position",
      "device_stepper_stop"
    ]
  },
  {
    "type": "device_stepper_coils",
    "label": "28BYJ-48 stepper",
    "kind": "stepper",
    "registry": "device",
    "hue": 225,
    "color": "#5b6ea6",
    "description": "Drive a 28BYJ-48 through ULN2003, with acceleration.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"28BYJ-48 stepper\"><title>28BYJ-48 stepper</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 36H9v18h10m61-18h10v18H80\" stroke=\"#9aaebd\" stroke-width=\"7\" fill=\"none\"/><circle cx=\"49\" cy=\"44\" r=\"28\" fill=\"#9eafb9\"/><circle cx=\"49\" cy=\"44\" r=\"21\" fill=\"#cfd8de\"/><circle cx=\"49\" cy=\"44\" r=\"9\" fill=\"#6d83a2\"/><path d=\"M49 44V21\" stroke=\"#3b5268\" stroke-width=\"5\"/><path d=\"M78 59h18v-8m-18 13h24V48m-24 21h30V45\" fill=\"none\" stroke=\"#c55d61\" stroke-width=\"2\"/><text x=\"49\" y=\"79\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"8\" font-weight=\"700\" fill=\"#465e70\">28BYJ-48</text></g></svg>",
    "actions": [
      "device_stepper_move",
      "device_stepper_run",
      "device_stepper_setting",
      "device_stepper_position",
      "device_stepper_stop"
    ]
  },
  {
    "type": "device_lcd",
    "label": "I2C LCD",
    "kind": "LCD",
    "registry": "device",
    "hue": 125,
    "color": "#5ba661",
    "description": "HD44780 text display with I2C backpack, including 16×2 and 20×4.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"I2C LCD\"><title>I2C LCD</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"8\" y=\"16\" width=\"104\" height=\"52\" rx=\"4\" fill=\"#3c855b\"/><circle cx=\"14\" cy=\"22\" r=\"2\" fill=\"#b9d0a0\"/><circle cx=\"106\" cy=\"62\" r=\"2\" fill=\"#b9d0a0\"/><rect x=\"19\" y=\"24\" width=\"82\" height=\"36\" rx=\"3\" fill=\"#193a30\"/><rect x=\"24\" y=\"29\" width=\"72\" height=\"26\" rx=\"1\" fill=\"#b5d16c\"/><text x=\"60\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"7\" font-weight=\"700\" fill=\"#38522d\">HELLO, WORLD</text><text x=\"60\" y=\"49\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"7\" font-weight=\"700\" fill=\"#38522d\">20 × 4</text><path d=\"M32 68V75\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M40 68V75\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M48 68V75\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M56 68V75\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M64 68V75\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M72 68V75\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M80 68V75\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M88 68V75\" stroke=\"#b5a273\" stroke-width=\"3\"/></g></svg>",
    "actions": [
      "device_lcd_print",
      "device_lcd_clear_row",
      "device_lcd_clear",
      "device_lcd_backlight",
      "device_lcd_create_glyph",
      "device_lcd_show_glyph"
    ]
  },
  {
    "type": "device_oled",
    "label": "OLED · I2C",
    "kind": "OLED",
    "registry": "device",
    "hue": 150,
    "color": "#5ba680",
    "description": "SSD1306 128×32 or 128×64 text display; no framebuffer.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"OLED · I2C\"><title>OLED · I2C</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"15\" y=\"12\" width=\"90\" height=\"58\" rx=\"4\" fill=\"#317aa8\"/><circle cx=\"21\" cy=\"18\" r=\"2\" fill=\"#b8d2e4\"/><circle cx=\"99\" cy=\"18\" r=\"2\" fill=\"#b8d2e4\"/><rect x=\"24\" y=\"20\" width=\"72\" height=\"39\" rx=\"2\" fill=\"#102738\"/><text x=\"60\" y=\"36\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"11\" font-weight=\"700\" fill=\"#89defa\">OLED</text><path d=\"M32 45h17m5 0h9m5 0h18M32 51h8m5 0h20\" stroke=\"#71cce9\" stroke-width=\"2\"/><path d=\"M49.5 70V77\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M56.5 70V77\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M63.5 70V77\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M70.5 70V77\" stroke=\"#b5a273\" stroke-width=\"3\"/><text x=\"60\" y=\"67\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"6\" font-weight=\"700\" fill=\"#eaf5ff\">I2C</text></g></svg>",
    "actions": [
      "device_oled_print",
      "device_oled_clear"
    ]
  },
  {
    "type": "device_oled_spi",
    "label": "OLED · SPI",
    "kind": "OLED",
    "registry": "device",
    "hue": 150,
    "color": "#5ba680",
    "description": "SSD1306 128×64 text display over SPI; no framebuffer.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"OLED · SPI\"><title>OLED · SPI</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"15\" y=\"12\" width=\"90\" height=\"58\" rx=\"4\" fill=\"#317aa8\"/><circle cx=\"21\" cy=\"18\" r=\"2\" fill=\"#b8d2e4\"/><circle cx=\"99\" cy=\"18\" r=\"2\" fill=\"#b8d2e4\"/><rect x=\"24\" y=\"20\" width=\"72\" height=\"39\" rx=\"2\" fill=\"#102738\"/><text x=\"60\" y=\"36\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"11\" font-weight=\"700\" fill=\"#89defa\">OLED</text><path d=\"M32 45h17m5 0h9m5 0h18M32 51h8m5 0h20\" stroke=\"#71cce9\" stroke-width=\"2\"/><path d=\"M39.0 70V77\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M46.0 70V77\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M53.0 70V77\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M60.0 70V77\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M67.0 70V77\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M74.0 70V77\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M81.0 70V77\" stroke=\"#b5a273\" stroke-width=\"3\"/><text x=\"60\" y=\"67\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"6\" font-weight=\"700\" fill=\"#eaf5ff\">SPI</text></g></svg>",
    "actions": [
      "device_oled_print",
      "device_oled_clear"
    ]
  },
  {
    "type": "device_tft",
    "label": "Colour TFT",
    "kind": "TFT",
    "registry": "device",
    "hue": 135,
    "color": "#5ba66e",
    "description": "ST7735 128×160: text, pixels and lines over SPI.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"Colour TFT\"><title>Colour TFT</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"32\" y=\"6\" width=\"57\" height=\"71\" rx=\"4\" fill=\"#397d6c\"/><rect x=\"39\" y=\"13\" width=\"43\" height=\"54\" rx=\"2\" fill=\"#263743\"/><rect x=\"43\" y=\"17\" width=\"35\" height=\"45\" fill=\"#86bad7\"/><path d=\"M43 54l12-17 8 10 6-8 9 15v8H43Z\" fill=\"#377e70\"/><circle cx=\"68\" cy=\"29\" r=\"6\" fill=\"#e2bd67\"/><path d=\"M43 77V82\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M51 77V82\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M59 77V82\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M67 77V82\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M75 77V82\" stroke=\"#b5a273\" stroke-width=\"3\"/><text x=\"60\" y=\"73\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"6\" font-weight=\"700\" fill=\"#eaf5ff\">ST7735</text></g></svg>",
    "actions": [
      "device_tft_print",
      "device_tft_pixel",
      "device_tft_line",
      "device_tft_fill",
      "device_tft_colour",
      "device_tft_rotation"
    ]
  },
  {
    "type": "device_ultrasonic",
    "label": "Distance sensor",
    "kind": "range sensor",
    "registry": "device",
    "hue": 180,
    "color": "#5ba6a6",
    "description": "Measure distance in centimetres with HC-SR04.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"Distance sensor\"><title>Distance sensor</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9\" y=\"24\" width=\"102\" height=\"40\" rx=\"4\" fill=\"#317e9b\"/><circle cx=\"34\" cy=\"44\" r=\"19\" fill=\"#bccad4\"/><circle cx=\"86\" cy=\"44\" r=\"19\" fill=\"#bccad4\"/><circle cx=\"34\" cy=\"44\" r=\"13\" fill=\"#415e70\"/><circle cx=\"86\" cy=\"44\" r=\"13\" fill=\"#415e70\"/><circle cx=\"34\" cy=\"44\" r=\"8\" fill=\"#728f9e\"/><circle cx=\"86\" cy=\"44\" r=\"8\" fill=\"#728f9e\"/><path d=\"M49 64V76\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M56 64V76\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M63 64V76\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M70 64V76\" stroke=\"#b5a273\" stroke-width=\"3\"/><text x=\"60\" y=\"17\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"9\" font-weight=\"700\" fill=\"#426779\">HC-SR04</text></g></svg>",
    "actions": [
      "device_ultrasonic_read"
    ]
  },
  {
    "type": "device_ds18b20",
    "label": "DS18B20 temperature",
    "kind": "temperature bus",
    "registry": "device",
    "hue": 170,
    "color": "#5ba699",
    "description": "One or more temperature sensors on a 1-Wire bus.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"DS18B20 temperature\"><title>DS18B20 temperature</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M43 48V73\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M53 48V73\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M63 48V73\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M34 29c0-23 38-23 38 0v23H34Z\" fill=\"#354754\"/><path d=\"M41 30h24\" stroke=\"#5d707d\" stroke-width=\"2\"/><text x=\"53\" y=\"44\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"7\" font-weight=\"700\" fill=\"#eaf5ff\">18B20</text><path d=\"M89 25v27a8 8 0 1 0 8 0V25a4 4 0 0 0-8 0Z\" fill=\"#d0e1e8\" stroke=\"#568ba3\" stroke-width=\"2\"/><path d=\"M93 34v24\" stroke=\"#cc6b65\" stroke-width=\"3\"/><circle cx=\"93\" cy=\"59\" r=\"4\" fill=\"#cc6b65\"/></g></svg>",
    "actions": [
      "device_ds_request",
      "device_ds_read"
    ]
  },
  {
    "type": "device_dht",
    "label": "DHT sensor",
    "kind": "DHT",
    "registry": "device",
    "hue": 170,
    "color": "#5ba699",
    "description": "Read temperature and humidity from DHT11 or DHT22.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"DHT sensor\"><title>DHT sensor</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"38\" y=\"11\" width=\"44\" height=\"56\" rx=\"4\" fill=\"#649ac0\"/><rect x=\"45\" y=\"18\" width=\"6\" height=\"8\" rx=\"1\" fill=\"#2d668d\"/><rect x=\"45\" y=\"31\" width=\"6\" height=\"8\" rx=\"1\" fill=\"#2d668d\"/><rect x=\"45\" y=\"44\" width=\"6\" height=\"8\" rx=\"1\" fill=\"#2d668d\"/><rect x=\"57\" y=\"18\" width=\"6\" height=\"8\" rx=\"1\" fill=\"#2d668d\"/><rect x=\"57\" y=\"31\" width=\"6\" height=\"8\" rx=\"1\" fill=\"#2d668d\"/><rect x=\"57\" y=\"44\" width=\"6\" height=\"8\" rx=\"1\" fill=\"#2d668d\"/><rect x=\"69\" y=\"18\" width=\"6\" height=\"8\" rx=\"1\" fill=\"#2d668d\"/><rect x=\"69\" y=\"31\" width=\"6\" height=\"8\" rx=\"1\" fill=\"#2d668d\"/><rect x=\"69\" y=\"44\" width=\"6\" height=\"8\" rx=\"1\" fill=\"#2d668d\"/><text x=\"60\" y=\"62\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"7\" font-weight=\"700\" fill=\"#eaf5ff\">DHT</text><path d=\"M44 67V78\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M54 67V78\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M64 67V78\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M74 67V78\" stroke=\"#b5a273\" stroke-width=\"3\"/></g></svg>",
    "actions": [
      "device_dht_read"
    ]
  },
  {
    "type": "device_neopixel",
    "label": "RGB LED strip",
    "kind": "pixels",
    "registry": "device",
    "hue": 325,
    "color": "#a65b87",
    "description": "Set individual WS2812 / NeoPixel colours and brightness.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"RGB LED strip\"><title>RGB LED strip</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"27\" width=\"110\" height=\"31\" rx=\"3\" fill=\"#304d46\"/><path d=\"M9 32h102M9 53h102\" stroke=\"#b4bd92\" stroke-width=\"1\"/><rect x=\"10\" y=\"33\" width=\"18\" height=\"18\" rx=\"2\" fill=\"#e8eddf\"/><circle cx=\"19\" cy=\"42\" r=\"5\" fill=\"#d97881\"/><rect x=\"37\" y=\"33\" width=\"18\" height=\"18\" rx=\"2\" fill=\"#e8eddf\"/><circle cx=\"46\" cy=\"42\" r=\"5\" fill=\"#69bd8e\"/><rect x=\"64\" y=\"33\" width=\"18\" height=\"18\" rx=\"2\" fill=\"#e8eddf\"/><circle cx=\"73\" cy=\"42\" r=\"5\" fill=\"#609ed9\"/><rect x=\"91\" y=\"33\" width=\"18\" height=\"18\" rx=\"2\" fill=\"#e8eddf\"/><circle cx=\"100\" cy=\"42\" r=\"5\" fill=\"#bf81c7\"/><text x=\"60\" y=\"73\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"8\" font-weight=\"700\" fill=\"#567266\">WS2812 / NeoPixel</text></g></svg>",
    "actions": [
      "device_pixels_set",
      "device_pixels_show",
      "device_pixels_clear",
      "device_pixels_brightness"
    ]
  },
  {
    "type": "device_ir_nec",
    "label": "IR receiver",
    "kind": "IR receiver",
    "registry": "device",
    "hue": 10,
    "color": "#a6685b",
    "description": "Read commands from an NEC infrared remote.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"IR receiver\"><title>IR receiver</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M43 51v24m10-24v24m10-24v24\" stroke=\"#a9b5be\" stroke-width=\"3\"/><path d=\"M33 31c0-24 40-24 40 0v25H33Z\" fill=\"#3b4553\"/><ellipse cx=\"53\" cy=\"36\" rx=\"14\" ry=\"17\" fill=\"#192b39\"/><ellipse cx=\"48\" cy=\"30\" rx=\"3\" ry=\"6\" fill=\"#536a7b\"/><path d=\"M84 28q9 10 0 20m9-27q15 17 0 34\" stroke=\"#b86e6c\" stroke-width=\"3\" fill=\"none\"/></g></svg>",
    "actions": [
      "device_ir_command"
    ]
  },
  {
    "type": "device_shift595",
    "label": "74HC595 outputs",
    "kind": "shift register",
    "registry": "device",
    "hue": 60,
    "color": "#a6a65b",
    "description": "Control eight outputs using data, clock and latch.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"74HC595 outputs\"><title>74HC595 outputs</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M25 20V13M25 62v9\" stroke=\"#aab5be\" stroke-width=\"3\"/><path d=\"M35 20V13M35 62v9\" stroke=\"#aab5be\" stroke-width=\"3\"/><path d=\"M45 20V13M45 62v9\" stroke=\"#aab5be\" stroke-width=\"3\"/><path d=\"M55 20V13M55 62v9\" stroke=\"#aab5be\" stroke-width=\"3\"/><path d=\"M65 20V13M65 62v9\" stroke=\"#aab5be\" stroke-width=\"3\"/><path d=\"M75 20V13M75 62v9\" stroke=\"#aab5be\" stroke-width=\"3\"/><path d=\"M85 20V13M85 62v9\" stroke=\"#aab5be\" stroke-width=\"3\"/><path d=\"M95 20V13M95 62v9\" stroke=\"#aab5be\" stroke-width=\"3\"/><rect x=\"18\" y=\"19\" width=\"85\" height=\"44\" rx=\"5\" fill=\"#344652\"/><path d=\"M18 34a7 7 0 0 1 0 14\" fill=\"#182d3d\"/><text x=\"62\" y=\"45\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"#eaf5ff\">74HC595</text></g></svg>",
    "actions": [
      "device_shift595_write"
    ]
  },
  {
    "type": "music_buzzer",
    "label": "Passive buzzer",
    "kind": "buzzer",
    "registry": "music",
    "hue": 285,
    "color": "#935ba6",
    "description": "Play nonblocking notes and melodies; up to three voices.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"Passive buzzer\"><title>Passive buzzer</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M47 66v12m26-12v12\" stroke=\"#a6b6c2\" stroke-width=\"3\"/><path d=\"M31 33v26c0 20 58 20 58 0V33\" fill=\"#334856\"/><ellipse cx=\"60\" cy=\"33\" rx=\"29\" ry=\"22\" fill=\"#536874\"/><ellipse cx=\"60\" cy=\"33\" rx=\"13\" ry=\"10\" fill=\"#162e3d\"/><path d=\"M94 25q8 8 0 16m9-23q13 15 0 30\" stroke=\"#ac79ba\" stroke-width=\"3\" fill=\"none\"/><text x=\"40\" y=\"28\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"10\" font-weight=\"700\" fill=\"#eaf5ff\">+</text></g></svg>",
    "actions": [
      "music_note", "music_note_record",
      "music_pitch",
      "music_midi_pitch",
      "music_rest",
      "music_stop",
      "music_busy",
      "music_melody",
      "music_note_item",
      "music_play",
      "music_update"
    ],
    "groups": [
      {
        "label": "Notes",
        "actions": [
          "music_note", "music_note_record",
          "music_pitch",
          "music_midi_pitch",
          "music_rest",
          "music_stop",
          "music_busy"
        ]
      },
      {
        "label": "Melodies",
        "actions": [
          "music_melody",
          "music_note_item",
          "music_play",
          "music_update"
        ]
      }
    ],
    "referenceFields": {
      "music_play": "BUZZER"
    }
  },
  {
    "type": "st_i2c_eeprom",
    "label": "24LC256 EEPROM",
    "kind": "memory",
    "registry": "storage",
    "hue": 35,
    "color": "#a6875b",
    "description": "32 KB I2C EEPROM for saved values and text.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"24LC256 EEPROM\"><title>24LC256 EEPROM</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M31 28H39M81 28H89\" stroke=\"#acb5bf\" stroke-width=\"4\"/><path d=\"M31 38H39M81 38H89\" stroke=\"#acb5bf\" stroke-width=\"4\"/><path d=\"M31 48H39M81 48H89\" stroke=\"#acb5bf\" stroke-width=\"4\"/><path d=\"M31 58H39M81 58H89\" stroke=\"#acb5bf\" stroke-width=\"4\"/><rect x=\"38\" y=\"17\" width=\"44\" height=\"51\" rx=\"5\" fill=\"#303d4b\"/><path d=\"M53 17a7 7 0 0 0 14 0\" fill=\"#15212e\"/><text x=\"60\" y=\"40\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"8\" font-weight=\"700\" fill=\"#eaf5ff\">24LC256</text><text x=\"60\" y=\"56\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"7\" font-weight=\"700\" fill=\"#c6d9e9\">I2C</text></g></svg>",
    "actions": [
      "st_memory_read",
      "st_memory_write",
      "st_memory_text_read",
      "st_memory_text_write",
      "st_memory_text_stream",
      "st_memory_ok"
    ]
  },
  {
    "type": "st_spi_eeprom",
    "label": "25LC256 EEPROM",
    "kind": "memory",
    "registry": "storage",
    "hue": 35,
    "color": "#a6875b",
    "description": "32 KB SPI EEPROM for saved values and text.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"25LC256 EEPROM\"><title>25LC256 EEPROM</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M31 28H39M81 28H89\" stroke=\"#acb5bf\" stroke-width=\"4\"/><path d=\"M31 38H39M81 38H89\" stroke=\"#acb5bf\" stroke-width=\"4\"/><path d=\"M31 48H39M81 48H89\" stroke=\"#acb5bf\" stroke-width=\"4\"/><path d=\"M31 58H39M81 58H89\" stroke=\"#acb5bf\" stroke-width=\"4\"/><rect x=\"38\" y=\"17\" width=\"44\" height=\"51\" rx=\"5\" fill=\"#303d4b\"/><path d=\"M53 17a7 7 0 0 0 14 0\" fill=\"#15212e\"/><text x=\"60\" y=\"40\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"8\" font-weight=\"700\" fill=\"#eaf5ff\">25LC256</text><text x=\"60\" y=\"56\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"7\" font-weight=\"700\" fill=\"#c6d9e9\">SPI</text></g></svg>",
    "actions": [
      "st_memory_read",
      "st_memory_write",
      "st_memory_text_read",
      "st_memory_text_write",
      "st_memory_text_stream",
      "st_memory_ok"
    ]
  },
  {
    "type": "st_spi_flash",
    "label": "W25Q32 Flash",
    "kind": "memory",
    "registry": "storage",
    "hue": 35,
    "color": "#a6875b",
    "description": "4 MB SPI Flash. Erase a sector before rewriting stored data.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"W25Q32 Flash\"><title>W25Q32 Flash</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M31 28H39M81 28H89\" stroke=\"#acb5bf\" stroke-width=\"4\"/><path d=\"M31 38H39M81 38H89\" stroke=\"#acb5bf\" stroke-width=\"4\"/><path d=\"M31 48H39M81 48H89\" stroke=\"#acb5bf\" stroke-width=\"4\"/><path d=\"M31 58H39M81 58H89\" stroke=\"#acb5bf\" stroke-width=\"4\"/><rect x=\"38\" y=\"17\" width=\"44\" height=\"51\" rx=\"5\" fill=\"#303d4b\"/><path d=\"M53 17a7 7 0 0 0 14 0\" fill=\"#15212e\"/><text x=\"60\" y=\"40\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"8\" font-weight=\"700\" fill=\"#eaf5ff\">W25Q32</text><text x=\"60\" y=\"56\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"7\" font-weight=\"700\" fill=\"#c6d9e9\">SPI FLASH</text><path d=\"M98 26l-7 13h7l-7 16\" stroke=\"#d4a032\" stroke-width=\"3\" fill=\"none\"/></g></svg>",
    "actions": [
      "st_flash_erase",
      "st_memory_read",
      "st_memory_write",
      "st_memory_text_read",
      "st_memory_text_write",
      "st_memory_text_stream",
      "st_memory_ok"
    ]
  },
  {
    "type": "st_sd",
    "label": "SD card",
    "kind": "sd",
    "registry": "storage",
    "hue": 40,
    "color": "#a68d5b",
    "description": "SPI card with FAT16/FAT32: files, streamed images and music.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"SD card\"><title>SD card</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"19\" y=\"25\" width=\"82\" height=\"49\" rx=\"4\" fill=\"#517ba0\"/><rect x=\"31\" y=\"29\" width=\"58\" height=\"39\" rx=\"3\" fill=\"#b4c2cc\"/><path d=\"M44 9h24l11 11v30H44Z\" fill=\"#344a5d\"/><rect x=\"51\" y=\"17\" width=\"19\" height=\"19\" rx=\"1\" fill=\"#e7edf0\"/><text x=\"60\" y=\"29\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"9\" font-weight=\"700\" fill=\"#4f6a7d\">SD</text><path d=\"M41 60h39\" stroke=\"#8296a7\" stroke-width=\"3\"/><path d=\"M37 74V81\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M46 74V81\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M55 74V81\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M64 74V81\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M73 74V81\" stroke=\"#b5a273\" stroke-width=\"3\"/><path d=\"M82 74V81\" stroke=\"#b5a273\" stroke-width=\"3\"/></g></svg>",
    "actions": [
      "st_sd_open",
      "st_sd_print",
      "st_sd_write",
      "st_sd_read",
      "st_sd_byte", "st_sd_read_line",
      "st_sd_seek",
      "st_sd_flush",
      "st_sd_close",
      "st_sd_ok",
      "st_sd_list",
      "st_image_begin",
      "st_image_append_gray",
      "st_image_append_rgb",
      "st_image_gray_pixel",
      "st_image_rgb_pixel",
      "st_image_finish",
      "st_image_ok",
      "st_bmp_stream_create",
      "st_bmp_append_pixel",
      "st_bmp_append_bits",
      "st_bmp_stream_finish",
      "st_bmp_create",
      "st_bmp_pixel",
      "sd_music_start",
      "sd_music_update",
      "sd_music_stop",
      "sd_music_active",
      "sd_music_ok"
    ],
    "groups": [
      {
        "label": "Files",
        "actions": [
          "st_sd_open",
          "st_sd_print",
          "st_sd_write",
          "st_sd_read",
          "st_sd_byte", "st_sd_read_line",
          "st_sd_seek",
          "st_sd_flush",
          "st_sd_close",
          "st_sd_ok",
          "st_sd_list"
        ]
      },
      {
        "label": "Images",
        "actions": [
          "st_image_begin",
          "st_image_append_gray",
          "st_image_append_rgb",
          "st_image_gray_pixel",
          "st_image_rgb_pixel",
          "st_image_finish",
          "st_image_ok"
        ]
      },
      {
        "label": "Compact BMP",
        "actions": [
          "st_bmp_stream_create",
          "st_bmp_append_pixel",
          "st_bmp_append_bits",
          "st_bmp_stream_finish",
          "st_bmp_create",
          "st_bmp_pixel"
        ]
      },
      {
        "label": "Music from SD",
        "actions": [
          "sd_music_start",
          "sd_music_update",
          "sd_music_stop",
          "sd_music_active",
          "sd_music_ok"
        ]
      }
    ]
  },
  {
    "type": "ll_spi_device",
    "label": "Custom SPI device",
    "kind": "SPI",
    "registry": "bus",
    "hue": 200,
    "color": "#5b8da6",
    "description": "Use a chip’s command bytes with one CS, mode and clock setting.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"Custom SPI device\"><title>Custom SPI device</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"23\" y=\"16\" width=\"74\" height=\"52\" rx=\"4\" fill=\"#527da0\"/><rect x=\"44\" y=\"26\" width=\"32\" height=\"30\" rx=\"3\" fill=\"#283f53\"/><path d=\"M7 31H43M76 31h36\" stroke=\"#6e9cae\" stroke-width=\"2\"/><path d=\"M7 41H43M76 41h36\" stroke=\"#bdac72\" stroke-width=\"2\"/><path d=\"M7 51H43M76 51h36\" stroke=\"#8bab91\" stroke-width=\"2\"/><text x=\"60\" y=\"45\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"10\" font-weight=\"700\" fill=\"#eaf5ff\">SPI</text><text x=\"60\" y=\"78\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"6\" font-weight=\"700\" fill=\"#526c82\">CS · SCK · MOSI · MISO</text></g></svg>",
    "actions": [
      "ll_spi_transaction",
      "ll_spi_send",
      "ll_spi_transfer"
    ]
  },
  {
    "type": "ll_i2c_device",
    "label": "Custom I2C device",
    "kind": "I2C",
    "registry": "bus",
    "hue": 190,
    "color": "#5b99a6",
    "description": "Read and write a chip’s protocol using its 7-bit address.",
    "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 84\" role=\"img\" aria-label=\"Custom I2C device\"><title>Custom I2C device</title><g stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"25\" y=\"15\" width=\"70\" height=\"53\" rx=\"4\" fill=\"#4d8394\"/><rect x=\"44\" y=\"27\" width=\"33\" height=\"30\" rx=\"3\" fill=\"#293f51\"/><path d=\"M6 32h37m34 0h37M6 49h37m34 0h37\" stroke=\"#8caf9d\" stroke-width=\"3\"/><text x=\"61\" y=\"46\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"10\" font-weight=\"700\" fill=\"#eaf5ff\">I2C</text><text x=\"60\" y=\"78\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-size=\"7\" font-weight=\"700\" fill=\"#526c82\">SDA · SCL · address</text></g></svg>",
    "actions": [
      "ll_i2c_start",
      "ll_i2c_write",
      "ll_i2c_end",
      "ll_i2c_request",
      "ll_i2c_available",
      "ll_i2c_read",
      "ll_i2c_config"
    ]
  }
];
}());
