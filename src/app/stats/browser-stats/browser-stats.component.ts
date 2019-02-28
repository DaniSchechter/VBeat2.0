import { Component, OnInit, NgZone } from '@angular/core';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-browser-stats',
  templateUrl: './browser-stats.component.html',
  styleUrls: ['./browser-stats.component.css']
})
export class BrowserStatsComponent implements OnInit {
  browserData = {
  	'Chrome': 0,
	'Firefox': 1,
	'Edge': 3
  };
 
  constructor(private statService: StatsService,
    private zone:NgZone) { }

  ngOnInit() {
  	this.statService.getBrowserData(this.onBrowserDataReceived.bind(this));
  }

  onBrowserDataReceived(data, error) {
  	if(error != null) {
  		console.error('unable to receive browser data', error);
  		return;
  	}
    this.zone.run(() => {
      this.browserData = data; 
    });
  }

}
