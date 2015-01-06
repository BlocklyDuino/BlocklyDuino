#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# credit: http://sheep.art.pl/Wiki%20Engine%20in%20Python%20from%20Scratch

import BaseHTTPServer, urllib, re, os

class Handler(BaseHTTPServer.BaseHTTPRequestHandler):
    template = u"""<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd"><html><body><h1>Arduino INO web server</h1>To download to an Arduino board connected to this computer, POST to /.</body></html>"""

    def escape_html(self, text):
        """Replace special HTML characters with HTML entities"""
        return text.replace(
            "&", "&amp;").replace(">", "&gt;").replace("<", "&lt;")

    def do_HEAD(self):
        """Send response headers"""
        self.send_response(200)
        self.send_header("content-type", "text/html;charset=utf-8")
        self.end_headers()

    def do_GET(self):
        """Send page text"""
        self.do_HEAD()
        self.wfile.write(self.template)

    def do_POST(self):
        """Save new page text and display it"""
        length = int(self.headers.getheader('content-length'))
        if length:
            text = self.rfile.read(length)
                        
            print "sketch to download: " + text

            # create ino project (if it doesn't exist already)
            os.system("mkdir ino_project")
            os.chdir("ino_project")
            os.system("ino init")
            
            # write to file
            fo = open("src/sketch.ino", "wb")
            fo.write(text + "\n");
            fo.close()

            print "created src/sketch.ino"
            
            # invoke ino to build/download
            # skip_lib_includes is used to avoid "line too long" errors with IDE 1.5.8+
            rc = os.system("ino build --skip_lib_includes")
            if not rc == 0:
                print "ino build returned " + `rc`            
                self.send_response(500)
            else:
                rc = os.system("ino upload")
                if not rc == 0:
                    print "ino upload returned " + `rc`            
                    self.send_response(500)
                else:
                    self.send_response(200)

if __name__ == '__main__':
    print "running local web server at 127.0.0.1:8080..."
    server = BaseHTTPServer.HTTPServer(("127.0.0.1", 8080), Handler)
    server.pages = {}
    server.serve_forever()