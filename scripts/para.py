 # Modul sys wird importiert:
import sys          
import serial
import time

def split_by_n( seq, n ):
    #A generator to divide a sequence into chunks of n units
    while seq:
        yield seq[:n]
        seq = seq[n:]

bar = list(split_by_n(sys.argv[1],2))

if len(sys.argv) != 3:
	print "Wrong # of arguments!"
	sys.exit()
elif len(bar) != 9:
	print "Wrong barcode format!"
	sys.exit()
elif len(sys.argv[2]) != 2:
	print "Wrong ID format!"
	sys.exit()
else:
	id = str(sys.argv[2])
	checksum = hex(int('0x17a', 16)+int('0x'+bar[0], 16)+int('0x'+bar[1], 16)+int('0x'+bar[2], 16)+int('0x'+bar[3], 16)+int('0x'+bar[4], 16)+int('0x'+bar[5], 16)+int('0x'+bar[6], 16)+int('0x'+bar[7], 16)+int('0x'+bar[8], 16) +int('0x'+id, 16))
	n =  len(checksum)-2
	checksum =  checksum[n:]
	telegram = "\\x72\\x10\\xee\\x01\\x09\\x"+bar[0]+"\\x"+bar[1]+"\\x"+bar[2]+"\\x"+bar[3]+"\\x"+bar[4]+"\\x"+bar[5]+"\\x"+bar[6]+"\\x"+bar[7]+"\\x"+bar[8]+"\\x"+sys.argv[2]+"\\x"+checksum

ser = serial.Serial("/dev/ttyAMA0", baudrate=9600,timeout=1)
ser.flushInput()
ser.write(telegram)
time.sleep(0.5)
read = ser.read(16)
moehre = read.encode('hex')[0:32]

antwort =  list (split_by_n(moehre, 2))
print "ID : " + antwort[2]
print "Barcode : " + antwort[5] + " " + antwort[6]  + " " + antwort[7]  + " " + antwort[8] + " " + antwort[9] + " "+ antwort[10] + " "+ antwort[11] + " "+ antwort[12] + " "+ antwort[13]
print antwort
#print checksum
#print telegram