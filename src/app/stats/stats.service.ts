import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SongService } from "../song/songs.service"
import { Song } from "../song/song.model";
 
@Injectable({
  providedIn: 'root'
})
export class StatsService {
	Mysongs;
  private base_url = "http://localhost:3000/api";

  constructor(private Http: HttpClient, private songService: SongService) { }

  /* gets browser statistics data */
  getBrowserData(onComplete: Function){
  	this.Http.get(this.base_url + "/user/browser").subscribe(
  			// call on complete with no error
  			(responseData) => {
  				onComplete(responseData, null);
  			},
  			// on error call complete with an error
  			(error) => {
  				onComplete(null, error);
  			}
  		);
	}
	
	// gets genre stats using map reduce
	getGenreData(){
		this.songService.getSongs();
    this.songService.getSongsUpdateListener()
    .subscribe((songData: {songs: Song[], totalSongs: number}) => {
			const songs = songData.songs;
			console.log(songs);
			this.Http.post(this.base_url + "/song/stats", songs).subscribe(()=>{
    })
		})
	}
}
