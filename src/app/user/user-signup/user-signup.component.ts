import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  constructor( private userService:UserService ) { }

  ngOnInit() {
    this.userRoleOptions  = Object.keys(UserRole);
  }

  // handler for login
  onSubmit(form: NgForm) {
  	if(!form.valid) {
  		return;
  	}

    this.userService.addUser(form.value.username, form.value.password, form.value.role, form.value.profile_pic, form.value.display_name, form.value.email);
    
    form.resetForm();

  }

}
