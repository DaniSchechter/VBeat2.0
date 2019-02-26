import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Playlist } from '../playlist.model'
import { Subscription } from 'rxjs';

import { PlaylistService } from '../playlist.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-playlist-search',
  templateUrl: './playlist-search.component.html',
  styleUrls: ['./playlist-search.component.css']
})
export class PlaylistSearchComponent implements OnInit, OnDestroy {


  selectedPlaylist: Playlist;
  playlists: Playlist[];
  totalPlaylists:number = 0;
  playlistsPerPage:number = 10;
  currentPage:number = 1;
  private playlistSub: Subscription;


  playlistName:string = '';
  songName:string = '';
  minimumSongs:number = 0;



  constructor(public playlistsService: PlaylistService) { }

  ngOnInit() {
    this.playlistSub = this.playlistsService.getSearchPlaylistUpdateListener()
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
    this.playlistsService.searchPlaylist(this.playlistsPerPage, this.currentPage, this.playlistName, this.songName, this.minimumSongs);
  }


  onDelete(playlistId: string) {
    this.playlistsService.deletePlaylist(playlistId);
  }

  ngOnDestroy(): void {
    this.playlistSub.unsubscribe();
  }

  onSearch(form: NgForm) {
    this.playlistName = form.value.playlistName;
    this.songName = form.value.songName;
    this.minimumSongs = form.value.minimumSongs;
    this.currentPage = 1;
    this.playlistsService.searchPlaylist(this.playlistsPerPage, this.currentPage, this.playlistName, this.songName, this.minimumSongs);
  }

}
