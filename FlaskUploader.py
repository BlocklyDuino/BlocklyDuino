import os

from flask import Response, Flask, request

app = Flask(__name__)

	

@app.route("/")
def recieveCode():
        return "A"

    





if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port,debug=True)


 
