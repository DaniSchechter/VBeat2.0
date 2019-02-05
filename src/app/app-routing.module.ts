import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongListComponent } from './song/song-list/song-list.component';
import { SongDetailsComponent } from './song/song-details/song-details.component';
import { SongCreateComponent } from './song/song-create/song-create.component';

const routes: Routes = [
  {path: '', component: SongListComponent},
  {path: 'create', component: SongCreateComponent},
  {path: 'details/:id', component: SongDetailsComponent},
  {path: 'edit/:id', component: SongCreateComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
