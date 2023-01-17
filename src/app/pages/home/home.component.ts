import * as Notiflix from 'notiflix';
import { post } from './../../modal/user-data.model';
import { DatabaseService } from './../../services/database.service';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { UtilService } from 'src/app/shared/util.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  error: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  message: any;
  trendingPostsData!: any[];
  isAuthor!: boolean;
  i: any;
  constructor(private db: DatabaseService, private util: UtilService) { }
  postsData!: post[]
  isLiked: boolean = false;
  token = localStorage.getItem('token') || '';
  sending: boolean = false;
  displayComm: any;
  displayCommBoolean: Boolean = false;
  resouceData: any[] = []
  ngOnInit(): void {
    this.getPosts()
    this.getUserData()
    this.trendingPosts()
    this.getResources()
  }
  getUserData() {
    this.db.getUserData(this.token).subscribe((userData: any) => {
      console.log(userData, "User Data");
      localStorage.setItem("userData", JSON.stringify(userData));
    })
  }
  displayComment(id: any) {
    this.displayComm = id
    this.displayCommBoolean = !this.displayCommBoolean
  }
  getPosts() {
    this.db.getPosts().subscribe((res: post[]) => {
      if (res.length > 0) {
        this.postsData = res;
        console.log(res);

      } else {
        this.message = "No posts found"
      }
    })
  }

  like(event: any, postUid: any) {
    if (this.util.isLogin()) {
      this.checkLiked(postUid)
      event.stopPropagation();
      let flag = 0
      this.db.checkAlreadyLikes({ id: postUid }).subscribe((res: any) => {
        let token: any = localStorage.getItem("token")
        let check = res?.likes === undefined ? 'inc' : res?.likes?.includes(token) ? 'dec' : 'inc'
        const likes = res?.likes === undefined ? [token] : check === 'inc' ? [...res?.likes, token] : [...res?.likes]
        if (check === 'dec') {
          let i = likes.indexOf(token)
          likes.splice(i, 1)
        }
        if (flag === 0) {
          flag = 1
          this.db.updateLikeCount({ id: postUid, likes, type: check }).subscribe((res: any) => {
            return
          })
        }
      })
    }
  }
  checkLiked(uid: string) {
    this.db.checkAlreadyLikes({ id: uid }).subscribe((res: any) => {
    })
  }
  comment(event: any, postId: string, i: number) {
    if (this.util.isLogin()) {
      if (event >= 0) {
        Notiflix.Notify.failure("Please Enter Some Content to Comment")
      } else {
        //   // this.error = ""
        this.sending = true;
        this.db.addComment({ id: this.token, comment: event, postId }).subscribe((res: any) => {
          Notiflix.Notify.info("Comment Added Successfully !!!")
        })
      }
      setTimeout(() => {
        this.sending = false;
      }, 1500)
    }
  }
  followes(data: any) {
    if (data?.includes(this.token)) {
      return true
    }
    return false
  }
  trendingPosts() {
    this.db.trendingPosts().subscribe((posts: any[]) => {
      this.trendingPostsData = posts;
    });

  }
  checkLikes(value: any) {
    if (value) {
      return value?.includes(this.token)
    }
    return false
  }
  checkAuthor(id: any) {
    // this.checkFollowing(id)
    if (this.token === id) {
      return true
    } else {
      return false
    }
  }
  follow(postAuthorId: any) {
    this.db.follow(postAuthorId, this.token).subscribe((res: any) => {
    })
  }
  unfollow(postAuthorId: any) {
    this.db.unfollow(postAuthorId, this.token).subscribe((res: any) => {
    })
  }

  getResources() {
    this.db.getNews().subscribe((res: any) => {
      console.log(res.value);
      this.resouceData = res.value;
    })
  }
}
