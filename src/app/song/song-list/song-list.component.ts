import { Component, OnInit } from '@angular/core';

import { Song, Genre } from '../song.model'

// TODO connect this to the song service

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {
  selectedSong: Song;
  songs: Song[]= [
    {
      id: 1,
      name: "Song1",
      genre: Genre.BLUES,
      song_path:"d",
      image_path:"http://material.angular.io/assets/img/examples/shiba2.jpg",
      release_date: new Date('2019-1-1'),
      artists: ['Drake ,CardiB'],
      num_of_times_liked: 23
    },
    {
      id: 2,
      name: "Song2",
      genre: Genre.CLASSIC,
      song_path:"d",
      image_path: "http://r.ddmcdn.com/s_f/o_1/APL/uploads/2015/07/cecil-AP463227356214-1000x400.jpg",
      release_date: new Date('2018-11-1'),
      artists: ['Pink, PostyPost'],
      num_of_times_liked: 9
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  onSelectSong(song: Song) {
    this.selectedSong = song;
  }

}
