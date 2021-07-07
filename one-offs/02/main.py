import http.server
from PIL import Image
import io
import time
import os
import signal
import urllib


images = [
    # this will hold the JPEG encoded bytes for image 1
    # then for image2
    # et cetera
]
path = './jpegs/'
# load PNGs and JPEGs, convert to JPEG
for file in os.listdir(path):
    filename = os.fsdecode(path + file)
    if filename.endswith(".jpg") or filename.endswith(".jpeg") or filename.endswith(".png"):
        print('Adding %s' % filename)
        
        img = Image.open(filename)
        bio = io.BytesIO()
        img.save(bio, "JPEG")
        images.append( bio.getvalue() )
    else:
        continue


running = True
def signal_handler(sig, frame):
    global running
    global httpd
    running = False
    print('Exiting ...')
    # this is necessary to stop handling requests (current and new)
    httpd.server_close()

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)


class requestHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *args):
        # Suppress the default behavior of logging every incoming HTTP request to stdout
        return

    def do_GET(self):      
        global images
        global running

        url = urllib.parse.urlparse(self.path)
        path = url.path

        if path == '/' or path == '/index.html':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()

            f = open('public/index.html', 'rb')
            self.wfile.write(f.read())
            f.close()
            return

        elif path == '/streaming.jpeg':
            boundary = 'HI_MULTIPART_BOUNDARY'
            self.send_response(200)
            self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=' + boundary)
            self.end_headers()

            i = 0
            while running:
                for img in images:
                    if not running:
                        break
                    
                    #img = bytes("hi there %d\n" % i, "utf8")
                    print('Sendimg multipart data')

                    try:
                        self.wfile.write( bytes("--%s\r\n" % boundary, "utf8") )
                        self.wfile.write( b"Content-Type: image/jpeg\r\n" )
                        self.wfile.write( bytes("Content-length: %d\r\n\r\n" % len(img), 'utf8') )
                        self.wfile.write(img)
                        self.wfile.flush()
                    except BrokenPipeError as e:
                        print('Socket closed unexpectedly: ' + str(e))
                        return False
                    except ConnectionResetError as e:
                        print('ConnectionResetError: ' + str(e))
                        return False
                    except Exception as e:
                        print('Other exception' + str(e))
                        return False

                    time.sleep(0.2)
                    i += 1
                    
            return


# Since we are keeping the response connections open, we need to handle each
# request in its own thread. Otherwise only 1 request could ever be served
# at a time. The built-in ThreadingHTTPServer does that for us.
httpd = http.server.ThreadingHTTPServer(('0.0.0.0', 8080), requestHandler)
while running:
    httpd.handle_request()

print('All done')