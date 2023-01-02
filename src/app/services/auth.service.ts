import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
        window.alert('You have been successfully registered!');
        console.log(result.user);
        this.db.addUserData({ ...rest, uid: result?.user?.uid }).subscribe((res: any) => {
          console.log(res)
        })
        this.router.navigate(['/login'])
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  SignIn(email: any, password: any) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.toastr.success('Login Successfully');
        localStorage.setItem("token", result.user?.uid || '')
        setTimeout(() => {
          this.router.navigate(['/home'])
        }, 2000)
        this.isLogout.next(false)
      })
      .catch((error) => {
        console.log(error.message);

        if (error.message === 'Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).') {
          this.toastr.error('Email or Password is wrong. Please try again', 'Email or Password Error', {
            timeOut: 3000,
          })
        } else if (error.message === 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).') {
          window.alert("Your Email Address is invalid. Please Sign up");
        } else {
          window.alert("Something went wrong. Please try again after several minutes")
        }
      }
      );
  }
  signOut() {
    return this.afAuth.signOut().then((res) => {
      if (window.confirm('Are you sure you want to logout')) {
        this.toastr.success("Logout Successfully", 'Success');
        localStorage.removeItem('token');
        this.isLogout.next(true);
      }
    });
  }

}
