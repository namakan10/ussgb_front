import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CandidatService} from '../../../services/GestionEtudiants/candidat.service';
import {Router} from '@angular/router';
import {StructureService} from '../../../services/structure.service';
import Swal from 'sweetalert2';
import {Util_fonction} from "../../models/util_fonction";
import {UNIV_SIGLE} from "../../../CONSTANTES";

@Component({
    selector: 'ngx-statut-candidat-check',
    templateUrl: './statut-candidat-check.component.html',
    styleUrls: ['./statut-candidat-check.component.scss']
})
export class StatutCandidatCheckComponent implements OnInit {
  univ = UNIV_SIGLE;
    AdmissionModeForm: FormGroup;
    anneeForm: FormGroup;
    Annees = [];
    annee2 = 0;
    anneeScol;
    newBac = false;
    showNumAdmission = false;
    postuleCas = false;
    statutOk = false;
    note = false;
    titre = null;
    structureSigle = null;
    noteText = null;
    Academies = null;
    CandidatSpecialites = null;
    structureID;
    CurrentStructure;
    ScrLogo;
    structureType: any;
    eventData: any;
    structureData = JSON.parse(sessionStorage.getItem("structureSelected"));
    constructor(private formBuilder: FormBuilder,
                private structureService: StructureService,
                private candidatService: CandidatService,
                // private utilService: UtilsService,
                private router: Router) {
      this.eventData = JSON.parse(sessionStorage.getItem('EvenementData'));
    }

    ngOnInit(): void {
      if (sessionStorage.getItem('id_structure') !== null){
        this.structureID = sessionStorage.getItem('id_structure');
        this.structureSigle = sessionStorage.getItem('structureSigle');
        this.structureType = sessionStorage.getItem('structureType');
        this.ScrLogo = sessionStorage.getItem('structureLogo');
        this.genereAnneeList();
        // this.genereAnnee();
        this.initForm();
        this.getAcademie();
        this.getAllSepcialites();
        this.getCurrentStructureDatas();
      } else {
        this.backToPreinscriptioPage();
      }
    }

    genereAnneeList() {
        const Annees = [];
        let endAnnee: number = new Date().getFullYear();
        endAnnee = endAnnee - 1;
        for (let i = endAnnee; i > 1994; i--) {
            Annees.push(i);
        }
        this.Annees = Annees;
    }

    getCurrentStructureDatas() {
        this.structureService.getStucture(this.structureID).subscribe(strucData => {
            this.CurrentStructure = strucData;
        });
    }

    getAcademie(){
        this.candidatService.getAcademies().subscribe(res => {
            this.Academies = res;
        });
    }

    getAllSepcialites(){
        this.candidatService.getSepcialites().subscribe(specialRes => {
            this.CandidatSpecialites = specialRes;
        });
    }

  /**
   * Postulation d'un candidat
   * @constructor
   */
  Postuler(item) {
      sessionStorage.setItem('limit_postule', item);
      sessionStorage.setItem('modeAdmission', this.AdmissionModeForm.controls.modeAdmission.value);
      this.navigateToCandidatRegisterForm();
    }

    checkCandidat() {
            this.candidatService.verifierCandidat(
                this.AdmissionModeForm.controls.nom.value,
                this.AdmissionModeForm.controls.prenom.value,
                this.AdmissionModeForm.controls.dateDeNaissance.value,
                this.AdmissionModeForm.controls.modeAdmission.value,
                this.AdmissionModeForm.controls.numPlace.value,
                this.AdmissionModeForm.controls.academie.value,
                this.AdmissionModeForm.controls.numAdmission.value,
                this.AdmissionModeForm.controls.anneeScolaire.value).subscribe(verif => {
                // if (Object.keys(verif).length > 0) {
                    sessionStorage.setItem('preinscriptionformPage', 'ok');
                    sessionStorage.setItem('id_candidat', verif['id']);
                    sessionStorage.setItem('id_specialiteCandidat', this.AdmissionModeForm.controls.specialite.value);
                    this.navigateToPreinscriptionForm();
                // }
            }, error => {
              Util_fonction.AlertMessage(error.error.status,error.error.message);
            });
    }
  mode = null;
    GenerFormInput() {
        const mode = this.AdmissionModeForm.controls.modeAdmission.value;
        if (mode === 'null'){
          this.showNumAdmission = false;
          return;
        }
        this.mode = mode;
        this.getNote(mode);
        if (mode === 'NOUVEAU_BACHELIER') {
          /**********************Cas Nouveau bachelier ************/
            this.newBac = true;
            if (this.structureType === 'Institut') {
              this.showNumAdmission = false;
              this.statutOk = false;
              this.postuleCas = false;
            } else {
              // DESACTIVATION DU NUM ADMISSION IF TYPE STRUCTURE === INSTITUT  ---Ok Fac new bac
              this.AdmissionModeForm.controls.numAdmission.reset();
              this.AdmissionModeForm.controls.numAdmission.clearValidators();
              this.AdmissionModeForm.controls.numAdmission.updateValueAndValidity();
              this.showNumAdmission = false;
              this.statutOk = false;
            }
            this.ActiveInputs();
        } else { /**********************Cas Admie sur titre et autre *********** */
            this.newBac = false;
          if (this.structureType === 'Institut') {
            // DESACTIVATION DU NUM ADMISSION IF TYPE STRUCTURE === INSTITUT -- Ok Methode Postuler('full) Inst Autre
            this.AdmissionModeForm.controls.numAdmission.reset();
            this.AdmissionModeForm.controls.numAdmission.clearValidators();
            this.AdmissionModeForm.controls.numAdmission.updateValueAndValidity();
            this.showNumAdmission = false;
            this.statutOk = false;
            this.postuleCas = true;
          } else {
            // ACTIVATION DU NUM ADMISSION SI LA STRUCTURE VISEE !!== INSTITUT --OK //FAC Autre
            this.AdmissionModeForm.controls.numAdmission.setValidators([Validators.required]);
            this.AdmissionModeForm.controls.numAdmission.updateValueAndValidity();
            this.showNumAdmission = true;
            this.statutOk = true;
            this.postuleCas = false;
          }
            this.DesactiveInputs();
        }
    }

    backToPreinscriptioPage() {
      this.router.navigate(['']);
    }

    /***
     * Remplissage auto du chant annee2 et annee
     */
    selectSecondYears() {
        this.AdmissionModeForm.controls.anneeScolaire.setValue(' ');
        const annee1: number = (<number>this.AdmissionModeForm.controls.annee1.value);
        this.annee2 = Number(annee1);
        this.anneeScol = this.annee2 + ' - ';
        this.annee2 = this.annee2 + 1;
        this.anneeScol += this.annee2;
        this.AdmissionModeForm.controls.anneeScolaire.setValue(this.anneeScol);
    }

    getNote(mode) {
        this.note = true;
        switch (mode){
            case 'NOUVEAU_BACHELIER' :
                this.titre = 'NOUVEAU BACHELIER';
                this.noteText = 'Toute personne titulaire d\'un diplôme de Baccalaureat ou équivalent de l\'année en cours';
                this.DescriptionModal();
                break;
            case 'MALIEN_DE_L_EXTERIEUR' :
                this.titre = 'MALIEN DE L\'EXTERIEUR';
                this.noteText = 'Toute personne ayant la nationalité <strong>Malienne </strong> mais qui est détenteur d\'un dipôme etrangé';
              this.DescriptionModal();
                break;
            case 'ETRANGER_UEMOA' :
                this.titre = 'ETRANGER UEMOA';
                this.noteText = "Toute personne ayant la nationalité d'un des pays de l'UEMOA et un diplôme etrangé obtenu dans l'UEMOA";
              this.DescriptionModal();
                break;

          case 'ETRANGER_HORS_UEMOA' :
            this.titre = 'ETRANGER HORS UEMOA';
            this.noteText = "Toute personne ayant la nationalité d'un des pays hors de l'UEMOA et un diplôme etrangé obtenu hors de l'UEMOA";
            this.DescriptionModal();
            break;

            case 'BT2' :
                this.titre = 'BT2';
                this.noteText = 'Toute personne ayant la nationalité  malienne et titulaire d\'un BT2';
              this.DescriptionModal();
                break;

            case 'ADMIS_SUR_TITRE' :
                this.titre = 'ADMIS SUR TITRE,';
                this.noteText = "Toute personne ayant la nationalité malienne et titulaire d'un diplôme équivalent au BAC";
              this.DescriptionModal();
                break;

            case 'ADMIS_PAR_TRANSFERT_DE_CREDIT' :
                this.titre = "ADMIS PAR TRANSFERT DE CREDIT";
                this.noteText = "Toute personne ayant effectuer un transfert d'une structure de "+this.univ+" vers la structure concernée <strong>"+this.structureSigle+"</strong>";
              this.DescriptionModal();
                break;

            case 'ADMIS_SUR_TITRE_RECTORAT' :
                this.titre = "ADMIS SUR TITRE RECTORAT";
                this.noteText = "Toute personne ayant l'accord du rectorat pour s'inscrit dans le la structure concernée <strong>"+this.structureSigle+"</strong> <br>";
              this.DescriptionModal();
                break;


            case 'MASTER' :
                this.titre = "MASTER";
                this.noteText = "Etudiant titulaire d'un diplôme de <strong>Licence</strong> valide!";
              this.DescriptionMasterModal();
                break;


            case 'MASTER_BOURSIER' :
                this.titre = "MASTER BOURSIER";
                this.noteText = "Etudiant titulaire d'un diplôme de <strong>Licence</strong> valide! et bénefitiant d'une bourse pour le master dans la structure <strong>"+this.structureSigle+"</strong>";
              this.DescriptionMasterModal();
                break;


            // case 'CANDIDAT_LIBRE' :
            //     this.titre = "MASTER BOURSIER";
            //     this.noteText = "Toute personne ayant la nationalité malienne et titulaire d'un diplôme équivalent au BAC";
            //   this.DescriptionModal();
            //     break;

            case 'PROFESSIONNEL' :
                this.titre = "PROFESSIONNEL";
                this.noteText = "Toute personne ayant la nationalité malienne et titulaire d'un diplôme équivalent au BAC";
              this.DescriptionModal();
                break;


            default: break;

        }
    }

  DescriptionModal(){
    Swal.fire({
      icon: 'info',
      title: this.titre,
      html: "<span class='badge badge-danger'>IMPORTANT :</span> <span class='text-info'>soyez sûre de votre profil</span> <br>"+this.noteText,
      allowOutsideClick:false
    })
  }
  DescriptionMasterModal(){

    Swal.fire({
      title: this.titre,
      html: "<span class='badge badge-danger'>IMPORTANT :</span> <span class='text-info'>soyez sûre de votre profil</span> <br>"+this.noteText,
      icon: 'info',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Non !',
      confirmButtonText: 'suivant!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.MasterQuestion();
      }
    })

  }

  MasterQuestion(){
    Swal.fire({
      title: this.titre,
      html: "<span class='badge badge-danger'>IMPORTANT :</span> <span class='text-info'>Etes-vous un ancien étudiant de la/l' ("+this.structureSigle+")</span> <br>",
      icon: 'info',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Non !',
      confirmButtonText: 'Oui, Je le suis!'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.setItem("acien", "oui");
        sessionStorage.setItem("modeAdmissionSelected", this.mode);
        this.navigateToAncientRe_Inscription();
      } else {
        sessionStorage.setItem("acien", "non");
      }
    })
  }

    ActiveInputs() {
        this.AdmissionModeForm.controls.nom.setValidators([Validators.required]);
        this.AdmissionModeForm.controls.nom.updateValueAndValidity();

        this.AdmissionModeForm.controls.prenom.setValidators([Validators.required]);
        this.AdmissionModeForm.controls.prenom.updateValueAndValidity();

        this.AdmissionModeForm.controls.dateDeNaissance.setValidators([Validators.required]);
        this.AdmissionModeForm.controls.dateDeNaissance.updateValueAndValidity();

        this.AdmissionModeForm.controls.numPlace.setValidators([Validators.required]);
        this.AdmissionModeForm.controls.numPlace.updateValueAndValidity();

        this.AdmissionModeForm.controls.academie.setValidators([Validators.required]);
        this.AdmissionModeForm.controls.academie.updateValueAndValidity();

        this.AdmissionModeForm.controls.anneeScolaire.setValidators([Validators.required]);
        this.AdmissionModeForm.controls.anneeScolaire.updateValueAndValidity();

        this.AdmissionModeForm.controls.specialite.setValidators([Validators.required]);
        this.AdmissionModeForm.controls.specialite.updateValueAndValidity();
        // this.AdmissionModeForm.controls.annee1.setValidators([Validators.required]);
        // this.AdmissionModeForm.controls.annee1.updateValueAndValidity();


    }

    DesactiveInputs() {

        this.AdmissionModeForm.controls.nom.reset();
        this.AdmissionModeForm.controls.nom.clearValidators();
        this.AdmissionModeForm.controls.nom.updateValueAndValidity();

        this.AdmissionModeForm.controls.prenom.reset();
        this.AdmissionModeForm.controls.prenom.clearValidators();
        this.AdmissionModeForm.controls.prenom.updateValueAndValidity();

        this.AdmissionModeForm.controls.dateDeNaissance.reset();
        this.AdmissionModeForm.controls.dateDeNaissance.clearValidators();
        this.AdmissionModeForm.controls.dateDeNaissance.updateValueAndValidity();

        this.AdmissionModeForm.controls.numPlace.reset();
        this.AdmissionModeForm.controls.numPlace.clearValidators();
        this.AdmissionModeForm.controls.numPlace.updateValueAndValidity();

        this.AdmissionModeForm.controls.academie.reset();
        this.AdmissionModeForm.controls.academie.clearValidators();
        this.AdmissionModeForm.controls.academie.updateValueAndValidity();

        this.AdmissionModeForm.controls.anneeScolaire.reset();
        this.AdmissionModeForm.controls.anneeScolaire.clearValidators();
        this.AdmissionModeForm.controls.anneeScolaire.updateValueAndValidity();

        this.AdmissionModeForm.controls.specialite.reset();
        this.AdmissionModeForm.controls.specialite.clearValidators();
        this.AdmissionModeForm.controls.specialite.updateValueAndValidity();
        //  this.AdmissionModeForm.controls.annee1.reset();
        // this.AdmissionModeForm.controls.annee1.clearValidators();
        // this.AdmissionModeForm.controls.annee1.updateValueAndValidity();


    }

    initForm() {
        this.AdmissionModeForm = this.formBuilder.group({
            modeAdmission: new FormControl(null, Validators.required),
            nom: new FormControl(null),
            prenom: new FormControl(null),
            dateDeNaissance: new FormControl(null),
            numPlace: new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')]), //[Validators.min(5), Validators.max(10)]
            anneeScolaire: new FormControl(null),
            numAdmission: new FormControl(null),
            academie: new FormControl(null),
            specialite: new FormControl(null),

            annee1: new FormControl(null),
            annee2: new FormControl({value: null, disabled: true}),
        });

        // this.anneeForm = this.formBuilder.group({
        //
        // });
    }

    navigateToPreinscriptionForm(){
        this.router.navigate(['/pages/utilisateur/preIncriptionForm']);
    }

    navigateToCandidatRegisterForm(){
        this.router.navigate(['/pages/utilisateur/registerCandidatForm']);
    }

    navigateToAncientRe_Inscription(){
        this.router.navigate(['/pages/utilisateur/re_inscriptionAncien']);
    }
}
