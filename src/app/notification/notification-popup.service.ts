import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Notification, NotificationStatus } from './notification.model'

export class Notificaton {
    constructor(private message:string, private status: string){};
}

@Injectable({providedIn: 'root'})
export class NotificationPopupService {

    private notification: Notification;
    private notificationSubmitted = new Subject<Notification>();

    constructor(){}

    getNotification(){
        return {...this.notification};
    }

    getNotificationSubmittedListener(){
        return this.notificationSubmitted.asObservable();
    }

    submitNotification(notification:Notification){    
        this.notification = notification;
        this.notificationSubmitted.next(this.notification);
    }

}