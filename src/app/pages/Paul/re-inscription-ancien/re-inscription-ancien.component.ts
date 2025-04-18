import { Component, OnInit } from '@angular/core';
import {PAYS_MONDE} from "../../PAYS_MODE";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";
import {FiliereService} from "../../../services/GestionFilieres/filiere.service";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {NgxImageCompressService} from "ngx-image-compress";
import {Router} from "@angular/router";
import {CandidatureService} from "../../../services/candidature.service";
import {Util_fonction} from "../../models/util_fonction";
import {CropComponent, ResulteFileCrop} from "../../A_Pages_Utilisateurs/crop/crop.component";
import Swal from "sweetalert2";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-re-inscription-ancien',
  templateUrl: './re-inscription-ancien.component.html',
  styleUrls: ['./re-inscription-ancien.component.css']
})
export class ReInscriptionAncienComponent implements OnInit {
  PAYS = PAYS_MONDE;
  ReInscriptionForm: FormGroup;

  InscriptionData = {
    etudiant: {
      id: null,
      telephoneTuteur : null,
      nationalite : null,
      typeCandidat: null,
      numEtudiant: null,
      user : {
        id: null,
        nom : null,
        prenom : null,
        genre : null,
        dateDeNaissance : null,
        lieuDeNaissance : null,
        email : null,
        telephone : null,
        pays : null,
        ville : null,
        quartier : null,
        porte : null,
        rue : null
      }
    },
    option : {
      id :3
    }
  }
  eventData = JSON.parse(sessionStorage.getItem("EvenementData"));
  Structure = JSON.parse(sessionStorage.getItem("structureSelected"));
  numEtudiant: any;
  annee: any;
  NotConnect: boolean = false;

  etudiantGetBody ={
    anneeScolaire: null,
    numEtudiant: null
  }
  MyDatas: any;

  filiereListBody = {
    id_structure: null,
    id_departement: null,
    id_specialiteCandidat: null,
    cursus: null,
  }
  Fil_spinner:boolean = false;
  Opt_spinner:boolean = false;
  Filieres: any;
  Options: any;


  /* FILES VARIABLES ******* */

  FileBody = {
    id_photo: null
  }

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

  changeImg: boolean = false;
  spinner1: boolean = false;
  spinner2: boolean = false;

  fileAlertMessage: any;
  localUrl: any;
  photo: any;

  constructor(private formBuilder: FormBuilder,
              private etudiantService: EtudiantService,
              private filiereService: FiliereService,
              private optionService: OptionsService,
              private imageCompress: NgxImageCompressService,
              public dialog: MatDialog,
              private router: Router,
              private candidatureService: CandidatureService) {
  }
  ngOnInit() {
    this.initForm();
  }

  /** ====================================================================================================
   *  GESTION DE LA PARTIE DES FICHIER A ENVOYER
   *  ***************************************************
   */
  FileSelect(event, type) {
    const fichier: File = event.target.files[0]; // this.CropConvertFile;
    let reader = new FileReader();

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
        this.changeImg = true;
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
    if (type === 'idPhoto') {
      this.idPhoto = newFile;
      this.FileBody.id_photo = newFile;
      console.log(newFile);
      console.log(this.FileBody.id_photo);
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
      default:
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


  /**
   *
   * @constructor
   */
  GetEtudiant(){
    this.spinner1 = true;
    if (Util_fonction.checkIfNoTEmpty(this.numEtudiant)){
      console.log(this.numEtudiant);
      this.candidatureService.getEtudiantByNumEtudiant(this.numEtudiant).subscribe(
        res => {
          this.NotConnect = true;
          if (Util_fonction.checkIfNoTEmpty(res)){
            this.MyDatas = res;
            this.FullForm(res);
          } else {
            this.spinner1 = false;
            Util_fonction.AlertMessage("info", "Aucun étudiant n'a été trouvé avec ce numéro Etudiant "+this.etudiantGetBody.numEtudiant);
          }
        }, error => {
          this.spinner1 = false;
          Util_fonction.AlertMessage(error.error.status, error.error.message);
        });
    } else {
      this.spinner1 = false;
      Util_fonction.AlertMessage(404, "Veuillez renseigner le cahmp num Etudiant");
    }
  }

  FullForm(data){
    let util = new Util_fonction();
    this.InscriptionData.etudiant.id = +data.id;
    this.InscriptionData.etudiant.user.id = +data.user.id;
    this.InscriptionData.etudiant.typeCandidat = data.typeCandidat;
    this.InscriptionData.etudiant.numEtudiant = data.numEtudiant;

    this.changeImg = false;
    this.localUrl = data.user.photo;

    this.ReInscriptionForm.controls.nom.setValue(data.nom);
    this.ReInscriptionForm.controls.prenom.setValue(data.prenom);
    this.ReInscriptionForm.controls.nationalite.setValue(data.nationalite);
    this.ReInscriptionForm.controls.telephoneTuteur.setValue(+data.telephoneTuteur);
    this.ReInscriptionForm.controls.dateDeNaissance.setValue( util.DateConvert(data.user.dateDeNaissance));
    this.ReInscriptionForm.controls.lieuDeNaissance.setValue(data.user.lieuDeNaissance);
    this.ReInscriptionForm.controls.genre.setValue(data.user.genre);
    this.ReInscriptionForm.controls.email.setValue(data.user.email);
    // this.ReInscriptionForm.controls.pays.setValue(data.user.pays);
    this.ReInscriptionForm.controls.telephone.setValue(+data.user.telephone);
    this.ReInscriptionForm.controls.ville.setValue(data.user.ville);
    this.ReInscriptionForm.controls.quartier.setValue(data.user.quartier);
    this.ReInscriptionForm.controls.rue.setValue(data.user.rue);
    this.ReInscriptionForm.controls.porte.setValue(data.user.porte);

    this.spinner1 = false;
  }




  /**
   * Save
   * @constructor
   */
  SaveReInscription(){
    this.spinner2 = true;
    console.log(this.FileBody.id_photo);
    this.InscriptionData.etudiant.nationalite = this.ReInscriptionForm.controls.nationalite.value;
    this.InscriptionData.etudiant.telephoneTuteur = this.ReInscriptionForm.controls.telephoneTuteur.value;

    this.InscriptionData.etudiant.user.nom = this.ReInscriptionForm.controls.nom.value;
    this.InscriptionData.etudiant.user.prenom = this.ReInscriptionForm.controls.prenom.value;
    // this.InscriptionData.etudiant.user.genre = this.ReInscriptionForm.controls.genre.value;
    this.InscriptionData.etudiant.user.dateDeNaissance = this.ReInscriptionForm.controls.dateDeNaissance.value;
    this.InscriptionData.etudiant.user.lieuDeNaissance = this.ReInscriptionForm.controls.lieuDeNaissance.value;
    this.InscriptionData.etudiant.user.email = this.ReInscriptionForm.controls.email.value;
    this.InscriptionData.etudiant.user.telephone = this.ReInscriptionForm.controls.telephone.value;
    this.InscriptionData.etudiant.user.ville = this.ReInscriptionForm.controls.ville.value;
    this.InscriptionData.etudiant.user.quartier = this.ReInscriptionForm.controls.quartier.value;
    this.InscriptionData.etudiant.user.porte = this.ReInscriptionForm.controls.porte.value;
    this.InscriptionData.etudiant.user.rue = this.ReInscriptionForm.controls.rue.value;

    this.InscriptionData.etudiant.user.pays = this.MyDatas.user.pays;

    sessionStorage.setItem("anciensData", JSON.stringify(this.InscriptionData));

    this.router.navigate(['/pages/utilisateur/CandidatureForm']);

  }


  initForm(){
    this.ReInscriptionForm = this.formBuilder.group({
      nom: new FormControl(null, [Validators.required]),
      prenom: new FormControl(null, [Validators.required]),
      dateDeNaissance: new FormControl(null, [Validators.required]),
      lieuDeNaissance: new FormControl(null, [Validators.required]),
      genre: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      // pays: new FormControl(null, [Validators.required]),
      nationalite: new FormControl(null, [Validators.required]),
      telephone: new FormControl(null, [Validators.required]),
      telephoneTuteur: new FormControl(null),
      ville: new FormControl(null,[Validators.required]),
      quartier: new FormControl(null,[Validators.required]),
      porte: new FormControl(null),
      rue: new FormControl(null),
    })
  }

}
