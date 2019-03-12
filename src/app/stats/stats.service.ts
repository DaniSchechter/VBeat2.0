import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';

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
	
	getMapReduce(){
		return new Promise((resolve, reject) => {
		this.Http.get<{message: string, results: any}>(`${this.base_url}/song/mapreduce`).subscribe(
			res => {
				resolve(res.results);
			},
			error=>{
				console.log(error.error.message);
				reject("Could not dispaly the graph");
			}
		)})
	}
}
