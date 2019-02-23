import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { SongService } from '../songs.service';


@Component({
  selector: 'app-song-search',
  templateUrl: './song-search.component.html',
  styleUrls: ['./song-search.component.css']
})
export class SongSearchComponent implements OnInit {

  constructor(public songService: SongService) { }

  ngOnInit() {
  }

  onSearch(form: NgForm) {
    const songName = form.value.songName;
    const artistName = form.value.artistName;
    const genreName = form.value.genreName;
    this.songService.searchSongs(songName, artistName, genreName);
  }

}
