import { Component, OnInit } from '@angular/core';
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";

@Component({
  selector: 'app-parcours',
  templateUrl: './parcours.component.html',
  styleUrls: ['./parcours.component.css']
})
export class ParcoursComponent implements OnInit {
  etudiant:any;
  Parcours:any;
  isLinear = false;
  constructor(private etudiantService: EtudiantService,) { }

  ngOnInit() {
    this.etudiant = JSON.parse(sessionStorage.getItem('user'));
    this.getEtudiantParcours();
  }

  getEtudiantParcours(){
    this.etudiantService.ParcoursEtudiant(this.etudiant.users.etudiant.id).subscribe(parcour =>{
      this.Parcours = parcour;
    });
  }

}
