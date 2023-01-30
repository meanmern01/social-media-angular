import { DatabaseService } from './../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Notiflix from 'notiflix';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  createGroup: boolean = false;
  newGroup!: FormGroup;
  image: any;
  token: any = localStorage.getItem('token')
  userData: any;
  allGroups: any;
  constructor(private fb: FormBuilder, private db: DatabaseService) { }
  ngOnInit(): void {
    this.newGroup = this.fb.group({
      groupName: ['', Validators.required],
      groupDesc: ['', Validators.required],
      groupLength: ['', Validators.required]
    })
    this.db.getUserData(this.token).subscribe((data: any) => {
      this.userData = data;
    })
    this.db.getGroups().subscribe((groups: any) => {
      console.log(groups);
      this.allGroups = groups;
    })
  }
  get groupName() {
    return this.newGroup.get('gName');
  }
  get groupDesc() {
    return this.newGroup.get('gDesc');
  }
  get groupLength() {
    return this.newGroup.get('gLength');
  }
  getImage(event: any) {
    console.log(event.target.files[0]);
    this.image = event.target.files[0]
  }
  addGroup() {
    if (this.newGroup.invalid) {
      Notiflix.Notify.failure('Please fill all fields', {
        timeout: 2000
      })
      return
    }
    let groupData = {
      ...this.newGroup.getRawValue(),
      adminId: this.userData.uid
    }
    console.log(groupData)
    this.db.addGroup(groupData).subscribe((res) => {
      this.db.pushGroupProfileToStorage(this.image, res.id).subscribe((dURL: any) => {
        this.db.updateGroupDetails(res.id, 'profile_Image', dURL).subscribe((res) => {
          Notiflix.Notify.success('Group Created Successfully', {
            timeout: 2000
          })
          this.newGroup.reset()
          this.image = undefined;
          this.db.getGroups().subscribe((data) => {
            this.allGroups = data;
          })
          this.createGroup = false
        })
      })
    })
  }
  isAdmin(group: any) {
    if (group.adminId === this.userData.uid) {
      return true
    } else {
      return false
    }
  }
  joinGroup(id: any) {
    this.db.joinGroup(id, this.token).subscribe((res) => {
      console.log(res)
    })
  }
  checkJoined(members: any) {
    if (members) {
      return members?.includes(this.token)
    }
    return
  }
}
