import { Component, OnInit, ElementRef } from '@angular/core';
import { Song } from '../../song/song.model';
import { ViewChild } from '@angular/core'

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit {

  // Reference to html audio
  @ViewChild('player') player: ElementRef;
  image:string = "https://images.pexels.com/photos/35646/pexels-photo.jpg?cs=srgb&dl=close-up-dahlia-flower-35646.jpg&fm=jpg";

  songs: string[] = [
    "../../../assets/songs/Alessia Cara - Scars To Your Beautiful (Audio).mp3",
    "../../../assets/songs/Anne-Marie - 2002 [Official Video].mp3",
    "../../../assets/songs/Clean Bandit - Symphony (feat. Zara Larsson) [Official Video].mp3",
    "../../../assets/songs/Hailee Steinfeld, Alesso - Let Me Go ft. Florida Georgia Line, WATT.mp3",
    "../../../assets/songs/Lauv - I Like Me Better [Official Audio].mp3",
    "../../../assets/songs/Marshmello & Anne-Marie - FRIENDS (Music Video) OFFICIAL FRIENDZONE ANTHEM.mp3",
    "../../../assets/songs/Marshmello ft. Bastille - Happier (Official Music Video).mp3",
    "../../../assets/songs/Selena Gomez, Marshmello - Wolves (Official Music Video).mp3",
  ];

  constructor() { }

  ngOnInit() {
  }

  onSongEnded(player): void {
    // remove the ended song (first song in the array)
    this.songs.shift();
    this.player.nativeElement.load();
    this.player.nativeElement.play();
  }

  playNow(song: string): void {
    this.songs.unshift(song);
    this.player.nativeElement.load();
    this.player.nativeElement.play();
  }

  addToQueue(song: string): void {
    // Add new song to the end of the array
    this.songs.push(song);
  }

  playPlaylist(songs: string[]): void {
    this.songs = songs;
    this.player.nativeElement.load();
    this.player.nativeElement.play();
  }

}
