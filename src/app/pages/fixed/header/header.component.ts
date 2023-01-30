import { AuthService } from './../../../services/auth.service';
import { UtilService } from './../../../shared/util.service';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from './../../../services/database.service';
import { Router } from '@angular/router';
import { Component, ElementRef, ViewChild, OnInit, NgZone } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Notiflix from 'notiflix'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public isEmojiPickerVisible!: boolean;
  @ViewChild('file') file!: ElementRef<HTMLInputElement>;
  toggled: boolean = false;
  message: string = '';
  selectedFile: any;
  loginStatus: boolean = false;
  image!: File;
  currentFileUpload: any;
  token: string = localStorage.getItem('token') || '';
  imagePreviewSrc: string | ArrayBuffer | null | undefined;
  isImageSelected!: boolean;
  format!: string;
  url!: string | ArrayBuffer | null;
  userDetail  !: any;

  constructor(private router: Router, private auth: AuthService, private db: DatabaseService, private toastr: ToastrService, private util: UtilService) {
    Notiflix.Notify.init({});
    Notiflix.Block.init({});
  }
  ngOnInit(): void {
    localStorage.getItem('token') ? this.loginStatus = true : this.loginStatus = false;
    this.auth.logoutStatus.subscribe((status: any) => {
      this.loginStatus = status;
    })
    // this.userDetail = JSON.parse(localStorage.getItem("userData") || '');
    if (this.loginStatus) {
      this.db.getUserData(this.token).subscribe(uData => {
        this.userDetail = uData;
      })
    }

  }


  handleSelection(event: any) {
    this.message += event.char;
  }
  uploadPost(content: any) {

    if (this.util.isLogin()) {
      if (!this.image) {
        Notiflix.Notify.failure('Please Select An Image or video to upload the post.', {
          timeout: 3000, // Display the notification for 6 seconds
          width: '300px', // Set the width of the notification
          cssAnimationStyle: 'fade', // Use the fade-up animation style
          clickToClose: true // Allow the user to close the notification by clicking on it
        });
        return
      }
      let postContent = {
        title: content,
        postAuthorId: localStorage.getItem('token'),
        format: this.format || 'unknown',
        likesCount: 0
      }
      let flag = 0;
      if (flag === 0) {
        this.db?.pushFileToStorage(this.image)?.subscribe((response: any) => {

          this.db.addPost({ postData: { ...postContent, imageUrl: response } })
          Notiflix.Notify.success('Post Uploaded Successfully', { timeout: 3000 });
          this.router.navigate(['/home'])
        })
        flag = 1;
        this.message = ''
      }
    }
  }
  fileChoose(event: any) {
    this.image = event.target.files[0];
    this.showPreview(event)
  }
  showPreview(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      }
    }
  }
  isLogin() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.auth.signOut()
    this.router.navigate(['/home'])
  }
}
