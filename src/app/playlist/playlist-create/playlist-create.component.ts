import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PlaylistService } from '../playlist.service'
import { NotificationPopupService } from '../../notification/notification-popup.service';
import { NotificationStatus, Notification } from '../../notification/notification.model';

@Component({
  selector: 'app-playlist-create',
  templateUrl: './playlist-create.component.html',
  styleUrls: ['./playlist-create.component.css']
})
export class PlaylistCreateComponent implements OnInit {

  constructor(private playlistService: PlaylistService,  private notificationService: NotificationPopupService) { }

  ngOnInit() {  }

  onSubmit(form: NgForm){
    if(!form.valid) {
      return; //! TODO - display popup message to correct 
    }
    if(form.value.name == "LIKED SONGS"){
      this.notificationService.submitNotification(
        new Notification("This name cannot be used",NotificationStatus.ERROR))
    }
    else{
      this.playlistService.addPlaylist(
        form.value.name,
        [],
      )
    }
    form.resetForm();
  }
}
