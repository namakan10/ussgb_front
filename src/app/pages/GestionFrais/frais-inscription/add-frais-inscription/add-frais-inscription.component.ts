import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
// import {UtilsService} from "../../../../services/utils.service";
import {FraisInscriptionService} from "../../../../services/GestionFrais/frais-inscription.service";
import {Router} from "@angular/router";

@Component({
  selector: 'ngx-add-frais-inscription',
  templateUrl: './add-frais-inscription.component.html',
  styleUrls: ['./add-frais-inscription.component.scss']
})
export class AddFraisInscriptionComponent implements OnInit {

  typeCandidat = [
    "Régulier",
    "Candidat libre",
    "Titre",
    "Admis par transfert de crédit",
    "Etranger",
    "Professionnel"
  ];
  ajouterFraisForm: FormGroup;

  constructor(
    // private utilsService: UtilsService,
              private fraisInscriptionService: FraisInscriptionService,
              private formBuilder: FormBuilder,
              private router: Router) {

  }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {
    this.fraisInscriptionService.enregistrerFrais(this.ajouterFraisForm.value).subscribe(
      res => {
        // this.utilsService.showToast("success", 'Enregistré','Enregistrement terminé');
        this.router.navigate(['/pages/frais_inscription']);
      },
      error => {
        // this.utilsService.showToast("danger", 'Erreur', 'Echec d\'eregistrement');
      }
    )
  }

  initForm() {
    this.ajouterFraisForm = this.formBuilder.group({
      type: ['', Validators.required],
      frais: ['', Validators.required]
    });
  }

}
