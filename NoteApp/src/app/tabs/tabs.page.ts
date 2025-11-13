import { Component, OnInit } from '@angular/core';
import { signOut } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FireService } from '../fire.service';



@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(private auth:Auth,  private router:Router, private fireService:FireService) { }

  ngOnInit() {
  }

  async logingOut()
  {
    const result = await this.fireService.signingOut();
    this.router.navigateByUrl('/login');
  }


}
