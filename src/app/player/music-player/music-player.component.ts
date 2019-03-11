import { Component, OnInit, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';

import { Song } from '../../song/song.model';
import { MusicPlayerService } from '../music-player/music-player.service';
import { SongPlayAction } from '../music-player/songPlayAction';
import { NotificationPopupService } from '../../notification/notification-popup.service';
import { NotificationStatus, Notification } from '../../notification/notification.model';


import { existsSync } from 'fs';
@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit {

  // Reference to html audio
  @ViewChild('player') player: ElementRef;

  songs: Song[] = [];

  constructor( private musicPlayerService: MusicPlayerService, private notificationService: NotificationPopupService) { }

  ngOnInit() {
    this.musicPlayerService.getSongPlayedListener().subscribe( playAction => {
        switch(playAction.action) {
          case SongPlayAction.ADD_SONG_TO_QUEUE:
            this.addToQueue(playAction.songs[0]);
            break;
          case SongPlayAction.PLAY_PLAYLIST:
            this.playPlaylist(playAction.songs);
            break;
          case SongPlayAction.PLAY_SONG_NOW:
            this.playNow(playAction.songs[0]);
          break;
        }
    });
  }

  onSongEnded(): void {
    // remove the ended song (first song in the array)
    this.songs.shift();
    this.player.nativeElement.load();
    this.player.nativeElement.play();
  }

  playNow(song: Song): void {
    if(this.fileExists(song.song_path)) {
      this.songs.unshift(song);
      this.player.nativeElement.load();
      this.player.nativeElement.play();
    }
    else {
      this.notificationService.submitNotification(new Notification('can not find song path', NotificationStatus.ERROR));
    }
  }

  addToQueue(song: Song): void {
    // Add new song to the end of the array
    this.songs.push(song);
  }

  playPlaylist(songs: Song[]): void {
    let tempSongs: Song[]; // filter all the songs that their path is not valid
    songs.forEach((song)=>{
      if(this.fileExists(song.song_path)){
        tempSongs.push(song);
      }
    })

    this.songs = tempSongs;
    this.player.nativeElement.load();
    this.player.nativeElement.play();
  }

  fileExists(songPath: string) {

    if (existsSync(songPath)){
      return true;
    }
    else{
      return false;
    }
  }

}
