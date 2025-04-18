import { Component, OnInit } from '@angular/core';
import {EvenementService} from "../../../services/evenement.service";
import {Util_fonction} from "../../models/util_fonction";
import {error} from "util";
import {MatDialog} from "@angular/material/dialog";
import {EtudiantUpdatePasswordComponent} from "../../aicha/etudiant-update-password/etudiant-update-password.component";
import {_HTTP} from "../../../CONSTANTES";

@Component({
  selector: 'app-etudiant-menu',
  templateUrl: './etudiant-menu.component.html',
  styleUrls: ['./etudiant-menu.component.css']
})
export class EtudiantMenuComponent implements OnInit {
  etudiant = JSON.parse(sessionStorage.getItem('user'));
  _http = _HTTP;
  constructor(public dialog: MatDialog,private evenementService: EvenementService) { }

  ngOnInit() {
    this.GetEvenement();
  }

  ReInscriptionIsLaunched: boolean = false;
  GetEvenement(){
    let data = {
      cursus: this.etudiant.users.etudiant.filiere.cursus,
      type_evenement: 'RE_INSCRIPTION',
      id_structure: this.etudiant.structure.id

    }
    this.evenementService.getStucturesEvenementVerif(data).subscribe(
      res =>{
        this.ReInscriptionIsLaunched = false;
      }, error =>{
        this.ReInscriptionIsLaunched = false;
        //Util_fonction.AlertMessage(error.error.status, error.error.message);
      }
    )
  }


  updatePassword() {

    let dialogRef = this.dialog.open(EtudiantUpdatePasswordComponent, {width: '30%'});

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed',result);
       if(result && result.error){
        Util_fonction.AlertMessage(result.error.status, result.error.message);
       } else if(result){
        Util_fonction.SuccessMessage(result);
      }
    });

  }

}
