import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Anime, AnimeInfo, Comment} from '../models/anime';
import {environment} from '../environments/environment';
import {Store} from '@ngxs/store';
import {AddAnime, AddAnimes} from '../app/actions/anime.action';
import { AngularFireDatabase, AngularFireList, AngularFireAction } from '@angular/fire/database';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AnimesService implements OnInit {

  animes: Observable<Anime[]>;
  toShow: Anime[] = [];
  aniimes: Anime[] = [];
  animeInfo: AnimeInfo;

  comments$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  animeEpisode$: BehaviorSubject<string|null>;

  filterBy(size: string|null) {
    this.animeEpisode$.next(size);
  }

  constructor(private http: HttpClient, private store: Store, private db: AngularFireDatabase) {
    this.animes = this.store.select(state => state.animes.animes);
    this.http.get<Anime[]>(environment.api + 'anime/list').subscribe((animes) => {
      this.aniimes = animes;
      this.toShow = animes;
      this.store.dispatch(new AddAnimes(animes));
      console.log('done !', this.aniimes);
    });

    this.animeEpisode$ = new BehaviorSubject(null);
    this.comments$ = this.animeEpisode$.pipe(
      switchMap(anime =>
        db.list('comments', ref =>
          anime ? ref.orderByChild('anime').equalTo(anime) : ref
        ).snapshotChanges()
      )
    );
  }

  getAnime(anime: string) {
     this.http.get<AnimeInfo>(environment.api + 'anime/' + anime).subscribe((infos) => {
       this.animeInfo = infos;
       console.log(this.animeInfo);
     });
  }

  getEpisodeComments(anime: string,  episode) {
    this.comments$ = this.animeEpisode$.pipe(
      switchMap(ime =>
        this.db.list(`comments/${anime}/${episode}/`, ref =>
          ime ? ref.limitToLast(5) : ref
        ).snapshotChanges()
      )
    );
  }

  addEpisodeComment(anime: string, episode, comment: Comment) {
    this.db.list(`/comments/${anime}/${episode}/`).push(comment);
  }

  ngOnInit(): void {
  }

}
