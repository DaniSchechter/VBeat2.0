import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PlaylistService } from '../../playlist/playlist.service'
import { UserService } from '../user.service';
import { UserConfig, UserRole } from '../user.model'; 

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {

  userConfig: UserConfig = new UserConfig();
  userRoleOptions: string[];
  private userId: string;

  constructor( private userService:UserService , private playlistService: PlaylistService) { }

  ngOnInit() {
    this.userRoleOptions  = Object.keys(UserRole);
  }

  // handler for login
  onSubmit(form: NgForm) {
  	if(!form.valid) {
  		return;
  	}

    this.userService.addUser(form.value.username, 
      form.value.password, 
      form.value.role, 
      encodeURI(form.value.profile_pic), 
      form.value.display_name, 
      form.value.email, 
      form.value.country,
      form.value.city,
      form.value.street,
      form.value.houseNum)
    .then( () => {
      this.playlistService.addPlaylist("LIKED SONGS", []);
      this.userService.getUserPermissions();
    }
    );
    form.resetForm();

  }

}
