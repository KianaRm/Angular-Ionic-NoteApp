import { FormGroup , FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.class';
import { FireService } from '../fire.service';
import { getAuth } from "firebase/auth";




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userData : User = new User();

  uyelikBilgisi!:FormGroup;
  userValue:any;
 



  constructor(private fireService:FireService, private router:Router, private fb:FormBuilder, private authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.uyelikBilgisi= this.fb.group({
      email:[null,[Validators.required,Validators.email]],
      password:[null,[Validators.required,Validators.minLength(6)]],

    })
  }
  

  async login() {
    try {
      await this.fireService.emailPasswordLogIn(this.userData);
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (user) {
        // Successful login, navigate to the desired page
        this.router.navigateByUrl('/tabs');
        this.uyelikBilgisi.reset();
        this.userData = new User();
      } else {
        // This block should not be executed in case of a successful login,
        // but in case there is an issue, handle it here.
        this.fireService.presentAlert('Error', 'An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      // Handle login errors here
      console.error('Login error:', error);
  
      // Clear the form or handle the error as needed
      this.uyelikBilgisi.reset();
      this.userData = new User();

      // Display an alert to the user with the error message
      this.fireService.presentAlert('Error', 'The Email or Password is wrong! Please try again');
    }
  }
  

  

  get email(){
    return this.uyelikBilgisi.get('email');
  }

  get password(){
    return this.uyelikBilgisi.get('password');
  }

  ErrorTextEmail():any{
   if(((this.email!.dirty || this.email!.touched) && this.email!.errors)){
     if(this.email.errors?.['required']){
       return'Email is required.';
      }
     if(this.email!.errors?.['email']){
       return'Invalid Email';
     }
    }
  }

  ErrorTextPass():any{
    if(((this.password!.dirty || this.password!.touched) && this.password!.errors)){
      if(this.password.errors?.['required']){
        return'Password is requiredr.';
       }
      if(this.password!.errors?.['minlength']){
        return'The password must be at least 6 characters.';
      }
     }
   }

}