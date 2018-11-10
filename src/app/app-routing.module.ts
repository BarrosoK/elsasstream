import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AnimesComponent} from './animes/animes.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {EpisodeComponent} from './episode/episode.component';
import {HistoryComponent} from './history/history.component';
import {ProfileComponent} from './profile/profile.component';
import {AnimesCardComponent} from './animes-card/animes-card.component';
import {AnimeInfoComponent} from './anime-info/anime-info.component';
import {AuthGuard} from '../guards/auth.guard';
import {WatchlistComponent} from './watchlist/watchlist.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  // Profile
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent,  canActivate: [AuthGuard]},
  {path: 'watchlist', component: WatchlistComponent, canActivate: [AuthGuard]},
  // Anime
  {path: 'animes', component: AnimesComponent},
  {path: 'animes/cards', component: AnimesCardComponent},
  {path: 'anime/detail/:anime', component: AnimeInfoComponent},
  {path: 'anime/:anime/:episode', component: EpisodeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
