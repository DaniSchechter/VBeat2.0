import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationPopupService } from '../notification/notification-popup.service'
import { NotificationStatus, Notification } from '../notification/notification.model'
import { User } from './user.model'
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService {

	userId

	private base_url = 'http://localhost:3000/api'; /* TODO need to move this out */ 
	constructor(private Http: HttpClient,
				private notificationService: NotificationPopupService, private router:Router) { }

	/* this function sends the information to the server
	   and submits a notification regarding the response*/
	addUser(username: string, 
			password: string,
			profile_pic: string,
			display_name: string,
			email: string
		){
		const user: User = {
			id: null,
			username: username,
			password: password, 
			profile_pic: profile_pic,
			display_name: display_name,
			email: email
		};
		this.Http.post<{message: string, userId: string}>(this.base_url + '/user',user)
		.subscribe(
			(responseData) => {
				this.notificationService.submitNotification(
						new Notification(responseData.message, NotificationStatus.OK)
				);
			},
			error => this.notificationService.submitNotification(
				new Notification(error.message, NotificationStatus.ERROR)
				)
		);
	}

	login(username: string,
		password: string,
		onSuccess: Function,
		onFailure: Function) {
		const user: User = {
			id: null,
			username: username,
			password: password,
			profile_pic: null,
			display_name: null,
			email: null
		}

		this.Http.post<{message: string}>(this.base_url + '/user/login', user)
			.subscribe(
					(responseData) => {
						this.notificationService.submitNotification(
								new Notification(responseData.message, NotificationStatus.OK)
						);
						if(responseData.message == "ok") {
							onSuccess();
							this.router.navigate(["/"])
						} else {
							onFailure();
						}
					},
					(error) => {
						this.notificationService.submitNotification(
								new Notification(error.message, NotificationStatus.ERROR)
							);
						onFailure();
					}
				);

	}

}