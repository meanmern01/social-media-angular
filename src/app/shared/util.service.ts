import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as Notiflix from 'notiflix'

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private toaster: ToastrService, private _snackBar: MatSnackBar) { }
  isLogin = () => {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      Notiflix.Notify.failure("You must login to Access This Functionality", { timeout: 3000 })
      return false;
    }
  }
}
