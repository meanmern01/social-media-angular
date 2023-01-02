import { AuthService } from './../../../services/auth.service';
import { UtilService } from './../../../shared/util.service';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from './../../../services/database.service';
import { Router } from '@angular/router';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public isEmojiPickerVisible!: boolean;
  toggled: boolean = false;
  message: string = '';
  loginStatus: boolean = false;

  constructor(private router: Router, private auth: AuthService, private modalService: NgbModal, private db: DatabaseService, private toastr: ToastrService, private util: UtilService) { }
  ngOnInit(): void {
    localStorage.getItem('token') ? this.loginStatus = true : this.loginStatus = false;
    this.auth.logoutStatus.subscribe((status: any) => {
      console.log(status);
      this.loginStatus = status;
    })
  }


  handleSelection(event: any) {
    this.message += event.char;
  }
  openVerticallyCentered(content: any) {
    if (this.util.isLogin()) {
      this.modalService.open(content, { centered: true });
    }


  }

  uploadPost(content: any) {
    console.log(content);
    let postContent = {
      title: content,
      postAuthorId: localStorage.getItem('token')
    }
    this.db.addPost(postContent).subscribe((response) => {
      console.log('response', response);
    })
    this.message = ''
    this.toastr.success('Post Uploaded Successfully');
  }


  logout() {
    this.auth.signOut()
  }
}
