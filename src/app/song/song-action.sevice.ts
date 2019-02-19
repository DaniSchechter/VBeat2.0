import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Song, Genre } from './song.model';
import { NotificationPopupService } from '../notification/notification-popup.service'
import { NotificationStatus, Notification } from '../notification/notification.model'



@Injectable({providedIn: 'root'})
export class SongActionService{

    private base_url = 'http://localhost:3000/api';
    private song: Song;
    private songLiked = new Subject<{song:Song, newNumOfLikes:number}>();

    constructor(private Http: HttpClient,
                private notificationService:NotificationPopupService, private router:Router){}

    getSongUpdateListener() { return this.songLiked.asObservable(); }

    like(song: Song) {
        this.song = song;
        let newNumOfLikes: number = this.song.num_of_times_liked + 1;
        this.song.num_of_times_liked = newNumOfLikes;
        let id = song.id;
        // ! TODO call API - update num of likes with newNumOfLikes .
        this.Http.put<{message: string}>(this.base_url + '/songs/likes/' + id, song).subscribe(
            res => {
            this.notificationService.submitNotification(
                new Notification(res.message,NotificationStatus.OK)
            )}, 
            error => this.notificationService.submitNotification(
                new Notification(error.message,NotificationStatus.ERROR))
        );
        this.songLiked.next( {song, newNumOfLikes} );
    }

    unlike(song: Song) {
        this.song = song;
        let newNumOfLikes: number = this.song.num_of_times_liked - 1;
        this.song.num_of_times_liked = newNumOfLikes;
        let id = song.id;
        // ! TODO call API - update num of likes with newNumOfLikes .
        this.Http.put<{message: string}>(this.base_url + '/songs/likes/' + id, song).subscribe(
            res => {
            this.notificationService.submitNotification(
                new Notification(res.message,NotificationStatus.OK)
            )}, 
            error => this.notificationService.submitNotification(
                new Notification(error.message,NotificationStatus.ERROR))
        );
        this.songLiked.next( {song, newNumOfLikes} );
    }
}
