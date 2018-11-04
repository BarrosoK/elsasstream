import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Anime, AnimeInfo} from '../models/anime';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {AddAnime, AddAnimes} from '../app/actions/anime.action';

@Injectable({
  providedIn: 'root'
})
export class AnimesService implements OnInit {

  animes: Observable<Anime[]>;
  toShow: Anime[] = [];
  aniimes: Anime[] = [];
  animeInfo: AnimeInfo;

  constructor(private http: HttpClient, private store: Store) {
    this.animes = this.store.select(state => state.animes.animes);
    this.http.get<Anime[]>(environment.api + 'anime/list').subscribe((animes) => {
      this.aniimes = animes;
      this.toShow = animes;
      this.store.dispatch(new AddAnimes(animes));
      console.log('done !', this.aniimes);
    });
  }

  getAnime(anime: string) {
     this.http.get<AnimeInfo>(environment.api + 'anime/' + anime).subscribe((infos) => {
       this.animeInfo = infos;
       console.log(this.animeInfo);
     });
  }

  ngOnInit(): void {
  }

}
