import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';


@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {

  role_options: string[]= ['User', 'Artist'];  
  minAttributeLength = 6;

  constructor( private userService:UserService ) { }

  ngOnInit() {
  }

  // handler for login
  onSubmit(form: NgForm) {
  	if(!form.valid) {
  		return;
  	}

    this.userService.addUser(form.value.username, form.value.password, form.value.profile_pic, form.value.display_name, form.value.email);
    
    form.resetForm();

  }

}
