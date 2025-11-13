import { FireService, noteInfo } from './../fire.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core'; 
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { NotePage } from '../note/note.page';
import { AddNotePage } from '../add-note/add-note.page';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  notes:noteInfo[]=[];
  username:any;
  adds:[];

  showDiv: boolean = false;

  selectedCategory: string = 'Pins'; // Default category

 constructor(private modalController:ModalController,private auth:Auth , private router:Router, private alertController:AlertController, public fireService:FireService,){}


  async ngOnInit()
  {
    
    const currentUser = this.auth.currentUser;

    if (currentUser) {
      this.loadNotes(currentUser?.uid); // Load all notes initially for the logged-in user

      // Subscribe to changes in the selected category
      this.fireService.selectedCategory.subscribe((category: string) => {
        this.selectedCategory = category;
        this.loadNotes(currentUser.uid); // Reload notes based on the selected category
      });
    }
  }

  loadNotes(userId: string) {

    if (this.selectedCategory === 'All') {
      // Fetch all notes
      this.fireService.getAllNotes(userId).subscribe((notes: noteInfo[]) => {
        this.notes = notes;
      });
    } else if (this.selectedCategory === 'Pins') {
      // Fetch pinned notes
      this.fireService.getPinnedNotes(userId).subscribe((pinnedNotes: noteInfo[]) => {
        this.notes = pinnedNotes;
      });
    } else {
      // Fetch notes based on the selected category
      this.fireService.getNotesByCategory(userId, this.selectedCategory).subscribe((notes: noteInfo[]) => {
        this.notes = notes;
      });
    }
  }

  
  async detail(note:noteInfo){
    const modal = await this.modalController.create({
      component:NotePage,
      componentProps:{id: note.id},
    });

    await modal.present(); 
  }

  async addNote(){
    const modal = await this.modalController.create({
      component:AddNotePage,
      componentProps: {}
    });

    await modal.present();
  }


  vDiv() {
    this.showDiv = !this.showDiv;
  }

  async logingOut()
  {
    const result = await this.fireService.signingOut();
    this.router.navigateByUrl('/login');
  }


  handleRefresh(event:any) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  

  


}
