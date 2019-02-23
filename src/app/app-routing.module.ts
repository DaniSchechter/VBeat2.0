import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongListComponent } from './song/song-list/song-list.component';
import { SongEditComponent } from './song/song-edit/song-edit.component';
import { SongCreateComponent } from './song/song-create/song-create.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserSignupComponent } from './user/user-signup/user-signup.component';

const routes: Routes = [
  {path: '', component: SongListComponent},
  {path: 'create_song', component: SongCreateComponent},
  {path: 'edit_song/:id', component: SongEditComponent},
  {path: 'login', component: UserLoginComponent},
  {path: 'signup', component: UserSignupComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
