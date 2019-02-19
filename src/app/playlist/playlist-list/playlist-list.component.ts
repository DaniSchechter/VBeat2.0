import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Playlist } from '../playlist.model'
import { Subscription } from 'rxjs';

import { PlaylistService } from '../playlist.service';



@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.css']
})
export class PlaylistListComponent implements OnInit {
  selectedPlaylist: Playlist;
  playlists: Playlist[];
  totalPlaylists:number = 0;
  playlistsPerPage:number = 10;
  currentPage:number = 1;
  private playlistSub: Subscription;

  constructor(public playlistsService : PlaylistService) { }

  ngOnInit() {
    this.playlistsService.getPlaylists(this.playlistsPerPage, 1);
    this.playlistSub = this.playlistsService.getPlaylistsUpdateListener()
    .subscribe((playlistData: {playlists: Playlist[], totalPlaylists: number}) => {
      this.totalPlaylists = playlistData.totalPlaylists;
      this.playlists = playlistData.playlists;
      this.selectedPlaylist = null;
    })
  }

  onSelectPlaylist(playlist: Playlist) {
    this.selectedPlaylist = playlist;
  }

  onChangePage(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.playlistsPerPage = pageData.pageSize;
    this.playlistsService.getPlaylists(this.playlistsPerPage, this.currentPage);
  }
  

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.playlistSub.unsubscribe();
  }

}
