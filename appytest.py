# Import the dependencies.
from pymongo import MongoClient
from pprint import pprint
from bson import json_util
from flask import Flask, jsonify, render_template, request
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
    return (render_template('landing.html', is_landing=True))

@app.route('/AffordableHousing.html')
def affordablehousing():
    return (render_template('AffordableHousing.html'))

#2.API Page
    # the below json_util formula came from stack overflow https://stackoverflow.com/questions/16586180/typeerror-objectid-is-not-json-serializable

@app.route("/api/v1.0/housing")
def api_data():
    query = {"city":{"$in":['Oshawa','Oakville','Vaughan','Milton','Burlington']}}
    results = all_houses.find(query)
    output = []
    for x in results:
        output.append(x)
    return json.loads(json_util.dumps(output))

@app.route("/api/v1.0/oakville")
def api_oakville():
    query = {"city":'Oakville'}
    results = all_houses.find(query)
    output = []
    for x in results:
        output.append(x)
    return json.loads(json_util.dumps(output))

@app.route("/api/v1.0/oshawa")
def api_oshawa():
    query = {"city":'Oshawa'}
    results = all_houses.find(query)
    output = []
    for x in results:
        output.append(x)
    return json.loads(json_util.dumps(output))

@app.route("/api/v1.0/milton")
def api_milton():
    query = {"city":'Milton'}
    results = all_houses.find(query)
    output = []
    for x in results:
        output.append(x)
    return json.loads(json_util.dumps(output))

@app.route("/api/v1.0/burlington")
def api_burlington():
    query = {"city":'Burlington'}
    results = all_houses.find(query)
    output = []
    for x in results:
        output.append(x)
    return json.loads(json_util.dumps(output))

@app.route("/api/v1.0/vaughan")
def api_vaughan():
    query = {"city":'Vaughan'}
    results = all_houses.find(query)
    output = []
    for x in results:
        output.append(x)
    return json.loads(json_util.dumps(output))

@app.route("/api/v1.0/leisure")
def api_leisure():
    query = {}
    results = leisure_spaces.find(query)
    output = []
    for x in results:
        output.append(x)
    return json.loads(json_util.dumps(output))

@app.route("/api/v1.0/sold-houses")
def api_sold_houses():
    query = {}
    results = sold_houses.find(query)
    output = []
    for x in results:
        output.append(x)
    return json.loads(json_util.dumps(output))

@app.route("/api/v1.0/weather")
def weather():
    query = {}
    results = weather_data.find(query)
    output = []
    for x in results:
        output.append(x)
    return json.loads(json_util.dumps(output))


@app.route("/api/v1.0/find_houses", methods=['GET'])
def find_houses():
    # Extract preTaxIncome from query parameters
    pre_tax_income = request.args.get('preTaxIncome')

    # Extract pagination parameters
    page = request.args.get('page', default=1, type=int)
    page_size = request.args.get('pageSize', default=10, type=int)

    # Validate preTaxIncome
    try:
        pre_tax_income = float(pre_tax_income)
    except (ValueError, TypeError):
        return "Invalid preTaxIncome value", 400

    # Construct query based on preTaxIncome
    query = {"price": {"$lte": pre_tax_income}}

    # Execute query with pagination
    results = all_houses.find(query).skip((page - 1) * page_size).limit(page_size)

    # Convert results to a list
    output = [x for x in results]

    # Return JSON response
    return jsonify(json.loads(json_util.dumps(output)))

@app.route('/api/v1.0/predictions/<lat>/<lon>/<floor>/<beds>/<baths>/<garage>/<price>/<condo>/<det>/<townh>/<other>')
def predictions(lat, lon, floor,beds,baths,garage,price,condo,det,townh,other):
        #http://127.0.0.1:5000/api/v1.0/predictions/-78.891020/43.943300/499/0/1/0/200000/1/0/0/0 test this link
        with open('Scaler.pk1','rb') as f:
            scaler = pickle.load(f)
            new_model = tf.keras.models.load_model('Neural_Network.h5')
            X_new = np.array([float(lat),float(lon),int(floor),int(beds),int(baths),int(garage),int(price),int(condo),int(det),int(townh),int(other)])
            X_new_scaled =  scaler.transform(X_new.reshape(1,11))
            prediction = new_model.predict(X_new_scaled) 
            prediction = np.where(prediction > 0.5,1,0)
            output = [int(i) for i in prediction]
            response = {
                'prediction' :output
            }
            return (jsonify(response)) 

if __name__ == '__main__':
    app.run(debug=True)