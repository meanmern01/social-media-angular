// @ts-nocheck
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  light: Boolean;
  resourceData: any[] = [1, 2, 3, 4];
  ngOnInit(): void {
    this.light = JSON.parse(localStorage.getItem('theme'));
    console.log('theme', typeof this.light);
    document.getElementById("body").setAttribute("data-bs-theme", this.light ? "light" : "dark");

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
          localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
      }

    });
  }
  setTheme() {
    this.light = !this.light
    console.log(this.light)
    localStorage.setItem('theme', this.light)
    document.getElementById("body").setAttribute("data-bs-theme", this.light ? "light" : "dark");
  }

}
