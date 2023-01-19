import { AuthService } from './../../services/auth.service';
import { userData } from './../../modal/user-data.model';
import { DatabaseService } from './../../services/database.service';
import { Component } from '@angular/core';
import { z } from 'zod'
import * as Notiflix from 'notiflix'
const signupSchema = z.object({
  name: z.string({
    required_error: "Name is required"
  }).min(2, { message: "Name is required" }),
  email: z.string({
    required_error: "Email is required",
  }).min(10, { message: "Email is required" }).email({ message: 'Please Enter a valid email address' }),
  phoneNumber: z.string().min(10, { message: "Please enter a phone number" }).length(10, { message: "Must be 10 characters long" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  cpassword: z.string().min(8, { message: "Confirm Password must be at least 8 characters long" }),
}).strict()

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  nameError!: any;
  emailError!: any;
  phoneError!: any;
  passwordError!: any;
  cpasswordError!: any;

  constructor(private db: DatabaseService, private auth: AuthService) { }
  handleSubmit(name: any, email: any, phone: any, password: any, confirmPassword: any) {
    let formData = {
      name,
      email,
      phoneNumber: phone,
      password,
      cpassword: confirmPassword
    }
    let sendData = {
      name,
      email,
      phoneNumber: phone
    }

    const result: any = signupSchema.safeParse(formData)
    if (!result.success) {
      const formatter = result.error.format()
      this.nameError = formatter?.name?._errors[0] || '';
      this.emailError = formatter?.email?._errors[0] || '';
      this.phoneError = formatter?.phoneNumber?._errors[0] || '';
      this.passwordError = formatter?.password?._errors[0] || '';
      this.cpasswordError = formatter?.cpassword?._errors[0] || '';
    } else {
      if (password !== confirmPassword) {
        this.nameError = '';
        this.emailError = '';
        this.phoneError = '';
        this.passwordError = '';
        this.cpasswordError = "Password and Confirm Password must be the same."
      } else {
        this.nameError = '';
        this.emailError = '';
        this.phoneError = '';
        this.passwordError = '';
        this.cpasswordError = '';
        this.auth.SignUp(formData).then((res: any) => {
        })
      }
    }
    return false;
  }
}
