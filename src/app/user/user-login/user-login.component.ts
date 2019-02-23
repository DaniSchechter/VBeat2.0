import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { UserConfig } from '../user.model'; 

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
 
  userConfig: UserConfig;

  constructor( private userService:UserService ) { }

  ngOnInit() {
  }

  // handler for login
  onSubmit(form: NgForm) {
  	if(!form.valid) {
  		return;
  	}

    this.userService.login(form.value.username, form.value.password);
  }
}
