import { Component, OnInit } from '@angular/core';
import {ToastService} from '../../services/toast.service';
import { AngularFireDatabase, AngularFireList, AngularFireAction } from '@angular/fire/database';
import {AnimesService} from '../../services/animes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private toast: ToastService, private db: AngularFireDatabase, public animeService: AnimesService) {
  }


  ngOnInit() {
  }

}
