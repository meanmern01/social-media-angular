import { userData, post, comment, chat } from './../modal/user-data.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { Observable, from, combineLatest, map, filter, finalize, catchError, throwError, tap, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { arrayUnion, increment } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { arrayRemove, DocumentSnapshot, QuerySnapshot, serverTimestamp } from 'firebase/firestore';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private userDatasCollection: AngularFirestoreCollection<userData>;
  private postDatasCollection!: AngularFirestoreCollection<any>;
  userData$: Observable<userData[]>;
  postData$!: Observable<any[]>;
  postLikeData$!: Observable<any[]>;
  basePath = 'post/images'
  downloadURL: any;
  error!: void;
  chatCollection: AngularFirestoreCollection<chat>;
  subscription: any;
  constructor(private afs: AngularFirestore, private fireStorage: AngularFireStorage, private https: HttpClient) {
    this.userDatasCollection = afs.collection<userData>('users');
    this.postDatasCollection = afs.collection<any>('posts');
    this.chatCollection = afs.collection<chat>('chat');
    this.userData$ = this.userDatasCollection.valueChanges();
  }
  //adds the user data to the database
  addUserData({ userData }: { userData: userData; }): any {
    return from((this.userDatasCollection.doc(userData.uid).set(userData)))
  }
  //Update user specific field of data from database
  updateUserData(id: any, key: any, data: any): Observable<void> {
    return from(
      this.userDatasCollection.doc(id).update({ [key]: data })
    );
  }
  //Update user data from database
  updateUserAllData(id: any, data: any) {
    return from(this.userDatasCollection.doc(id).update(data))
  }
  //Delete a user
  DeleteUserData(): void {

  }
  //get all users
  getAllUsers() {
    return from(this.userDatasCollection.valueChanges())
  }
  // Add Post
  addPost({ postData }: { postData: any; }): Observable<DocumentReference> {
    console.log("Uploading post...");
    let uid = this.afs.createId()
    return from(this.postDatasCollection.add({ ...postData, timeStamp: +new Date(), uid: uid }))
  }
  //Get Post
  getPosts(): Observable<any> {
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
        let result: any = []
        acc.filter((x: any, i: number) => result.push({ ...x, ...cur.filter((e: any) => e?.uid == x?.postAuthorId)[0] }))
        return result
      }
      )))
    const commentCombinedList = combineLatest<any[]>(combinedList, user).pipe(
      map(arr => arr.reduce(function (acc, cur) {

        let result: any = []
        acc.filter((x: any, i: number) => result.push({
          ...x, comments: x?.comments?.filter((e: any) => {
            return e.user = cur.filter((a: any) => a?.uid == e.userId)[0]
          })
        }))
        return result
      }
      )
      )
    )

    return commentCombinedList;
  }
  //update like count
  updateLikeCount({ id, likes, type }: { id: string; likes: any; type: any; }): Observable<void> {

    return from(this.afs.collection('posts/').doc(id).update({ likesCount: type === 'inc' ? increment(1) : increment(-1), likes: likes }))
  }
  //checks that the user has already liked this post
  checkAlreadyLikes({ id }: { id: string; }): Observable<unknown> {
    return from(this.afs.collection('posts/').doc(id).valueChanges())
  }
  //adds a comment
  addComment({ id, comment, postId }: { id: any; comment: string; postId: string; }): Observable<void> {
    let commentData: comment = {
      userId: id,
      commentText: comment,
      time: +new Date()
    }

    return from(this.afs.collection('posts').doc(postId).update({ comments: arrayUnion(commentData) }))
  }
  //Upload Images / Videos to storage
  pushFileToStorage(image?: any): Observable<unknown> {
    if (image) {
      if (image.type === 'image/png' || image.type === 'image/jpeg' || image.type === 'image/jpg' || image.type === 'image/gif') {
        let rendomNum = Math.floor(Math.random() * 100000).toString();
        let fileObject = {
          file: image,
          name: rendomNum
        };
        const filePath = `/${this.basePath}/${new Date().getTime()}${fileObject.file.name}`;
        const storageRef = this.fireStorage.ref(filePath);
        const uploadTask = this.fireStorage.upload(filePath, fileObject.file);

        return new Observable((observer) => {
          uploadTask.snapshotChanges().pipe(
            finalize(() => {
              storageRef.getDownloadURL().subscribe((downloadURL: any) => {
                // Emit the download URL and complete the observable
                observer.next(downloadURL);
                image.name = fileObject.name;
                observer.complete();
              });
            }),
            catchError((err: any) => {
              return of(err);
            })
          ).subscribe();
        });
      } else if (image.type === 'video/mp4' || image.type === 'video/MOV' || image.type === 'video/webm' || image.type === 'video/MKV' || image.type === 'video/AVI') {
        let rendomNum = Math.floor(Math.random() * 100000).toString();
        let fileObject = {
          file: image,
          name: rendomNum
        };
        this.basePath = 'post/video'
        const filePath = `/${this.basePath}/${new Date().getTime()}${fileObject.file.name}`;
        const storageRef = this.fireStorage.ref(filePath);
        const uploadTask = this.fireStorage.upload(filePath, fileObject.file);

        return new Observable((observer) => {
          uploadTask.snapshotChanges().pipe(
            finalize(() => {
              storageRef.getDownloadURL().subscribe((downloadURL: any) => {
                // Emit the download URL and complete the observable
                observer.next(downloadURL);
                image.name = fileObject.name;
                observer.complete();
              });
            }),
            catchError((err: any) => {
              return of(err);
            })
          ).subscribe();
        });
      } else {
        return new Observable((observer) => {
          observer.next('No file specified');
        });
      }
    }
    return new Observable((observer) => {
      observer.next('No file specified');
    });
  }
  //get most liked posts from the database
  trendingPosts(): Observable<any> {
    const user = this.afs.collection('users').snapshotChanges().pipe(
      map(uactions => {
        return uactions.map(userAction => {
          const uData = userAction.payload.doc.data() as any;
          return uData


        })

      })
    )
    const posts = this.afs.collection('posts', ref => ref.orderBy('likesCount', 'desc')).snapshotChanges().pipe(
      map(pactions => {
        return pactions.map(postAction => {
          const pData = postAction.payload.doc.data() as any;
          console.log(pData);

          return { ...pData, postId: postAction.payload.doc.id }
        })
      })
    );

    const combinedList = combineLatest<any[]>(posts, user).pipe(
      map(arr => arr.reduce(function (acc, cur) {
        let result: any = []
        acc.filter((x: any, i: number) => result.push({ ...x, ...cur.filter((e: any) => e?.uid == x?.postAuthorId)[0] }))
        console.log(result)
        return result
      }
      )))
    console.log(combinedList);

    return combinedList;
  }
  //Add a followers to the database
  follow(postAuthorId: any, id: any) {
    return from(this.afs.collection('users').doc(postAuthorId).update({ followers: arrayUnion(id) }))
  }
  checkFollowing(uid: any) {
    return from(this.afs.collection('users').doc(uid).valueChanges().pipe(
      map((followers: any) => {
        followers.followers.includes(uid);
      })
    ))
  }
  unfollow(postAuthorId: any, id: any) {
    return from(this.afs.collection('users').doc(postAuthorId).update({ followers: arrayRemove(id) }))
  }


  //send Message
  sendMessage(message: chat) {
    console.log("Sending message", message);
    return from(this.afs.collection('/chats').add(message))
  }
  //get message
  getMessages(uid: any): Observable<any> {
    const query = this.afs.collection('/chats').ref.where('uid', '==', uid).orderBy('timestemp', 'desc');

    return new Observable((observer) => {
      this.subscription = query.onSnapshot((snapshot) => {
        const messages = snapshot.docs.map(doc => doc.data());
        observer.next(messages);
      });
    });
  }
  getUserData(token: string) {
    return from(this.afs.collection('users').doc(token).valueChanges())
  }

  //cover Upload
  pushCoverToStorage(file: any, id: any) {
    let rendomNum = Math.floor(Math.random() * 100000).toString();
    let fileObject = {
      file: file,
      name: rendomNum
    };
    this.basePath = 'cover'
    const filePath = `/${this.basePath}/${id}`;
    const storageRef = this.fireStorage.ref(filePath);
    const uploadTask = this.fireStorage.upload(filePath, fileObject.file);

    return new Observable((observer) => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL: any) => {
            // Emit the download URL and complete the observable
            observer.next(downloadURL);
            file.name = fileObject.name;
            observer.complete();
          });
        }),
        catchError((err: any) => {
          return of(err);
        })
      ).subscribe();
    })
  }

  pushProfileToStorage(file: any, id: any) {
    let fileObject = {
      file: file,
      name: id
    };
    this.basePath = 'profile'

    const filePath = `/${this.basePath}/${id}`;
    const storageRef = this.fireStorage.ref(filePath);
    const uploadTask = this.fireStorage.upload(filePath, fileObject.file);

    return new Observable((observer) => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL: any) => {
            // Emit the download URL and complete the observable
            observer.next(downloadURL);
            file.name = fileObject.name;
            observer.complete();
          });
        }),
        catchError((err: any) => {
          return of(err);
        })
      ).subscribe();
    })
  }

  getNews() {
    const headers = new HttpHeaders({ 'X-RapidAPI-Key': 'a5187d0bbfmshd40c41bdd972b69p1c8cb0jsn5e51bf7ca41a' })
    return from(this.https.get('https://bing-news-search1.p.rapidapi.com/news?count=4', { 'headers': headers }))
  }
}
