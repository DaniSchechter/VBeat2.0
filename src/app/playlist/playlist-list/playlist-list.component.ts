import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Playlist } from '../playlist.model'
import { Subscription } from 'rxjs';

import { PlaylistService } from '../playlist.service';
import { MusicPlayerService } from '../../player/music-player/music-player.service';
import { SongPlayAction } from '../../player/music-player/songPlayAction';


@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.css']
})
export class PlaylistListComponent implements OnInit, OnDestroy {

  selectedPlaylist: Playlist;
  playlists: Playlist[];
  totalPlaylists:number = 0;
  playlistsPerPage:number = 10;
  currentPage:number = 1;
  private playlistSub: Subscription;

  constructor(private playlistsService : PlaylistService,
              private musicPlayerService: MusicPlayerService) { }

  ngOnInit() {
    // get the playlists
    this.playlistsService.getPlaylists(this.playlistsPerPage, 1);
    this.playlistSub = this.playlistsService.getPlaylistsUpdateListener()
    .subscribe((playlistData: {playlists: Playlist[], totalPlaylists: number}) => {
      this.totalPlaylists = playlistData.totalPlaylists;
      this.playlists = playlistData.playlists;
      this.selectedPlaylist = null;
    })
  }

  onSelectPlaylist(playlist: Playlist) {
    this.selectedPlaylist = playlist;  }

  onChangePage(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.playlistsPerPage = pageData.pageSize;
    this.playlistsService.getPlaylists(this.playlistsPerPage, this.currentPage);
  }
  
  onPlay(playlist: Playlist){
    this.musicPlayerService.play(playlist.songList, SongPlayAction.PLAY_PLAYLIST);
  }
  
  onDelete(playlistId: string) {
    this.playlistsService.deletePlaylist(playlistId);
  }

  ngOnDestroy(): void {
    this.playlistSub.unsubscribe();
  }

}
