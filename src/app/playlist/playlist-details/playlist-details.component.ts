import { Component, OnInit, OnDestroy } from '@angular/core';
import { Playlist } from '../playlist.model';
import { PlaylistService } from '../playlist.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.css']
})
export class PlaylistDetailsComponent implements OnInit, OnDestroy {

  playlist: Playlist;
  playlistSub: Subscription;

  constructor(private route: ActivatedRoute, private playlistService: PlaylistService) {}

  ngOnInit() {
    let playlistId: string;
    // Fetch the correct playlist to be viewd
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')){
        playlistId = paramMap.get('id');
      }
    });

    this.playlistSub = this.playlistService.getPlaylistUpdateListener()
        .subscribe( (playlist: Playlist) =>  this.playlist = playlist );
    
    this.playlistService.getPlaylistById(playlistId);
  }

  onDeleteFromPlaylist(songId : string){
    this.playlistService.deleteSongFromPlaylist(this.playlist, songId);
  }

  ngOnDestroy(): void {
    this.playlistSub.unsubscribe();
  }
}
