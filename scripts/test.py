import serial
import time
ser = serial.Serial("/dev/ttyAMA0", baudrate=9600,timeout=1)
ser.flushInput()
ser.write("\x72\x10\xee\x01\x09\x98\x63\x81\x42\x01\x42\x80\x00\x19\x01\x15")
time.sleep(0.5)
read = ser.read(16)
moehre = read.encode('hex')[0:32]
#print int(moehre,16) * 130.0 / 16384.0
print (moehre)
ser.close()