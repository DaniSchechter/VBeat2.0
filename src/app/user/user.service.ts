import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map }  from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { NotificationPopupService } from '../notification/notification-popup.service'
import { NotificationStatus, Notification } from '../notification/notification.model'

import { User, UserRole } from './user.model'

@Injectable({
  providedIn: 'root'
})
export class UserService {

	private base_url = 'http://localhost:3000/api'; /* TODO need to move this out */ 
	artists: User[];
	artistsUpdated = new Subject<User[]>();
	userIdUpdated = new Subject<string>();

	constructor(private Http: HttpClient,
				private notificationService: NotificationPopupService, private router:Router) { }

	getArtistsUpdateListener(){
		return this.artistsUpdated.asObservable();
	}


	// getNewUserUpdateListener(){
	// 	return this.userIdUpdated.asObservable();
	// }
	/* this function sends the information to the server
	   and submits a notification regarding the response*/
	addUser(
		username: string, 
		password: string,
		role: UserRole,
		profile_pic: string,
		display_name: string,
		email: string
	)
	{
		const user: User = {
			id: null,
			username: username,
			role: role,
			password: password, 
			profile_pic: profile_pic,
			display_name: display_name,
			email: email
		};
		
		return new Promise( (resolve, reject) => {
			this.Http.post<{message: string, userId: string}>(this.base_url + '/user',user)
			.subscribe(
				responseData => {
					this.notificationService.submitNotification(
						new Notification(responseData.message, NotificationStatus.OK)
					);
					resolve();
				},
				error => {
					this.notificationService.submitNotification(
						new Notification(error.message, NotificationStatus.ERROR));
					reject();
				}
			)
		})
	}

	login(
		username: string,
		password: string,
	) 
	{
		const user: User = {
			id: null,
			username: username,
			role: null,
			password: password,
			profile_pic: null,
			display_name: null,
			email: null
		}

		this.Http.post<{message: string}>(this.base_url + '/user/login', user)
			.subscribe(
					responseData => {
						this.notificationService.submitNotification(
								new Notification(responseData.message, NotificationStatus.OK)
						);
            this.router.navigate(["/"]);
					},
					error => {
						this.notificationService.submitNotification(
								new Notification(error.message, NotificationStatus.ERROR)
						);
					}
			);
	}

	getArtists(): void {
		this.Http.get<{ message:string, artists: any }>(`${this.base_url}/user/artists`)
        .pipe(
            map(artistsData => {
            return {message:artistsData.message, artists: artistsData.artists.map(artist => {
                return new User(
					artist._id,
					artist.username,
					artist.role,
					artist.username,
					artist.profile_pic,
					artist.display_name,
					artist.email,
				)
			})}
        }))
        .subscribe(
            artistsList => {
                this.artists = artistsList.artists;
                this.artistsUpdated.next([...this.artists]);
            },
            error => this.notificationService.submitNotification(
                new Notification(error.message,NotificationStatus.ERROR))
        );
	}

}
