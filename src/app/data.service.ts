import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {
    //Creating a Messge Service
    private messageSource = new BehaviorSubject('dummy_data');
    currentMessage = this.messageSource.asObservable();

    //Creating a Service to Get City from IP-API
    private citySource = new BehaviorSubject('dummy_city');
    currentCity = this.citySource.asObservable();

    //Creating a Service to Get State from IP-API
    private stateSource = new BehaviorSubject('dummy_state');
    currentState = this.stateSource.asObservable();

    //Creating a Service to Get Image URL
    private imageURL = new BehaviorSubject('dummy_img');
    currentURL = this.imageURL.asObservable();

    //Creating a Service to set Invalid Address Error
    private invalidAddress = new BehaviorSubject('False');
    addressDetails = this.invalidAddress.asObservable();

    //Creating a Service to setFav Button
    private favButton = new BehaviorSubject('false');
    favDetails = this.favButton.asObservable();

    //Creating a Service to Call Progress bar
    private progressBar = new BehaviorSubject('false');
    progressBarBool = this.progressBar.asObservable();

    constructor() { }
    
    //Changing the Message text
    changeMessage(message: any) {
        this.messageSource.next(message)
    }

    //Changing the City Data
    changeCity(message: any) {
        this.citySource.next(message)
    }

    //Changing the State Data
    changeState(message: any) {
        this.stateSource.next(message)
    }

    //Changing the URL Data
    changeURL(message: any) {
        this.imageURL.next(message)
    }

    //Changing the Invalid Address Data
    changeInvalidAddress(message: any) {
        this.invalidAddress.next(message)
    }

    //Changing the Favourites Button Data
    changeFavButton(message: any) {
        this.favButton.next(message)
    }

    //Changing the Progress Bar
    changeProgressBar(message: any) {
        this.progressBar.next(message)
    }
}