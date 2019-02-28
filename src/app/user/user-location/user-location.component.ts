import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-location',
  templateUrl: './user-location.component.html',
  styleUrls: ['./user-location.component.css']
})
export class UserLocationComponent implements OnInit {

  userName: string;
  houseNumber: number;
  streetName: string;
  cityName: string;
  countryName: string;


  //ISHAY: your goal is to update the lat lng to the location of the current connected user. the map will be updated automatically(try to do it in ngOnInit in case that it wont)

  lat = 51.678418;
  lng = 7.809007;
  constructor(private Http: HttpClient) { }

  ngOnInit() {
    //this.findLocation(this.houseNumber, this.streetName, this.cityName, this.countryName);
    this.findLocation(1, 'shaked', 'mishmar hashiva', 'israel');
  }


  //ISHAY:for checking - you can use lines from here and delete it
  findLocation(houseNumber:Number, streetName: string, cityName: string, countryName: string){
    const address: string = houseNumber.toString() + ',' + streetName + ',' + cityName + ',' + countryName;
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyD_SmdSZQy58OQhbGxJN9fi_SbTT2sBVf4';
    this.Http.get<''>(url).subscribe((json) => {
      console.log(json);
    });
  }

}
