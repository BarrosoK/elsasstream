import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {AnimesService} from '../../services/animes.service';
import {Store} from '@ngxs/store';
import {UserState} from '../state/user.state';
import {Router} from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {

  animesRef: AngularFireList<any>;
  animes: Observable<any[]>;
  cols = 2;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private db: AngularFireDatabase, private animeService: AnimesService, private store: Store) {

      this.store.select(UserState.getSession).subscribe((session) => {
          if (session) {
            const uid = session.uid;
            this.animesRef = db.list(`watchlist/${uid}/`);
            this.animes = this.animesRef.snapshotChanges().pipe(
              map(changes =>
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
              )
            );
            console.log(`watchlist/${uid}/`);
            this.animes.subscribe((res) => console.log('RES', res), (err) => console.log('ERR', err));
          }
      });

    this.isHandset$.subscribe((onMobile) => {
      (onMobile) ? this.cols = 1 : this.cols = 3;
    });
  }

  watch(anime: string) {
    this.router.navigate(['/anime/detail/' + anime]);
  }

  ngOnInit() {
  }

}
