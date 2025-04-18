import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
// import {UtilsService} from "../../../../services/utils.service";
import {FraisInscriptionService} from "../../../../services/GestionFrais/frais-inscription.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'ngx-modif-frais-inscription',
  templateUrl: './modif-frais-inscription.component.html',
  styleUrls: ['./modif-frais-inscription.component.scss']
})
export class ModifFraisInscriptionComponent implements OnInit {

  modifierFraisForm: FormGroup;
  fraisInscription = {
    id:'',
    type: '',
    frais: '',
  };
  fraisInscriptionNotFound = null;

  typeCandidat = [
    "Régulier",
    "Candidat libre",
    "Titre",
    "Admis par transfert de crédit",
    "Etranger",
    "Professionnel"
  ];


  constructor(private route: ActivatedRoute,
              // private utilsService: UtilsService,
              private fraisInscriptionService: FraisInscriptionService,
              private formBuilder: FormBuilder,
              private router: Router) {

  }

  ngOnInit(): void {
    const id_frais_inscription = this.route.snapshot.paramMap.get("id_frais_inscription");
    this.getFraisInscription(id_frais_inscription);
    this.initForm();
  }

  initForm() {
    //this.route.snapshot.paramMap.get("id");
    this.modifierFraisForm = this.formBuilder.group({
      type: [this.fraisInscription.type, Validators.required],
      frais: [this.fraisInscription.frais, Validators.required],
    });
  }

  getFraisInscription(id_frais_inscription) {
    this.fraisInscriptionService.getFraisInscription(id_frais_inscription).subscribe(
      res => {
        // this.handleSuccessfulResponse(res);
        console.log(res);
      },
      error => {
        this.fraisInscriptionNotFound = "Cet frais n'existe pas !";
      }
    )
  }
  // handleSuccessfulResponse(res) {
  //   this.fraisInscription = res;
  //   this.initForm();
  // }

  modifierFraisInscription() {
    this.fraisInscription.type = this.modifierFraisForm.value['type'];
    this.fraisInscription.frais = this.modifierFraisForm.value['frais'];
    this.fraisInscriptionService.updateFraisInscription(this.fraisInscription).subscribe(
      response => {
        // this.utilsService.showToast("success", 'Succès',
        //   "Frais d'inscription modifié avec succès");
        this.router.navigate(['/pages','frais_inscription']);
      }, error => {
        // this.utilsService.showToast("danger", 'Erreur',
        //   error['error']['response']);
        console.log(this.modifierFraisForm.value);
      }
    );
  }
}
