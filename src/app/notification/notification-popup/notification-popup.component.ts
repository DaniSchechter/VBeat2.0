import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NotificationPopupService } from '../notification-popup.service';
import { Notification, NotificationStatus } from '../notification.model'

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.css']
})
export class NotificationPopupComponent implements OnInit{

  notification: Notification;
  duration: number = 6000; //Pop up time in mili seconds

  constructor(private popup:MatSnackBar, 
              private notificationService:NotificationPopupService) {}

  ngOnInit() {
    this.notificationService.getNotificationSubmittedListener()
      .subscribe( (notification: Notification) => {
        this.notification = notification; 
        this.displayPopup();
      });
  }

  private displayPopup() {
    this.popup.open(this.notification.message, this.notification.status, {
      duration: this.duration,
      verticalPosition: 'top',
    });
  }
} 
