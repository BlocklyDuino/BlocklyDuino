## 硬件准备
 
  * 一个ICBrick硬件板
  * 一个USB连接线

##　软件准备

* 安装Arduino
* 安装python
* git clone https://github.com/osokay/BlocklyDuino.git

### 运行

```
  python arduino_web_server.py  --port=COM3
```

  * Window选择   `--port=COM3` (or `--port=/dev/tty.foo` on Linux and Mac);
  * Linux或者Mac : 使用  `--port=/dev/tty.foo` 


## 参考

* 在线的demo [Web](http://blocklyduino.github.io/BlocklyDuino/blockly/apps/blocklyduino/) 
* [demo 1](http://blocklyduino.github.io/BlocklyDuino/blockly/apps/blocklyduino/index.html?url=examples/blink.xml) 点13口灯
* 增加新的demo
* 自 https://github.com/BlocklyDuino  分支
### TODO(还需要改进的)

* 按钮和错误提示中文化、国际化
* 更改为编译服务器,可以调用后台的编译
* 迁移到nodejs
* 在blockly基础上使用 [scratch-blocks](https://github.com/osokay/scratch-blocks) 效果
* 增加更多的模块
* 在Upload时有几率错误,而且reset后基本不会出错.


### License

Copyright (C) 2012~2015 Fred Lin gasolin+blockly@gmail.com

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
