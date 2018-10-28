import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material';
import {environment} from '../../environments/environment';

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

  constructor(private breakpointObserver: BreakpointObserver) {
  }

}
