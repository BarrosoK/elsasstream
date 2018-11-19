import { Component, OnInit } from '@angular/core';
import {AnimesService} from '../../services/animes.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {first, map, switchMap} from 'rxjs/operators';
import {AnimeInfo} from '../../models/anime';
import {environment} from '../../environments/environment';
import {SetWatching} from '../actions/user.action';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngxs/store';
import {UserState} from '../state/user.state';
import {User} from 'firebase';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Component({
  selector: 'app-anime-info',
  templateUrl: './anime-info.component.html',
  styleUrls: ['./anime-info.component.scss']
})
export class AnimeInfoComponent implements OnInit {

  currentAnime: Observable<AnimeInfo>;
  red = 'slategrey';
  session: Observable<any>;

  watchlist;
  alreadyWatchList = false;

  constructor(private db: AngularFireDatabase, private animeService: AnimesService, public aRouter: ActivatedRoute, private router: Router, private http: HttpClient, private store: Store) {
    this.currentAnime = this.store.select(UserState.getWatching);
    this.aRouter.params.subscribe((params) => {
      this.http.get<AnimeInfo>(environment.api + 'anime/' + params['anime']).subscribe(infos => {
        this.store.dispatch(new SetWatching(infos));
      });
    });

    this.store.select(UserState.getSession).subscribe((session) => {
      if (session) {
        const uid = session.uid;
         const animesRef = db.list(`watchlist/${uid}/`, ref =>
          ref.orderByChild('anime').equalTo(this.aRouter.snapshot.params['anime']));
         this.watchlist = animesRef.snapshotChanges().pipe(
          map(changes =>
            changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
          )
        );
        console.log(`watchlist/${uid}/`);
        this.watchlist.subscribe((res) => {
          (res.length === 0) ? this.alreadyWatchList = false : this.alreadyWatchList = true;
        }, (err) => console.log('ERR', err));
      }
    });
  }

  watchEpisode(episode) {
    this.router.navigate(['/anime/' + this.aRouter.snapshot.params['anime'] + '/' + episode]);
  }

  ngOnInit() {
  }

}
