import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Anime, AnimeInfo} from '../models/anime';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimesService implements OnInit {

  animes: Anime[] = [];
  animeInfo: AnimeInfo;

  constructor(private http: HttpClient) {
    this.http.get<Anime[]>(environment.api + 'anime/list').subscribe((animes) => {
      this.animes = animes;
      console.log('done !', this.animes);
    });
  }

  getAnime(anime: string) {
     this.http.get<AnimeInfo>(environment.api + 'anime/' + anime).subscribe((infos) => {
       this.animeInfo = infos;
       console.log(this.animeInfo);
     };
  }

  ngOnInit(): void {
  }

}
