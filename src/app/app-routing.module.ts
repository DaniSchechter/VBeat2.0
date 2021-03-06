import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongListComponent } from './song/song-list/song-list.component';
import { SongEditComponent } from './song/song-edit/song-edit.component';
import { SongCreateComponent } from './song/song-create/song-create.component';
import { SongSearchComponent } from './song/song-search/song-search.component'
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserSignupComponent } from './user/user-signup/user-signup.component';
import { BrowserStatsComponent } from './stats/browser-stats/browser-stats.component';
import { PlaylistListComponent } from './playlist/playlist-list/playlist-list.component';
import { PlaylistCreateComponent } from './playlist/playlist-create/playlist-create.component';
import { PlaylistDetailsComponent } from './playlist/playlist-details/playlist-details.component';
import { QuickSearchComponent } from './quick-search/quick-search.component';
import { PlaylistSearchComponent } from './playlist/playlist-search/playlist-search.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { GraphComponent } from './stats/graph/graph.component';


const routes: Routes = [
  {path: '', component: SongListComponent},
  {path: 'create_song', component: SongCreateComponent},
  {path: 'edit_song/:id', component: SongEditComponent},
  {path: 'login', component: UserLoginComponent},
  {path: 'signup', component: UserSignupComponent},
  {path: 'stats', component: BrowserStatsComponent },
  {path: 'playlist/details/:id', component: PlaylistDetailsComponent},
  {path: 'playlist', component: PlaylistListComponent},
  {path: 'create_playlist', component: PlaylistCreateComponent},
  {path: 'song_search', component: SongSearchComponent},
  {path: 'quick_search', component: QuickSearchComponent},
  {path: 'playlist_search', component: PlaylistSearchComponent},
  {path: 'user_details', component: UserDetailsComponent},
  {path: 'mapReduce', component: GraphComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
