import { Component, OnInit } from '@angular/core';
import {InformationsPortailService} from '../../../../services/informations-portail.service';
import {Util_fonction} from '../../../models/util_fonction';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-actualites',
  templateUrl: './actualites.component.html',
  styleUrls: ['./actualites.component.css']
})
export class ActualitesComponent implements OnInit {
  ckeditorContent = '';
  user = JSON.parse(sessionStorage.getItem('user'));
  _spinner : boolean = false;
  constructor(private portailService : InformationsPortailService) { }

  ngOnInit() {
    this.GetPageInformations();
  }
  titre;
  typeActu;
  typeActuChange = 'annonces';
  campusPage;
  action;
  GetPageInformations(){
    this._spinner = true;
    this.portailService.getPageInformations(this.typeActuChange).subscribe(getResponse => {
      this.campusPage = getResponse.content;
      this._spinner = false;
    })
  }

  ChangetypeActu(){
    this.GetPageInformations();
  }

  submit(){
    if (this.action === "new"){
      this.SaveNewData();
    }else {
      this.SaveModifData();
    }
  }

  showForm:boolean = false;
  addActu(){
    this.action = "new";
    this.ckeditorContent = '';
    this.showForm = true;
    // $('#ActuFormModal').modal('show');
    // $('#ActuFormModal').appendTo('body');
  }

  SaveNewData(){
    this._spinner = true;
    const body = {
      titre: this.titre,
      type: this.typeActu,
      contenu: this.ckeditorContent,
      structure: {id: this.user.structure.id},
      date: Util_fonction.convertDate(new Date())
    }
    this.portailService.SavePageInformations(body).subscribe(saveResponse => {
      Util_fonction.SuccessMessage("Page enregistrer avec succès !");
      this.closeForm();
      this.GetPageInformations();
      this._spinner = false;
    }, error => {
      this._spinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }

  EditData;
  EditActu(actu){
    this.showForm = true;
    this.action = "edit";
    this.EditData = actu;
    this.ckeditorContent = actu.contenu;
    this.titre = actu.titre;
    this.typeActu = actu.type;
    // $('#ActuFormModal').modal('show');
    // $('#ActuFormModal').appendTo('body');
  }


  SaveModifData(){
    this._spinner = true;
    const bodyModit = {
      titre: this.titre,
      type: this.typeActu,
      contenu: this.ckeditorContent,
      structure: {id: this.user.structure.id},
      id: this.EditData.id,
      date: Util_fonction.convertDate(new Date())
    }
    this.portailService.UpdatePageInformations(bodyModit).subscribe(updateResponse => {
      Util_fonction.SuccessMessage("Modification enregistrer avec succès !");
      this.closeForm();
      this.GetPageInformations();
      this._spinner = false;
    }, error => {
      this._spinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    });
  }

  closeForm(){
    this.showForm = false;
    this.ckeditorContent = '';
    this.titre = '';
    this.typeActu = '';
    // this.GetPageInformations();
  }

  DeleteActu(element){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer l'actu : '"+element.titre+"'",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portailService.deleteInfo(element.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(element.titre+" ,supprimer avec succès !");
          this.GetPageInformations();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })

  }
  save(event){
    console.log("event onChange==> ", event);
  }

}
