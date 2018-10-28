import {Component, OnInit} from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import {AnimesService} from '../../services/animes.service';
import {AnimeInfo} from '../../models/anime';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-animes',
  templateUrl: './animes.component.html',
  styleUrls: ['./animes.component.scss'],
})
export class AnimesComponent implements OnInit {

  loadAnime(anime: string) {
    this.animesService.getAnime(anime);
  }

  removeAnime() {
    this.animesService.animeInfo = undefined;
  }

  constructor(private breakpointObserver: BreakpointObserver, private animesService: AnimesService) {
  }

  ngOnInit() {}
}
