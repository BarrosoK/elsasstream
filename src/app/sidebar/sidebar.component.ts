import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material';
import {environment} from '../../environments/environment';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import {AngularFireDatabase} from 'angularfire2/database';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  config = environment;
  isMobile = false;
  @ViewChild('drawer') sidenav: MatSidenav;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  onNavClick() {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }


  ngOnInit() {
    this.isHandset$.subscribe((onMobile) => {
      this.isMobile = onMobile;
      if (!onMobile && !this.sidenav.opened) {
        this.sidenav.open();
      } else if (onMobile && this.sidenav.opened) {
        this.sidenav.close();
      }
    });
  }

  logout() {
    if (!this.afAuth.auth) { return; }
    this.afAuth.auth.signOut();
    this.router.navigate(['']);
  }

  constructor(private router: Router, private breakpointObserver: BreakpointObserver, public afAuth: AngularFireAuth) {
  }

}
