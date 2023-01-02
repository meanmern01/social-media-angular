import { userData, post, comment } from './../modal/user-data.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { Observable, from, combineLatest, map, filter } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { arrayUnion, increment } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private userDatasCollection: AngularFirestoreCollection<userData>;
  private postDatasCollection!: AngularFirestoreCollection<any>;
  userData$: Observable<userData[]>;
  postData$!: Observable<any[]>;
  postLikeData$!: Observable<any[]>;

  constructor(private afs: AngularFirestore) {
    this.userDatasCollection = afs.collection<userData>('users');
    this.postDatasCollection = afs.collection<any>('posts');
    this.userData$ = this.userDatasCollection.valueChanges();
  }

  addUserData(userData: userData): Observable<DocumentReference> {
    return from(this.userDatasCollection.add(userData));
  }

  updateUserData(userData: userData): Observable<void> {
    return from(
      this.afs.doc<userData>(`users/${userData.id}`).update({
      }),
    );
  }

  DeleteUserData() {

  }


  // Add Post
  addPost(postData: any): Observable<DocumentReference> {
    console.log("Uploading post...");
    let uid = this.afs.createId()
    return from(this.postDatasCollection.add({ ...postData, timeStamp: +new Date(), uid: uid }))
  }

  //Get Post
  getPosts() {
    // const posts = this.postDatasCollection.valueChanges()
    // console.log(posts.subscribe((res: any) => { console.log(res) }))
    // const user = this.userDatasCollection.valueChanges()

    // const combinedList = combineLatest<any[]>(posts, user).pipe(
    //   map(arr => arr.reduce(function (acc, cur) {
    //     let result: any = []
    //     acc.filter((x: any, i: number) => result.push({ ...x, ...cur.filter((e: any) => e.uid == x.postAuthorId)[0] }))
    //     return result
    //   }
    //   ))
    // )
    const user = this.afs.collection('users').snapshotChanges().pipe(
      map(uactions => {
        return uactions.map(userAction => {
          const uData = userAction.payload.doc.data() as any;
          return uData


        })

      })
    )
    const posts = this.afs.collection('posts').snapshotChanges().pipe(
      map(pactions => {
        return pactions.map(postAction => {
          const pData = postAction.payload.doc.data() as any;
          return { ...pData, postId: postAction.payload.doc.id }
        })
      })
    );

    const combinedList = combineLatest<any[]>(posts, user).pipe(
      map(arr => arr.reduce(function (acc, cur) {
        console.log('data', acc, cur)
        let result: any = []
        acc.filter((x: any, i: number) => result.push({ ...x, ...cur.filter((e: any) => e?.uid == x?.postAuthorId)[0] }))
        return result
      }
      )))
    console.log(combinedList.subscribe(x => console.log(x)));

    return combinedList;
  }


  //Get Post Author User Data
  getPostAuthor() {
    return this.userDatasCollection.valueChanges();
  }


  //update like count
  updateLikeCount(id: string, likes: any, type: any) {
    return from(this.afs.collection('posts/').doc(id).update({ likesCount: type === 'inc' ? increment(1) : increment(-1), likes: likes }))
  }

  checkAlreadyLikes(id: string) {
    return from(this.afs.collection('posts/').doc(id).valueChanges())
  }

  addComment(id: any, comment: string, postId: string) {
    console.log(id, comment);
    let commentData: comment = {
      userId: id,
      commentText: comment,
      time: +new Date()
    }

    return from(this.afs.collection('posts').doc(postId).update({ comments: arrayUnion(commentData) }))
  }
  getComments() {
    return from(this.afs.collection('posts').valueChanges())
  }
}
