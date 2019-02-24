import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SongService } from '../songs.service';
import { PageEvent } from '@angular/material';
import { Song, Genre } from '../song.model'
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-song-search',
  templateUrl: './song-search.component.html',
  styleUrls: ['./song-search.component.css']
})
export class SongSearchComponent implements OnInit {
  selectedSong: Song;
  songs: Song[];
  totalSongs:number = 0;
  songsPerPage:number = 10;
  currentPage:number = 1;
  // pageSizeOptions = [3,4,10];
  private songSub: Subscription;

  constructor(public songService: SongService) { }

  ngOnInit() {
        // this.songLiked = false;
        this.songService.getSongs(this.songsPerPage, 1);
        this.songSub = this.songService.getSearchSongUpdateListener()
        .subscribe((songData: {songs: Song[], totalSongs: number}) => {
          this.totalSongs = songData.totalSongs;
          this.songs = songData.songs;
          this.selectedSong = null;
        })
  }

  onSelectSong(song: Song) {
    this.selectedSong = song;
  }


  onSearch(form: NgForm) {
    const songName = form.value.songName;
    const artistName = form.value.artistName;
    const genreName = form.value.genreName;
    this.songService.searchSong(songName, artistName, genreName, 10, 1);
  }
}
