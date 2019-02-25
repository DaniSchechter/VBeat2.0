import * as io  from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Song } from './song.model';
import { HttpClient } from '@angular/common/http';
import { NotificationPopupService } from '../notification/notification-popup.service';
import { NotificationStatus, Notification } from '../notification/notification.model';
import { PlaylistService } from '../playlist/playlist.service';

@Injectable({providedIn: 'root'})
export class SongActionService{

    private base_url = 'http://localhost:3000/api';
    private song: Song;
    private socket;

    // Singelton pattern
    private static instance: SongActionService; 
    // Global changes through web sockets
    private songUpdatedSubject: Subject<Song>;
    // Local changes for changing like button color
    private localSongUpdated = new Subject<Song>();


    // Force only one Socket per client
    private constructor( 
        private http: HttpClient,
        private notificationService: NotificationPopupService)    {
        this.socket = io("http://localhost:3000/");
        this.songUpdatedSubject = this.createSongUpdatedSubject();
    }

    // TODO think of a way without getting Httpclient as paramater
    // TODO then remove also from song-tool-bar.component.ts
    static getInstance(http:HttpClient ): SongActionService {
        if(!SongActionService.instance) {
            SongActionService.instance = new SongActionService(http, new NotificationPopupService());
        }
        return SongActionService.instance;
    }

    // Create subject to enable listening to like chane through web sockets
    private createSongUpdatedSubject(): Subject<Song> {
        // We define our observable which will observe any incoming messages
        // from our socket.io server.
        let observable = new Observable(observer => {
            this.socket.on('songLikeAction', (song:Song) => {
                observer.next(song);
            });
            return () => {
                this.socket.disconnect();
            }
        });

        // We define our Observer which will listen to messages
        // from our other components and send messages back to our
        // socket server whenever the `next()` method is called.
        let observer = {
            next: (song: Song) => {
                this.socket.emit('songLikeAction', song);
            },
        };

        // we return our Subject which is a combination
        // of both an observer and observable.
        return Subject.create(observer, observable);
    }

    // Return subject to enable listening to like chane through web sockets
    getSongUpdatedSubject(): Subject<Song> {
        return this.songUpdatedSubject;
    }

    getLocalSongUpdateListener() { 
        return this.localSongUpdated.asObservable(); 
    }

    like(song: Song) {
        this.song = song;

        this.song.num_of_times_liked ++;
        // Inform for global change
        this.songUpdatedSubject.next(this.song);
        // Inform for local change
        this.localSongUpdated.next(song);
        // Update in DB
        this.http.put<{message: string}>(this.base_url + '/song/likes/' + song.id, song).subscribe(
            res => {
            this.notificationService.submitNotification(
                new Notification(res.message,NotificationStatus.OK)
            )}, 
            error => this.notificationService.submitNotification(
                new Notification(error.message,NotificationStatus.ERROR))
        );
    }

    unlike(song: Song) {
        this.song = song;

        this.song.num_of_times_liked --;
        // Inform for global change
        this.songUpdatedSubject.next(this.song);
        // Inform for local change
        this.localSongUpdated.next(song);
        // Update in DB
        this.http.put<{message: string}>(this.base_url + '/song/likes/' + song.id, song).subscribe(
            res => {
            this.notificationService.submitNotification(
                new Notification(res.message,NotificationStatus.OK)
            )}, 
            error => this.notificationService.submitNotification(
                new Notification(error.message,NotificationStatus.ERROR))
        );
    }
}