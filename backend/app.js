const express = require("express");
const bodyParser = require('body-parser');
const app = express();


//Callback funtion for AutoComplete
function getAutoComplete(city_name, callback) {
    const request = require('request');
    var googleAPIKey = 'AIzaSyAZGVwVONZlKUt5oJ-tq273Tx2mU378srQ'
    var googleAutoUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+ city_name +'&types=(cities)&language=en&key='+googleAPIKey 
    console.log(googleAutoUrl)
    request(googleAutoUrl, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            result = JSON.stringify(JSON.parse(body));          
            return callback(result, false);
        } else {            
            return callback(null, error);;
        }
    });
}

//Callback funtion for DarkSky API
function darkSkyApi(darksky_api_url, callback) {
    const request = require('request');
    request(darksky_api_url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            result = JSON.stringify(JSON.parse(body));          
            return callback(result, false);
        } else {            
            return callback(null, error);;
        }
    });
}

//Callback funtion for Google Geo Code API
function googleGeoCodeApi(google_api_url, callback) {
    const request = require('request');
    request(google_api_url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            result = JSON.stringify(JSON.parse(body));          
            return callback(result, false);
        } else {            
            return callback(null, error);;
        }
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

//Allowing CORS Requests
app.use("/*", function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

//Handles POST API Call that comes from Angular JS.
app.get('/api/weatherCard', (req, res, next) => {
    var city_name = req.query.city;
    getAutoComplete(city_name, function(err, data) { 
        if(err) return res.send(err);  
        res.status(200).json({
            message: 'Data fetched Successfully', 
            weather_details: data
        });
    });
});

//Handles POST API Call for Forecast API that comes from Angular JS
app.get('/forecast', (req, res, next) => {
    var lat = req.query.lat;
    var lon = req.query.lon;
    var darksky_api_key = "772090218efb7cbfa01ea469bc55ac2e";
    var darksky_api_url = "https://api.darksky.net/forecast/"+ darksky_api_key +"/" + lat + "," + lon;

    darkSkyApi(darksky_api_url, function(err, data) { 
        if(err) return res.send(err);  
        res.status(200).json({
            message: 'Data fetched Successfully',
            weather_details: data
        });
    });
});


//Handles GET API Call for Google Geocode API that comes from Angular JS
app.get('/googleGeoCode', (req, res, next) => {
    var street = req.query.street;
    var city = req.query.city;
    var state = req.query.state;
    var google_api_key = 'AIzaSyAZGVwVONZlKUt5oJ-tq273Tx2mU378srQ';
    var google_api_url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+street+','+city+','+state+'&key='+google_api_key;

    googleGeoCodeApi(google_api_url, function(err, data) { 
        if(err) return res.send(err);  
        res.status(200).json({
            message: 'Data fetched Successfully',
            weather_details: data
        });
    });
});

//Handles POST API Call to the Dark Sky that comes from Angular JS - Loads Form Modal
app.get('/formmodal', (req, res, next) => {
    var lat = req.query.lat;
    var lon = req.query.lon;
    var time = req.query.timestamp;
    var darksky_api_key = "772090218efb7cbfa01ea469bc55ac2e";
    var darksky_api_url = "https://api.darksky.net/forecast/"+ darksky_api_key +"/"+ lat +","+ lon +","+ time 
    darkSkyApi(darksky_api_url, function(err, data) { 
        if(err) return res.send(err);  
        res.status(200).json({
            message: 'Data fetched Successfully',
            weather_details: data
        });
    });
});

//Handles POST API Call to the Google Search Engine from Angular JS
app.get('/googleSearchEngine', (req, res, next) => {
    var state_code = req.query.state_code;
    var search_engine_id = '017084148988984634333:ar7lnqnfqxe';
    var google_api_key = 'AIzaSyAZGVwVONZlKUt5oJ-tq273Tx2mU378srQ';
    var google_search_engine_url = "https://www.googleapis.com/customsearch/v1?q="+ state_code +"%20State%20Seal&cx="+ search_engine_id +"&imgSize=medium&imgType=news&num=1&searchType=image&key=" + google_api_key;
    darkSkyApi(google_search_engine_url, function(err, data) { 
        if(err) return res.send(err);  
        res.status(200).json({
            message: 'Data fetched Successfully',
            weather_details: data
        });
    });
});

//Normal Call
app.get('/exampleCall', (req, res) => {
    res.set('Content-Type', 'text/html');
    
    var street = ''
    var city = 'New York'
    var state = 'NY';
    var google_api_key = 'AIzaSyAZGVwVONZlKUt5oJ-tq273Tx2mU378srQ';
    var google_api_url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+street+','+city+','+state+'&key='+google_api_key;

    googleGeoCodeApi(google_api_url, function(err, data) { 
        if(err) return res.send(err);  
        res.send(new Buffer(data));
    });
 });

module.exports = app;
