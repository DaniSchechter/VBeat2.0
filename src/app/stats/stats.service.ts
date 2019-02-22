import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private base_url = "http://localhost:3000/api";

  constructor(private Http: HttpClient) { }

  /* gets browser statistics data */
  getBrowserData(onComplete: Function){
  	this.Http.get(this.base_url + "/user/browser").subscribe(
  			// call on complete with no error
  			(responseData) => {
  				onComplete(responseData, null);
  			},
  			// on error call complete with an error
  			(error) => {
  				onComplete(null, error);
  			}
  		);
  }
}
