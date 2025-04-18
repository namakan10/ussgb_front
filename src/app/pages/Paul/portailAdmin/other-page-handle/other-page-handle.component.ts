import { Component, OnInit } from '@angular/core';
import {InformationsPortailService} from '../../../../services/informations-portail.service';
import {Util_fonction} from '../../../models/util_fonction';
import Swal from 'sweetalert2';
import {FilesService} from '../../../../services/files.service';
import {_HTTP} from '../../../../CONSTANTES';
declare var $: any;


@Component({
  selector: 'app-other-page-handle',
  templateUrl: './other-page-handle.component.html',
  styleUrls: ['./other-page-handle.component.css']
})
export class OtherPageHandleComponent implements OnInit {
  private EditData: any;
  user = JSON.parse(sessionStorage.getItem('user'));
  _http = _HTTP;

  constructor(
    private portailService : InformationsPortailService,
    private file: FilesService) { }


  ngOnInit() {
    this.GetHomePageStatistique();
    this.GetPageHome();
    this.GetPageHomeImage();
    this.GetPageHomeImageSlide();
  }
//TODO:: FAIRE LA GESTION DES PAGE DE PRESENTATIONS ET ABOUT
  /*
  * ============================================================
  * =========> STATTE PART
  * ============================================================*/
  Statistiques;
  action;
  _spinner: boolean;
  titre: any;
  nombre: any;
  ckeditorContent1= '';
  GetHomePageStatistique(){
    this._spinner = true;
    this.portailService.getPageInformations('statistiques').subscribe(getResponse => {
      this._spinner = false;
      this.Statistiques = getResponse.content;
    }, error => {
      this._spinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);

    })
  }

  add() {
    this.action = "new";
    $('#StatistiqueFormModal').modal('show');
    $('#StatistiqueFormModal').appendTo('body');
  }

  save(){
    const body = {
      titre: this.titre,
      type: 'statistiques',
      contenu: this.nombre,
      structure: {id: this.user.structure.id},
      date: Util_fonction.convertDate(new Date())
    }

    this.portailService.SavePageInformations(body).subscribe(res=>{
      this.GetHomePageStatistique();
      this.cleanForm();
      Util_fonction.SuccessMessage("Enregistrer avec succès !");
      $('#StatistiqueFormModal').modal('hide');
      this._spinner = false;
    }, errorSpecialite => {
      this._spinner = false;
      Util_fonction.AlertMessage(errorSpecialite.error.status, errorSpecialite.error.message);
    });
  }

  edit(state: any) {
    this.action = "edit";
    this.EditData = state;
    this.titre = state.titre;
    this.nombre = state.contenu;
    $('#StatistiqueFormModal').modal('show');
    $('#StatistiqueFormModal').appendTo('body');
  }

  update() {
    const body = {
      titre: this.titre,
      type: 'statistiques',
      id: this.EditData.id,
      contenu: this.nombre,
      structure: {id: this.user.structure.id},
      date: Util_fonction.convertDate(new Date())
    }
    this.portailService.UpdatePageInformations(body).subscribe(res=>{
      this.GetHomePageStatistique();
      this.cleanForm();
      $('#StatistiqueFormModal').modal('hide');
      this._spinner = false;
      Util_fonction.SuccessMessage("Mofifier avec succès !");
    }, errorSpecialite => {
      this._spinner = false;
      Util_fonction.AlertMessage(errorSpecialite.error.status, errorSpecialite.error.message);
    });
  }
  submit(){
    if (this.action === "new"){
      this.save();
    }else {
      this.update();
    }
  }
  cleanForm() {
    this.titre = '';
    this.nombre = '';
    this._spinner = false;
  }
  delete(state: any) {
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer le statistique '"+state.titre+"'",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portailService.deleteInfo(state.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
          this.GetHomePageStatistique();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })

  }
//  =====> ACCUEIL PART GO
//  ==================================================>


  ckeditorContent = '';
  homePage;
  homeaction;
  GetPageHome(){
    this.portailService.getPageInformations('home').subscribe(getResponse => {
      this.homePage = getResponse.content[0];
      if (getResponse.content.length > 0){
        this.ckeditorContent = getResponse.content[0].contenu;
        this.homeaction = 'edit';
      }else {
        this.homeaction = 'new';
      }

    })
  }

  homePageImage= '';
  GetPageHomeImage(){
    this.portailService.getPageInformations('homeImage').subscribe(rsponse => {
      this.homePageImage = rsponse.content[0].contenu;
    })
  }

  homePageImageSlide= [];
  GetPageHomeImageSlide(){
    this.portailService.getPageInformations('homeImageSlide').subscribe(imagesponse => {
      this.homePageImageSlide = imagesponse.content;
    })
  }

  homeSubmit(){
    if (this.homeaction === "new"){
      this.homeSaveNewData();
    }else {
      this.homeSaveModifData();
    }
  }

  homeSaveNewData(){
    const body = {
      titre: 'Page accueil',
      type: 'home',
      contenu: this.ckeditorContent,
      structure: {id: this.user.structure.id},
      date: Util_fonction.convertDate(new Date())
    }
    this.portailService.SavePageInformations(body).subscribe(saveResponse => {
      Util_fonction.SuccessMessage("Page enregistrer avec succès !");
    }, error => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }

  homeSaveModifData(){
    const body = {
      titre: 'Page accueil',
      type: 'home',
      contenu: this.ckeditorContent,
      structure: {id: this.user.structure.id},
      id: this.homePage.id,
      date: Util_fonction.convertDate(new Date())
    }
    this.portailService.UpdatePageInformations(body).subscribe(updateResponse => {
      Util_fonction.SuccessMessage("Modification enregistrer avec succès !");
    }, error => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);

    })
  }

  changePicture(event) {
    const file = event.target.files[0];
    let fd = new FormData();
    fd.append('file', file);
    fd.append('fileType', "AUTRE");
    this.file.uploadImage(fd).subscribe(response => {

      const body = {
        titre: "Image d'acceuil",
        type: 'homeImage',
        contenu: response,
        structure: {id: this.user.structure.id},
        date: Util_fonction.convertDate(new Date())
      }
      this.portailService.SavePageInformations(body).subscribe(saveResponse => {
        Util_fonction.SuccessMessage("Image enregistrer avec succès !");
        this.GetPageHomeImage();
        }, error => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      })

    })
  }


//  ====>

  sildeaction="new";
  addSlide() {
    this.sildeaction = "new";
    $('#slideFormModal').modal('show');
    $('#slideFormModal').appendTo('body');
  }

  addSlidePicture(event) {
    const file = event.target.files[0];
    let fd = new FormData();
    fd.append('file', file);
    fd.append('fileType', "AUTRE");
    this.file.uploadImage(fd).subscribe(response => {

      const body = {
        titre: "Image slide d'acceuil",
        type: 'homeImageSlide',
        contenu: response,
        structure: {id: this.user.structure.id},
        date: Util_fonction.convertDate(new Date())
      }
      this.portailService.SavePageInformations(body).subscribe(saveResponse => {
        Util_fonction.SuccessMessage("Image enregistrer avec succès !");
        this.GetPageHomeImageSlide();
        }, error => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      })

    })
  }


  deleteImage(slide: any) {
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer l'image",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portailService.deleteInfo(slide.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
          this.GetPageHomeImageSlide();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })
  }
}

//====>

