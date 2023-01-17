import { DatabaseService } from './../../../services/database.service';
import { filter, take } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  light!: any;
  resourceData: any = [];
  url!: string;
  show!: boolean;

  constructor(private route: Router, private db: DatabaseService) {
    route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/chat' || event.url === '/trending' || event.url === '/search' || event.url === '/profile') {
        this.show = true;
      } else {
        this.show = false;
      }
    });
  }
  ngOnInit(): void {
    this.light = localStorage.getItem('theme') || '';
    if (this.light === 'true') {
      this.light = true;
    } else {
      this.light = false;
    }
    document?.getElementById("body")?.setAttribute("data-bs-theme", this.light ? "light" : "dark");
    // this.checkRoute()
    this.getResources()
  }
  sidebar() {
    window.addEventListener('DOMContentLoaded', event => {

      // Toggle the side navigation
      const sidebarToggle = document.body.querySelector('#sidebarToggle');
      if (sidebarToggle) {
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //   document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
          event.preventDefault();
          document.body.classList.toggle('sb-sidenav-toggled');
          localStorage.setItem('sb|sidebar-toggle', JSON.stringify(document.body.classList.contains('sb-sidenav-toggled')));
        });
      }

    });
  }
  setTheme() {
    this.light = !this.light
    localStorage.setItem('theme', JSON.stringify(this.light))
    document.getElementById("body")?.setAttribute("data-bs-theme", this.light ? "light" : "dark");
  }
  isHome(): any {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/home') {
        return true
      }
      return false
    });
  }
  getResources() {
    this.db.getNews().pipe(
      take(4)
    ).subscribe((res: any) => {
      this.resourceData = res.value;
      console.log(this.resourceData, "dsflsfkj.sjnf,ksdjf,sbdf b,fjsia");

    })
  }
}
