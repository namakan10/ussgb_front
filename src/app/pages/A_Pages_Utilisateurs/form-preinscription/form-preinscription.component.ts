import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material";
import {PAYS_MONDE} from "../../PAYS_MODE";
import {CropComponent, ResulteFileCrop} from "../crop/crop.component";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {FiliereService} from "../../../services/GestionFilieres/filiere.service";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {CandidatureService} from "../../../services/GestionEtudiants/candidature.service";
import {CandidatService} from "../../../services/GestionEtudiants/candidat.service";
import {PreInscriptionServiceService} from "../../../services/pre-inscription-service.service";
import {FilesService} from "../../../services/files.service";
import {Util_fonction} from "../../models/util_fonction";
import {NgxImageCompressService} from "ngx-image-compress";
import {UNIV_FILIERE, UNIV_OPTION} from "../../../CONSTANTES";

/** FIle dialog Data ***/
export interface FileAlertData {
  imageChangedEvent: any;
  returnFile: any ;
}

@Component({
  selector: 'app-form-preinscription',
  templateUrl: './form-preinscription.component.html',
  styleUrls: ['./form-preinscription.component.css']
})
export class FormPreinscriptionComponent implements OnInit {
  univ_fil = UNIV_FILIERE;
  univ_opt = UNIV_OPTION;
SendDatas = {
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

  filiereListBody = {
    id_structure: null,
    id_departement: null,
    id_candidat: null,
    cursus: null,
  }
  eventData: any;
  constructor(private formBuilder: FormBuilder,
              private preInscriptionService: PreInscriptionServiceService,
              private router: Router,
              private optionService: OptionsService,
              private filiereService: FiliereService,
              private candidatureService: CandidatureService,
              private imageCompress: NgxImageCompressService,
              private candidatService: CandidatService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.initForm();
    if(!sessionStorage.getItem('preinscriptionformPage') || sessionStorage.getItem('preinscriptionformPage') === null){
      this.router.navigate(['/pages/utilisateur/home']);
    }
    this.eventData = JSON.parse(sessionStorage.getItem("EvenementData"));
    this.candidatID = sessionStorage.getItem('id_candidat');

    this.structureID = sessionStorage.getItem('id_structure');
    this.anneeScolaireUniv = sessionStorage.getItem('structureAnneeScolaire');
    this.structureSigle = sessionStorage.getItem('structureSigle');
    this.structureType = sessionStorage.getItem('structureType');

    if (this.structureType === 'Institut') {
      this.formTitle = 'candidature';
    } else {
      this.formTitle = 'pré-inscription';
    }

    this.getFiliereByStructureAndCandidatSpecialite();
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

    Swal.fire({
      title: '<h1><strong>Recapitulatif.</strong></h1>',
      html:
        '<h2 mat-dialog-title class="text-center"><i class="fa fa-history text-danger"></i></h2>\n' +
        '\n' +
        '    <div class="alert alert-light"><strong>Niveau: </strong> ' + this.firstFormGroup.controls.niveau.value + '</div>\n' +
        '    <div class="alert alert-light"><strong>'+this.univ_fil+'</strong> ' + this.SelectFiliere + '</div>\n' +
        '    <div class="alert alert-light"><strong>'+this.univ_opt+' </strong> ' + this.SelectOption + '</div>\n' +
        '    <div class="alert alert-warning"><strong>Email: </strong> ' + this.secondFormGroup.controls.email.value + '\n' +
        '        <div class="pulsating-circle float-right"><i class="fa fa-info-circle"  aria-hidden="true"></i></div>\n' +
        '    </div>\n' +
        '    <div class="alert alert-light"><strong>Téléphone: </strong> ' + this.secondFormGroup.controls.telephone.value + '</div>\n' +
        '    <div class="alert alert-light"><strong>Téléphone tuteur: </strong> ' + this.secondFormGroup.controls.telephoneTuteur.value + '</div>\n' +
        '    <div class="alert alert-light"><strong>Nationalité: </strong> ' + this.secondFormGroup.controls.nationalite.value + '</div>\n' +
        '    <div class="alert alert-light"><strong>Pays de naissance: </strong> ' + this.secondFormGroup.controls.paysDeNaissance.value + '</div>\n' +
        '    <div class="alert alert-light"><strong>Ville : </strong> ' + this.secondFormGroup.controls.ville.value + '</div>\n' +
        '    <div class="alert alert-light"><strong>Quartier : </strong> ' + this.secondFormGroup.controls.quartier.value + '</div>\n' +
        '    <div class="alert alert-light"><strong>Rue : </strong> ' + this.secondFormGroup.controls.rue.value + '</div>\n' +
        '    <div class="alert alert-light"><strong>Porte : </strong> ' + this.secondFormGroup.controls.porte.value + '</div>\n'+
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
      confirmButtonText: 'Oui, soumettre ma ' + this.formTitle,
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
  /** ************************************************************
   *  FIN == END RECAPITULATIF DES SELECTIONS
   *  ============================================================
   */



  emailAlert() {
    Swal.fire(
      'notez bien',
      'Des informations vous serons envoyé à cette adresse mail <strong>' + this.secondFormGroup.controls.email.value + '</strong> ' +
      'Veuillez a ce que cela soit correct et accessible',
      'warning'
    );
  }





  /** ============================================================
   *  ENVOIE DES DONNES DU CANDIDAT DANS LA BD
   *  ***************************************************
   */
  SubmitForm(){
    this.SendDatas.candidat.id = +this.candidatID;
    this.SendDatas.candidat.email = this.secondFormGroup.controls.email.value;

    this.SendDatas.niveau = this.firstFormGroup.controls.niveau.value;
    this.SendDatas.option.id = +this.firstFormGroup.controls.option.value;

    this.SendDatas.candidat.telephone = +this.secondFormGroup.controls.telephone.value;
    this.SendDatas.candidat.telephoneTuteur = +this.secondFormGroup.controls.telephoneTuteur.value;

    this.SendDatas.candidat.nationalite = this.secondFormGroup.controls.nationalite.value;
    this.SendDatas.candidat.ville = this.secondFormGroup.controls.ville.value;

    this.SendDatas.candidat.rue = +this.secondFormGroup.controls.rue.value;
    this.SendDatas.candidat.porte = +this.secondFormGroup.controls.porte.value;

    this.SendDatas.candidat.quartier = this.secondFormGroup.controls.quartier.value;
    this.SendDatas.candidat.paysDeNaissance = this.secondFormGroup.controls.paysDeNaissance.value;

    this.SaveCandidatData();

    // PRENDRE COMPTE DU CAS DE IUG

  }

  SaveCandidatData(){
    if (this.structureType === 'Institut') {
      // CAS D'UNE CANDIDATURE DANS UNE INSTITUT

      this.candidatureService.addCandidature(this.SendDatas,this.FileBody).subscribe(CandRes => {
        this.submit_spinner = false;

        this.PayementConfirmAlert(CandRes);
      }, Canderror1 => {
        this.submit_spinner = false;
        Util_fonction.AlertMessage(Canderror1.error.status,Canderror1.error.message);
      });


    } else {
      // CAS D'UNE PRE-INSCRIPTION DANS UNE FACULTE
      this.preInscriptionService.savePreInscription(this.SendDatas,this.FileBody).subscribe(PreInsRes => {
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
      title: 'Enregistré',
      html: '' + InsertResponse.toString() + ' <br>' +
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
        this.router.navigate(['/pages/utilisateur/home']);
      }
    });

  }

  GoToPayement() {
    this.router.navigate(['/pages/utilisateur/payement']);
  }

  /** ************************************************************
   *  FIN == END ENVOIE DANS LA BD
   *  ============================================================
   */





  /***
   * Initialisation du forme
   */
  initForm() {
    this.firstFormGroup = this.formBuilder.group({
      id: this.candidatID, // ??
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
