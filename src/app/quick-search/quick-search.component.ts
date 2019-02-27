import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.css']
})
export class QuickSearchComponent implements OnInit {
	searchResults = [{
		name: 'test',
		genre: 'BLUES', 
		song_path: 'http://none',
		image_path: 'http://none',
		release_date: 'http://none',
		artists:['some_object_id'],
		num_of_times_liked: 1
	},
	{
		name: 'test2',
		genre: 'CLASSIC', 
		song_path: 'http://none',
		image_path: 'http://none',
		release_date: 'http://none',
		artists:['some_object_id'],
		num_of_times_liked: 2
	}];

  constructor() { }

  ngOnInit() {
  }

}
