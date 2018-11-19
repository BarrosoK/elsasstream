import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import {Anime, AnimeInfo} from '../../models/anime';
import {AnimesService} from '../../services/animes.service';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {AnimeState} from '../state/anime.state';

@Component({
  selector: 'app-animes-card',
  templateUrl: './animes-card.component.html',
  styleUrls: ['./animes-card.component.scss'],
})
export class AnimesCardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  animes: Observable<Anime[]>;
  search = '';

  constructor(private breakpointObserver: BreakpointObserver, public animeService: AnimesService, private http: HttpClient, private store: Store) {
    this.animes = this.store.select(AnimeState.getAnimes);
  }
}
