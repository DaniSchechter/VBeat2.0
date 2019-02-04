import { Component, OnInit } from '@angular/core';
import { Genre } from '../song.model'

@Component({
  selector: 'app-song-create',
  templateUrl: './song-create.component.html',
  styleUrls: ['./song-create.component.css']
})
export class SongCreateComponent implements OnInit {

  genre_options: string[];
  
  constructor() {
    this.genre_options = Object.keys(Genre);
  }


  ngOnInit() {
    
  }

}
