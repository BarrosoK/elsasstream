import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireAction } from '@angular/fire/database';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AnimesService} from '../../services/animes.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  historyRef;
  history;

  constructor(public animeService: AnimesService, public db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.historyRef = db.list('/history');

    db.list('/history/').snapshotChanges().subscribe((snap) => {
      console.log(snap);
    });

  }

  ngOnInit() {
  }

}
