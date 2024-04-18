# Import the dependencies.
from pymongo import MongoClient
from pprint import pprint
from bson import json_util
from flask import Flask, jsonify, render_template
import json
from api_keys import mongo_username,mongo_password
import ssl
import tensorflow as tf
import numpy as np
import pickle

#################################################
# Database Setup
#################################################
connection_string = f"mongodb+srv://{mongo_username}:{mongo_password}@cluster0.9gjuly6.mongodb.net/mydatabase"

# Create the MongoClient instance with SSL/TLS options
mongo = MongoClient(connection_string)

#Assigning our db to a variable  

db = mongo['properties']

#Assigning our collections to a variable

all_houses = db["all_houses"]
leisure_spaces=db['leisure_spaces']
sold_houses = db['sold_houses']
weather_data = db['weather_data']
#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

#1. Main Page + Charts
    #Below I am taking a random index.html file to test
@app.route("/")
def main():
    return (render_template('index.html'))

#2.API Page
    # the below json_util formula came from stack overflow https://stackoverflow.com/questions/16586180/typeerror-objectid-is-not-json-serializable
    
@app.route("/api/v1.0/housing")
def api_data():
    query = {"city":{"$in":['Oshawa','Oakville','Vaughan','Milton','Burlington']}}
    results = all_houses.find(query)
    output = []
    for x in results:
        output.append(x) 
    return jsonify(json.loads(json_util.dumps(output)))
                
@app.route("/api/v1.0/oakville")
def api_oakville():
    query = {"city":'Oakville'}
    results = all_houses.find(query)
    output = []
    for x in results:
        output.append(x) 
    return jsonify(json.loads(json_util.dumps(output)))

@app.route("/api/v1.0/oshawa")
def api_oshawa():
    query = {"city":'Oshawa'}
    results = all_houses.find(query)
    output = []
    for x in results:
        output.append(x) 
    return jsonify(json.loads(json_util.dumps(output)))

@app.route("/api/v1.0/milton")
def api_milton():
    query = {"city":'Milton'}
    results = all_houses.find(query)
    output = []
    for x in results:
        output.append(x) 
    return jsonify(json.loads(json_util.dumps(output)))

@app.route("/api/v1.0/burlington")
def api_burlington():
    query = {"city":'Burlington'}
    results = all_houses.find(query)
    output = []
    for x in results:
        output.append(x) 
    return jsonify(json.loads(json_util.dumps(output)))

@app.route("/api/v1.0/vaughan")
def api_vaughan():
    query = {"city":'Vaughan'}
    results = all_houses.find(query)
    output = []
    for x in results:
        output.append(x) 
    return jsonify(json.loads(json_util.dumps(output)))

@app.route("/api/v1.0/leisure")
def api_leisure():
    query = {}
    results = leisure_spaces.find(query)
    output = []
    for x in results:
        output.append(x) 
    return jsonify(json.loads(json_util.dumps(output)))

@app.route("/api/v1.0/sold-houses")
def api_sold_houses():
    query = {}
    results = sold_houses.find(query)
    output = []
    for x in results:
        output.append(x) 
    return jsonify(json.loads(json_util.dumps(output)))

@app.route("/api/v1.0/weather")
def weather():
    query = {}
    results = weather_data.find(query)
    output = []
    for x in results:
        output.append(x) 
    return jsonify(json.loads(json_util.dumps(output)))

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/api/v1.0/predictions/<lat>/<lon>/<floor>/<beds>/<baths>/<garage>/<price>/<condo>/<det>/<townh>/<other>')
def predictions(lat, lon, floor,beds,baths,garage,price,condo,det,townh,other):
        with open('Scaler.pk1','rb') as f:
            scaler = pickle.load(f)
            new_model = tf.keras.models.load_model('Neural_Network.h5')
            X_new = np.array([int(lat),int(lon),int(floor),int(beds),int(baths),int(garage),int(price),int(condo),int(det),int(townh),int(other)])
            X_new_scaled =  scaler.transform(X_new.reshape(1,11)) #first, we give a random array
            prediction = new_model.predict(X_new_scaled) #now we can
            prediction = np.where(prediction > 0.5,1,0)
            output = [int(i) for i in prediction]
            response = {
                'prediction' :output
            }
            return jsonify(response)        