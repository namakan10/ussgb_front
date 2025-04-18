import { Component, OnInit } from '@angular/core';
import {StructureService} from '../../../../services/structure.service';
import {InformationsPortailService} from '../../../../services/informations-portail.service';
import {Util_fonction} from '../../../models/util_fonction';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-presentation-personel',
  templateUrl: './presentation-personel.component.html',
  styleUrls: ['./presentation-personel.component.css']
})
export class PresentationPersonelComponent implements OnInit {

  user = JSON.parse(sessionStorage.getItem('user'));
  _RECTORAT: boolean =  this.user.structure.type === 'RECTORAT';

  constructor(private structureService: StructureService,
              private portailService: InformationsPortailService) { }

  ngOnInit() {
    this.getStructure();
  }
  Structures;
  showForm : boolean = false;
  getStructure(){
    this.structureService.getStuctures().subscribe(structures => {
      this.Structures = structures;
    })
  }
  structureSelectedId;// = this._RECTORAT ? undefined : this.user.structure.id;
  ChangeStructure(){
    this.Personas = [];
    if (this.structureSelectedId !== undefined){
      this.GetPageInformations();
    }
  }

  titre;
  typeActu;
  typeActuChange = 'personaAdministra';
  campusPage;
  action;
  _spinner: boolean = false;
  ckeditorContent = '';

  Personas;
  GetPageInformations(){
    this._spinner = true;
    this.portailService.getPageInformations(this.typeActuChange).subscribe(getResponse => {
      this.Personas = getResponse.content.filter(element => +element.structure.id === +this.structureSelectedId);
      this._spinner = false;
    })
  }

  addNewPersona(){
    this.showForm = true;
    this.action = 'new'
    // this.closeForm();
  }
  closeForm(){
    this.ckeditorContent = '';
    this.titre = '';
    this.typeActu = '';
    this.showForm = false;

    // this.GetPageInformations();
  }

  submit(){
    if (this.action === "new"){
      this.SaveNewData();
    }else {
      this.SaveModifData();
    }
  }

  SaveNewData(){
    this._spinner = true;
    const body = {
      titre: this.titre,
      type: this.typeActuChange,
      contenu: this.ckeditorContent,
      structure: {id: this.structureSelectedId},
      date: Util_fonction.convertDate(new Date())
    }
    this.portailService.SavePageInformations(body).subscribe(saveResponse => {
      Util_fonction.SuccessMessage("Page enregistrer avec succès !");
      this.closeForm();
      this.GetPageInformations();
      this._spinner = false;
      this.showForm = false;
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
      type: this.typeActuChange,
      contenu: this.ckeditorContent,
      structure: {id: this.structureSelectedId},
      id: this.EditData.id,
      date: Util_fonction.convertDate(new Date())
    }
    this.portailService.UpdatePageInformations(bodyModit).subscribe(updateResponse => {
      Util_fonction.SuccessMessage("Modification enregistrer avec succès !");
      this.closeForm();
      this.GetPageInformations();
      this._spinner = false;
      this.showForm = false;
    }, error => {
      this._spinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    });
  }

  nommerCommeDoyen(persona){
    this._spinner = true;
    console.log("Personas :: ", this.Personas);
    const ancienDoyen = this.Personas.find(element => element.titre.includes('_DOYEN'));

    const body = [
      {
        titre: persona.titre+"_DOYEN",
        type: this.typeActuChange,
        contenu: persona.contenu,
        structure: {id: persona.structure.id},
        id: persona.id,
        date: Util_fonction.convertDate(new Date())
      }];

    if (ancienDoyen !== undefined){
      body.push({
        titre: ancienDoyen.titre,
        type: this.typeActuChange,
        contenu: ancienDoyen.contenu,
        structure: {id: ancienDoyen.structure.id},
        id: ancienDoyen.id,
        date: Util_fonction.convertDate(new Date())
      })
    }

      this.portailService.UpdatePageInformationsList(body).subscribe(updateResponse => {
        Util_fonction.SuccessMessage(persona.titre+ " est maintenant le Doyen !");
        this.closeForm();
        this.GetPageInformations();
        this._spinner = false;
        this.showForm = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });

  }

  DeletePersona(persona){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer : '"+persona.titre+"'",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portailService.deleteInfo(persona.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(persona.titre+" ,supprimer avec succès !");
          this.GetPageInformations();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })
  }


}
