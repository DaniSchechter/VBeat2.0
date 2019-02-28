import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  currentUser: User;
  private userSub: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userSub = this.userService.getUserDetailsUpdateListener().subscribe((user: User) => {
      this.currentUser = user;
    });
    this.userService.getCurrentUser();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
