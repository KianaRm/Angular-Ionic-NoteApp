import { Auth } from '@angular/fire/auth';
import { User } from './user.class';
import { Injectable, NgModule } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, provideFirestore, serverTimestamp, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import * as firebase from "firebase/app"; 
import 'firebase/firestore';
import { CollectionReference, DocumentData, getDocs, getFirestore, query, QueryFieldFilterConstraint, where } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { initializeApp, provideFirebaseApp,getApp } from '@angular/fire/app';



export interface noteInfo{
  id?:string;  
  title?:string;
  text?:string;
  category?:string;
  date?:any;
  isPinned?:boolean;
}



@Injectable({
  providedIn: 'root'
})


export class FireService {
  
  private selectedCategorySubject: BehaviorSubject<string> = new BehaviorSubject<string>('All');
  selectedCategory: Observable<string> = this.selectedCategorySubject.asObservable();

  
  constructor(private router:Router,private firestore:Firestore ,  private alertController:AlertController, private auth:Auth) {}
   

  updateSelectedCategory(category: string) {
    this.selectedCategorySubject.next(category);
  }

  getAllNotes(userId: string): Observable<noteInfo[]> {
    const notesQuery = query(collection(this.firestore, `users/${userId}/notes/`));
    return collectionData(notesQuery, { idField: 'id' });
  }

  getNotesByCategory(userId: string, category: string): Observable<noteInfo[]> {
    const notesQuery = query(collection(this.firestore, `users/${userId}/notes/`), where('category', '==', category));
    return collectionData(notesQuery, { idField: 'id' });
    
  }

  getPinnedNotes(userId: string): Observable<noteInfo[]> {
    const pinnedNotesQuery = query(collection(this.firestore, `users/${userId}/notes/`), where('isPinned', '==', true));
    return collectionData(pinnedNotesQuery, { idField: 'id' });
  }

  async addNote(note: noteInfo, userId) {
    const urunSonuc = await addDoc(collection(this.firestore, `users/${userId}/notes`), {
      title: note.title,
      text: note.text,
      category: note.category,
      isPinned: note.isPinned, 
      date: serverTimestamp(),
    });
  }

  updateNote(note: noteInfo, userId) {
    const result = doc(this.firestore, `users/${userId}/notes/${note.id}` );
    return updateDoc(result, {title:note.title, text:note.text, category:note.category, isPinned:note.isPinned});
  }

  deleteNote(id: string, userId) {
    const result = doc(this.firestore,`users/${userId}/notes/${id}`)
    return deleteDoc(result); 
  }

  newRecord(note:noteInfo, userId){
    const result = collection(this.firestore,`users/${userId}/notes`)
    return addDoc(result,note);
  }

  eachNote(id:any,userId):any
  {
    const result = doc(this.firestore, `users/${userId}/notes/${id}` );
    return docData(result,{idField:'id'});
  }

  async emailPasswordSignUp(user:User)
  {
    try{
     const signedInUser = await createUserWithEmailAndPassword(this.auth, user.email, user.password)
     return signedInUser;
    }
    catch(error)
    {
       return 'Error: ' + error;
    }
  }

  async emailPasswordLogIn(userData: User): Promise<void> {
    const { email, password } = userData;
    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      // Handle authentication errors
      throw error; // Rethrow the error so it can be caught in the login component
    }
  }

  async signingOut(){
    try{
      await signOut(this.auth)
      return true;
    }
    catch(error)
    {
      return 'Error: ' + error;
    }
  }

  async presentAlert(status:any, mesage:any)
  {
    const alert = await this.alertController.create({
      header: status,
      message:mesage,
      buttons: ['OK'],
    });
    await alert.present();
  }

}

function firestoreQuery(notesCollection: CollectionReference<DocumentData, DocumentData>, arg1: QueryFieldFilterConstraint) {
  throw new Error('Function not implemented.');
}

