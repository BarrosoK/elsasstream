import { Component, OnInit } from '@angular/core';
import {AnimesService} from '../../services/animes.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  selected;

  constructor(public animeService: AnimesService) {
    this.selected = animeService.scrapped[0];
  }

  ngOnInit() {
  }

  scrappedChange() {
    console.log('changed !');
  }

}
