import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {




  URL="https://reqres.in/api/"

  constructor(private alertController:AlertController , private httpClient:HttpClient) { }

  login(veri:any)
  {
    return this.httpClient.post(this.URL + 'login',veri); 
  }

  signup(veri:any){
    return this.httpClient.post(this.URL + 'register', veri);


  }

  async presentAlert(mesaj:any) {
    const alert = await this.alertController.create({
      header: 'Hata',
      message: mesaj,
      buttons: ['Tamam'],
    });

    await alert.present();
  }
}
