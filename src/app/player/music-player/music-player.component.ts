import { Component, OnInit, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { Song } from '../../song/song.model';
import { MusicPlayerService } from '../music-player/music-player.service';
import { SongPlayAction } from '../music-player/songPlayAction'
import { NotificationPopupService } from '../../notification/notification-popup.service';
import { Notification, NotificationStatus } from '../../notification/notification.model';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit {

  // Reference to html audio
  @ViewChild('player') player: ElementRef;

  songs: Song[] = [];

  constructor(private musicPlayerService: MusicPlayerService, 
              private http: HttpClient,
              private notificationPopupService: NotificationPopupService ) { }

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
    this.songResourceExists(song)
      .then( () => {
        this.songs.unshift(song);
        this.player.nativeElement.load();
        this.player.nativeElement.play();
      })
      .catch( (err) => {this.notificationPopupService.submitNotification(
        new Notification(`Cannot find "${song.name}"'s resource - path:${song.song_path}`,NotificationStatus.ERROR))
      });
  }

  addToQueue(song: Song): void {
    this.songResourceExists(song)
    .then( () => {
      // Add new song to the end of the array
      this.songs.push(song);
    })
    .catch( (err) => this.notificationPopupService.submitNotification(
      new Notification(`Cannot find "${song.name}"'s resource`,NotificationStatus.ERROR)
    ));
  }

  playPlaylist(songs: Song[]): void {
    this.songs = songs;
    this.player.nativeElement.load();
    this.player.nativeElement.play();
  }

  private songResourceExists(song: Song){
    // Checl if the file exists without the prefix
    let path = song.song_path.replace("../../..","");
    return new Promise((resolve, reject) => {
      this.http.get(encodeURI(path)).subscribe( 
        () => { 
          // never gets here - too long time I couldn't get it - so if u see it, Please explain ;-)
        },
        response =>  {
          if(response.status == 200) resolve();
          else reject();
        }
      );
    });
  }
}
