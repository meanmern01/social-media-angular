import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  private searchClient = {
    appId: 'L9X0MTZMRZ',
    apikey: '5dfbacc2564682c5a956d82446c0c866'
  }
  title = 'social-media-app';
  isAuth!: boolean;
  // index =
  constructor(private route: ActivatedRoute, private router: Router) {
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
  }

}
