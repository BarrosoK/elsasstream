import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {first, map} from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import {AnimesService} from '../../services/animes.service';
import {Anime, AnimeInfo} from '../../models/anime';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {ListRange} from '@angular/cdk/collections';
import {AddAnime} from '../actions/anime.action';
import {Store} from '@ngxs/store';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SetWatching} from '../actions/user.action';
import {UserState} from '../state/user.state';
import {Router} from '@angular/router';


@Component({
  selector: 'app-animes',
  templateUrl: './animes.component.html',
  styleUrls: ['./animes.component.scss'],
})

export class AnimesComponent implements OnInit {
  search = '';

  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewport: CdkVirtualScrollViewport;
  size = 20;
  animes: Anime[];
  
  async animeOverview(anime) {
      this.openDialog(anime);
  }

  openDialog(anime): void {
    const dialogRef = this.dialog.open(AnimeOverview, {
      height: '80%',
      panelClass: 'panelAnime',
      data: anime
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }

  AddAnime() {
    this.store.dispatch(new AddAnime({name: 'fdp'}));
  }


  removeAnime() {
    this.size = 20;
    this.animesService.animeInfo = undefined;
  }

  searchAnime() {

  }

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private animesService: AnimesService, private store: Store, public dialog: MatDialog) {
  }

  openAnime(anime: Anime) {
    this.router.navigate(['/anime/detail/' + anime.link]);

  }


  ngOnInit() {}
}


@Component({
  selector: 'app-animeOverview',
  templateUrl: './anime-overview.html',
})
export class AnimeOverview {

  animeInfos;
  anime$: Observable<AnimeInfo>;
  temp;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<AnimeOverview>,
    @Inject(MAT_DIALOG_DATA) public anime: Anime, private animeService: AnimesService, private http: HttpClient, private store: Store) {
    this.anime$ = this.store.select(UserState.getWatching);
    this.temp = anime;
    this.loadAnime();
  }

  async loadAnime() {
    this.anime$.pipe(first()).subscribe((res) => {
      if (!res || res.anime !== this.temp.link) {
        this.http.get<AnimeInfo>(environment.api + 'anime/' + this.temp.link).subscribe(infos => {
          this.animeInfos = infos;
          console.log(this.animeInfos.episodes);
          this.store.dispatch(new SetWatching(infos));
        });
      } else {
        this.animeInfos = res;
      }

    });
  }

  openAnime(anime: AnimeInfo) {
    this.router.navigate(['/anime/detail/' + this.anime.link]).finally(() => this.dialogRef.close());

  }

  watchEpisode(episode) {
    this.router.navigate(['/anime/' + this.animeInfos.anime + '/' + episode]);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
