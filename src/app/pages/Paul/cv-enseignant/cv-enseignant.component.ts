import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {CvService} from "../../../services/cv.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {backgroundRepeat} from "html2canvas/dist/types/css/property-descriptors/background-repeat";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import {Util_fonction} from "../../models/util_fonction";
import {REST_URL} from "../../REST_URL";
import {environment} from "../../../../environments/environment";

declare var $: any;

@Component({
  selector: 'app-cv-enseignant',
  templateUrl: './cv-enseignant.component.html',
  styleUrls: ['./cv-enseignant.component.css']
})
export class CvEnseignantComponent implements OnInit {
  _http = environment._HTTP
  step = 0;
  changeType: any;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }


  panelOpenState = false;
  etudiant:any;
  CV_DATA:any;
  idcv:any;
  spinner1:boolean= false;
  cvIsCreated:boolean= false;
  ELementPart:boolean= false;

  showLebelle:boolean= false;
  showDateDebut:boolean= false;
  showDateFin:boolean= false;
  showNiveau:boolean= false;
  showContenu:boolean= false;
  DoEdit:boolean= false;
  editID:any;
  changeID: any;
  typeSelect:any;

  action: any;

  CvForm: FormGroup;

  Array = [];

  Formations = [];
  formationPart: boolean = false;

  ExperienceProfessionnelle = [];
  experienceProfessionnellePart: boolean = false;

  user = JSON.parse(sessionStorage.getItem("user"));

  constructor(private cvService:CvService,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
    this.etudiant = JSON.parse(sessionStorage.getItem('user'));
    this.CreatEnseignantCV();
  }

  exportpdf() {
    // this.export_spinner = true;
    const data = document.getElementById('export-doc');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 305;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 5;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('Mon_Cv.pdf'); // Generated PDF
      // this.export_spinner = false;
    });
  }

  /**
   * ========================
   *  FORMATIONS
   */
  Add(item){
    this.action = 'new';
    this.typeSelect = item;
    this.initForm();
    if (item === 'PROFIL'){
      this.showDateDebut = false;
      this.showDateFin = false;
      this.showLebelle = false;
      this.showNiveau = false;

      this.CvForm.controls.dateDebut.reset();
      this.CvForm.controls.dateDebut.clearValidators();
      this.CvForm.controls.dateDebut.updateValueAndValidity();

      this.CvForm.controls.dateFin.reset();
      this.CvForm.controls.dateFin.clearValidators();
      this.CvForm.controls.dateFin.updateValueAndValidity();

      this.CvForm.controls.libelle.reset();
      this.CvForm.controls.libelle.clearValidators();
      this.CvForm.controls.libelle.updateValueAndValidity();

      this.CvForm.controls.niveau.reset();
      this.CvForm.controls.niveau.clearValidators();
      this.CvForm.controls.niveau.updateValueAndValidity();
    }

    if (item === 'FORMATION' || item === 'CERTIFICAT' || item === 'EXPERIENCE_PRO' || item === 'PUBLICATION') {
      this.showNiveau = false;

      this.CvForm.controls.niveau.reset();
      this.CvForm.controls.niveau.clearValidators();
      this.CvForm.controls.niveau.updateValueAndValidity();
    }

    if (item === 'COMPETENCE' || item === 'LANGUE') {
      this.showDateDebut = false;
      this.showDateFin = false;
      this.showContenu = false;

      this.CvForm.controls.dateDebut.reset();
      this.CvForm.controls.dateDebut.clearValidators();
      this.CvForm.controls.dateDebut.updateValueAndValidity();

      this.CvForm.controls.dateFin.reset();
      this.CvForm.controls.dateFin.clearValidators();
      this.CvForm.controls.dateFin.updateValueAndValidity();

      this.CvForm.controls.contenu.reset();
      this.CvForm.controls.contenu.clearValidators();
      this.CvForm.controls.contenu.updateValueAndValidity();

    }

    if (item === 'INTERET' || item === 'QUALITE'){
      this.showDateDebut = false;
      this.showDateFin = false;
      this.showContenu = false;
      this.showNiveau= false;


      this.CvForm.controls.dateDebut.reset();
      this.CvForm.controls.dateDebut.clearValidators();
      this.CvForm.controls.dateDebut.updateValueAndValidity();

      this.CvForm.controls.dateFin.reset();
      this.CvForm.controls.dateFin.clearValidators();
      this.CvForm.controls.dateFin.updateValueAndValidity();

      this.CvForm.controls.contenu.reset();
      this.CvForm.controls.contenu.clearValidators();
      this.CvForm.controls.contenu.updateValueAndValidity();

      this.CvForm.controls.niveau.reset();
      this.CvForm.controls.niveau.clearValidators();
      this.CvForm.controls.niveau.updateValueAndValidity();
    }

    if (item === 'REALISATION') {
      this.showNiveau = false;
      this.showLebelle = false;

      this.CvForm.controls.libelle.reset();
      this.CvForm.controls.libelle.clearValidators();
      this.CvForm.controls.libelle.updateValueAndValidity();

      this.CvForm.controls.niveau.reset();
      this.CvForm.controls.niveau.clearValidators();
      this.CvForm.controls.niveau.updateValueAndValidity();
    }

    this.PutAllFalse_showModal();

  }

  Edit(itemData, typ){
    console.log(itemData);
    if (typ === 'edit'){
      this.action = 'edit';
    } else {
      this.action = 'changeCv';
    }
    this.typeSelect = itemData.type;
    this.editID = itemData.id;
    this.initForm();
    if (itemData.hasOwnProperty('PROFIL') || (itemData.hasOwnProperty('type') && itemData.type === 'PROFIL')  || (itemData.hasOwnProperty('profil') && itemData.profil.type === 'PROFIL')){
      this.showDateDebut = false;
      this.showDateFin = false;
      this.showLebelle = false;
      this.showNiveau = false;

      this.CvForm.controls.dateDebut.reset();
      this.CvForm.controls.dateDebut.clearValidators();
      this.CvForm.controls.dateDebut.updateValueAndValidity();

      this.CvForm.controls.dateFin.reset();
      this.CvForm.controls.dateFin.clearValidators();
      this.CvForm.controls.dateFin.updateValueAndValidity();

      this.CvForm.controls.libelle.reset();
      this.CvForm.controls.libelle.clearValidators();
      this.CvForm.controls.libelle.updateValueAndValidity();

      this.CvForm.controls.niveau.reset();
      this.CvForm.controls.niveau.clearValidators();
      this.CvForm.controls.niveau.updateValueAndValidity();
    }

    if (itemData.type === 'FORMATION' || itemData.type === 'CERTIFICAT' || itemData.type === 'EXPERIENCE_PRO' || itemData.type === 'PUBLICATION') {
      this.showNiveau = false;

      this.CvForm.controls.niveau.reset();
      this.CvForm.controls.niveau.clearValidators();
      this.CvForm.controls.niveau.updateValueAndValidity();
    }

    if (itemData.type === 'COMPETENCE' || itemData.type === 'LANGUE') {
      this.showDateDebut = false;
      this.showDateFin = false;
      this.showContenu = false;

      this.CvForm.controls.dateDebut.reset();
      this.CvForm.controls.dateDebut.clearValidators();
      this.CvForm.controls.dateDebut.updateValueAndValidity();

      this.CvForm.controls.dateFin.reset();
      this.CvForm.controls.dateFin.clearValidators();
      this.CvForm.controls.dateFin.updateValueAndValidity();

      this.CvForm.controls.contenu.reset();
      this.CvForm.controls.contenu.clearValidators();
      this.CvForm.controls.contenu.updateValueAndValidity();

    }

    if (itemData.type === 'INTERET' || itemData.type === 'QUALITE'){
      this.showDateDebut = false;
      this.showDateFin = false;
      this.showContenu = false;
      this.showNiveau= false;


      this.CvForm.controls.dateDebut.reset();
      this.CvForm.controls.dateDebut.clearValidators();
      this.CvForm.controls.dateDebut.updateValueAndValidity();

      this.CvForm.controls.dateFin.reset();
      this.CvForm.controls.dateFin.clearValidators();
      this.CvForm.controls.dateFin.updateValueAndValidity();

      this.CvForm.controls.contenu.reset();
      this.CvForm.controls.contenu.clearValidators();
      this.CvForm.controls.contenu.updateValueAndValidity();

      this.CvForm.controls.niveau.reset();
      this.CvForm.controls.niveau.clearValidators();
      this.CvForm.controls.niveau.updateValueAndValidity();
    }

    if (itemData.type === 'REALISATION') {
      this.showNiveau = false;
      this.showLebelle = false;

      this.CvForm.controls.libelle.reset();
      this.CvForm.controls.libelle.clearValidators();
      this.CvForm.controls.libelle.updateValueAndValidity();

      this.CvForm.controls.niveau.reset();
      this.CvForm.controls.niveau.clearValidators();
      this.CvForm.controls.niveau.updateValueAndValidity();
    }

    this.FullForm(itemData);

    this.PutAllFalse_showModal();
  }


  /**
   * METHODE QUI REMPLIES LE FORMULAIRE
   * @param Data
   * @constructor
   */
  FullForm(Data){
    if (Data.libelle !== undefined && Data.libelle !== null ){
      this.CvForm.controls.libelle.setValue(Data.libelle);
    }

    if (Data.dateDebut !== undefined && Data.dateDebut !== null ){
      this.CvForm.controls.dateDebut.setValue(Util_fonction.DateConvert2(Data.dateDebut));
    }

    if (Data.dateFin !== undefined && Data.dateFin !== null ){
      this.CvForm.controls.dateFin.setValue(Util_fonction.DateConvert2(Data.dateFin));
    }

    if (Data.niveau !== undefined && Data.niveau !== null ){
      this.CvForm.controls.niveau.setValue(Data.niveau);
    }

    if (Data.contenu !== undefined && Data.contenu !== null ){
      this.CvForm.controls.contenu.setValue(Data.contenu);
    }
    if (Data.hasOwnProperty('profil')){
      if (Data.profil.contenu !== undefined && Data.profil.contenu !== null ){
        this.CvForm.controls.contenu.setValue(Data.profil.contenu);
      }

    }

  }


  PutAllFalse_showModal(){

    $('#FormModal').modal('show');
    $('#FormModal').appendTo('body');
  }

  generateID(){

    const Mms1 = new Date().getMilliseconds();
    const Mms2 = new Date().getMilliseconds();
    const S = new Date().getSeconds();
    const M = new Date().getMinutes();
    return M +''+ Mms1 +''+ S +''+ Mms2;
  }


  /***************** CREATION ************************
   * *******  SOUMISSION DU FORMULAIRE ***************
   */
  ProfilIsFull:boolean = false;
  submitForm(){
    this.Array.push(
      {
        id: this.generateID(),
        type: this.typeSelect,
        libelle: (this.CvForm.controls.libelle.value === null ? "" : this.CvForm.controls.libelle.value) ,
        contenu: (this.CvForm.controls.contenu.value === null ? "" : this.CvForm.controls.contenu.value),
        niveau: (this.CvForm.controls.niveau.value === null ? "" : this.CvForm.controls.niveau.value),
        dateDebut : (this.CvForm.controls.dateDebut.value === null ? "" : this.CvForm.controls.dateDebut.value),
        dateFin : (this.CvForm.controls.dateFin.value === null ? "" : this.CvForm.controls.dateFin.value)
      }
    )
    if (this.typeSelect === 'PROFIL'){
      this.ProfilIsFull = true;
    }
    console.log(this.Array);
    $('#FormModal').modal('hide');
  }

  /***************** EDITION *************************
   * *******  SOUMISSION DU FORMULAIRE ***************
   */
  submitEditForm(){
    for (let arr of this.Array){
      if (arr.id === this.editID){
        arr.libelle = ( this.CvForm.controls.libelle.value === null ? null : this.CvForm.controls.libelle.value);
        arr.contenu = (this.CvForm.controls.contenu.value  === null ? null : this.CvForm.controls.contenu.value);
        arr.niveau = (this.CvForm.controls.niveau.value === null ? null : +this.CvForm.controls.niveau.value);
        arr.dateDebut = (this.CvForm.controls.dateDebut.value === null ? null : this.CvForm.controls.dateDebut.value);
        arr.dateFin = (this.CvForm.controls.dateFin.value === null ? null : this.CvForm.controls.dateFin.value);
      }
    }
    console.log("azey-----");
    // $('#FormModal').modal('hide');
  }

  DeleteItem(item, idItem){
    Swal.fire({
      title: '',
      html: "êtes-vous sûr de vouloir supprimer <br> -"+item.libelle+"<br> -"+item.contenu,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Non',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        let i = 0;
        for (let arr of this.Array){
          if (arr.id === idItem){
            this.Array.splice(i, 1);
          }
          i = i+1;
        }
        if (item === 'Profil'){
          this.ProfilIsFull = false;
        }
      }
    })
  }

  initForm(){
    this.CvForm = this.formBuilder.group({
      type: new FormControl(null),
      libelle: new FormControl(null, [Validators.required]),
      contenu: new FormControl(null, [Validators.required]),
      niveau: new FormControl(null, [Validators.required]),
      dateDebut: new FormControl(null, [Validators.required]),
      dateFin: new FormControl(null, [Validators.required]),
    });

    this.showLebelle = true;
    this.showDateDebut = true;
    this.showDateFin = true;
    this.showNiveau = true;
    this.showContenu = true;
  }

  /***
   *
   * ENVOIE DANS LA BD
   */

  SENDING_IN_DB(){

    for(let arra of this.Array){
      delete arra.id;
    }

    console.log(this.Array);

    this.cvService.AddElementsToCV(this.idcv,this.Array).subscribe(cvElement => {
      this.ELementPart = false;
      this.Array = [];
      this.CreatEnseignantCV();
    }, error => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })

  }

  /** *********************************************
   * les gestion de la vue du cv
   * ==============================================
   */

  CreatEnseignantCV(){
    this.spinner1 = true;
    let CVCreatBody = {
      idUser: this.user.users.id,
      fichier: null,
    }
    this.cvService.create(CVCreatBody).subscribe(Res => {
      // Util_fonction.AlertMessage("success", Res);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: ''+Res,
        showConfirmButton: false,
        timer: 2000
      })
      this.getCvOfEnseignant();
    }, creatError => {
      if (creatError['status'] === 409){
        // Cv déjà crée
        this.getCvOfEnseignant();
      } else{
        this.spinner1 = false;
        Swal.fire({
          title: '',
          text: ""+creatError.error.message,
          icon: 'warning',
          allowOutsideClick: false,
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/pages/utilisateur/home']);
          }
        })
      }
    })
  }

  getCvOfEnseignant(){
    this.cvService.getEnseignantCV(this.user.users.id).subscribe(creatRes => {
      this.spinner1 = false;
      console.log(creatRes);
      this.CV_DATA = creatRes;
      // this.idcv = creatRes;
      this.cvIsCreated = true;

    }, error =>{
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    });
  }

  elementPlus(data){
    console.log(data);
    this.idcv = data.idcv;
    this.ELementPart = true;
  }

  changeElement(Data,typ){
    console.log(Data);
    // this.action = 'changeCv';
    if (typ === 'PROFIL'){
      this.changeID = Data.profil.id;
    } else {
      this.changeID = Data.id;
    }
    this.changeType = typ;
    this.Edit(Data, 'changeCv');
  }

  DeleteElement(Data, typ){
    console.log(Data);
    let typp: any;
    let idItem: any;
    let lib: any;
    let cont: any;
    if (Data.hasOwnProperty('profil') && Data.profil.type === 'PROFIL'){
      idItem = Data.profil.id;
      typp = Data.profil.type;
      lib = Data.profil.libelle;
      cont = Data.profil.contenu;
    } else {
      // lib = item.libelle
      // cont = item.contenu
      idItem = Data.id;
      typp = Data.type;
      lib = Data.libelle;
      cont = Data.contenu;
    }
    Swal.fire({
      title: '',
      html: "êtes-vous sûr de vouloir supprimer <br> <strong>"+typp+"</strong> <br> - "+lib+" <br> -"+cont,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Non',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cvService.DeleteElemnt(idItem).subscribe( deleteElemnetResponse =>{
          // window.location.reload();
          console.log(this.CV_DATA);
          let j = 0;
          let tt : any;
          if (Data.hasOwnProperty('profil') && Data.profil.type === 'PROFIL'){
            tt = typp.toLowerCase();

            this.CV_DATA['profil'] = null;

          } else {

            for (let data of this.CV_DATA[typp]){
              if (data.id === this.changeID){
                this.Array.splice(j, 1);
              }
              j = j+1;
            }
          }


        })
      }
    })
  }

  submitCVElementChange(){
    let body = {
      type: this.typeSelect,
      libelle: (this.CvForm.controls.libelle.value === null ? "" : this.CvForm.controls.libelle.value) ,
      contenu: (this.CvForm.controls.contenu.value === null ? "" : this.CvForm.controls.contenu.value),
      niveau: (this.CvForm.controls.niveau.value === null ? "" : this.CvForm.controls.niveau.value),
      dateDebut : (this.CvForm.controls.dateDebut.value === null ? "" : this.CvForm.controls.dateDebut.value),
      dateFin : (this.CvForm.controls.dateFin.value === null ? "" : this.CvForm.controls.dateFin.value)
    }
    this.cvService.UpdatElement(this.changeID, body).subscribe(elementChange => {
      // if ()
      let i = 0;
      let key = null;
      if (this.changeType === 'INTERET'){
        key = 'interets';
      } else if (this.changeType === 'EXPERIENCE_PRO'){
        key = 'experiences_pro';
      } else {
        key = this.changeType.toLowerCase()+'s';
      }
      console.log(key);
      console.log(this.CV_DATA);
      let d = this.changeType.toString();
      for (let data of this.CV_DATA[key]){
        if (data.id === this.changeID){
          data.libelle = ( this.CvForm.controls.libelle.value === null ? "" : this.CvForm.controls.libelle.value);
          data.contenu = (this.CvForm.controls.contenu.value  === null ? "" : this.CvForm.controls.contenu.value);
          data.niveau = (this.CvForm.controls.niveau.value === null ? "" : this.CvForm.controls.niveau.value);
          data.dateDebut = (this.CvForm.controls.dateDebut.value === null ? "" : this.CvForm.controls.dateDebut.value);
          data.dateFin = (this.CvForm.controls.dateFin.value === null ? "" : this.CvForm.controls.dateFin.value);
        }
      }

      $('#FormModal').modal('hide');

    })
  }

}
