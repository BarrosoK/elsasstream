import {Component, OnInit, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireDatabase} from 'angularfire2/database';

import {FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs';

export interface Test {
  name: string;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  items$: Observable<Test[]>;
  error: any;

  loginForm = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required],
  });

  ngOnInit() {
    // this.afs.collection('animes').valueChanges().subscribe(res => console.log(res));
    this.afAuth.authState.subscribe(res => console.log(res));
  }

  constructor(private afs: AngularFirestore, public db: AngularFireDatabase, private fb: FormBuilder, private router: Router, public afAuth: AngularFireAuth) {
  }

  login() {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        const provider = new firebase.auth.EmailAuthProvider();
        return firebase.auth().signInWithEmailAndPassword(this.loginForm.getRawValue().username, this.loginForm.getRawValue().password).then(
          res => this.router.navigate(['/animes']))
          .catch(res => console.log(res));
      });
  }

  loginGoogle() {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        const provider = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(provider).then(
          res => this.router.navigate(['/animes']))
          .catch(res => console.log(res));
      });

  }
}
