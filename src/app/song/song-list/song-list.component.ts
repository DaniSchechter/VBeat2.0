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
      image_path:"http://material.angular.io/assets/img/examples/shiba2.jpg",
      release_date: new Date('2019-1-1'),
      artists: ['Drake ,CardiB']
    },
    {
      song_id: 2,
      name: "Song2",
      genres: [Genre.Blues, Genre.Country],
      song_path:"d",
      image_path: "https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjsrYyXyJ3gAhVGsKQKHcR9CeQQjRx6BAgBEAU&url=https%3A%2F%2Fwww.vectorstock.com%2Froyalty-free-vector%2Fbalon-simple-icon-vector-10463225&psig=AOvVaw13rf6DCdMm2ciJ1PYRKssb&ust=1549214576949954",
      release_date: new Date('2018-11-1'),
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
