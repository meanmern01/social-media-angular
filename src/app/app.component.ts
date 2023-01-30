import { Component, HostListener, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  @HostListener("window:beforeunload", ["$event"])
  beforeUnloadHandler($event: any) {
    console.log("beforeunload")
    this.db.updateUserData(this.token, 'online', false)
  }
  private searchClient = {
    appId: 'L9X0MTZMRZ',
    apikey: '5dfbacc2564682c5a956d82446c0c866'
  }
  token = localStorage.getItem('token')
  title = 'social-media-app';
  isAuth!: boolean;
  // index =
  constructor(private route: ActivatedRoute, private router: Router, private db: DatabaseService) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/login' || event.url === '/signup') {
        this.isAuth = true;
      } else {
        this.isAuth = false;
      }
    });
  }
  ngOnInit(): void {
    this.db.updateUserData(this.token, 'online', true)
  }

}
