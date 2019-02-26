import { Component, OnInit } from '@angular/core';

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


  constructor() { }

  ngOnInit() {
  }

}
