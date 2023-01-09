import * as Notiflix from 'notiflix';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private db: DatabaseService, private router: Router, private toastr: ToastrService) { }
  isLogout = new BehaviorSubject<Boolean>(true)
  logoutStatus = this.isLogout.asObservable()
  SignUp(user: any) {
    let { password, cpassword, ...rest } = user;
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        Notiflix.Notify.success('You have been successfully registered!')
        this.db.addUserData({ userData: { ...rest, uid: result?.user?.uid } }).subscribe((res: any) => {
          console.log(res)
        })
        this.router.navigate(['/login'])
      })
      .catch((error) => {
        window.alert(error.message);
        Notiflix.Notify.failure('Somthing Went Wrong !!!!')
      });
  }

  SignIn(email: any, password: any) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        Notiflix.Notify.success('Login Successfully')
        console.log(result.user?.uid);

        localStorage.setItem("token", result.user?.uid || '')
        setTimeout(() => {
          this.router.navigate(['/home'])
        }, 2000)
        this.isLogout.next(false)
      })
      .catch((error) => {
        console.log(error.message);

        if (error.message === 'Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).') {
          Notiflix.Notify.failure("Email or Password is wrong. Please try again", {
            closeButton: true,
            cssAnimationStyle: 'from-right',
            timeout: 5000
          })
        } else if (error.message === 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).') {
          Notiflix.Notify.failure("Your Email Address is invalid. Please Sign up", {
            closeButton: true,
            cssAnimationStyle: 'from-right',
            timeout: 5000
          })
        } else {
          Notiflix.Notify.failure("Something went wrong. Please try again after several minutes", {
            closeButton: true,
            cssAnimationStyle: 'from-right',
            timeout: 5000
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
        console.log(result.user, "Login With Data");
        let loginData = {
          name: result.user?.displayName || '',
          email: result.user?.email || '',
          phoneNumber: result.user?.phoneNumber || '',
          uid: result.user?.uid || ''
        }
        this.db.addUserData({ userData: loginData })
        console.log('You have been successfully logged in!');
        Notiflix.Notify.success("You have been successfully logged in !!", {
          timeout: 2000
        })
        localStorage.setItem('token', result.user?.uid || '')
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
