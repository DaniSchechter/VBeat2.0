import { Component, OnInit } from '@angular/core';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-browser-stats',
  templateUrl: './browser-stats.component.html',
  styleUrls: ['./browser-stats.component.css']
})
export class BrowserStatsComponent implements OnInit {
  browserData = null;
 
  constructor(private statService: StatsService) { }

  ngOnInit() {
  	this.statService.getBrowserData(this.onBrowserDataReceived.bind(this));
  }

  onBrowserDataReceived(data, error) {
  	if(error != null) {
  		console.error('unable to receive browser data', error);
  		return;
  	}
  	this.browserData = data;
  	console.log('received browser data => ', data);
  }

}
