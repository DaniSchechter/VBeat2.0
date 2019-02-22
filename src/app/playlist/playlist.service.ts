import { Subject } from 'rxjs';
import { map }  from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Playlist } from './playlist.model';
import { NotificationPopupService } from '../notification/notification-popup.service'
import { NotificationStatus, Notification } from '../notification/notification.model'
import { Router } from '@angular/router';
import {Song } from "../song/song.model";

@Injectable({providedIn: 'root'})
export class PlaylistService{
    private base_url = 'http://localhost:3000/api';

    private playlists: Playlist[] = [];
    private favoritePlaylist: Playlist;
    private playlistsCount = 0;
    private playlistsByNameUpdated = new Subject<Playlist>();
    private playlistsUpdated = new Subject<{playlists: Playlist[], totalPlaylists: number}>();
    private playlistUpdated = new Subject<Playlist>();

    constructor(private Http: HttpClient,
                private notificationService:NotificationPopupService, private router:Router){
                    // get the favorite playlist id if there is one
                    this.Http.get<{message: string; playlist: any}>(this.base_url + '/playlist/' + "LIKED SONGS")
                    .pipe(
                        map(playlistData => {
                            if(playlistData.playlist){
                                return {
                                    name: playlistData.playlist.name, 
                                    UserId: playlistData.playlist.UserId, 
                                    songList: playlistData.playlist.songList,
                                    id: playlistData.playlist._id
                                };
                        }
                    }))
                    .subscribe(
                        playlistsAfterChange => {
                            this.favoritePlaylist = playlistsAfterChange;
                        },
                        error => this.notificationService.submitNotification(new Notification(error.message,NotificationStatus.ERROR))
                    );
    }

    
    getPlaylistsUpdateListener(){
        return this.playlistsUpdated.asObservable();
    }
    
    // get all playlists
    getPlaylists(playlistsPerPage = 10, currentPage = 1){
        const queryParams = `?pageSize=${playlistsPerPage}&page=${currentPage}`;
        this.Http.get<{message: string; playlists: any, totalPlaylists: number}>(this.base_url + '/playlist' + queryParams)
        .pipe(
            map(playlistData => {
            return {playlists: playlistData.playlists.map(playlist => {
                return {
                    name: playlist.name, 
                    UserId: playlist.UserId, 
                    songList: playlist.songList,
                    id: playlist._id
                };
            }), totalPlaylists: playlistData.totalPlaylists};
        }))
        .subscribe(
            (playlistsAfterChange) => {
                this.playlistsCount = playlistsAfterChange.totalPlaylists;
                this.playlists = playlistsAfterChange.playlists;
                this.playlistsUpdated.next({
                    playlists: [...this.playlists], 
                    totalPlaylists: playlistsAfterChange.totalPlaylists
                });
            },
            error => this.notificationService.submitNotification(new Notification(error.message,NotificationStatus.ERROR))
        );
    }

    getPlaylistUpdateListener(){
        return this.playlistUpdated.asObservable();
    }

    // get playlist by id
    getPlaylist(playlists: Playlist[], playlistId: string){
        return {...this.playlists.find(playlist => playlist.id === playlistId)};
    }

    // add new playlist
    addPlaylist(name: string, songList: Song[]){
            const playlist: Playlist = {
                id: null, 
                name: name, 
                UserId: null, 
                songList: songList
            };
        this.Http.post<{message: string, playlistId: string}>(this.base_url + '/playlist', playlist)
        .subscribe(
                responseData => {
                this.notificationService.submitNotification(
                    new Notification(responseData.message,NotificationStatus.OK)
                )
                this.router.navigate(["/"])
            },
            error => this.notificationService.submitNotification(new Notification(error.message,NotificationStatus.ERROR))

        );
    }

    // delete playlist
    deletePlaylist(playlistId: string){
        return this.Http.delete<{message: string}>(this.base_url + '/playlist/' + playlistId)
        .subscribe(
            (responseData) => {
                const updatedPlaylists = this.playlists.filter(playlist => playlist.id !== playlistId);
                this.playlists = updatedPlaylists;
                this.playlistsCount--;
                this.playlistsUpdated.next({playlists: [...this.playlists], totalPlaylists: this.playlistsCount});
                this.notificationService.submitNotification(
                    new Notification(responseData.message,NotificationStatus.OK)
                )
            },
            error => this.notificationService.submitNotification(new Notification(error.message,NotificationStatus.ERROR))
        );
    }

    // add the specific song to the favorite song playlist
    addSongToFavoritePlaylist(song: Song){
        // var for showing different massege
        var isLikedPlaylist = true;
        // If there is a favorite playlist
        if (this.favoritePlaylist){
            this.favoritePlaylist.songList.push(song)
            this.updatePlaylist(this.favoritePlaylist.id, this.favoritePlaylist.name, this.favoritePlaylist.songList, isLikedPlaylist);
        }
        // Need to create a new favorite playlist
        else{
            const playlist: Playlist = {
                id: null, 
                name: "LIKED SONGS", 
                UserId: null, 
                songList: [song]
            };
            this.Http.post<{message: string, playlistId: string}>(this.base_url + '/playlist', playlist)
            .subscribe(
                    responseData => {
                        this.favoritePlaylist = {
                            id : responseData.playlistId,
                            songList : [song],
                            name : "LIKED SONGS",
                            // !!! TODO ge tthe userId from the session
                            UserId: "5c6ea4605634786140479038",
                        };
                        this.favoritePlaylist.id = responseData.playlistId;
                        this.favoritePlaylist.songList = [song];
                        this.favoritePlaylist.name = "LIKED SONGS";
                        this.notificationService.submitNotification(
                            new Notification("Added to liked songs playlist",NotificationStatus.OK)
                        )
                },
                error => this.notificationService.submitNotification(new Notification(error.message,NotificationStatus.ERROR))
            );
        }
    }

    // remove the song from the favorite song playlist
    removeSongFromFavoritePlaylist(songToRemove: Song){
        this.favoritePlaylist.songList = this.favoritePlaylist.songList.filter(song => song.id != songToRemove.id);
        this.updatePlaylist(this.favoritePlaylist.id, this.favoritePlaylist.name, this.favoritePlaylist.songList);
    }

    // update playlist
    updatePlaylist(id: string, name: string, songList: Song[], isLikedPlaylist=false){
            const playlist: Playlist = {
                id: id, 
                name: name, 
                UserId: null,
                songList: songList
            };
            this.Http.put<{message: string}>(this.base_url + '/playlist/' + id, playlist).subscribe(res => {
                if (isLikedPlaylist){
                    this.notificationService.submitNotification(
                        new Notification("Added to liked songs playlist",NotificationStatus.OK)
                    )
                }
                else{
                    this.notificationService.submitNotification(
                        new Notification(res.message,NotificationStatus.OK)
                    )
                }
                this.router.navigate(["/"])            
            }, 
            error => this.notificationService.submitNotification(new Notification(error.message,NotificationStatus.ERROR))
            );
    }

}