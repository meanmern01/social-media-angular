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
  constructor(private db: DatabaseService, private util: UtilService, private _snackBar: MatSnackBar) { }
  postsData!: post[]
  isLiked: boolean = false;
  token = localStorage.getItem('token');
  sending: boolean = false;
  ngOnInit(): void {
    this.getPosts()

  }
  getPosts() {
    this.db.getPosts().subscribe((res: post[]) => {
      if (res.length > 0) {
        this.postsData = res
        console.log(this.postsData)
        console.log("first")
      } else {
        this.message = "No posts found"
        console.log("dsijfsiZLDF")
      }
    })
  }

  like(event: any, postUid: any) {
    if (this.util.isLogin()) {
      this.checkLiked(postUid)
      event.stopPropagation();
      let flag = 0
      this.db.checkAlreadyLikes(postUid).subscribe((res: any) => {
        let token: any = localStorage.getItem("token")
        let check = res.likes === undefined ? 'inc' : res.likes?.includes(token) ? 'dec' : 'inc'
        const likes = res.likes === undefined ? [token] : check === 'inc' ? [...res.likes, token] : [...res.likes]
        if (check === 'dec') {
          let i = likes.indexOf(token)
          likes.splice(i, 1)
        }
        if (flag === 0) {
          flag = 1
          this.db.updateLikeCount(postUid, likes, check).subscribe((res: any) => {
            console.log(res);
            return
          })
        }

      })
    }
  }
  checkLiked(uid: string) {
    this.db.checkAlreadyLikes(uid).subscribe((res: any) => {
      console.log(res);

    })
  }
  comment(event: any, postId: string, i: number) {
    if (this.util.isLogin()) {
      if (event >= 0) {
        //   // this.error = "Please Enter Some Content to Comment"
        this.openSnackBar("Please Enter Some Content to Comment")
      } else {
        //   // this.error = ""
        this.sending = true;
        this.db.addComment(this.token, event, postId).subscribe((res: any) => {
          console.log(res);

        })
      }
      console.log(event);
      setTimeout(() => {
        this.sending = false;
      }, 1500)
    }
  }
  openSnackBar(value: string) {
    this._snackBar.open(value, 'got it!', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      // duration: 5 * 1000,
      panelClass: ["custom-class"]
    });
  }

}
