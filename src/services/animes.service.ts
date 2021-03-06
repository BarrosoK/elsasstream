import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Anime, AnimeInfo, Comment} from '../models/anime';
import {environment} from '../environments/environment';
import {Store} from '@ngxs/store';
import {AddAnime, AddAnimes} from '../app/actions/anime.action';
import {AngularFireDatabase, AngularFireList, AngularFireAction} from '@angular/fire/database';
import {BehaviorSubject, Observable} from 'rxjs';
import {first, map, switchMap} from 'rxjs/operators';
import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AddWatchListAnime, AddWatchListAnimes, RemoveWatchListAnime, SetSession} from '../app/actions/user.action';
import {UserState} from '../app/state/user.state';
import {FirebaseError, User} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AnimesService implements OnInit {

  scrapped: Array<string> = [
    'KickAssAnime',
    'NekoStreaming'
  ];

  animes: Observable<Anime[]>;
  toShow: Anime[] = [];
  aniimes: Anime[] = [];
  animeInfo: AnimeInfo;

  comments$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  animeEpisode$: BehaviorSubject<string | null>;

  history: Observable<{}[]>;
  history$: Observable<any[]>;

  filterBy(size: string | null) {
    this.animeEpisode$.next(size);
  }

  constructor(private http: HttpClient, private store: Store, private db: AngularFireDatabase, private afAuth: AngularFireAuth) {

    /* Auth */
    this.afAuth.authState.subscribe(res => {
      this.store.dispatch(new SetSession(res));
      if (res) {
        this.history = this.db.list(`history/${res.uid}/`, ref =>
          ref ? ref.limitToLast(50) : ref
        ).auditTrail();
      }
    });

    /* NGXS */
    this.animes = this.store.select(state => state.animes.animes);
    this.http.get<Anime[]>(environment.api + 'anime/list').subscribe((animes) => {
      this.aniimes = animes;
      this.toShow = animes;
      this.store.dispatch(new AddAnimes(animes));
    });

    /* Firebase */
    this.animeEpisode$ = new BehaviorSubject(null);
    this.comments$ = this.animeEpisode$.pipe(
      switchMap(anime =>
        db.list('comments', ref =>
          anime ? ref.orderByChild('anime').equalTo(anime) : ref
        ).snapshotChanges()
      )
    );

  }

  episodeWatched(anime: AnimeInfo, episode: number) {
    const uid = this.store.selectSnapshot(UserState.getSession).uid;
    this.db.list(`watched/${uid}/${anime.anime}/`).set(episode.toString(), {episode: episode, date: Date()});
  }

  removeWatched(anime: string, episode) {
    const uid = this.store.selectSnapshot(UserState.getSession).uid;
    if (episode > 0 && episode < 10 && episode.toString().length === 1) {
      episode = '0' + episode;
    }
    console.log('removing episode ' + episode);
    this.db.list(`watched/${uid}/${anime}/`).remove(episode.toString());
  }

  addToWatchList(anime) {
    const uid = this.store.selectSnapshot(UserState.getSession).uid;
    this.db.list(`watchlist/${uid}/`).set(`${anime.anime}`, anime);
    this.store.dispatch(new AddWatchListAnime(anime));
  }

  removeFromWatchList(anime) {
    const uid = this.store.selectSnapshot(UserState.getSession).uid;
    this.db.list(`watchlist/${uid}/`).remove(anime);
    this.store.dispatch(new RemoveWatchListAnime(anime));
  }

  getWatchListFromFirebase() {
    let animes: Observable<any>;

    this.store.select(UserState.getSession).subscribe((session) => {
      if (session) {
        const uid = session.uid;
        const animesRef = this.db.list(`watchlist/${uid}/`);
        animes = animesRef.snapshotChanges().pipe(
          map(changes =>
            changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
          )
        );
        console.log(`watchlist/${uid}/`);
        animes.pipe(first()).subscribe((res) => this.store.dispatch(new AddWatchListAnimes(res)), (err) => console.log('ERR', err));
      }
    });
  }

  getUid() {
    return new Promise<any>((resolve, reject) => {
      this.store.select(UserState.getSession).subscribe((session) => {
        (session && session.uid) ? resolve(session.uid) : resolve(undefined);
      });
    });
  }

  getWatchList() {

  }

  getAnime(anime: string) {
    this.http.get<AnimeInfo>(environment.api + 'anime/' + anime).subscribe((infos) => {
      this.animeInfo = infos;
      console.log(this.animeInfo);
    });
  }

  getEpisodeComments(anime: string, episode) {
    if (episode > 0 && episode < 10 && episode.toString().length === 1 ) {
      episode = '0' + episode;
    }
    this.comments$ = this.animeEpisode$.pipe(
      switchMap(ime =>
        this.db.list(`comments/${anime}/${episode}/`, ref =>
          ref ? ref.limitToLast(5) : ref
        ).snapshotChanges()
      )
    );
  }

  addEpisodeComment(anime: string, episode, comment: Comment) {
    if (episode > 0 && episode < 10 && episode.toString().length === 1 ) {
      episode = '0' + episode;
    }
    this.db.list(`/comments/${anime}/${episode}/`).push(comment);
  }

  async addAnimeToHistory(uid: string, anime: string, episode) {
    this.history$ = new BehaviorSubject(null);
    this.history = this.db.list(`history/${uid}/${anime}/${episode}`, ref =>
      ref ? ref.limitToLast(50) : ref
    ).valueChanges();

    this.history.subscribe(res => {
      if (res.length === 0) {
        this.db.list(`history/${uid}/${anime}/${episode}`).push({anime: anime, episode: episode, date: Date.now()});
      }
    });
  }

  ngOnInit(): void {
  }

}
