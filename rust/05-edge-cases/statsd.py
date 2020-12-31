import os
import socket
import time

one = (socket.gethostname(),)
two = (socket.gethostname(),socket.gethostname())

messages = [
    # one message
    'users.logins1,host=%s,country=US:1|c' % one,
    # two messages
    'users.logins2,country=US,host=%s:1|c\nusers.registrations2,country=US,host=%s:1|c' % two,
    # trailing newline
    'users.registrations3,host=%s,country=US:1|c\n' % one,
    # empty lines
    'users.logins4,host=%s,country=US:1|c\n\n' % one,
    # \r\n lines
    'users.logins5,country=US,host=%s:1|c\r\nusers.registrations5,country=US,host=%s:1|c\r\n' % two,
    # invalid statsd message
    'users.logins6'
]

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
while 1:
    for message in messages:
        sock.sendto(message.encode('utf8'), ('192.168.1.128', 5001))

    time.sleep(1)

