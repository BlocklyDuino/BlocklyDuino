#!/usr/bin/env python3
"""Host simulations, without physical I/O; requires g++ and Pillow."""
from pathlib import Path
import os, subprocess, sys
root=Path(__file__).resolve().parents[1];os.chdir(root)
Path('.test-build/images').mkdir(parents=True,exist_ok=True)
def run(*args): subprocess.run(list(args),check=True)
def compile_run(name,source,*flags):
    binary='.test-build/'+name
    run('g++','-std=c++17','-O2','-Wall','-Wextra',source,'-o',binary,'-Iarduino/libraries/BlocklyMotion/src',*flags)
    run('./'+binary)
for clock_hz in (8000000,16000000):
    compile_run('hardware-pulses-'+str(clock_hz),'tests/motion-tests/hardware.cpp','-DF_CPU='+str(clock_hz)+'UL','-D__AVR_ATmega168__','-D__AVR__','-Itests/music-tests/stubs','-Iarduino/libraries/BlocklyMotion/src','-Iarduino/libraries/BlocklyMusic/src')
compile_run('motion','tests/motion-tests/test.cpp','-Itests/motion-tests/stubs','-Iarduino/libraries/BlocklyMotion/src')
compile_run('music','tests/music-tests/test_music.cpp','-DF_CPU=16000000UL','-D__AVR_ATmega168__','-D__AVR__','-Itests/music-tests/stubs','-Iarduino/libraries/BlocklyMusic/src')
compile_run('sd-music','tests/sd-music-tests/test.cpp','-Itests/sd-music-tests/stubs','-Iarduino/libraries/BlocklySDMusic/src','-Iarduino/libraries/BlocklyMusic/src')
compile_run('polyphonic','tests/sd-music-tests/polyphonic.cpp','-Itests/sd-music-tests/stubs','-Iarduino/libraries/BlocklySDMusic/src','-Iarduino/libraries/BlocklyMusic/src')
compile_run('buffers','tests/buffer-tests/test.cpp','-Itests/buffer-tests/stubs','-Iarduino/libraries/BlocklyBuffers/src')
compile_run('textio','tests/textio-tests/check.cpp','-Itests/textio-tests/stubs','-Iarduino/libraries/BlocklyStorage/src')
compile_run('image-tests','tests/storage-tests/host/image.cpp','-Itests/storage-tests/host','-Iarduino/libraries/BlocklyStorage/src')
run(sys.executable,'tests/storage-tests/host/check_image.py')
run('node','tests/timer-interrupt-tests/check.js')
for freq in (8000000,16000000):
    compile_run('timer-'+str(freq),'.test-build/timer-interrupt-tests/runtime.cpp','-DF_CPU='+str(freq)+'UL')
