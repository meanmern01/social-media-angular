import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { z } from 'zod';
const signinSchema = z.object({
  email: z.string({
    required_error: "Email is required",
  }).min(10, { message: "Email is required" }).email({ message: 'Please Enter a valid email address' }),
  password: z.string().min(1, { message: "Password is required" }),
}).strict()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  passwordError!: string;
  emailError!: string;
  constructor(private auth: AuthService) {

  }

  login(email: any, password: any) {
    let formData = {
      email,
      password,
    }

    const result: any = signinSchema.safeParse(formData)
    if (!result.success) {
      const formatter = result.error.format()
      this.emailError = formatter?.email?._errors[0] || '';
      this.passwordError = formatter?.password?._errors[0] || '';
      console.log(this.passwordError, this.emailError)
    } else {
      this.emailError = '';
      this.passwordError = '';
      this.auth.SignIn(email, password)
    }
    return false
  }
  loginWithGoogle() {
    this.auth.GoogleAuth()
  }
}
