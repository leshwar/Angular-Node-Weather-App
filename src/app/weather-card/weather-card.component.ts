import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup,  FormBuilder,  Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import axios from 'axios';
import { DataService } from "../data.service";


@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.css']
})

export class WeatherCardComponent implements OnInit {
  
  //Controls for Form Fields
  streetControl = new FormControl('', Validators.required);
  cityControl = new FormControl();
  stateControl = new FormControl();
  locationControl = new FormControl();
  searchControl = new FormControl();
  submit_button: boolean;
  hideError: boolean = false;

  //Variables to Set Values of HTTP Requests
  cities_auto = [];
  ip_api_results: any;
  tab_data_results: any;
  geo_code_results: any;
  ip_api_city: any;
  image_data_results: any;
  message: string;

  //Variable to show progress bar
  progress_bar: boolean = false
  fav_clicked: boolean = false;
  result_clicked: boolean = true;

  constructor(private http: HttpClient, private data: DataService) { }

  ngOnInit() {
    this.submit_button = true
    this.data.progressBarBool.subscribe(message => this.progress_bar = message == 'false' ? false : true)
  }

  //Get Results from IpApi URL.
   async ipApi(ip_api_url) {
    try {
      const response = await axios.get(ip_api_url); 
      return response
    } 
    catch (error) {
      console.error(error);
    }
  }

  //Get Lat-Lon Details from Google Geo Code API
  async geoCodeApi() {
    try {
      const address_string = { street : this.streetControl.value, city: this.cityControl.value, state: this.stateControl.value };
      const headers = {
        'Authorization': 'my-auth-token',
        'Content-Type': 'application/json'
      }
      const response = await axios.get('http://elanka-hw8-final.appspot.com/googleGeoCode?street='+this.streetControl.value+'&city= '+this.cityControl.value+'&state='+this.stateControl.value, {
        headers: headers
      })
      return response
    }
    catch (error) {
      console.error(error);
    }
  }

  //Get Final Results from Lat-Lon
  async fetchResultsLatLon(lat, lon) {
    try {
      const search_string = { lat : lat, lon: lon };
      const headers = {
        'Authorization': 'my-auth-token',
        'Content-Type': 'application/json'
      }
      const response = await axios.get('http://elanka-hw8-final.appspot.com/forecast?lat='+lat+'&lon='+lon, {
        headers: headers
      }) 
      return response
    } 
    catch (error) {
      console.error(error);
    }
  }

  //Get Image data after sending State
  async fetchImageData(state_code) {
    try {
      const search_string = { state_code : state_code };
      const headers = {
        'Authorization': 'my-auth-token',
        'Content-Type': 'application/json'
      }
      const response = await axios.get('http://elanka-hw8-final.appspot.com/googleSearchEngine?state_code=' + state_code, {
        headers: headers
      }) 
      return response
    } 
    catch (error) {
      console.error(error);
    }
  }

  //Function gets called when Submit Button is Clicked.
  async onSearch(form: NgForm) {
    //Checkbox is Checked
    this.progress_bar = true;

    //Change to result button on search
    this.data.changeFavButton('false')
    this.result_clicked = true
    this.fav_clicked = false

    if(this.locationControl.value == true) {
      this.data.changeInvalidAddress('False')
      //Calling IP-API to get the Lat Lon values
      var ip_api_url = "http://ip-api.com/json";
      this.ip_api_results = await this.ipApi(ip_api_url)
      
      this.ip_api_city = this.ip_api_results.data.city
      var lat = this.ip_api_results.data.lat
      var lon = this.ip_api_results.data.lon
      var state_code = this.ip_api_results.data.region

      //Setting the City Value using IP-API Data
      this.data.changeCity(this.ip_api_city)

      //Setting the State Value using IP-API Data
      this.data.changeState(state_code)

      //Using the Lat Lon values calling the ForeCast API to get the Results for Tabs
      this.tab_data_results = await this.fetchResultsLatLon(lat, lon)
      console.log(this.tab_data_results.data)

      //Call the function to get the Image Data for 1st Card.
      this.image_data_results = await this.fetchImageData(state_code)

      this.progress_bar = false;

      //console.log(this.image_data_results)
      console.log(this.image_data_results.data.items[0].link)
      this.data.changeURL(this.image_data_results.data.items[0].link)

      //Getting and Setting Results to Data Service
      this.data.currentMessage.subscribe(message => this.message = message)
      console.log(this.message)
      this.data.changeMessage(this.tab_data_results.data)
    }
    //Checkbox is UnChecked
    else {
      //Calling Google Geo Code API to get the Lat-Lon Details from the Address given by User
      this.geo_code_results = await this.geoCodeApi()
      console.log(this.geo_code_results)
      if(this.geo_code_results.data.status == "ZERO_RESULTS") {
        this.progress_bar = false;
        this.data.changeInvalidAddress('True')
      }
      else {
        this.data.changeInvalidAddress('False')
        var lat = this.geo_code_results['data']['results'][0]['geometry']['location']['lat']
        var lon = this.geo_code_results['data']['results'][0]['geometry']['location']['lng']

        //Using the Lat Lon values calling the ForeCast API to get the results for Tabs
        this.tab_data_results = await this.fetchResultsLatLon(lat, lon)
        console.log(this.tab_data_results.data)

        //Setting the City Value using Form Data
        this.data.changeCity(this.cityControl.value)

        //Setting the State Value using IP-API Data
        this.data.changeState(this.stateControl.value)

        //Call the function to get the Image Data for 1st Card.
        this.image_data_results = await this.fetchImageData(this.stateControl.value)
        //console.log(this.image_data_results)
        
        this.progress_bar = false;

        console.log(this.image_data_results.data.items[0].link)
        this.data.changeURL(this.image_data_results.data.items[0].link)

        //Getting and Setting Results to Data Service
        this.data.currentMessage.subscribe(message => this.message = message)
        console.log(this.message)
        this.data.changeMessage(this.tab_data_results.data)
      }
    }
  }
  
  //Function gets called when Current Location Checkbox in checked.
  onLocationChange(checkbox_value: FormControl): void {  
    if(checkbox_value.value == true) {
      this.streetControl.disable()
      this.cityControl.disable()
      this.stateControl.disable()

      this.submit_button = false
      this.cities_auto = []
    }
    else {
      this.streetControl.enable()
      this.cityControl.enable()
      this.stateControl.enable()
      if(this.streetControl.value.length > 0 && this.cityControl.value.length > 0 && this.stateControl.value != '') {
        this.submit_button = false
      }
      else {
        this.submit_button = true
      }
    }
  }

  //Function gets called when User Types in Street Textbox.
  onStreetChange(): void {
    if(this.streetControl.value.length > 0 && this.cityControl.value.length > 0 && this.stateControl.value != '') {
      this.submit_button = false
    }
    if(this.streetControl.value.length == 0 || this.cityControl.value.length == 0 || this.stateControl.value == '') {
      this.submit_button = true
    }
  }

  //Function gets called when User Types in City Textbox.
  onCityChange(city_value: FormControl): void {
    if(this.streetControl.value.length > 0 && this.cityControl.value.length > 0 && this.stateControl.value != '') {
      this.submit_button = false
    }
    if(this.streetControl.value.length == 0 || this.cityControl.value.length == 0 || this.stateControl.value == '') {
      this.submit_button = true
    }
    const headers = new HttpHeaders()
          .set('Authorization', 'my-auth-token')
          .set('Content-Type','application/json');
    
    this.http.get('http://elanka-hw8-final.appspot.com/api/weatherCard/?city='+city_value.value, {
      headers: headers
    }) 
    .subscribe(returnedData => {
      this.cities_auto = []
      console.log(returnedData)
      var json_len = returnedData['predictions'].length;
      for( var i = 0 ; i < json_len; i++) {
         var city = returnedData['predictions'][i]['structured_formatting']['main_text']
         this.cities_auto.push(city)
      }
    });
  }

  //Function to Clear the form Values
  clearForm() {
    this.streetControl.setValue("")
    this.cityControl.setValue("")
    this.stateControl.setValue("")
    this.locationControl.setValue(false)
    
    this.streetControl.enable()
    this.cityControl.enable()
    this.stateControl.enable()
    this.data.changeMessage('dummy_data')
    this.data.changeFavButton('false')
    this.submit_button = true

    //Clearing the Errors in the Form.
    this.cities_auto = []
    this.streetControl.reset()
    this.cityControl.reset()

    //Change to result button on search
    this.data.changeFavButton('false')
    this.result_clicked = true
    this.fav_clicked = false

    this.data.changeInvalidAddress('False')
  }

  showFav() {
    this.data.changeFavButton('true')
    this.result_clicked = false
    this.fav_clicked = true
  }

  showResult() {
    this.data.changeFavButton('false')
    this.result_clicked = true
    this.fav_clicked = false
  }
}


