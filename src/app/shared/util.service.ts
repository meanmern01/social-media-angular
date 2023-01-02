import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private toaster: ToastrService) { }
  isLogin = () => {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      this.toaster.error("Error", "You must login to Access This Functionality", { positionClass: 'toast-bottom-center', })
      return false;
    }
  }
}
