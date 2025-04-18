import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {Router} from '@angular/router';

import Swal from 'sweetalert2';
import {PAYS_MONDE} from "../../PAYS_MODE";
import {CandidatService} from "../../../services/GestionEtudiants/candidat.service";
import {Util_fonction} from "../../models/util_fonction";



@Component({
  selector: 'ngx-register-candidat-form',
  templateUrl: './register-candidat-form.component.html',
  styleUrls: ['./register-candidat-form.component.scss']
})
export class RegisterCandidatFormComponent implements OnInit {
  Pays = PAYS_MONDE;
  candidatID;
  logo_structure;
    Annees;
    annee2 = 0;
    anneeScol;
    valideClick = false;
    StructureSigle ;
    StructureType ;
    modeAdmission ;
    CandidatSpecialites ;
    Academies ;
    candidatRegisterForm: FormGroup;
    candidatRegisterForm2: FormGroup;
    registerData ={
      id: null,
      nom: "",
      prenom: "",
      dateDeNaissance: "",
      lieuDeNaissance: "",
      genre: "",
      paysDeNaissance: "",
      nationalite: "",
      ville: "",
      quartier: "",
      rue: 0,
      porte: 0,
      telephone: 0,
      email: "",
      telephoneTuteur: 0,
      modeAdmission: "",
      dateObtentionDiplome: "",
      specialite: "",
      annee: "",
      typeCandidat: "",
    }
  SpinnerLoad = false;
  SbumBTN = false;
  limitAtion: any;
  StructureID: any;
  Complet_Inputs = false;
  candidaturePage = false;
  CandatData: any;
    constructor(private formBuilder: FormBuilder,
                private candidatService: CandidatService,
                private router: Router) { }

    ngOnInit(): void {
      if (sessionStorage.getItem('modeAdmission') !== null) {
        this.getAcademie();
        this.getAllSepcialites();
        this.genereAnneeList();
        this.candidatID = sessionStorage.getItem('id');
        this.StructureSigle = sessionStorage.getItem('structureSigle');
        this.logo_structure = sessionStorage.getItem('structureLogo');
        this.modeAdmission = sessionStorage.getItem('modeAdmission');
        this.limitAtion = sessionStorage.getItem('limit_postule');
        this.StructureID = sessionStorage.getItem('id_structure');
        // this.registerData.structure.id = this.StructureID;
        this.initForm();
        if (this.limitAtion === 'fullRegister'){
          this.Complet_Inputs = false;
          // this.DesactivateInpute();
        }else{
          // this.ActivateInpute();
          this.Complet_Inputs = true;
        }

        if (sessionStorage.getItem('CandidatRegisterInfos') !== null){
          this.candidaturePage = true;
          this.CandatData = JSON.parse(sessionStorage.getItem('CandidatRegisterInfos'));
          this.FullForEdit();
        }


      } else {
        this.backToStatutCheckingPage();
      }
    }
    //
    // ActivateInpute(){
    //   this.candidatRegisterForm2.controls.paysDeNaissance.setValidators([Validators.required]);
    //   this.candidatRegisterForm2.controls.paysDeNaissance.updateValueAndValidity();
    //
    //   this.candidatRegisterForm2.controls.nationalite.setValidators([Validators.required]);
    //   this.candidatRegisterForm2.controls.nationalite.updateValueAndValidity();
    //
    //   this.candidatRegisterForm2.controls.ville.setValidators([Validators.required]);
    //   this.candidatRegisterForm2.controls.ville.updateValueAndValidity();
    //
    //   this.candidatRegisterForm2.controls.quartier.setValidators([Validators.required]);
    //   this.candidatRegisterForm2.controls.quartier.updateValueAndValidity();
    //
    //   this.candidatRegisterForm2.controls.telephone.setValidators([Validators.required, Validators.minLength(8),
    //     Validators.pattern('[0-9]*')]);
    //   this.candidatRegisterForm2.controls.telephone.updateValueAndValidity();
    //
    //   this.candidatRegisterForm2.controls.telephoneTuteur.setValidators([Validators.required, Validators.minLength(8),
    //     Validators.pattern('[0-9]*')]);
    //   this.candidatRegisterForm2.controls.telephoneTuteur.updateValueAndValidity();
    // }

    // DesactivateInpute(){
    //   this.candidatRegisterForm2.controls.paysDeNaissance.reset();
    //   this.candidatRegisterForm2.controls.paysDeNaissance.clearValidators();
    //   this.candidatRegisterForm2.controls.paysDeNaissance.updateValueAndValidity();
    //
    //   this.candidatRegisterForm2.controls.nationalite.reset();
    //   this.candidatRegisterForm2.controls.nationalite.clearValidators();
    //   this.candidatRegisterForm2.controls.nationalite.updateValueAndValidity();
    //
    //   this.candidatRegisterForm2.controls.ville.reset();
    //   this.candidatRegisterForm2.controls.ville.clearValidators();
    //   this.candidatRegisterForm2.controls.ville.updateValueAndValidity();
    //
    //   this.candidatRegisterForm2.controls.quartier.reset();
    //   this.candidatRegisterForm2.controls.quartier.clearValidators();
    //   this.candidatRegisterForm2.controls.quartier.updateValueAndValidity();
    //
    //   this.candidatRegisterForm2.controls.telephone.reset();
    //   this.candidatRegisterForm2.controls.telephone.clearValidators();
    //   this.candidatRegisterForm2.controls.telephone.updateValueAndValidity();
    //
    //   this.candidatRegisterForm2.controls.telephoneTuteur.reset();
    //   this.candidatRegisterForm2.controls.telephoneTuteur.clearValidators();
    //   this.candidatRegisterForm2.controls.telephoneTuteur.updateValueAndValidity();
    // }

  doNotFing(){

  }

  FullForEdit(){
    this.candidatRegisterForm.controls.annee1.reset();
    this.candidatRegisterForm.controls.annee2.reset();
    let ans = Util_fonction.separeAnnee(this.CandatData.annee);
    this.candidatRegisterForm.controls.annee1.setValue(ans[0]);
    this.candidatRegisterForm.controls.annee2.setValue(ans[1]);

    this.candidatRegisterForm.controls.annee.setValue(this.CandatData.annee);
    this.candidatRegisterForm.controls.nom.setValue(this.CandatData.nom);
    this.candidatRegisterForm.controls.prenom.setValue(this.CandatData.prenom);
    this.candidatRegisterForm.controls.dateDeNaissance.setValue(this.CandatData.dateDeNaissance);
    this.candidatRegisterForm.controls.lieuDeNaissance.setValue(this.CandatData.lieuDeNaissance);
    this.candidatRegisterForm.controls.genre.setValue(this.CandatData.genre);

    this.candidatRegisterForm.controls.email.setValue(this.CandatData.email);
    this.candidatRegisterForm.controls.paysDeNaissance.setValue(this.CandatData.paysDeNaissance);
    this.candidatRegisterForm.controls.nationalite.setValue(this.CandatData.nationalite);
    this.candidatRegisterForm.controls.ville.setValue(this.CandatData.ville);
    this.candidatRegisterForm.controls.quartier.setValue(this.CandatData.quartier);
    this.candidatRegisterForm.controls.rue.setValue(this.CandatData.rue);
    this.candidatRegisterForm.controls.porte.setValue(this.CandatData.porte);
    this.candidatRegisterForm.controls.telephone.setValue(this.CandatData.telephone);
    this.candidatRegisterForm.controls.telephoneTuteur.setValue(this.CandatData.telephoneTuteur);

    this.candidatRegisterForm.controls.modeAdmission.setValue(this.CandatData.modeAdmission);
    this.candidatRegisterForm.controls.dateObtentionDiplome.setValue(this.CandatData.dateObtentionDiplome);
    this.candidatRegisterForm.controls.specialite.setValue(this.CandatData.specialite);

  }

    genereAnneeList() {
        const Annees = [];
        let endAnnee: number = new Date().getFullYear();
        endAnnee = endAnnee - 1;
        for (let i = endAnnee; i > 1994; i--){
            Annees.push(i);
        }
        this.Annees = Annees;
    }

    getAcademie() {
        this.candidatService.getAcademies().subscribe(res => {
            this.Academies = res;
        });
    }

    getAllSepcialites() {
        this.candidatService.getSepcialites().subscribe(specialRes => {
            this.CandidatSpecialites = specialRes;
        });
    }

    valideClicking(bool) {
        this.valideClick = !!bool;
    }

/**
 *
 */
    RegisterCandidat() {
      this.SpinnerLoad = true;

        this.fullRegisterData();
        if (this.limitAtion === 'fullRegister') {
          sessionStorage.setItem('preinscriptionformPage', 'ok');
          sessionStorage.setItem('CandidatRegisterInfos', JSON.stringify(this.registerData));
          this.navigateToPreinscriptionForm();
        } else {
          sessionStorage.setItem('CandidatRegisterInfos', JSON.stringify(this.registerData));
          this.navigateToCandidatureForm();
          // this.candidatService.createCandidat(this.registerData).subscribe(resRegister => {
          //   // sessionStorage.setItem('id_candidat', resRegister['id']);
          //   // this.navigateToPreinscriptionForm(); // ou candidature
          //   sessionStorage.setItem('CandidatRegisterInfos', JSON.stringify(resRegister));
          //   this.SpinnerLoad = false;
          //   // this.successCandidatRegisterAlert();
          //
          //
          // }, error => {
          //   this.SbumBTN = false;
          //   this.SpinnerLoad = false;
          //   Swal.fire({
          //     title: 'Note!',
          //     text: '' + error['error'],
          //     icon: 'info',
          //     allowOutsideClick: false,
          //     confirmButtonText: 'ok'
          //   });
          // });
        }
    }

  successCandidatRegisterAlert(){
      Swal.fire({
        title: 'Note!',
        html: 'Votre candidature a été enregistré avec succès. <br>' +
          '<span class="text-danger"><strong>Important:</strong></span> Un numéro d\'admission vous sera délivré plus tard après étude de dossier.' +
          ' Il vous permettra plus tard de procèder à la pré-inscription <br>' +
          '<h2 class="text-center"><strong>' + this.StructureSigle + '</strong></h2>',
        icon: 'success',
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'ok'
      }).then((result) => {
        if (result.isConfirmed) {
          // Généralisation
          sessionStorage.clear();
          this.navigateToHome();
        }
      });
    }

  navigateToHome() {
        this.router.navigate(['']);
    }
  navigateToPreinscriptionForm() {
    this.router.navigate(['/pages/utilisateur/preIncriptionForm']);
  }
  navigateToCandidatureForm() {
    this.router.navigate(['/pages/utilisateur/CandidatureForm']);
  }
  backToStatutCheckingPage() {
    this.router.navigate(['/pages/utilisateur/statutCandidat_verification']);
  }

    /***
     * Remplissage auto du chant annee2 et annee
     */
    selectSecondYears(){
        this.candidatRegisterForm.controls.annee.setValue('');
        const annee1: number = (<number>this.candidatRegisterForm.controls.annee1.value);
        this.annee2 = Number(annee1);
        this.anneeScol = this.annee2 + ' - ';
        this.annee2 = this.annee2 + 1;
        this.anneeScol += this.annee2;
        this.candidatRegisterForm.controls.annee.setValue(this.anneeScol);

        this.checkAnneeDiplome(this.annee2);
    }

  checkAnneeDiplome(annee2: number) {
      const dateObtentionDiplomeDIp = this.candidatRegisterForm.controls.dateObtentionDiplome.value;
      const Year = new Date(dateObtentionDiplomeDIp).getFullYear();
      if (Year < annee2) {
        this.candidatRegisterForm.controls.annee.setValue(null);
        this.candidatRegisterForm.controls.annee1.setValue(null);
        // this.candidatRegisterForm.controls.annee2.setValue(null);
        // this.candidatRegisterForm.controls.sessionBac.setValue(null);
      }
  }

    /**
     * Remplie la table registerData avec le valeur à envoyer
     *
     */
    fullRegisterData(){
      this.findSpecialiteID(this.candidatRegisterForm.controls.specialite.value);
      this.candidatRegisterForm.controls.annee.setValue(this.anneeScol);
      this.registerData.annee = this.anneeScol;
      this.registerData.nom = this.candidatRegisterForm.controls.nom.value;
      this.registerData.prenom = this.candidatRegisterForm.controls.prenom.value;
      this.registerData.dateDeNaissance = this.candidatRegisterForm.controls.dateDeNaissance.value;
      this.registerData.lieuDeNaissance = this.candidatRegisterForm.controls.lieuDeNaissance.value;
      this.registerData.genre = this.candidatRegisterForm.controls.genre.value;

      if (this.modeAdmission === 'MALIEN_DE_L_EXTERIEUR' || this.modeAdmission === 'ADMIS_SUR_TITRE'){
        this.registerData.typeCandidat = 'TITRE';
      } else {
        this.registerData.typeCandidat = this.modeAdmission;
      }
      if (this.limitAtion === 'fullRegister'){
        this.registerData.paysDeNaissance = null
        this.registerData.nationalite = null
        this.registerData.ville = null
        this.registerData.quartier = null
        this.registerData.rue = null
        this.registerData.porte = null
        this.registerData.telephone = null
        this.registerData.telephoneTuteur = null
      } else {
        this.registerData.email = this.candidatRegisterForm.controls.email.value;
        this.registerData.paysDeNaissance = this.candidatRegisterForm.controls.paysDeNaissance.value;
        this.registerData.nationalite = this.candidatRegisterForm.controls.nationalite.value;
        this.registerData.ville = this.candidatRegisterForm.controls.ville.value;
        this.registerData.quartier = this.candidatRegisterForm.controls.quartier.value;
        this.registerData.rue = this.candidatRegisterForm.controls.rue.value;
        this.registerData.porte = this.candidatRegisterForm.controls.porte.value;
        this.registerData.telephone = this.candidatRegisterForm.controls.telephone.value;
        this.registerData.telephoneTuteur = this.candidatRegisterForm.controls.telephoneTuteur.value;
      }

      this.registerData.modeAdmission = this.candidatRegisterForm.controls.modeAdmission.value;
      this.registerData.dateObtentionDiplome = this.candidatRegisterForm.controls.dateObtentionDiplome.value;
      // this.registerData.academie = candidatRegisterForm.controls.academie.value;
      // this.registerData.numPlaceBac. = candidatRegisterForm.controls.numPlaceBac.value;
      this.registerData.specialite = this.candidatRegisterForm.controls.specialite.value;
      // this.registerData.numMatricule = candidatRegisterForm.controls.numMatricule.value;
    }

    findSpecialiteID(Specialite){
        for (const spc of this.CandidatSpecialites){
            if (Specialite === spc['nom'] ){
                sessionStorage.setItem('id_specialiteCandidat', spc['id']);
            }
        }
    }

/***
   * initialisation
   */
  initForm() {
    this.candidatRegisterForm = this.formBuilder.group({
      annee1: new FormControl(null, Validators.required),
      annee2: new FormControl(null),

      nom: new FormControl(null, Validators.required),
      prenom: new FormControl(null, Validators.required),
      dateDeNaissance: new FormControl(null, Validators.required),
      lieuDeNaissance: new FormControl(null, Validators.required),
      genre: new FormControl(null, Validators.required),
      modeAdmission: new FormControl(sessionStorage.getItem('modeAdmission')),
      dateObtentionDiplome: new FormControl(null, Validators.required), // ---new

      specialite: new FormControl(null, Validators.required),
      // numMatricule: new FormControl(null),
      annee: new FormControl(null, Validators.required),

      email: new FormControl(null, [Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')]),

      paysDeNaissance: new FormControl(null, Validators.required),
      nationalite: new FormControl(null, Validators.required),
      ville: new FormControl(null, Validators.required),
      quartier: new FormControl(null, Validators.required),
      rue: new FormControl(null),
      porte: new FormControl(null),
      telephone: new FormControl(null, [Validators.minLength(8),
        Validators.pattern('[0-9]*'), Validators.required]),

      telephoneTuteur: new FormControl(null),
    });

    // this.candidatRegisterForm2 = this.formBuilder.group({
    //
    // });
  }
}
