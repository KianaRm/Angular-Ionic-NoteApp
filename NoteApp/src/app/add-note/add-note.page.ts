import { FireService, noteInfo } from './../fire.service';
import { Component, OnInit, Input } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.page.html',
  styleUrls: ['./add-note.page.scss'],
})
export class AddNotePage implements OnInit {

  note!:noteInfo;




  constructor(private auth:Auth,private fireService:FireService, private modalController:ModalController) { }

  ngOnInit() {
    this.note = {
      title: '',
      text: '',
      category: '', // You may set a default category if needed
      isPinned: false, // You may set a default value for isPinned if needed
    };
  }

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  async confirm()
  {
    await this.fireService.addNote(this.note,this.auth.currentUser?.uid);
    this.modalController.dismiss();
  }
}
