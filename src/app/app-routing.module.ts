import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AnimesComponent} from './animes/animes.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthGuard} from './auth.guard';
import {HomeComponent} from './home/home.component';
import {EpisodeComponent} from './episode/episode.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'animes', component: AnimesComponent},
  {path: 'anime/:anime/:episode', component: EpisodeComponent},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
