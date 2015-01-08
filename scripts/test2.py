import serial
import time
ser = serial.Serial("/dev/ttyAMA0", baudrate=9600,timeout=1)
ser.flushInput()
ser.write("\x72\x07\xee\x00\x04\x00\x6b")
time.sleep(0.5)
read = ser.read(8)
print (read)
ser.close()
