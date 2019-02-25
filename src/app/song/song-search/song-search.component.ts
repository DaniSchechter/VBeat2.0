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
  songsPerPage:number = 2;
  currentPage:number = 1;
  // pageSizeOptions = [3,4,10];
  private songSub: Subscription;
  songName:string = '';
  artistName:string = '';
  genreName:string = '';

  constructor(public songService: SongService) { }

  ngOnInit() {
        // this.songLiked = false;
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

  onChangePage(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.songsPerPage = pageData.pageSize;
    this.songService.searchSong(this.songName, this.artistName, this.genreName, this.songsPerPage, this.currentPage);
  }

  onSearch(form: NgForm) {
    this.songName = form.value.songName;
    this.artistName = form.value.artistName;
    this.genreName = form.value.genreName;
    this.currentPage = 1;
    this.songService.searchSong(this.songName, this.artistName, this.genreName, this.songsPerPage, this.currentPage);
  }
}
