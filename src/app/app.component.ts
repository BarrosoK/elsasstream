import { Component } from '@angular/core';
import {AnimesService} from '../services/animes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stream';
  constructor(private animeService: AnimesService) {
    this.animeService.getWatchListFromFirebase();
  }
}
