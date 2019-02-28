import { Component, OnInit } from '@angular/core';
import { SongService } from '../song/songs.service';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.css']
})
export class QuickSearchComponent implements OnInit {
	// TODO remove later
	searchResults = []
	constructor(private songService: SongService) { }

	ngOnInit() {
	}


	onEnter(searchQuery){
		this.songService.quickSearch(searchQuery, this.onSearchResults.bind(this));
	}

	onSearchResults(results) {
		this.searchResults = results;
	}
}
