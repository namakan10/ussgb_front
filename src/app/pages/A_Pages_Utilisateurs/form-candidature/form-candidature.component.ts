import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Util_fonction} from "../../models/util_fonction";
import {CropComponent, ResulteFileCrop} from "../crop/crop.component";
import Swal from "sweetalert2";
import {PAYS_MONDE} from "../../PAYS_MODE";
import {PreInscriptionServiceService} from "../../../services/pre-inscription-service.service";
import {Router} from "@angular/router";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {FiliereService} from "../../../services/GestionFilieres/filiere.service";
import {CandidatureService} from "../../../services/GestionEtudiants/candidature.service";
import {NgxImageCompressService} from "ngx-image-compress";
import {CandidatService} from "../../../services/GestionEtudiants/candidat.service";
import {MatDialog} from "@angular/material";
import {UNIV_FILIERE, UNIV_OPTION} from "../../../CONSTANTES";

@Component({
  selector: 'app-form-candidature',
  templateUrl: './form-candidature.component.html',
  styleUrls: ['./form-candidature.component.css']
})
export class FormCandidatureComponent implements OnInit {
univ_fil = UNIV_FILIERE;
univ_opt = UNIV_OPTION;
  SendDatas = {
    candidat : {
      // id: null,
      nom: null,
      prenom: null,
      dateDeNaissance: null,
      lieuDeNaissance: null,
      nationalite: null,
      paysDeNaissance : null,
      genre: null,
      ville : null,
      telephone : null,
      telephoneTuteur : null,
      email : null,
      specialite: null,
      modeAdmission: null,
      annee: null,

      quartier: null,
      rue: null,
      porte: null,

    },
    niveau : null,
    option : {
      id : null,
    }
  }
  FileBody = {
    id_photo: null,
    acteNaissance: null,
    certificatNationnalite: null,
    diplome: null,
    releve: null,
  }
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  troisFormGroup: FormGroup;

  Pays = PAYS_MONDE;

  /* FILES VARIABLES ******* */
  FileNAME: any;
  FileTYPE: any;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  idPhoto: File;
  acteDeNaissance: File;
  attestationBac: File;
  releveBac: File;
  autre: File;

  idPhotoAlert = false; //     Alert
  acteDeNaissanceAlert = false;
  attestationBacAlert = false;
  releveBacAlert = false;
  autreAlert = false;

  idPhotoOk = false; //     chevron de conformité
  acteDeNaissanceOk = false;
  attestationBacOk = false;
  releveBacOk = false;
  autreOk = false;

  fileAlertMessage: any;

  /* VARIABLE DES DONNEES ******* */
  formTitle;
  candidatID;
  anneeScolaireUniv;
  candidatSpecialiteID;
  structureID;
  structureSigle;
  structureType;
  Filieres;
  Options;

  SelectFiliere = null;
  SelectOption = null;

  Fil_spinner;
  Opt_spinner: boolean  = false;
  submit_spinner: boolean = false;

  alertt = null;
  srcIMG: any;
  localUrl: any;

  enablebOptions = true;
  eventData :any;
  candidatData :any;
  CandidatureData :any;
  filID :any;
  CandidatureFileData :any;
  FilesReloadAlert :boolean = false;

  filiereListBody = {
    id_structure: null,
    id_departement: null,
    id_candidat: null,
    cursus: null
  }

  MasterData = {
    niveau:null,
    option:{
      id: null
    },
    etudiant:{
      id:null,
      numEtudiant:null,
      telephoneTuteur:null,
      typeCandidat:null,
      user:{
        id:null,
        email:null,
        telephone:null,
        ville:null,
        quartier:null,
        porte:null,
        rue:null
      }
    }
  }

  anciensDatas = JSON.parse(sessionStorage.getItem("anciensData"));
  anciensToNewCandidature : boolean = false;


  constructor(private formBuilder: FormBuilder,
              private preInscriptionService: PreInscriptionServiceService,
              private router: Router,
              private optionService: OptionsService,
              private filiereService: FiliereService,
              private candidatureService: CandidatureService,
              private imageCompress: NgxImageCompressService,
              private candidatService: CandidatService,
              public dialog: MatDialog) {

    if (Util_fonction.checkIfNoTEmpty(this.anciensDatas)) {
      this.anciensToNewCandidature = true;
    }
  }

  ngOnInit() {

    this.initForm();
    this.candidatID = sessionStorage.getItem('id_candidat');
    this.eventData = JSON.parse(sessionStorage.getItem('EvenementData'));
    this.candidatData = JSON.parse(sessionStorage.getItem('CandidatRegisterInfos'));

    this.structureID = sessionStorage.getItem('id_structure');
    this.anneeScolaireUniv = sessionStorage.getItem('structureAnneeScolaire');
    this.structureSigle = sessionStorage.getItem('structureSigle');
    this.structureType = sessionStorage.getItem('structureType');
    this.getFiliereByStructureAndCandidatSpecialite();

    if (sessionStorage.getItem('CandidatureData') !== null){
      // sessionStorage.setItem('CandidatureData', JSON.stringify(this.SendDatas));
      this.CandidatureData = JSON.parse(sessionStorage.getItem('CandidatureData'));
      this.CandidatureFileData = JSON.parse(sessionStorage.getItem('CandidatureFileData'));
      this.FullCandidatureFormForEdit();
    }
  }

  FullCandidatureFormForEdit() {
    Util_fonction.AlertMessage('info', 'Veuillez, s\'il vous plaît réselection les documents à envoyer');
    this.FilesReloadAlert = true;
    this.firstFormGroup.controls.niveau.setValue(this.CandidatureData.niveau);
    let idFil = JSON.parse(sessionStorage.getItem('filID'));
    this.firstFormGroup.controls.filiere.setValue(idFil);
    this.GetFilOptions(idFil);
    this.firstFormGroup.controls.option.setValue(this.CandidatureData.option.id);


  }


  /** =========================================================================================================
   * GESTION DE PAR PARTIE FILIERES ET OPTIONS
   * ***************************************************
   */

  /**
   * AMENE LES FILIERES QUI CONCERNE LA SPECIALITE DU CANDIDANT EN COURS D'INSCRIPTION
   */
  getFiliereByStructureAndCandidatSpecialite() {
    this.Fil_spinner = true;
    this.filiereListBody.id_structure = this.structureID;
    this.filiereListBody.id_candidat = this.candidatID;
    this.filiereListBody.cursus = this.eventData.cursus;

    this.filiereService.GetStructureFilieres(this.filiereListBody).subscribe(filRes => {
      this.Filieres = filRes;
      this.Fil_spinner = false;
    });
    setTimeout(() => {this.loadFil(); }, 10000);
  }


  /***
   * CHARGE LES OPTIONS DE LA FILIERE SELECTIONNEE
   * @param event
   */
  selectOptions(event) {
    this.Opt_spinner = true;
    this.SelectFiliere = event.target.options[event.target.options.selectedIndex].text;
    const filID = this.firstFormGroup.controls.filiere.value;
    this.filID = this.firstFormGroup.controls.filiere.value;
    this.optionService.getOptionsByFiliereID(filID).subscribe(getFilRes => {
      this.enablebOptions = false;
      this.Options = getFilRes;
      this.Opt_spinner = false;
    });
  }

  GetFilOptions(filID){
    this.optionService.getOptionsByFiliereID(filID).subscribe(getFilRes => {
      this.enablebOptions = false;
      this.Options = getFilRes;
      this.Opt_spinner = false;
    });
  }

  getOptionSelect(event) {
    this.SelectOption = event.target.options[event.target.options.selectedIndex].text;
  }

  loadFil() {
    if (this.Fil_spinner) {
      Util_fonction.AlertMessage("warning", "Veuillez vous rassurer que votre connection est stable!");

      this.getFiliereByStructureAndCandidatSpecialite();
    }
  }
  /** ***************************************************
   *  FIN == END DE LA PARTIE DES FICHIER A ENVOYER
   *  ====================================================================================================
   */




  /** ====================================================================================================
   *  GESTION DE LA PARTIE DES FICHIER A ENVOYER
   *  ***************************************************
   */
  FileSelect(event, type) {
    const fichier: File = event.target.files[0]; // this.CropConvertFile;
    //   let reader = new FileReader();

    //   reader.readAsDataURL(fichier);
    //   reader.onload = (_event) => {
    //     this.srcIMG = _event.target.result;
    //   }


    if (fichier !== undefined && fichier !== null) {
      this.FileNAME = fichier.name;
      this.FileTYPE = type;
      this.controlFile(event, type);
    } else {
      this.showAlertText(type);
    }
  }

  /**
   * VERIFIE SI LE FICHIER RESPECT LES NORMES
   * @param event
   * @param type
   */
  async controlFile(event, type) {
    let fileName: any;
    let fichier: File;
    fileName = event.target.files[0]['name'];

    // COMPRESS L'IMAGE SI PHOTO DE PROFILE
    if (type === 'idPhoto') {

      let reader = new FileReader();
      reader.onload = async (event: any) => {
        this.localUrl = event.target.result;
        let util = new Util_fonction(this.imageCompress);
        // this.CompressReult = await util.compressFile(this.localUrl, fileName);
        fichier = await util.compressFile(this.localUrl, fileName);

        await this.delay(1000);
      }
      reader.readAsDataURL(event.target.files[0]);
      await this.delay(855);

    } else {

      fichier = event.target.files[0]; // this.CropConvertFile;
    }
    //= this.CompressReult; //event.target.files[0]; // this.CropConvertFile;

    const ext = fichier.name.substr(fichier.name.lastIndexOf('.') + 1);
    const extension1 = ['jpeg', 'jpg', 'png', 'pdf', 'JPEG', 'JPG', 'PNG', 'PDF']; // cas eventuel Pdf
    const extension2 = ['jpeg', 'jpg', 'png', 'JPEG', 'JPG', 'PNG'];
    const limitSize = 2097152;
    let selectExtensionArray = null;


    if (type === 'idPhoto') {
      selectExtensionArray = extension2;
    } else {
      selectExtensionArray = extension1;
    }

    if (selectExtensionArray.includes(ext)) {
      if (fichier['size'] <= limitSize) {
        // lancer le crop
        this.FileTYPE = type;
        if (extension2.includes(ext)) {
          this.imageChangedEvent = event;
          this.LaunchCrop();

        } else {
          this.RenameFile(fichier, this.FileTYPE);
        }
      } else {
        // show Alert Modal
        this.fileAlertMessage = 'Ce fichier est trop volumineux que ce qui est demandé';
        this.showAlertText(type);
        this.fileAlert('Ce fichier est trop volumineux que ce qui est demandé');
      }
    } else {
      // show Alert Modal
      this.fileAlertMessage = 'Ce fichier ne répond pas aux format attendus!';
      this.showAlertText(type);
      this.fileAlert('Ce fichier ne répond pas aux format attendus!');
      // this.LaunchCrop();

    }

  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  /***
   * Ouvert le modal Crop
   * @constructor
   */
  LaunchCrop(): void {
    const dialogRef = this.dialog.open(CropComponent, {
      disableClose: true,
      width: '950px',
      data: {imageChangedEvent: this.imageChangedEvent, returnFile: ''}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.RenameFile(ResulteFileCrop, this.FileTYPE);
    });
  }

  /***
   * RENOMME LE FICHIER SELECTIONNER
   * @param FILES
   * @param type
   * @constructor
   */
  RenameFile(FILES, type) {
    const fichier: File = FILES; // event.target.files[0];
    const ext = fichier.type.substr(fichier.type.lastIndexOf('/') + 1);
    const newFile: File = new File([fichier], Math.floor(Date.now() / 1000) + '.' + ext, {type: fichier.type});

    this.fullFileData(newFile, type);
  }

  fullFileData(newFile: File, type: string) {
    // const fd = new FormData();
    // fd.append('file', newFile);
    if (type === 'idPhoto') {
      this.idPhoto = newFile;
      this.FileBody.id_photo = newFile;
    } else if (type === 'attestationBac') {
      this.attestationBac = newFile;
      this.FileBody.diplome = newFile;
    } else if (type === 'acteDeNaissance') {
      this.acteDeNaissance = newFile;
      this.FileBody.acteNaissance = newFile;
    } else if (type === 'releveBac') {
      this.releveBac = newFile;
      this.FileBody.releve = newFile;
    } else if (type === 'autre') {
      this.autre = newFile;
      this.FileBody.certificatNationnalite = newFile;
    }
    this.hideAlertText(type);
  }

  /**
   * CACHE LE MESSAGE DE NOM CONFORMITE
   * @param type
   */
  hideAlertText(type) {
    switch (type) {
      case 'idPhoto':
        this.idPhotoAlert = false;
        this.idPhotoOk = true;
        break;
      case 'acteDeNaissance':
        this.acteDeNaissanceAlert = false;
        this.acteDeNaissanceOk = true;
        break;
      case 'attestationBac':
        this.attestationBacAlert = false;
        this.attestationBacOk = true;
        break;
      case 'releveBac':
        this.releveBacAlert = false;
        this.releveBacOk = true;
        break;
      case 'autre':
        this.autreAlert = false;
        this.autreOk = true;
        break;
    }
  }
  /**
   * MONTRE LE MESSAGE DE NOM CONFORMITE
   * @param type
   */
  showAlertText(type) {
    switch (type) {
      case 'idPhoto':
        this.idPhotoAlert = true;
        this.idPhotoOk = false;
        break;
      case 'acteDeNaissance':
        this.acteDeNaissanceAlert = true;
        this.acteDeNaissanceOk = false;
        break;
      case 'attestationBac':
        this.attestationBacAlert = true;
        this.attestationBacOk = false;
        break;
      case 'releveBac':
        this.releveBacAlert = true;
        this.releveBacOk = false;
        break;
      case 'autre':
        this.autreAlert = true;
        this.autreOk = false;
        break;

    }
  }

  fileAlert(message) {
    Util_fonction.AlertMessage(404,message);
  }
  /** ***************************************************
   *  FIN==END DE LA PARTIE DES FICHIER A ENVOYER
   *  ====================================================================================================
   */


  /** ============================================================
   *  RECAPITULATIF DES SELECTIONS
   *  ***************************************************
   */
  recapitulatifAlert() {
    this.FilesReloadAlert = false;
    // if (Util_fonction.checkIfNoTEmpty(this.candidatData.id)){
    //   this.SendDatas.candidat.id = +this.candidatData.id;
    // }
    this.SendDatas.option.id = +this.firstFormGroup.controls.option.value;
    this.SendDatas.niveau = this.firstFormGroup.controls.niveau.value;
    sessionStorage.setItem('filID', JSON.stringify(this.filID));
    sessionStorage.setItem('CandidatureData', JSON.stringify(this.SendDatas));
    sessionStorage.setItem('CandidatureFileData', JSON.stringify(this.FileBody));


    Swal.fire({
      title: '<h1><strong>Recapitulatif.</strong></h1>',
      html:
        '<h2 mat-dialog-title class="text-center"><i class="fa fa-history text-danger"></i></h2>\n' +
        '\n' +
        '    <div class="alert alert-light"><strong>Niveau: </strong> ' + this.firstFormGroup.controls.niveau.value + '</div>\n' +
        '    <div class="alert alert-light"><strong>'+this.univ_fil+': </strong> ' + this.SelectFiliere + '</div>\n' +
        '    <div class="alert alert-light"><strong>'+this.univ_opt+': </strong> ' + this.SelectOption + '</div>\n' +
        '    <div class="alert alert-warning"><strong>Email: </strong> ' + this.candidatData.email + '\n' +
        '        <div class="pulsating-circle float-right"><i class="fa fa-info-circle"  aria-hidden="true"></i></div>\n' +
        '    </div>\n' +
        '    <div class="alert alert-light"><strong>Nom: </strong> ' + this.candidatData.nom + '</div>\n' +
        '    <div class="alert alert-light"><strong>Prénom: </strong> ' + this.candidatData.prenom + '</div>\n' +
        '    <div class="alert alert-light"><strong>Genre: </strong> ' + this.candidatData.genre + '</div>\n' +
        '    <div class="alert alert-light"><strong>Spécialité: </strong> ' + this.candidatData.specialite + '</div>\n' +
        '    <div class="alert alert-light"><strong>Mode d\'admission: </strong> ' + this.candidatData.modeAdmission + '</div>\n' +
        '    <div class="alert alert-light"><strong>Année: </strong> ' + this.candidatData.annee + '</div>\n' +
        '    <div class="alert alert-light"><strong>Téléphone: </strong> ' + this.candidatData.telephone + '</div>\n' +
        '    <div class="alert alert-light"><strong>Téléphone tuteur: </strong> ' + this.candidatData.telephoneTuteur + '</div>\n' +
        '    <div class="alert alert-light"><strong>Nationalité: </strong> ' + this.candidatData.nationalite + '</div>\n' +
        '    <div class="alert alert-light"><strong>Pays de naissance: </strong> ' + this.candidatData.paysDeNaissance + '</div>\n' +
        '    <div class="alert alert-light"><strong>Date de naissance: </strong> ' + this.candidatData.dateDeNaissance + '</div>\n' +
        '    <div class="alert alert-light"><strong>Lieu de naissance: </strong> ' + this.candidatData.lieuDeNaissance + '</div>\n' +
        '    <div class="alert alert-light"><strong>Ville : </strong> ' + this.candidatData.ville + '</div>\n' +

        '    <h5><strong>-- Fichiers joints -- </strong> <br/></h5>'+
        '    <div class="alert alert-light"><strong>Photo :</strong> ' + this.idPhoto['name'] + ' <i class="fa fa-check-circle text-success"></i></div>\n' +
        '    <div class="alert alert-light"><strong>Acte de naissance :</strong> ' + this.acteDeNaissance['name'] + ' <i class="fa fa-check-circle text-success"></i></div>\n' +
        '    <div class="alert alert-light"><strong>Diplôme :</strong> ' + this.attestationBac['name'] + ' <i class="fa fa-check-circle text-success"></i></div>\n' +
        '    <div class="alert alert-light"><strong>Rélévé de note :</strong> ' + this.releveBac['name'] + ' <i class="fa fa-check-circle text-success"></i></div>\n' +
        '    <div class="alert alert-light"><strong>Certificat de nationalité :</strong> ' + this.autre['name'] + ' <i class="fa fa-check-circle text-success"></i></div>\n',
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'non, je modifie',
      confirmButtonText: 'Oui, soumettre',
    }).then((result) => {
      if (result.isConfirmed) {
        this.submit_spinner = true;
        // save datas
        Swal.close();
        this.SubmitForm();
        // this.saveCandidatPreInscription();
      }
    });


  }


  AncienrecapitulatifNewCandidatureAlert(){
    this.SendDatas.option.id = +this.firstFormGroup.controls.option.value;
    this.SendDatas.niveau = this.firstFormGroup.controls.niveau.value;
    // sessionStorage.setItem('filID', JSON.stringify(this.filID));
    sessionStorage.setItem('CandidatureData', JSON.stringify(this.SendDatas));
    // sessionStorage.setItem('CandidatureFileData', JSON.stringify(this.FileBody));

    Swal.fire({
      title: '<h1><strong>Recapitulatif.</strong></h1>',
      html:
        '<h2 mat-dialog-title class="text-center"><i class="fa fa-history text-danger"></i></h2>\n' +
        '\n' +
        '    <div class="alert alert-light"><strong>Niveau: </strong> ' + this.firstFormGroup.controls.niveau.value + '</div>\n' +
        '    <div class="alert alert-light"><strong>'+this.univ_fil+': </strong> ' + this.SelectFiliere + '</div>\n' +
        '    <div class="alert alert-light"><strong>'+this.univ_opt+': </strong> ' + this.SelectOption + '</div>\n' +
        '    <div class="alert alert-warning"><strong>Email: </strong> ' + this.anciensDatas.etudiant.user.email + '\n' +
        '        <div class="pulsating-circle float-right"><i class="fa fa-info-circle"  aria-hidden="true"></i></div>\n' +
        '    </div>\n' +
        '    <div class="alert alert-light"><strong>Nom: </strong> ' + this.anciensDatas.etudiant.user.nom + '</div>\n' +
        '    <div class="alert alert-light"><strong>Prénom: </strong> ' + this.anciensDatas.etudiant.user.prenom + '</div>\n' +
        '    <div class="alert alert-light"><strong>Genre: </strong> ' + this.anciensDatas.etudiant.user.genre + '</div>\n' +
        '    <div class="alert alert-light"><strong>Téléphone: </strong> ' + this.anciensDatas.etudiant.user.telephone + '</div>\n' +
        '    <div class="alert alert-light"><strong>Téléphone tuteur: </strong> ' + this.anciensDatas.etudiant.telephoneTuteur + '</div>\n' +
        '    <div class="alert alert-light"><strong>Nationalité: </strong> ' + this.anciensDatas.etudiant.nationalite + '</div>\n' +
        '    <div class="alert alert-light"><strong>Date de naissance: </strong> ' + this.anciensDatas.etudiant.user.dateDeNaissance + '</div>\n' +
        '    <div class="alert alert-light"><strong>Lieu de naissance: </strong> ' + this.anciensDatas.etudiant.user.lieuDeNaissance + '</div>\n' +
        '    <div class="alert alert-light"><strong>Ville : </strong> ' + this.anciensDatas.etudiant.user.ville + '</div>\n' +
        '    <div class="alert alert-light"><strong>Quartier : </strong> ' + this.anciensDatas.etudiant.user.quartier + '</div>\n' +
        '    <div class="alert alert-light"><strong>Rue : </strong> ' + this.anciensDatas.etudiant.user.rue + '</div>\n' +
        '    <div class="alert alert-light"><strong>Porte : </strong> ' + this.anciensDatas.etudiant.user.porte + '</div>\n' +

        '    <h5><strong>-- Fichiers joints -- </strong> <br/></h5>'+
        '    <div class="alert alert-light"><strong>Photo :</strong> ' + this.idPhoto['name'] + ' <i class="fa fa-check-circle text-success"></i></div>\n' +
        '    <div class="alert alert-light"><strong>Acte de naissance :</strong> ' + this.acteDeNaissance['name'] + ' <i class="fa fa-check-circle text-success"></i></div>\n' +
        '    <div class="alert alert-light"><strong>Diplôme :</strong> ' + this.attestationBac['name'] + ' <i class="fa fa-check-circle text-success"></i></div>\n' +
        '    <div class="alert alert-light"><strong>Rélévé de note :</strong> ' + this.releveBac['name'] + ' <i class="fa fa-check-circle text-success"></i></div>\n' +
        '    <div class="alert alert-light"><strong>Certificat de nationalité :</strong> ' + this.autre['name'] + ' <i class="fa fa-check-circle text-success"></i></div>\n',
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'non, je modifie',
      confirmButtonText: 'Oui, soumettre',
    }).then((result) => {
      if (result.isConfirmed) {
        this.submit_spinner = true;
        // save datas
        Swal.close();
        this.SubmitForm();
        // this.saveCandidatPreInscription();
      }
    });
  }


  /***
   *
   * @constructor
   */

  SubmitForm(){
    if (this.anciensToNewCandidature) {
      if (Util_fonction.checkIfNoTEmpty(this.anciensDatas.etudiant.id)){
        this.MasterData.etudiant.id = +this.anciensDatas.etudiant.id;
      }
      if (Util_fonction.checkIfNoTEmpty(this.anciensDatas.etudiant.id)){
        this.MasterData.etudiant.user.id = +this.anciensDatas.etudiant.user.id;
      }
      this.MasterData.option.id = +this.firstFormGroup.controls.option.value;
      this.MasterData.niveau = this.firstFormGroup.controls.niveau.value;

      this.MasterData.etudiant.user.email = this.anciensDatas.etudiant.user.email;

      this.MasterData.etudiant.user.telephone = +this.anciensDatas.etudiant.user.telephone;
      if (Util_fonction.checkIfNoTEmpty(this.anciensDatas.etudiant.telephoneTuteur)){
        this.MasterData.etudiant.telephoneTuteur = +this.anciensDatas.etudiant.telephoneTuteur;
      }
      this.MasterData.etudiant.user.ville = this.anciensDatas.etudiant.user.ville;

      this.MasterData.etudiant.user.quartier = this.anciensDatas.etudiant.user.quartier;
      this.MasterData.etudiant.user.porte = this.anciensDatas.etudiant.user.porte;
      this.MasterData.etudiant.user.rue = this.anciensDatas.etudiant.user.rue;

      this.MasterData.etudiant.numEtudiant = this.anciensDatas.etudiant.numEtudiant;
      if (Util_fonction.checkIfNoTEmpty(sessionStorage.getItem("modeAdmissionSelected"))){
        this.MasterData.etudiant.typeCandidat = sessionStorage.getItem("modeAdmissionSelected");
      }else {
        this.MasterData.etudiant.typeCandidat = this.anciensDatas.etudiant.typeCandidat;
      }



      //   option:{
      //   id: null
      // },
      // etudiant:{
      //     // numEtudiant:null,
      //
      //     // typeCandidat:null,
      //     user:{
      //     id:null,
      //
      //   }
      // }
    } else {

      /**        */

      // this.SendDatas.candidat = this.candidatData;
      // if (Util_fonction.checkIfNoTEmpty(this.candidatData.id)){
      //   this.SendDatas.candidat.id = +this.candidatData.id;
      // }
      this.SendDatas.option.id = +this.firstFormGroup.controls.option.value;
      this.SendDatas.niveau = this.firstFormGroup.controls.niveau.value;

      this.SendDatas.candidat.email = this.candidatData.email;
      this.SendDatas.candidat.nom = this.candidatData.nom;
      this.SendDatas.candidat.prenom = this.candidatData.prenom;

      this.SendDatas.candidat.telephone = +this.candidatData.telephone;
      if (Util_fonction.checkIfNoTEmpty(this.candidatData.telephoneTuteur)){
        this.SendDatas.candidat.telephoneTuteur = +this.candidatData.telephoneTuteur;
      }
      this.SendDatas.candidat.ville = this.candidatData.ville;
      this.SendDatas.candidat.paysDeNaissance = this.candidatData.paysDeNaissance;
      this.SendDatas.candidat.nationalite = this.candidatData.nationalite;
      this.SendDatas.candidat.dateDeNaissance = this.candidatData.dateDeNaissance;
      this.SendDatas.candidat.lieuDeNaissance = this.candidatData.lieuDeNaissance;
      this.SendDatas.candidat.specialite = this.candidatData.specialite;
      this.SendDatas.candidat.modeAdmission = this.candidatData.modeAdmission;
      this.SendDatas.candidat.annee = this.candidatData.annee;
      this.SendDatas.candidat.genre = this.candidatData.genre;

      this.SendDatas.candidat.quartier = this.candidatData.quartier;

//*--------------------------------------
      // if (Util_fonction.checkIfNoTEmpty(this.candidatData.telephoneTuteur)){
      //
      //   this.SendDatas.candidat.telephoneTuteur = +this.candidatData.telephoneTuteur;
      // }
      // this.SendDatas.candidat.nationalite = this.candidatData.nationalite;

    }

    this.SaveCandidatureData();
    // PRENDRE COMPTE DU CAS DE IUG
  }

  SaveCandidatureData(){
    let datas: any;
    if (this.anciensToNewCandidature){
      datas = this.MasterData;
    } else {
      datas = this.SendDatas;
    }

    console.log(datas);
      this.candidatureService.addCandidature(datas,this.FileBody)
        .subscribe(CandRes => {
        this.submit_spinner = false;

        Swal.fire({
          title: '',
          text: ""+CandRes,
          icon: 'success',
          allowOutsideClick:false,
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            sessionStorage.clear();
            this.router.navigate(['']);
          }
        })


      }, Canderror1 => {
        this.submit_spinner = false;
       Util_fonction.AlertMessage(Canderror1.error.status, Canderror1.error.message);
      });

  }

  PayementConfirmAlert(InsertResponse) {}

  navigeToRegister()
  {
    if (this.anciensToNewCandidature){
      this.router.navigate(['/pages/utilisateur/re_inscriptionAncien']);
    } else {
      this.router.navigate(['/pages/utilisateur/registerCandidatForm']);
    }
  }


  /***
   * Initialisation du forme
   */
  initForm() {
    this.firstFormGroup = this.formBuilder.group({
      niveau: new FormControl(null, Validators.required),
      filiere: new FormControl(null, Validators.required),
      option: new FormControl(null, Validators.required),
    });


    // Validators.minLength(8)
    this.troisFormGroup = this.formBuilder.group({
      idPhoto: new FormControl(null), // 1131123
      acteDeNaissance: new FormControl(null), // jpeg", "jpg", "png", "pdf"  3131123
      attestationBac: new FormControl(null),
      releveBac: new FormControl(null), // ["jpeg", "jpg", "png"]  3131123
      autre: new FormControl(null),

    });

  }


}
