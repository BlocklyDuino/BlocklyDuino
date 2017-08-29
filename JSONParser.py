import requests
import json
import re

import os

from flask import Response, Flask, request
errorText="Error"
app = Flask(__name__)
gCityID="1275339"
gAppID="15373f8c0b06b6e66e6372db065c4e46"

	

@app.route("/humidity")
def getHumidity():
        gCityID = request.args.get('id')
        gAppID = request.args.get('appid')
        try:
                
                return getData(gCityID, gAppID, "main.humidity")
        except:
                return errorText
    
@app.route("/temperature")
def getTemperature():
        gCityID = request.args.get('id')
        gAppID = request.args.get('appid')
        try:	
                return getData(gCityID, gAppID, "main.temp")
        except:
                return errorText

@app.route("/weatherDescription")
def getWeatherDescription():
        gCityID = request.args.get('id')
        gAppID = request.args.get('appid')        
        try:	
                return getData(gCityID, gAppID, "weather.main")
        except:
                return errorText
    
    



def getData(lCityID, lAppID, jsontree):
    #requestURL="http://api.openweathermap.org/data/2.5/weather?id=1275339&appid=15373f8c0b06b6e66e6372db065c4e46"
    requestURL="http://api.openweathermap.org/data/2.5/weather?id="+lCityID+"&appid="+lAppID
    filename='jsondata.json'
    response = download_file(requestURL, filename)
    with open(filename) as data_file:    
        data = json.load(data_file)
    splittree=jsontree.split(".")    
    lastLeafIndex = len(splittree) - 1
    #jsontree="main.temp"
    
    for i, leaf in enumerate(splittree):
        if i == lastLeafIndex:
            continue
        else:
           leafDataIndex=0
           result =  re.findall(r'\[([^]]*)\]', leaf)
           if result:
              leafDataIndex=result[0]
              leaf=leaf.replace("["+leafDataIndex+"]","")
              leafDataIndex=int(leafDataIndex)
           #print (leafDataIndex)
        try:        
            data=data[leaf][leafDataIndex]
        except(KeyError):
           try: 
               data=data[leaf]
           except (KeyError):
               return "Error"
               exit()

    leaf=splittree[lastLeafIndex]
    leafDataIndex=0
    result =  re.findall(r'\[([^]]*)\]', leaf)
    if result:
        leafDataIndex=result[0]
        leaf=leaf.replace("["+leafDataIndex+"]","")
        leafDataIndex=int(leafDataIndex)
        #print (data[leaf][leafDataIndex])
    else:
       return str(data[leaf])
   










def download_file(url,filename):
    local_filename = filename
    # NOTE the stream=True parameter
    r = requests.get(url, stream=True)
    with open(local_filename, 'wb') as f:
        for chunk in r.iter_content(chunk_size=1024): 
            if chunk: # filter out keep-alive new chunks
                f.write(chunk)                
    return True



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port,debug=True)


 
