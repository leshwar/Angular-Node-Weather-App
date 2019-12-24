import { AfterViewInit, Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { DataService } from "../data.service";
import { FormControl } from '@angular/forms';
import * as CanvasJS from '../canvasjs.min';
import axios from 'axios';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-results-tab',
  templateUrl: './results-tab.component.html',
  styleUrls: ['./results-tab.component.css']
})
export class ResultsTabComponent implements OnInit, AfterViewInit {
  
  hourly_select = new FormControl()
  hourlyControl = new FormControl()
  message: any;
  city_fetched: any;
  default_select: any;
  modal_api_results: any;
  state_url: any;
  invalid_address: any;
  myChart: any;
  state_fetched: any;
  

  //Variables to toggle navbar
  show_current: boolean = true;
  show_hourly: boolean = false;
  show_weekly: boolean = false;

  load_bar_chart: boolean;

  //Variables for Charts
  temperature: boolean;
  pressure: boolean;
  humidity: boolean;
  ozone: boolean;
  visibility: boolean;
  windspeed: boolean;

  //Variables for Modal Dialog
  mdlSampleIsOpen : boolean = false;
  modal_date: any;
  modal_city: any;
  modal_temperature: any;
  modal_summary: any;
  modal_precipitation: any;
  modal_chance_of_rain: any;
  modal_wind_speed: any;
  modal_humidity: any;
  modal_visibility: any;
  modal_icon: any;
  favourites_clicked = 'false'
  favourites_data: any;
  temp_split: any;
  ip_api_results: any;
  ip_api_city: any;
  tab_data_results: any;
  image_data_results: any;
  progress_bar: boolean;
  geo_code_results: any;
  city_state_value: any;

  @ViewChild('results_tab', { static: true }) results_tab: ElementRef;
  @ViewChild('modal_button', { static: false }) modal_button: ElementRef;
  @ViewChild('chartContainer', { static: false }) chartContainer: ElementRef;
  @ViewChild('current', { static: false }) current: ElementRef;
  @ViewChild('hourly', { static: false }) hourly: ElementRef;
  @ViewChild('weekly', { static: false }) weekly: ElementRef;

  ngAfterViewInit(): void {
    //console.log(this.results_tab.nativeElement.innerHTML);
  }
  

  ngOnInit() {
    //Getting and Setting Results to Data Service
    this.data.currentMessage.subscribe(message => this.message = message)
    this.data.currentCity.subscribe(message => this.city_fetched = message)
    this.data.currentURL.subscribe(message => this.state_url = message)
    this.data.addressDetails.subscribe(message => this.invalid_address = message)
    this.data.currentState.subscribe(message => this.state_fetched = message)
    this.data.favDetails.subscribe(message => this.favourites_clicked = message)
  }

  //Parameters for Bar Chart
  barChartLabels = [];
  barChartType = 'bar';
  barChartLegend = true;

  barChartData = [{
    data: [], 
    label: '',
    backgroundColor: 'rgba(54, 162, 235, 0.5)',
    borderColor: 'rgba(54, 162, 235, 0.5)',
    hoverBackgroundColor: 'rgba(93, 139, 162, 2)',
    hoverBorderColor: 'rgba(54, 162, 235, 0.5)'
  }];

  //Temperature Chart Options
  tempChartOptions = {
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Times difference from current hour'
        }
      }],
      yAxes: [{
          scaleLabel: {
          display: true,
          labelString: 'Fahrenheit'
        },
        ticks: {
          suggestedMax: 12
        }
      }]
    }
  }

  //Pressure Chart Option
  preChartOptions = {
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Times difference from current hour'
        }
      }],
      yAxes: [{
          scaleLabel: {
          display: true,
          labelString: 'Millibars'
        }
      }]
    }
  }

  //Humidity Chart Options
  humChartOptions = {
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Times difference from current hour'
        }
      }],
      yAxes: [{
          scaleLabel: {
          display: true,
          labelString: '% Humidity'
        }
      }]
    }
  }

  //Ozone Chart Options
  ozoChartOptions = {
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Times difference from current hour'
        }
      }],
      yAxes: [{
          scaleLabel: {
          display: true,
          labelString: 'Dobson Units'
        }
      }]
    }
  }

  //Visibility Chart Options
  visChartOptions = {
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Times difference from current hour'
        }
      }],
      yAxes: [{
          scaleLabel: {
          display: true,
          labelString: 'Miles(Maximum 10)'
        },
        ticks: {
          suggestedMax: 12
        }
      }]
    }
  }

  //Wind Chart Options
  winChartOptions = {
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Times difference from current hour'
        }
      }],
      yAxes: [{
          scaleLabel: {
          display: true,
          labelString: 'Miles per hour'
        }
      }]
    }
  }
  
  constructor(private data: DataService, public dialog: MatDialog) { }

  //Calls the Dark Sky API to fetch results for Form Modal
  async modalCodeAPI(timestamp: any) {
    try {
      let lat = this.message['latitude']
      let lon = this.message['longitude']
      const search_string = { lat : lat, lon: lon, timestamp: timestamp };
      const headers = {
        'Authorization': 'my-auth-token',
        'Content-Type': 'application/json'
      }
      const response = await axios.get('http://elanka-hw8-final.appspot.com/formmodal?lat='+lat+'&lon='+lon+'&timestamp='+timestamp, {
        headers: headers
      }) 
      return response
    } 
    catch (error) {
      console.error(error);
    }
  }

  openDialog() {
    console.log('In openDialog function')
    this.mdlSampleIsOpen = true;
  }
  closeDialog() {
    console.log('In openDialog function')
    this.mdlSampleIsOpen = false;
  }

  //This function is called when Favourite button is Clicked
  saveFav() {
    let city = this.city_fetched
    let state = this.state_fetched
    let state_seal = this.state_url
    let store_value = state_seal + "," + city + "," + state
    var saved_fav = JSON.parse(localStorage.getItem("saved_fav"));
    if(saved_fav == null) saved_fav = [];
    saved_fav.push(store_value)
    localStorage.setItem("saved_fav", JSON.stringify(saved_fav));
    this.checkIfFavSaved()
  }

  //This function is called when Remove Favourite button is Clicked
  remFav() {
    let city = this.city_fetched
    let state = this.state_fetched
    let state_seal = this.state_url
    let store_value = state_seal + "," + city + "," + state
    var saved_fav = JSON.parse(localStorage.getItem("saved_fav"));
    var remove_index = -1
    for(var i = 0; i < saved_fav.length ; i++) {
      console.log(saved_fav[i])
      if(saved_fav[i] == store_value) {
        remove_index = i
      }
    }
    saved_fav.splice(remove_index, 1);
    localStorage.setItem("saved_fav", JSON.stringify(saved_fav));
  }

  setDefaults() {
    this.show_current = true
    this.show_hourly = false
    if(this.chartContainer != undefined) {
      this.chartContainer.nativeElement.style.display = "none";
    }
    if(this.current != undefined) {
      this.current.nativeElement.classList.add('active')
    }
    if(this.hourly != undefined) {
      this.hourly.nativeElement.classList.remove('active')
    }
    if(this.weekly != undefined) {
      this.weekly.nativeElement.classList.remove('active')
    }
    return true
  }

  //This function is called to Set the Variables
  setFavVariable() {
    this.show_current = true
    this.show_hourly = false
    if(this.chartContainer != undefined) {
      this.chartContainer.nativeElement.style.display = "none";
    }
    if(this.current != undefined) {
      this.current.nativeElement.classList.add('active')
    }
    if(this.hourly != undefined) {
      this.hourly.nativeElement.classList.remove('active')
    }
    if(this.weekly != undefined) {
      this.weekly.nativeElement.classList.remove('active')
    }

    if(this.results_tab.nativeElement != null) {
      this.results_tab.nativeElement.style.display = "none";
    }
    this.favourites_data = JSON.parse(localStorage.getItem("saved_fav"))
    if (this.favourites_data == null) {
      return false;
    }
    let list_len = this.favourites_data.length
    if(list_len > 0) {
      return true;
    }
    else {
      return false;
    }
  }
  //This function is used to set the resuts back
  setResultsBack() {
    if(this.results_tab.nativeElement != null) {
      this.results_tab.nativeElement.style.display = "block";
    }
  }

  splitItem(item) {
    this.temp_split = item.split(',');
    return true;
  }

  removeFav(index) {
    var saved_fav = JSON.parse(localStorage.getItem("saved_fav"));
    if(saved_fav == null) saved_fav = [];
    saved_fav.splice(index, 1);
    localStorage.setItem("saved_fav", JSON.stringify(saved_fav));
  }

  checkIfFavSaved() {
    var flag = 0
    let city = this.city_fetched
    let state = this.state_fetched
    var saved_fav = JSON.parse(localStorage.getItem("saved_fav"));
    if(saved_fav !== null) {
      for(var i = 0; i < saved_fav.length; i++) {
        let temp_split = saved_fav[i].split(',');
        if(city == temp_split[1] && state == temp_split[2]) {
          flag = 1
          break
        }
        else {
          flag = 0
        }
      }
    }
    if(flag == 0) {
      return false
    }
    else {
      return true
    }
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
      const response = await axios.get('http://elanka-hw8-final.appspot.com/googleSearchEngine?state_code='+state_code, {
        headers: headers
      }) 
      return response
    } 
    catch (error) {
      console.error(error);
    }
  }
  
  //Get Lat-Lon Details from Google Geo Code API
  async geoCodeApi() {
    try {
      const address_string = { street : '', city: this.city_state_value[1], state: this.city_state_value[2] };
      const headers = {
        'Authorization': 'my-auth-token',
        'Content-Type': 'application/json'
      }
      const response = await axios.get('http://elanka-hw8-final.appspot.com/googleGeoCode?street=&city='+this.city_state_value[1]+'&state='+this.city_state_value[2], {
        headers: headers
      })
      return response
    }
    catch (error) {
      console.error(error);
    }
  }

  async callResults(city_state) {
    this.data.changeProgressBar('true')
    this.city_state_value = city_state.split(',');
    this.favourites_clicked = 'false'
    
    //Calling Google Geo Code API to get the Lat-Lon Details from the Address given by User
    this.geo_code_results = await this.geoCodeApi()
    if(this.geo_code_results.data.status == "ZERO_RESULTS") {
      this.progress_bar = false;
      this.data.changeProgressBar('false')
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
      this.data.changeCity(this.city_state_value[1])

      //Setting the State Value using IP-API Data
      this.data.changeState(this.city_state_value[2])

      //Call the function to get the Image Data for 1st Card.
      this.image_data_results = await this.fetchImageData(this.city_state_value[2])
      //console.log(this.image_data_results)
      
      this.progress_bar = false;
      this.data.changeProgressBar('false')

      console.log(this.image_data_results.data.items[0].link)
      this.data.changeURL(this.image_data_results.data.items[0].link)

      //Getting and Setting Results to Data Service
      this.data.currentMessage.subscribe(message => this.message = message)
      console.log(this.message)
      this.data.changeMessage(this.tab_data_results.data)
    }
    if(this.results_tab.nativeElement != null) {
      this.results_tab.nativeElement.style.display = "block";
    }
  }

  //This function gets called when a bar is clicked.
  async formModal(timestamp, date) {
    this.modal_api_results = await this.modalCodeAPI(timestamp)
    console.log(this.modal_api_results)
    this.modal_date = date
    this.modal_city = this.city_fetched
    this.modal_temperature = this.modal_api_results['data']['currently']['temperature']
    this.modal_summary = this.modal_api_results['data']['currently']['summary']
    //let icons 
    this.modal_precipitation = this.modal_api_results['data']['currently']['precipIntensity'].toFixed(2)
    if(this.modal_precipitation == 0.00) {
      this.modal_precipitation = 0
    }
    this.modal_chance_of_rain = (this.modal_api_results['data']['currently']['precipProbability'] * 100).toFixed()
    this.modal_wind_speed = this.modal_api_results['data']['currently']['windSpeed'].toFixed(2)
    this.modal_humidity = (this.modal_api_results['data']['currently']['humidity'] * 100).toFixed()
    this.modal_visibility = this.modal_api_results['data']['currently']['visibility'].toFixed(2)
    let icon_result = this.modal_api_results['data']['currently']['icon']

    if(icon_result == 'clear-day' || icon_result == 'clear-night') {
      this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png"
    }
    if(icon_result == 'rain') {
      this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png"
    }
    if(icon_result == 'snow') {
      this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png"
    }
    if(icon_result == 'sleet') {
      this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png"
    }
    if(icon_result == 'wind') {
      this.modal_icon = "https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png"
    }
    if(icon_result == 'fog') {
      this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png"
    }
    if(icon_result == 'cloudy') {
      this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png"
    }
    if(icon_result == 'partly-cloudy-day' || icon_result == 'partly-cloudy-night') {
      this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png"
    }    
    this.modal_button.nativeElement.click();
  }
  

  //Canvas.JS Function - Loads the Range bar Graph in Weekly Tab
  canvasFunction() {
    //Getting the data required from Object returned.
    let data_points_array = []
    var x_points = this.message['daily']['data'].length
    for(var i = 0; i < this.message['daily']['data'].length; i++) {
      let time = this.message['daily']['data'][i]['time']
      let full_date = new Date(time*1000);
      var todate = full_date.getDate();
      var tomonth = full_date.getMonth()+1;
      var toyear = full_date.getFullYear();
      var original_date = todate+'/'+tomonth+'/'+toyear;

      let tempLow = Math.round(this.message['daily']['data'][i]['temperatureLow'])
      let tempHigh = Math.round(this.message['daily']['data'][i]['temperatureHigh'])

      let temp_object = { x: x_points, y:[tempLow, tempHigh], label: original_date, timestamp: time, that: this, time_format: original_date }
      x_points--;
      data_points_array.push(temp_object)
    }

		CanvasJS.addColorSet("blueShades",
    [
      '#A1CEED'
    ]);

		let chart = new CanvasJS.Chart("chartContainer",{
      animationEnabled: true,
      dataPointWidth: 12,
      colorSet: "blueShades",
			title:{
				text: "Weekly Weather"
      },
      axisX: {
        title: "Days",
        gridThickness: 0,
      },
      axisY: {
        includeZero: false,
        title: "Temperature in Fahrenheit",
        gridThickness: 0,
        interval: 10,
      },
      legend :{
        verticalAlign: "top",
       },
			data: [{
        type: "rangeBar",
        click: onClick,
        showInLegend: true,
        yValueFormatString: "#0.#",
        indexLabel: "{y[#index]}",
        legendText: "Day wise temperature range",
        toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
				dataPoints : data_points_array
			}]
		});
    chart.render();
    function onClick(event) {
      //Calling the Angular function to take care of next steps.
      event.dataPoint.that.formModal(event.dataPoint.timestamp, event.dataPoint.time_format)
      //alert('Please work')
    }
  }

  //Function gets called when a change happens in the select option in Hourly Tab
  selectItemChange() {
    let select_value = this.hourly_select.value
    
    //If Condition for Temperature
    if(select_value == '' || this.default_select == 1) {
      this.temperature = true;
      this.pressure = false;
      this.humidity = false;
      this.ozone = false;
      this.visibility = false;
      this.windspeed = false;

      select_value = 'temperature'
      this.default_select = 0
      this.barChartLabels = []
      this.barChartData[0].data = []
      this.barChartData[0].label = select_value

      var max_value = -1
      for (var i = 0; i < 24; i++) {
        this.barChartLabels.push(i)
        this.barChartData[0].data.push(this.message['hourly']['data'][i]['temperature'])
        if(this.message['hourly']['data'][i]['temperature'] > max_value) {
          max_value = this.message['hourly']['data'][i]['temperature']
        }
      }
    }

    //If Condition for Pressure
    if(select_value == 'pressure') {
      this.temperature = false;
      this.pressure = true;
      this.humidity = false;
      this.ozone = false;
      this.visibility = false;
      this.windspeed = false;
      
      this.barChartLabels = []
      this.barChartData[0].data = []
      this.barChartData[0].label = select_value
      
      for (var i = 0; i < 24; i++) {
        this.barChartLabels.push(i)
        this.barChartData[0].data.push(this.message['hourly']['data'][i]['pressure'])
      }
    }

    //If Condition for Humidity
    if(select_value == 'humidity') {

      this.temperature = false;
      this.pressure = false;
      this.humidity = true;
      this.ozone = false;
      this.visibility = false;
      this.windspeed = false;

      this.barChartLabels = []
      this.barChartData[0].data = []
      this.barChartData[0].label = select_value
      
      for (var i = 0; i < 24; i++) {
        this.barChartLabels.push(i)
        this.barChartData[0].data.push((this.message['hourly']['data'][i]['humidity'] * 100).toFixed())
      }
    }

    //If Condition for Ozone
    if(select_value == 'ozone') {

      this.temperature = false;
      this.pressure = false;
      this.humidity = false;
      this.ozone = true;
      this.visibility = false;
      this.windspeed = false;

      this.barChartLabels = []
      this.barChartData[0].data = []
      this.barChartData[0].label = select_value
      
      for (var i = 0; i < 24; i++) {
        this.barChartLabels.push(i)
        this.barChartData[0].data.push(this.message['hourly']['data'][i]['ozone'])
      }
    }

    //If Condition for visibility
    if(select_value == 'visibility') {

      this.temperature = false;
      this.pressure = false;
      this.humidity = false;
      this.ozone = false;
      this.visibility = true;
      this.windspeed = false;

      this.barChartLabels = []
      this.barChartData[0].data = []
      this.barChartData[0].label = select_value
      
      for (var i = 0; i < 24; i++) {
        this.barChartLabels.push(i)
        this.barChartData[0].data.push(this.message['hourly']['data'][i]['visibility'])
      }
    }

    //If Condition for Wind speed
    if(select_value == 'windspeed') {

      this.temperature = false;
      this.pressure = false;
      this.humidity = false;
      this.ozone = false;
      this.visibility = false;
      this.windspeed = true;

      this.barChartLabels = []
      this.barChartData[0].data = []
      this.barChartData[0].label = select_value
      
      for (var i = 0; i < 24; i++) {
        this.barChartLabels.push(i)
        this.barChartData[0].data.push(this.message['hourly']['data'][i]['windSpeed'])
      } 
    }
  }

  //Function gets called when Nav Tab is Clicked
  onNavClick(tab_selected: String) {
    if(tab_selected == 'current') {
      this.show_current = true;
      this.show_hourly = false;
      this.show_weekly = false;
      this.chartContainer.nativeElement.style.display = "none";
    }
    if(tab_selected == 'hourly') {
      this.show_current = false;
      this.show_hourly = true;
      this.show_weekly = false;
      this.chartContainer.nativeElement.style.display = "none";
      this.default_select = 1
      this.selectItemChange()
    }
    if(tab_selected == 'weekly') {
      this.show_current = false;
      this.show_hourly = false;
      this.show_weekly = true;
      //Canvas.js
      this.chartContainer.nativeElement.style.display = "block";
      this.canvasFunction()
    }
  }
}