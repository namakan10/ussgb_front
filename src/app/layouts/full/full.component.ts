import * as $ from 'jquery';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  ViewChild,
  HostListener,
  Directive,
  AfterViewInit
} from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { AppHeaderComponent } from './header/header.component';
import { AppSidebarComponent } from './sidebar/sidebar.component';
import {_HTTP, UNIV_SIGLE} from "../../CONSTANTES";
import {environment} from "../../../environments/environment";
import {Util_fonction} from "../../pages/models/util_fonction";

/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: []
})
export class FullComponent implements OnDestroy, AfterViewInit {
  _http = _HTTP;
  univ_sigle = UNIV_SIGLE;
  mobileQuery: MediaQueryList;
  user: any;
  hasRole = false;
  src = '../../'+environment._ASSET_IMAGE;
  active = '';
  selectedS;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private router: Router,
  ) {
    if (sessionStorage.getItem('user')) {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.src = this.user.structure.logo;
      this.user['users']['roles'].forEach((item, index) => {
        if (item['nom'] === 'ROLE_ETUDIANT') {
            this.hasRole = true;
        }
        if (this.user['users']['roles'].length === (index + 1)) {
          if (this.hasRole) {
            this.router.navigate(['/pages/utilisateur/home']);
          } else {
          }
        }
    });
    } else {
      this.router.navigate(['/pages/utilisateur/home']);
    }
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  SelectedStructure(event){
    this.selectedS = event;
  }

  checkUndefined(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() {}
}
