import { _fixedSizeVirtualScrollStrategyFactory } from '@angular/cdk/scrolling';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CandidatService } from '../../../services/GestionEtudiants/candidat.service';
import { CandidatureService } from '../../../services/GestionEtudiants/candidature.service';
import { FiliereService } from '../../../services/GestionFilieres/filiere.service';
import { OptionsService } from '../../../services/GestionFilieres/Options/options.service';
import { PreInscriptionServiceService } from '../../../services/pre-inscription-service.service';
import { StructureService } from '../../../services/structure.service';
import { PAYS_MONDE } from '../../PAYS_MODE';
import {CropComponent, ResulteFileCrop} from "../crop/crop.component";
import {MatDialog} from "@angular/material";
import {Util_fonction} from "../../models/util_fonction";
import {NgxImageCompressService} from "ngx-image-compress";
import {UNIV_FILIERE, UNIV_OPTION} from "../../../CONSTANTES";

export interface FileAlertData {
  imageChangedEvent: any;
  returnFile: any ;
}

@Component({
  selector: 'app-modif-pre-inscription',
  templateUrl: './modif-pre-inscription.component.html',
  styleUrls: ['./modif-pre-inscription.component.css']
})
export class ModifPreInscriptionComponent implements OnInit {
  univ_fil = UNIV_FILIERE;
  univ_opt = UNIV_OPTION;

    formTitle;
    Pays = PAYS_MONDE;
    alertt = null;
    niveauDefaut = 'L1';
    candidatID;
    anneeScolaireUniv;
    candidatSpecialiteID;
    structureID;
    structureSigle;
    structureType;
    Filieres;
    Options;

    fileBtnNext = true;
    Opt_spinner = false;
    Fil_spinner = false;


    continious = true;
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

    FileNAME: any;
    FileTYPE: any;

    imageChangedEvent: any = '';
    croppedImage: any = '';
    CompressReult: any;

    submit_spinner: boolean = false;


  PreInscriptionData = {
        candidat: {
            nationalite: '',
            ville: '',
            rue: '',
            quartier: '',
            telephone: '',
            porte: '',
            id: '', // id Candidate
            telephoneTuteur: '',
            email: '',
            paysDeNaissance: '',
        },
        niveau: '',
        option: {
            id: '',
        },
    };


    isOptional = false;
    enablebOptions = true;
    count = 0;
    fileAlertMessage: any;

  // ==================
  // ==================
  numForm: FormGroup;

  CandidatDataGroup: FormGroup;

  ID_structure : any;
  structure: any;
  num_Label: string;
  doc_type: string;
  type: any;
  candidatDatas: any;
  typeDoc: string;

  CheckBodyForCandidature = {
    "nom": "",
    "prenom": "",
    "telephone": null,
    "email": "",
    "numDossier": ""

  };
  CheckBody =   {
    "nom" : "",
    "prenom" : "",
    "telephone" : null,
    "email" : "",
    "numPreInscription" : ""
  }

  SendBodyForPreInscription ={
      candidat : {
        nationalite : null,
        ville : null,
        rue : null,
        quartier : null,
        telephone : null,
        porte : null,
        id : null,
        telephoneTuteur : null,
        email : null,
        paysDeNaissance : null,
      },
      niveau : null,
      option : {
        id : null,
      }
    };

  FilesBody = {
    id_photo: null,
    acteNaissance: null,
    certificatNationnalite: null,
    diplome: null,
    releve: null,
  }

  Sepcialites: any;
  CandidatFichiers: any = [];
  FileArray = [];
  idDossier: any;
  check_spinner = false;
  showModifForm = false;
  update_spinner= false;
  showDocuments = false;
  UpdateBody = {
    "option" : {
    "id" : null
    }
  };
  lastFiliere: string;
  lastOption: string;
  EtatPaiement: boolean;
  CandidatPhoto: any;


  Structure_Filieres: any;
  FiliereSelectOptions: any;

  SelectFiliere = null;
  SelectOption = null;

  // Modif Form Part
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  troisFormGroup: FormGroup;
  structureSelectData: any;
  localUrl: any;
  constructor(private structureService: StructureService,
              private formBuilder: FormBuilder,
              private candidatureService: CandidatureService,
              private candidatService: CandidatService,
              private filiereService: FiliereService,
              private optionService: OptionsService,
              private route: Router,
              private imageCompress: NgxImageCompressService,
              public dialog: MatDialog,
              private preInscriptionService: PreInscriptionServiceService) {
              }

  ngOnInit() {
    this.ID_structure = sessionStorage.getItem('ID_Structure');
    this.structureSelectData = JSON.parse(sessionStorage.getItem('structureSelected'));
    this.GetStructureSelect();
    this.GetSpecialites();
    this.GetStructionFilieres();

    this.init_NumForm();
    // this.init_ModifForm();
    this.initForm();

  }
  backToHome(){
    this.route.navigate(['']);
  }

  GetStructionFilieres(){
    this.filiereService.getStructureFilieres(this.ID_structure).subscribe(specialtRes => {
      this.Structure_Filieres = specialtRes;
    })
  }

  GetSpecialites(){
    this.candidatService.getSepcialites().subscribe(specialtRes => {



      this.Sepcialites = specialtRes;
    })
  }

  GetStructureSelect() {
    this.structureService.getStucture(this.ID_structure).subscribe(structure_get_resp =>{
      this.structure = structure_get_resp;
      if (this.structure['type']+'' === 'Institut'){
        this.num_Label = "Numéro de dossier";
        this.type = this.structure['type'];
        this.typeDoc = "candidature";
      } else {
        this.num_Label = "Numéro de pré-inscription";
        this.type = this.structure['type'];
        this.typeDoc = "pré-inscription";
      }
    });
  }

  /**
   * AMENE LES DONNEE DU CANDIDAT
   * @constructor
   */
  GetMyDatas() {
    this.check_spinner = true;
    this.CheckBody.nom = this.numForm.controls.nom.value;
    this.CheckBody.prenom = this.numForm.controls.prenom.value;
    this.CheckBody.telephone = +this.numForm.controls.telephone.value;
    this.CheckBody.email = this.numForm.controls.email.value;
    this.CheckBody.numPreInscription = this.numForm.controls.numDoc.value;

    if(this.type+'' === 'Institut'){
      // CANDIDATURE
      this.candidatureService.getCandidatureByNumDossier(this.CheckBody).subscribe(candidature_get_response =>{
        this.candidatDatas = candidature_get_response;
        this.showDocuments = true;
        // this.check_spinner = false;
        // this.fullForm();
        this.showModifForm = true;
      },candidature_get_error =>{
        this.check_spinner = false;
        this.showModifForm = false;
        Util_fonction.AlertMessage(candidature_get_error.error.status,candidature_get_error.error.message);
      });
    } else {
      // PRE-INSCRIPTION
      this.preInscriptionService.getPreInscriptionByNumPreIncription(this.CheckBody).subscribe(preInscription_get_response =>{

        this.candidatDatas = preInscription_get_response;
        this.showModifForm = true;
        this.showDocuments = true;
        for (let candidatFile of this.candidatDatas.candidat.fichiers){
          if (candidatFile.typeFichier === "Photo d'identité"){
            this.CandidatPhoto = candidatFile.fileUrl;
          }
        }
        // this.fullForm();
      }, preInscription_get_error=> {
        this.check_spinner = false;
        this.showModifForm = false;
        Util_fonction.AlertMessage(preInscription_get_error.error.status,preInscription_get_error.error.message);
      });
    }
  }

  ModifiDocumentClique(){
    this.initForm();
    this.showDocuments = false;
    this.showModifForm = true;
    this.GetSelectFiliereOption();
    this.fullForm();
  }

  GetSelectFiliereOption(){
    this.optionService.getOptionsByFiliereID(this.candidatDatas.option.filiere.id).subscribe(OptRes => {
      this.FiliereSelectOptions = OptRes;
    })
  }

  emailAlert() {
    Swal.fire(
      'notez bien',
      'Des informations vous serons envoyé à cette adresse mail <strong>' + this.secondFormGroup.controls.email.value + '</strong> ' +
      'Veuillez a ce que cela soit correct et accessible',
      'warning'
    );
  }

  /*** ===================================================================
   *  FORMULAIRE DE MODIFICATION D'UNE FILIERE
   *  *****************************************************
   */



  fullForm(){
    this.initForm();
    this.firstFormGroup.controls.filiere.setValue(this.candidatDatas.option.filiere.id);
    this.firstFormGroup.controls.option.setValue(this.candidatDatas.option.id);

    this.secondFormGroup.controls.email.setValue(this.candidatDatas.candidat.email);
    this.secondFormGroup.controls.telephone.setValue(this.candidatDatas.candidat.telephone);
    this.secondFormGroup.controls.telephoneTuteur.setValue(this.candidatDatas.candidat.telephoneTuteur);
    this.secondFormGroup.controls.nationalite.setValue(this.candidatDatas.candidat.nationalite);
    this.secondFormGroup.controls.ville.setValue(this.candidatDatas.candidat.ville);
    this.secondFormGroup.controls.rue.setValue(this.candidatDatas.candidat.rue);
    this.secondFormGroup.controls.quartier.setValue(this.candidatDatas.candidat.quartier);
    this.secondFormGroup.controls.porte.setValue(this.candidatDatas.candidat.porte);
    this.secondFormGroup.controls.paysDeNaissance.setValue(this.candidatDatas.candidat.paysDeNaissance);

  }


  /** ====================================================================================================
   *  GESTION DE LA PARTIE DES FICHIER A ENVOYER
   *  ***************************************************
   */
  FileSelect(event, type) {
    const fichier: File = event.target.files[0]; // this.CropConvertFile;

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
    //
    //
    const ext = fichier.type.substr(fichier.type.lastIndexOf('/') + 1);
    const newFile: File = new File([fichier], Math.floor(Date.now() / 1000) + '.' + ext, {type: fichier.type});

    this.fullFileData(newFile, type);
  }

   fullFileData(newFile: File, type: string) {

    if (type === 'idPhoto') {
      // this.idPhoto = newFile;
      this.FilesBody.id_photo = newFile; // this.idPhoto; //fd.append('file', this.idPhoto);// this.idPhoto;
    } else if (type === 'attestationBac') {
      // this.attestationBac = newFile;
      this.FilesBody.diplome = newFile;//this.attestationBac;
    } else if (type === 'acteDeNaissance') {
      // this.acteDeNaissance = newFile;
      this.FilesBody.acteNaissance = newFile; // this.acteDeNaissance;
    } else if (type === 'releveBac') {
      // this.releveBac = newFile;
      this.FilesBody.releve = newFile; // this.releveBac;
    } else if (type === 'autre') {
      // this.autre = newFile;
      this.FilesBody.certificatNationnalite = newFile; // this.autre;
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



  /** =========================================================================================================
   * GESTION DE PAR PARTIE FILIERES ET OPTIONS
   * ***************************************************
   */

  /**
   * AMENE LES FILIERES QUI CONCERNE LA SPECIALITE DU CANDIDANT EN COURS D'INSCRIPTION
   */
  getFiliereByStructureAndCandidatSpecialite() {
    this.Fil_spinner = true;
    this.filiereService.getFiliereByCandidatSpecialite(this.candidatSpecialiteID, this.structureID).subscribe(filRes => {
      this.Structure_Filieres = filRes;
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
    this.optionService.getOptionsByFiliereID(filID).subscribe(getFilRes => {
      this.enablebOptions = false;
      this.FiliereSelectOptions = getFilRes;
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



  /** ============================================================
   *  ENVOIE DES DONNES DU CANDIDAT DANS LA BD
   *  ***************************************************
   */
  SubmitForm(){
    this.submit_spinner = true;
    this.SendBodyForPreInscription.candidat.id = this.candidatDatas.candidat.id;
    this.SendBodyForPreInscription.candidat.email = this.secondFormGroup.controls.email.value;

    this.SendBodyForPreInscription.niveau = "L1";
    this.SendBodyForPreInscription.option.id = +this.firstFormGroup.controls.option.value;

    this.SendBodyForPreInscription.candidat.telephone = +this.secondFormGroup.controls.telephone.value;
    this.SendBodyForPreInscription.candidat.telephoneTuteur = +this.secondFormGroup.controls.telephoneTuteur.value;

    this.SendBodyForPreInscription.candidat.nationalite = this.secondFormGroup.controls.nationalite.value;
    this.SendBodyForPreInscription.candidat.ville = this.secondFormGroup.controls.ville.value;

    this.SendBodyForPreInscription.candidat.rue = this.secondFormGroup.controls.rue.value;
    this.SendBodyForPreInscription.candidat.porte = this.secondFormGroup.controls.porte.value;

    this.SendBodyForPreInscription.candidat.quartier = this.secondFormGroup.controls.quartier.value;
    this.SendBodyForPreInscription.candidat.paysDeNaissance = this.secondFormGroup.controls.paysDeNaissance.value;

    this.SaveCandidatData();

    // PRENDRE COMPTE DU CAS DE IUG

  }

  SaveCandidatData(){
    if (this.structureSelectData.Data.type === 'Institut') {
      // CAS D'UNE CANDIDATURE DANS UNE INSTITUT

      // this.candidatureService.addCandidature(this.candidatDatas.id,this.SendBodyForPreInscription).subscribe(CandRes => {
      //   this.submit_spinner = false;
      //   //
      //
      //   this.PayementConfirmAlert(CandRes);
      // }, Canderror1 => {
      //   this.submit_spinner = false;
      //   //
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Oops...',
      //     text: Canderror1['error'],
      //   });
      // });


    } else {
      // CAS D'UNE PRE-INSCRIPTION DANS UNE FACULTE

      this.preInscriptionService.updatePreInscription(this.candidatDatas.id,this.SendBodyForPreInscription, this.FilesBody).subscribe(PreInsRes => {
        this.submit_spinner = false;
        this.PayementConfirmAlert(PreInsRes);
      }, PreInsResError1 => {
        this.submit_spinner = false;
        Util_fonction.AlertMessage(PreInsResError1.error.status,PreInsResError1.error.message);
      });
    }
  }

  PayementConfirmAlert(InsertResponse) {
    const swalWithBootstrapButtons = Swal.mixin( {
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire ({
      title: '',
      html: '<strong>' + InsertResponse.toString() + ' </strong> <br>' +
        '<div class="alert alert-info">Voulez-vous procéder au payement Maintenant <i class="fa fa-question-circle"></i></div>',
      icon: 'success',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Oui, procéder au payement!',
      cancelButtonText: 'Non, plus tard!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('preinscriptionformPage');
        // go to payement
        this.GoToPayement();
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        // retour à la maison
        sessionStorage.removeItem('preinscriptionformPage');
        this.route.navigate(['/pages/utilisateur/home']);
      }
    });

  }

CancelUpdate() {
  this.GoToPayement();
}

GoToPayement() {
  this.route.navigate(['/pages/utilisateur/payement']);
}

  init_NumForm(){
    this.numForm = this.formBuilder.group({
      numDoc: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      nom: new FormControl(null, Validators.required),
      prenom: new FormControl(null, Validators.required),
      telephone: new FormControl(null, Validators.required),
    });
  }


  init_ModifForm(){
      this.CandidatDataGroup =this.formBuilder.group({
        niveau: new FormControl({value: 'L1', disabled: true}, [Validators.required]),
        option: new FormControl('', [Validators.required]),
        filiere: new FormControl('', [Validators.required]),

      });

  }

  /***
   * Initialisation du formulaire de modification
   */
  initForm() {
    this.firstFormGroup = this.formBuilder.group({
      id: new FormControl(null), // ??
      niveau: new FormControl({value: "L1", disabled: true}, Validators.required), //[this.niveauDefaut, Validators.required],
      filiere: new FormControl(null, Validators.required),
      option: new FormControl(null, Validators.required),

    }); // Validators.minLength(8)
    this.secondFormGroup = this.formBuilder.group({
      telephone: new FormControl(null, [Validators.required, Validators.minLength(8),
        Validators.pattern('[0-9]*')]),

      telephoneTuteur: new FormControl('', [Validators.minLength(8),
        Validators.pattern('[0-9]*')]),

      email: new FormControl(null, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')]),

      // **--
      nationalite: new FormControl(null, Validators.required),
      ville: new FormControl(null, Validators.required),
      rue: new FormControl(''),
      quartier: new FormControl(null, Validators.required),
      porte: new FormControl(''),
      paysDeNaissance: new FormControl(null, Validators.required)
    });

    this.troisFormGroup = this.formBuilder.group({
      idPhoto: new FormControl(null), // 1131123
      acteDeNaissance: new FormControl(null), // jpeg", "jpg", "png", "pdf"  3131123
      attestationBac: new FormControl(null),
      releveBac: new FormControl(null), // ["jpeg", "jpg", "png"]  3131123
      autre: new FormControl(null),

    });

  }

}
