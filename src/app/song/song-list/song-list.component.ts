import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Song, Genre } from '../song.model'
import { Subscription } from 'rxjs';

import { SongService } from '../songs.service';



@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit, OnDestroy {
  selectedSong: Song;
  songs: Song[];
  totalSongs:number = 0;
  songsPerPage:number = 10;
  currentPage:number = 1;
  // pageSizeOptions = [3,4,10];
  private songSub: Subscription;

  constructor(public songsService : SongService) { }

  ngOnInit() {
    // this.songLiked = false;
    this.songsService.getSongs(this.songsPerPage, 1);
    this.songSub = this.songsService.getSongsUpdateListener()
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
    this.songsService.getSongs(this.songsPerPage, this.currentPage);
  }
  

  ngOnDestroy(): void {
    this.songSub.unsubscribe();
  }

}
