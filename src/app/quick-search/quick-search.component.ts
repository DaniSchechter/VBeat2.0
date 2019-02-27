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
		image_path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyoxytt4ywnKXQJdgeZG5Z41Umk92jcWMGB7SGwg_rnO8KKYYP',
		release_date: 'http://none',
		artists:['some_object_id'],
		num_of_times_liked: 1
	},
	{
		name: 'test2',
		genre: 'CLASSIC', 
		song_path: 'http://none',
		image_path: 'https://i.kinja-img.com/gawker-media/image/upload/s--_40CUoZX--/c_fill,f_auto,fl_progressive,g_center,h_264,q_80,w_470/i3x37tdozf9bpui6ssec.jpg',
		release_date: 'http://none',
		artists:['some_object_id'],
		num_of_times_liked: 2
	}];

  constructor() { }

  ngOnInit() {
  }

}
