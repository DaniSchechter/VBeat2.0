import { Component, OnInit } from '@angular/core';

import { Song, Genre } from '../song.model'
import { Subscription } from 'rxjs';

import { SongService } from '../songs.service';


@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {
  selectedSong: Song;
  songs: Song[];
  private songSub: Subscription;

  constructor(public songsService : SongService) { }

  ngOnInit() {
    // this.songLiked = false;
    this.songsService.getSongs();
    this.songSub = this.songsService.getSongsUpdateListener()
    .subscribe((songs: Song[]) => {
      this.songs = songs;
    })
  }

  onSelectSong(song: Song) {
    this.selectedSong = song;
  }

  onDelete(songId: string){
    this.songsService.deleteSong(songId);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.songSub.unsubscribe();
  }

}
