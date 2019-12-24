import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherCardComponent } from './weather-card/weather-card.component';
import { DataService } from './data.service';
import { ResultsTabComponent } from './results-tab/results-tab.component';
import { ChartsModule } from 'ng2-charts';
import {Pipe, PipeTransform} from "@angular/core";
 
@Pipe({name: 'round'})
export class RoundPipe implements PipeTransform {
    /**
     *
     * @param value
     * @returns {number}
     */
    transform(value: number): number {
        return Math.round(value);
    }
}

@NgModule({
  declarations: [
    AppComponent,
    WeatherCardComponent,
    ResultsTabComponent,
    RoundPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    HttpClientModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    ChartsModule,
    MatDialogModule,
    MatNativeDateModule,
    NgbModule
  ],
  exports: [],
  bootstrap: [AppComponent],
  providers: [ DataService ],
  entryComponents: [ResultsTabComponent]
})

export class AppModule { }
