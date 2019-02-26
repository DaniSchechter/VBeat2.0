import { Component, OnInit } from '@angular/core';
import { Song } from '../../song/song.model';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit {

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
    // remove the endedd song (first song in the array)
    this.songs.shift();
    player.load();
    player.play();
  }
}
