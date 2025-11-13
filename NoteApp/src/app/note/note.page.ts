import { FireService, noteInfo } from './../fire.service';
import { Component, OnInit, Input } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {

@Input() id?:string;
note!:noteInfo;

  constructor(private auth:Auth,private fireService:FireService, private modalController:ModalController) { }

  ngOnInit() {
    this.fireService.eachNote(this.id,this.auth.currentUser?.uid).subscribe((sonuc:any)=>{this.note = sonuc}, (hata:any)=>{}); 
  } 

  close(){
    this.modalController.dismiss({'dismissed':true});
  }

  async updateNote()
  {
    await this.fireService.updateNote(this.note,this.auth.currentUser?.uid);
    this.modalController.dismiss();
  }

  async deleteNote()
  {
    await this.fireService.deleteNote(this.note.id,this.auth.currentUser?.uid);
    this.modalController.dismiss();
  }

}
