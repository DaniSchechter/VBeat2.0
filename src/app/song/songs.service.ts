import { Subject } from 'rxjs';
import { map }  from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song, Genre } from './song.model';
import { NotificationPopupService } from '../notification/notification-popup.service'
import { NotificationStatus, Notification } from '../notification/notification.model'
import { elementEnd } from '@angular/core/src/render3';
import { visitValue } from '@angular/compiler/src/util';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class SongService{
    private base_url = 'http://localhost:3000/api';

    private songs: Song[] = [];
    private song: Song;
    private songsUpdated = new Subject<{songs: Song[], totalSongs: number}>();
    private songUpdated = new Subject<Song>();

    constructor(private Http: HttpClient,
                private notificationService:NotificationPopupService, private router:Router){}

    
    getSongsUpdateListener(){
        return this.songsUpdated.asObservable();
    }
    
    getSongs(songsPerPage: number, currentPage: number){
        const queryParams = `?pageSize=${songsPerPage}&page=${currentPage}`;
        this.Http.get<{message: string; songs: any, totalSongs: number}>(this.base_url + '/songs' + queryParams)
        .pipe(
            map(songData => {
            return {songs: songData.songs.map(song => {
                return {
                    name: song.name, 
                    genre: song.genre, 
                    song_path: song.song_path, 
                    image_path: song.image_path, 
                    release_date: song.release_date,
                    artists: song.artists, //TODO: change to artist array
                    num_of_times_liked: song.num_of_times_liked, 
                    id: song._id
                };
            }), totalSongs: songData.totalSongs};
        }))
        .subscribe(
            (songsAfterChange) => {
                this.songs = songsAfterChange.songs;
                this.songsUpdated.next({
                    songs: [...this.songs], 
                    totalSongs: songsAfterChange.totalSongs
                });
                    //! TODO think if diplay message on fetching
                // this.notificationService.submitNotification(
                //     new Notification(responseData.message,NotificationStatus.OK)
                // )
            },
            //! TODO get error message from the server
            error => this.notificationService.submitNotification(new Notification("ERROR",NotificationStatus.ERROR))
        );
    }

    getSongUpdateListener(){
        return this.songUpdated.asObservable();
    }

    getSong(songs: Song[], songId: string){
        return {...this.songs.find(song => song.id === songId)};
    }


    addSong(name: string, genre: Genre, song_path: string, image_path: string, release_date: Date,
        artists: string[], //TODO: change to artist array
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
        this.Http.post<{message: string, songId: string}>(this.base_url + '/songs', song)
        .subscribe(
                responseData => {
                this.notificationService.submitNotification(
                    new Notification(responseData.message,NotificationStatus.OK)
                )
                this.router.navigate(["/"])
            },
            //! TODO get error message from the server
            error => this.notificationService.submitNotification(new Notification("ERROR",NotificationStatus.ERROR))

        );
    }

    deleteSong(songId: string){
        return this.Http.delete<{message: string}>(this.base_url + '/songs/' + songId)
        // .subscribe(
        //     (responseData) => {
        //         this.notificationService.submitNotification(
        //             new Notification(responseData.message,NotificationStatus.OK)
        //         )
        //     },
        //      //! TODO get error message from the server
        //     error => this.notificationService.submitNotification(new Notification("ERROR",NotificationStatus.ERROR))
        // );
    }

    updateSong(id: string, name: string, genre: Genre, song_path: string, image_path: string, release_date: Date,
        artists: string[], //TODO: change to artist array
        num_of_times_liked: number){
            const song: Song = {
                id: id, 
                name: name, 
                genre: genre, 
                song_path: song_path, 
                image_path: image_path, 
                release_date: release_date,
                artists: artists, 
                num_of_times_liked: num_of_times_liked
            };
            this.Http.put<{message: string}>(this.base_url + '/songs/' + id, song).subscribe(res => {
                this.notificationService.submitNotification(
                    new Notification(res.message,NotificationStatus.OK)
                )
                this.router.navigate(["/"])            
            });
        }
    

}