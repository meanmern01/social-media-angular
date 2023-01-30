import * as Notiflix from 'notiflix';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase/compat';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private messaging: AngularFireMessaging, private db: DatabaseService, private router: Router, private toastr: ToastrService) { }
  isLogout = new BehaviorSubject<Boolean>(true)
  logoutStatus = this.isLogout.asObservable()
  SignUp(user: any) {
    let { password, cpassword, ...rest } = user;
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        Notiflix.Notify.success('You have been successfully registered!', { timeout: 3000 })
        this.db.addUserData({ userData: { ...rest, uid: result?.user?.uid } }).subscribe((res: any) => {
        })
        this.router.navigate(['/login'])
      })
      .catch((error) => {
        window.alert(error.message);
        Notiflix.Notify.failure('Somthing Went Wrong !!!!', { timeout: 3000 })
      });
  }

  SignIn(email: any, password: any) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        Notiflix.Notify.success('Login Successfully', { timeout: 3000 })

        localStorage.setItem("token", result.user?.uid || '')
        setTimeout(() => {
          this.router.navigate(['/home'])
        }, 2000)
        this.messaging.requestPermission.subscribe((permission: any) => {
          console.log("Permission: ", permission);
          this.messaging.getToken.subscribe((token: any) => {
            console.log("Token: ", token);
          })
        })
        this.isLogout.next(false)
      })
      .catch((error) => {

        if (error.message === 'Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).') {
          Notiflix.Notify.failure("Email or Password is wrong. Please try again", {
            closeButton: true,
            cssAnimationStyle: 'from-right',
            timeout: 3000
          })
        } else if (error.message === 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).') {
          Notiflix.Notify.failure("Your Email Address is invalid. Please Sign up", {
            closeButton: true,
            cssAnimationStyle: 'from-right',
            timeout: 3000
          })
        } else {
          Notiflix.Notify.failure("Something went wrong. Please try again after several minutes", {
            closeButton: true,
            cssAnimationStyle: 'from-right',
            timeout: 3000
          })
        }
      }
      );
  }
  signOut() {
    return this.afAuth.signOut().then((res) => {
      if (window.confirm('Are you sure you want to logout')) {
        localStorage.removeItem('token');
        Notiflix.Notify.success("Logout Successfully", {
          closeButton: true,
          cssAnimationStyle: 'from-right',
          timeout: 3000
        });
        this.isLogout.next(true);
      }
    });
  }

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider: firebase.auth.AuthProvider | GoogleAuthProvider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        let loginData = {
          name: result.user?.displayName || '',
          email: result.user?.email || '',
          phone: result.user?.phoneNumber || '',
          uid: result.user?.uid || ''
        }
        this.db.getUserData(result.user?.uid).subscribe(data => {
          if (!data) {
            this.db.addUserData({ userData: loginData })
          }
        })
        Notiflix.Notify.success("You have been successfully logged in !!", {
          timeout: 3000
        })
        localStorage.setItem('token', result.user?.uid || '')
        this.router.navigate(['/home']);
        this.messaging.requestPermission.subscribe((permission: any) => {
          console.log("Permission: ", permission);
          this.messaging.getToken.subscribe((token: any) => {
            console.log("Token: ", token);
          })
        })
      })
      .catch((error) => {
      });
  }

}
