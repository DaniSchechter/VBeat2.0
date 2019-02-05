import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NotificationPopupService } from './notification-popup.service';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.css']
})
export class NotificationPopupComponent implements OnInit{

  message:string;

  constructor(private popup:MatSnackBar, 
              private notificationService:NotificationPopupService) {}

  ngOnInit() {
    this.notificationService.getMessageSubmittedListener()
      .subscribe( (message: string) => {
        this.message = message; 
        this.displayPopup();
      });
  }

  private displayPopup() {
    this.popup.open(this.message, "info",{
      duration: 1500,
      verticalPosition: 'top',
    });
  }
} 
