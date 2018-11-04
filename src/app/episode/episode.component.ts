import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Anime, AnimeInfo} from '../../models/anime';
import {environment} from '../../environments/environment';
import {SetWatching} from '../actions/user.action';
import {Store} from '@ngxs/store';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserState} from '../state/user.state';
import {first, min} from 'rxjs/operators';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.scss']
})
export class EpisodeComponent implements OnInit {

  episode;
  animeLink: string;
  anime$: Observable<AnimeInfo>;
  anime: AnimeInfo;
  episodeLinks;
  urls: SafeResourceUrl[] = [];
  currentUrl = 0;

  next() {
    this.currentUrl = Math.min(Math.max(this.currentUrl + 1, 0), this.urls.length - 1);
  }

  prev() {
    this.currentUrl = Math.min(Math.max(this.currentUrl - 1, 0), this.urls.length - 1);
  }

  async loadAnimeInformations() {
    this.anime$.pipe(first()).subscribe((res: AnimeInfo) => {
      if (!res || res.anime !== this.animeLink) {
        this.http.get<AnimeInfo>(environment.api + 'anime/' + this.animeLink).subscribe(infos => {
          this.anime = infos;
          console.log(infos);
          this.store.dispatch(new SetWatching(infos));
        });
      } else {
       this.anime = res;
      }
      this.http.get(environment.api + 'anime/' + this.animeLink + '/' + this.episode).subscribe(episode => {
          this.episodeLinks = episode;
        for (const url of episode['links']) {
          this.urls.push(this.sanitizer.bypassSecurityTrustResourceUrl(url));
        }

      });
    });
  }

  constructor(private activeRoute: ActivatedRoute, private store: Store, private http: HttpClient, public sanitizer: DomSanitizer) {
    this.anime$ = this.store.select(UserState.getWatching);
    const routeParams = this.activeRoute.snapshot.params;
    this.episode = routeParams.episode;
    this.animeLink = routeParams.anime;
    this.loadAnimeInformations();
    }

  async ngOnInit() {

  }

}