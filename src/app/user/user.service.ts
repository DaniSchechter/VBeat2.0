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

	private base_url = 'http://localhost:3000/api';
	artists: User[];
	artistsUpdated = new Subject<User[]>();
	userFetched = new Subject<User>();
	connectedUser: User;
  	isLoggedIn = false;


  userDetailsFetched = new Subject<User>();

	constructor(private Http: HttpClient,
				private notificationService: NotificationPopupService, private router:Router) { 
		this.isLoggedIn = document.cookie.indexOf("loggedin") != -1;
		console.log(
			'isLoggedIn initialized',
			this.isLoggedIn
			);
	}



  getUserDetailsUpdateListener(){
    return this.userDetailsFetched.asObservable();
  }


	getArtistsUpdateListener(){
		return this.artistsUpdated.asObservable();
  }

	/* this function sends the information to the server
	   and submits a notification regarding the response*/
	addUser(
		username: string,
		password: string,
		role: UserRole,
		profile_pic: string,
		display_name: string,
		email: string,
		country: string,
    	city: string,
		street: string,
		houseNum: number
	)
	{
		const user: User = {
			id: null,
			username: username,
			role: role,
			password: password,
			profile_pic: profile_pic,
			display_name: display_name,
			email: email,
			country: country,
      		city: city,
			street: street,
			houseNum: houseNum,
		};

		return new Promise( (resolve, reject) => {
			this.Http.post<{message: string, userId: string}>(`${this.base_url}/user`,user)
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
			email: null,
			country: null,
			city: null,
			street: null,
			houseNum: null,
		}

		return new Promise( (resolve, reject) => {
			this.Http.post<{message: string}>(this.base_url + '/user/login', user)
				.subscribe(
						responseData => {
							this.notificationService.submitNotification(
									new Notification(responseData.message, NotificationStatus.OK)
							);
							this.isLoggedIn = true;
							document.cookie = 'loggedin=true;';
							resolve();
							this.router.navigate(["/"]);
						},
						error => {
							this.notificationService.submitNotification(
									new Notification(error.message, NotificationStatus.ERROR)
							);
							reject();
						}
				);
		});
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
					artist.country,
					artist.city,
					artist.street,
					artist.houseNum,
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

	getUserPermissionsUpdateListener(){
		return this.userFetched.asObservable();
	}

	getUserPermissions(){
		if(!this.isLoggedIn){
			return;
		}
		this.Http.get<{user: any}>(`${this.base_url}/user/currentUser`)

		.subscribe(userData => {
			const newUser: User = new User(
				userData.user._id,
				userData.user.username,
				userData.user.role,
				userData.user.password,
				userData.user.profile_pic,
				userData.user.display_name,
				userData.user.email,
				userData.user.country,
				userData.user.city,
				userData.user.street,
				userData.user.houseNum,
			);
			this.connectedUser = newUser;
			this.userFetched.next(newUser);
		},
		error => {
			this.notificationService.submitNotification(
				new Notification(error.message, NotificationStatus.ERROR));
		})
	}

	getIsLoggedIn(){
		return this.isLoggedIn;
	}

	logout(onSuccess: Function){
		this.Http.get(`${this.base_url}/user/logout`)
			.subscribe(data => {
				this.notificationService.submitNotification(new Notification("logged out!", NotificationStatus.OK));
				this.isLoggedIn = false;
				document.cookie = '';
				onSuccess();
			},
			error => {
				this.notificationService.submitNotification(new Notification("unable to logout", NotificationStatus.ERROR));
			});
  }


  getCurrentUser(){
    this.Http.get<{user: User}>(`${this.base_url}/user/currentUser`)
		.subscribe(userData => {
			this.userDetailsFetched.next(userData.user);
		},
		error => {
			this.notificationService.submitNotification(
				new Notification(error.message, NotificationStatus.ERROR));
    });
  }




}
