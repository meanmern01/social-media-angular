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
  allUsers: any;
  token = localStorage.getItem('token');
  constructor(private db: DatabaseService) {

  }
  ngOnInit(): void {
    this.fillterUsers()
  }
  fillterUsers() {
    this.db.getAllUsers().subscribe(users => {
      let fUsers = users.filter(user => user.uid != this.token)
      console.log(fUsers);

      fUsers.map(e => {
        this.userNames.push(e.name)
      })
      this.allUsers = fUsers
    })
  }
  followes(data: any) {
    data = data?.map((ele: any) => {
      return ele
    })
    if (data?.includes(this.token)) {
      return true
    }
    return false
  }
  follow(postAuthorId: any) {
    this.db.follow(postAuthorId, this.token).subscribe((res: any) => {
    })
  }
  unfollow(postAuthorId: any) {
    this.db.unfollow(postAuthorId, this.token).subscribe((res: any) => {
    })
  }
}
