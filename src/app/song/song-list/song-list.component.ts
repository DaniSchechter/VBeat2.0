import { Component, OnInit } from '@angular/core';

import { Song, Genre } from '../song.model'

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {
  selectedSong: Song;
  songs: Song[]= [
    {
      song_id: 1,
      name: "Song1",
      genres: [Genre.Blues, Genre.Country],
      song_path:"d",
      image_path:"sd",
      release_data: new Date('2019-1-1'),
      artists: ['Drake ,CardiB']
    },
    {
      song_id: 2,
      name: "Song2",
      genres: [Genre.Blues, Genre.Country],
      song_path:"d",
      image_path:"sd",
      release_data: new Date('2018-11-1'),
      artists: ['Pink, PostyPost']
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  onSelectSong(song: Song) {
    this.selectedSong = song;
  }

}
