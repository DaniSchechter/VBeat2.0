import { Component, OnInit } from '@angular/core';
import { Song, Genre } from '../song.model';

@Component({
  selector: 'app-song-details',
  templateUrl: './song-details.component.html',
  styleUrls: ['./song-details.component.css']
})
export class SongDetailsComponent implements OnInit {

  song: Song;
  constructor() { }

  ngOnInit() {

    //TODO remove this
    //TODO display through songs list (homr page or playlist)
    this.song = {
      song_id: 2,
      name: "TheName",
      genre: Genre.Blues,
      song_path:"d",
      image_path:"sd",
      release_data: new Date('2019-1-1'),
      artists: ['Drake']

    }
  }

}
