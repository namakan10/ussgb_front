import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StructureService } from '../../services/structure.service';
import {UNIV_FILIERE, UNIV_FILIERE_CODE, UNIV_OPTION, UNIV_OPTION_CODE} from "../../CONSTANTES";

@Component({
  selector: 'app-mon-menu',
  templateUrl: './mon-menu.component.html',
  styleUrls: ['./mon-menu.component.css']
})
export class MonMenuComponent implements OnInit {
  univ_fil = UNIV_FILIERE;
  // univ_filCode = UNIV_FILIERE_CODE;

  univ_opt = UNIV_OPTION;
  // univ_optCode = UNIV_OPTION_CODE;

  id: any;
  structure: any;
  user:any;
  constructor(private structuresServices:StructureService,
    private router: Router,
    private route: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.id = this.user.structure.id;
    this.getStructures(this.id);
  }

  getStructures(id){
    this.structuresServices.getStucture(id).subscribe((data) => {
    this.structure= data;
    })
    }


afficheBatiments(){
  this.router.navigate(['/structure',this.id,'batiment']);

}
afficheEquipements(){
  this.router.navigate(['/structure',this.id, 'Equipement']);
}
afficheEnseignants(){
  this.router.navigate(['/structure/Enseignant']);

}
afficheDepartement(){
  this.router.navigate(['/structure',this.id,'departement']);

}
afficheFilieres(){
  this.router.navigate(['/structure/filiere']);

}
afficheOptions(){
  this.router.navigate(['/structure/options']);

}
affichePersonnel(){
  this.router.navigate(['/structure',this.id,'personnel']);
}

afficheSalle(){
  this.router.navigate(['structure',this.id,'salle']);

}
}
