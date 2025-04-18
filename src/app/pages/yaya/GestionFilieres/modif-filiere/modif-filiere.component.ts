import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartementService } from '../../../../services/departement.service';
import { CandidatService } from '../../../../services/GestionEtudiants/candidat.service';
import { FiliereService } from '../../../../services/GestionFilieres/filiere.service';
import { OptionsService } from '../../../../services/GestionFilieres/Options/options.service';
import { StructureService } from '../../../../services/structure.service';
import Swal from "sweetalert2";

@Component({
  selector: 'ngx-modif-filiere',
  templateUrl: './modif-filiere.component.html',
  styleUrls: ['./modif-filiere.component.css']
})
export class ModifFiliereComponent implements OnInit {

  modifFiliereForm: FormGroup;
  filiere :any= {
    id:  this.route.snapshot.paramMap.get("id_filiere"),
    nom: '',
    codeFiliere: '',
   departement: {
      id: '',
    }
  };
  id :any;
  filiereNotFound: string;
  departement: any;


  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              // private utilsService: UtilsService,
              private departementService: DepartementService,
              private filiereService:FiliereService,
              private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id_structure");
    this.getDepartementFiliere(this.id);

    // initiation du formulaire
    this.initForm();
  }
  // foction initialisation du formulaire pour le lier au template dans ng OnInit
  initForm(){
    //this.route.snapshot.paramMap.get("id_departement");
    this.modifFiliereForm = this.formBuilder.group({
      nom:  (this.filiere.nom, [Validators.required]),
     codeFiliere: (this.filiere.codeFiliere, [Validators.required]),
     departement: (this.departement.id, [Validators.required]),
    });
  }
  Annuler(){
    this.router.navigate(['/pages','departement',this.route.snapshot.paramMap.get("id_departement")]);

  }
  getDepartementFiliere(id) {
    this.filiereService.getFilieres(id).subscribe((data) => {
    this.filiere= data;
    })
    }

  // handleSuccessfulResponse(res) {
  //   this.departement = res;
  //   this.initForm();
  // }

  modifierFiliere() {
    // this.filiere.nom = this.modifFiliereForm.value['nom'];
    // this.filiere.codeFiliere = this.modifFiliereForm.value['codeFiliere'];
    // this.filiere.departement = {
    //   id: this.route.snapshot.paramMap.get("id"),
    // };
    // //let id = this.route.snapshot.paramMap.get("id_structure");
    // this.filiereService.updateFiliere(this.filiere).subscribe(
    //   response => {
    //     Swal.fire({
    //       title: "",
    //       text: "Filiere modifié avec succes!",
    //       icon: "success",
    //     });
    //     // this.utilsService.showToast("success", 'Succès',
    //     //   "Departement modifié avec succès");
    //     console.log(this.filiere);
    //     this.router.navigate(['/pages','departement',this.route.snapshot.paramMap.get("id_departement")]);
    //   },error =>{
    //     Swal.fire({
    //       title: "Attention",
    //       text:"" + error['error'],
    //       icon: "error",
    //     });
    //   }
    // )
  }

}
