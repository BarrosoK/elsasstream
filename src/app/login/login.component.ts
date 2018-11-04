import {Component, OnInit, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
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

  }

  loginGoogle() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
          this.router.navigate(['/animes']);
        });
    });
  }

}
