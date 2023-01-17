import { DatabaseService } from './../../services/database.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  fillterdNames!: string;
  userNames: any[] = [];
  constructor(private db: DatabaseService) {

  }
  ngOnInit(): void {
    this.fillterUsers()
  }
  search(value: any) {
    console.log(value, 'Enterd value');
  }
  fillterUsers() {
    this.db.getAllUsers().subscribe(users => {
      console.log(users)
      users.map(e => {
        this.userNames.push(e.name)
      })
    })

  }
}
