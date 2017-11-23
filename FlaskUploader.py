import os

from flask import Response, Flask, request,jsonify
from flask_cors import CORS
import platform
import argparse
import logging
app = Flask(__name__)
CORS(app)

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument("--port", dest="port", help="Upload to serial port named PORT", metavar="PORT")
parser.add_argument("--board", dest="board", help="Board definition to use", metavar="BOARD")
parser.add_argument("--command", dest="cmd", help="Arduino command name", metavar="CMD")



	

#@app.route("/upload", methods=['GET','POST'])
def recieveCode():
        #options, args = parser.parse_args()
        compile_args = [get_arduino_command(),"--upload","--port","COM4"]
        #if options.board:
        #        compile_args.extend(["--board",options.board])
        compile_args.append("abc.ino")

        print ("Uploading with %s" % (" ".join(compile_args)))
        
        #return a

#@app.route("/getPorts")
def getPorts():
        data = {"ports":["COM3","COM4"]}
        return jsonify(data)




arduino_cmd = None
def get_arduino_command():
    """Attempt to find or guess the path to the Arduino binary."""
    global arduino_cmd
    if not arduino_cmd:
        if platform.system() == "Darwin":
            arduino_cmd_guesses = ["/Applications/Arduino.app/Contents/MacOS/Arduino"]
        elif platform.system() == "Windows":
            arduino_cmd_guesses = [
                "c:\Program Files\Arduino\Arduino_debug.exe",
                "c:\Program Files\Arduino\Arduino.exe",
                "c:\Program Files (x86)\Arduino\Arduino_debug.exe",
                "c:\Program Files (x86)\Arduino\Arduino.exe"
            ]
        else:
            arduino_cmd_guesses = []

        for guess in arduino_cmd_guesses:
            if os.path.exists(guess):
                logging.info("Found Arduino command at %s", guess)
                arduino_cmd = guess
                break
        else:
            logging.info("Couldn't find Arduino command; hoping it's on the path!")
            arduino_cmd = "arduino"
    return arduino_cmd





    



def do_POST(self):
        options, args = parser.parse_args()

        length = int(self.headers.getheader('content-length'))
        if length:
            text = self.rfile.read(length)
                        
            print ("sketch to upload: " + text)

            dirname = tempfile.mkdtemp()
            sketchname = os.path.join(dirname, os.path.basename(dirname)) + ".ino"
            f = open(sketchname, "wb")
            f.write(text + "\n")
            f.close()

            print ("created sketch at %s" % (sketchname,))

            # invoke arduino to build/upload
            compile_args = [
                options.cmd or get_arduino_command(),
                "--upload",
                "--port",
                options.port or guess_port_name(),
            ]
            if options.board:
                compile_args.extend([
                    "--board",
                    options.board
                ])
            compile_args.append(sketchname)

            print ("Uploading with %s" % (" ".join(compile_args)))
            rc = subprocess.call(compile_args)

            if not rc == 0:
                print ("arduino --upload returned " + rc)                            
                self.send_response(400)
            else:
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
        else:
            self.send_response(400)

recieveCode()

##if __name__ == "__main__":
##        port = int(os.environ.get("PORT", 8080))
##        app.run(host='0.0.0.0', port=port,debug=True)

#print(get_arduino_command())
#print(guess_port_name())
 
