import os
import socket
import time

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
while 1:
    # variation 1
    s = 'users.logins,host=%s,country=US:1|c' % (socket.gethostname(),)
    sock.sendto(s.encode('utf8'), ('192.168.1.128', 5001))

    # variation 2
    s = 'users.logins,cou=US,host=%s:1|c' % (socket.gethostname(),)
    sock.sendto(s.encode('utf8'), ('192.168.1.128', 5001))

    time.sleep(1)