// @ts-ignore
import {Component, OnInit, ViewEncapsulation } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import {User_MENU_ITEMS} from "./pages-utilisateur-menu";
import {json} from "@angular-devkit/core";
import { Router } from '@angular/router';
import {UNIV_SIGLE} from "../CONSTANTES";
import {environment} from "../../environments/environment";

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],

  encapsulation: ViewEncapsulation.None,
  template: `
    <body style="background-color: white">
      <app-header></app-header>
<!--SIDE BAR POUR ETUDIANT-->
   <div class="row">
     <div class="col-3 pl-1 pt-3" *ngIf="connexion && etudiantConnected">
       <div class="container col-10 shadow-sm mt-3 pt-3" style="height: 100%">
         <app-etudiant-menu></app-etudiant-menu>
       </div>
     </div>
     <!---->
     <div [className]="connexion ? 'col-9 mb-4 pt-3' : 'col-12 mb-4 pt-3'">
       <router-outlet></router-outlet>
     </div>
   </div>
      <footer class="fixed-bottom mt-2" style="background-color: #eee">
        <!--      <img src="../../../assets/images/ussgb.png" height="60" width="100" style="border-radius: 5px" alt="">-->
        <div class="text-center">
          2020-2021 {{univ_sigle}}
      </div>
    </footer>
    </body>
  `,
})
export class PagesComponent implements OnInit {
  // menu = MENU_ITEMS;
  menu = null;
  connexion = false;
  etudiantConnected = false;
  user: any;
  src = environment._ASSET_IMAGE;
  hasRole = false;
  univ_sigle = UNIV_SIGLE;

  constructor(private router: Router) {
  }

  ngOnInit() {
    if (sessionStorage.getItem('user')) {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.src = this.user.structure.logo;
      this.user['users']['roles'].forEach((item, index) => {
        if (item['nom'] === 'ROLE_ETUDIANT') {
          this.hasRole = true;
        }
        if (this.user['users']['roles'].length === (index + 1)) {
          if (!this.hasRole) {
            this.router.navigate(['/admin']);
          } else {
          }
        }
      });
    }
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user !== null) {
      this.connexion = true;
      if (user.users.roles[0].nom === 'ROLE_ETUDIANT') {
        this.etudiantConnected = true;
      }
      this.menu = MENU_ITEMS
    } else {
      this.connexion = false;
      this.menu = User_MENU_ITEMS
    }
  }

}
