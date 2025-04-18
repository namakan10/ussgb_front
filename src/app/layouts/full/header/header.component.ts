import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import {environment} from "../../../../environments/environment";
import {StructureService} from "../../../services/structure.service";
import * as Util from "util";
import {Util_fonction} from "../../../pages/models/util_fonction";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent implements OnInit {
  user = JSON.parse(sessionStorage.getItem('user'));
  src = '../../../'+environment._ASSET_IMAGE;
  active = '';
  spinnerS: boolean =false;
  Structures;
  structure;
  _RECTORAT: boolean =  this.user.structure.type === 'RECTORAT';
  @Output() selectedS = new EventEmitter();
  selectedStructure;
  constructor(private router: Router,
              private structureService: StructureService,
  ) {}

  ngOnInit(): void {

    if (sessionStorage.getItem('user')) {
      // this.user = JSON.parse(sessionStorage.getItem('user'));
      this.src = this.user.structure.logo;
    }
    if (sessionStorage.getItem('retoratStructure')) {
      this.selectedStructure = JSON.parse(sessionStorage.getItem("retoratStructure"));
      this.selectedS.emit(this.selectedStructure);
    }
    if (this._RECTORAT){
      this.GetAllStructures();
    }
  }

  GetAllStructures(){
    this.spinnerS = true;
    this.structureService.getStuctures().subscribe(
      (res) => {
        this.Structures = res;//.filter(s => s.type !== "RECTORAT");
        this.spinnerS = false;
      });
  }

  structureChange(event){
    this.selectedStructure = this.Structures.find(s => +s.id === +this.structure);
    //Changement des données
    this.user.structure.id = this.selectedStructure.id;
    sessionStorage.setItem("user", JSON.stringify(this.user));
    sessionStorage.setItem("retoratStructure", JSON.stringify(this.selectedStructure));
    window.location.reload();
  }

  checkUndefined(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

  deconnection() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('dateEnCours');
    sessionStorage.removeItem('retoratStructure');
    this.user = null;
    this.src = '../../../'+environment._ASSET_IMAGE;
    this.navigateHome();
  }

  navigateHome() {
    this.active = 'home';
      this.router.navigate(['/pages/utilisateur/home']);
      // window.location.reload();
  }
  // navigateToTrombinoscope() {
  //   this.active = 'trombinoscope';
  //     this.router.navigate(['/trombinoscope']);
  //     // window.location.reload();
  // }
}
