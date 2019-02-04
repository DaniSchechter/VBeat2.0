import { Subject } from 'rxjs';
import { map }  from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from './song.model';
import { Genre } from './song.model'

@Injectable({providedIn: 'root'})
export class SongService{

    private songs: Song[] = [];
    private songsUpdated = new Subject<Song[]>();

    constructor(private Http: HttpClient){}

    getSongs(){
        this.Http.get<{message: string; songs: any}>('http://localhost:3000/api/getSong')
        .pipe(map((songData) => {
            return songData.songs.map(song => {
                return {
                    name: song.name, 
                    genres: song.genres, 
                    song_path: song.song_path, 
                    image_path: song.image_path, 
                    release_date: song.release_date,
                    artists: song.artists, //TODO: change to artist array
                    num_of_times_liked: song.num_of_times_liked, 
                    id: song._id
                };
            });
        }))
        .subscribe(songsAfterChange => {
            this.songs = songsAfterChange;
            this.songsUpdated.next([...this.songs]);
        });
    }

    getSongsUpdateListener(){
        return this.songsUpdated.asObservable();
    }

    addSong(name: string, genre: Genre, song_path: string, image_path: string, release_date: Date,
        artists: [string], //TODO: change to artist array
        num_of_times_liked: number){
            const song: Song = {
                id: null, 
                name: name, 
                genre: genre, 
                song_path: song_path, 
                image_path: image_path, 
                release_date: release_date,
                artists: artists, 
                num_of_times_liked: num_of_times_liked
            };
        this.Http.post<{message: string}>('http://localhost:3000/api/addSong', song)
        .subscribe((responseData)=>{
            console.log(responseData.message);
            this.songs.push(song);
            this.songsUpdated.next([...this.songs]);
        });
    }

    

}