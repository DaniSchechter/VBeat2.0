import { Component, OnInit } from '@angular/core';

import { Song, Genre } from '../song.model'
import { Subscription } from 'rxjs';

import { SongService } from '../songs.service';

// TODO connect this to the song service

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
    console.debug("request to get songs");
    this.songsService.getSongs();
    this.songSub = this.songsService.getSongsUpdateListener()
    .subscribe((songs: Song[]) => {
      console.log({'idodo': songs});
      this.songs = songs;
    })
  }

  onSelectSong(song: Song) {
    console.debug("request to get songs");
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
