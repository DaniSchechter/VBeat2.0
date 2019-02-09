import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  constructor(private userService: UserService) {
  }

  ngOnInit() {
  }

  // submit user creation form
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.userService.addUser(
      form.value.username,
      form.value.password,
      form.value.profile_pic,
      form.value.display_name,
      form.value.email,
    );
    form.resetForm();
  }
}
