import serial
import time
import sys
def split_by_n( seq, n ):
 while seq:
  yield seq[:n]
  seq = seq[n:]

 

preamble = "17a"
id = "1"
line = sys.stdin.readline()

while line:
 #print line,
 #print (int(preamble, 16) + int(id, 16))# + int(line, 16))	
 string_line =  line[0:18]								
 string_list = list(split_by_n(string_line,2))	
 a = map(int,string_list)								 
 print a
 b = hex(a[0])
 print b
 sys.exit("stop")
 line = sys.stdin.readline()