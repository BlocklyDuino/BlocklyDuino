import serial.tools.list_ports
list = serial.tools.list_ports.comports()
for element in list:
    print(element.device)
