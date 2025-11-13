import { Component, OnInit } from '@angular/core';
import { FireService, noteInfo } from '../fire.service';
import { Auth } from '@angular/fire/auth';
import { NotePage } from '../note/note.page';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  notes: any[] = [];
  filteredNotes: any[] = [];
  searchTerm: string = '';

  constructor(private fireService:FireService , private auth:Auth, private modalController:ModalController) { }

  ngOnInit() {

    const currentUser = this.auth.currentUser;


    this.fireService.getAllNotes(currentUser?.uid).subscribe((notes) => {
      this.notes = notes;
      this.filteredNotes = this.notes;
    });
  }

  onSearch() {
    if (this.searchTerm.trim() === '') {
      // If the search term is empty, show all notes
      this.filteredNotes = this.notes;
    } else {
      // Otherwise, filter notes based on the search term in title, text, or category
      this.filteredNotes = this.notes.filter((note) =>
        this.matchSearchTerm(note, this.searchTerm.toLowerCase())
      );
    }
  }

  private matchSearchTerm(note: any, searchTerm: string): boolean {
    return (
      note.title.toLowerCase().includes(searchTerm) ||
      note.text.toLowerCase().includes(searchTerm) ||
      note.category.toLowerCase().includes(searchTerm)
    );
  }

  async detayGoster(note:noteInfo){
    const modal = await this.modalController.create({
      component:NotePage,
      componentProps:{id: note.id},
    });

    await modal.present(); 
  }


 
}
