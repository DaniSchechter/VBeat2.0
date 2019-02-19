import { Component, OnInit } from '@angular/core';
import { Playlist } from '../playlist.model'
import { NgForm } from '@angular/forms';
import { PlaylistService } from '../playlist.service'
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-playlist-create',
  templateUrl: './playlist-create.component.html',
  styleUrls: ['./playlist-create.component.css']
})
export class PlaylistCreateComponent implements OnInit {
  
  constructor(private playlistService: PlaylistService) { }

  ngOnInit() {  }

  onSubmit(form: NgForm){
    if(!form.valid) {
      return; //! TODO - display popup message to correct 
    }
    this.playlistService.addPlaylist(
      form.value.name,
      [],
    )
    form.resetForm();
  }
}
