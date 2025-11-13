import { FormGroup , FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.class';
import { FireService } from '../fire.service';
import { getAuth } from "firebase/auth";



@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'], 
})
export class SignupPage implements OnInit {

  userData : User = new User();


  uyelikBilgisi!:FormGroup;
  userValue:any;
  
  constructor(private fireService:FireService, private router:Router, private fb:FormBuilder, private authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.uyelikBilgisi = this.fb.group({
      fullname:[null,[Validators.required,Validators.minLength(3)]],
      bdate:[null,[Validators.required]],
      email:[null,[Validators.required,Validators.email]],
      password:[null,[Validators.required,Validators.minLength(6)]],
    })
  }

  async signup(){
    const result = await this.fireService.emailPasswordSignUp(this.userData);
    const auth = getAuth();
    const user = auth.currentUser;
   if(result)
   this.router.navigateByUrl('/tabs');
   else
   this.fireService.presentAlert('Error', 'The Email or Password is wrong! Please try again')
  }


  get email(){
    return this.uyelikBilgisi.get('email');
  }

  get password(){
    return this.uyelikBilgisi.get('password');
  }

  get fullname(){
    return this.uyelikBilgisi.get('fullname');
  }

  get bdate(){
    return this.uyelikBilgisi.get('bdate');
  }

  ErrorTextFullname():any{
    if(((this.fullname!.dirty || this.fullname!.touched) && this.fullname!.errors)){
      if(this.fullname.errors?.['required']){
        return'Full Name is required.';
       }
      if(this.fullname!.errors?.['minlength']){
        return'Your Fullname must be at least 3 characters.';
      }
     }
   }

   ErrorTextBirthDate():any{
    if(((this.bdate!.dirty || this.bdate!.touched) && this.bdate!.errors)){
      if(this.bdate.errors?.['required']){
        return'Birth date is required.';
       }
     }
   }

  ErrorTextEmail():any{
    if(((this.email!.dirty || this.email!.touched) && this.email!.errors)){
      if(this.email.errors?.['required']){
        return'Email is required.';
       }
      if(this.email!.errors?.['email']){
        return'Invalid Email format';
      }
     }
   }
 
   ErrorTextPass():any{
     if(((this.password!.dirty || this.password!.touched) && this.password!.errors)){
       if(this.password.errors?.['required']){
         return'Password is required.';
        }
       if(this.password!.errors?.['minlength']){
         return'Your password must be at least 6 characters.';
       }
      }
    }
 


}
