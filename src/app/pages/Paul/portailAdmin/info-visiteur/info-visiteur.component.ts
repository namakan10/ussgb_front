import { Component, OnInit } from '@angular/core';
import {InformationsPortailService} from '../../../../services/informations-portail.service';
import {Util_fonction} from '../../../models/util_fonction';

@Component({
  selector: 'app-info-visiteur',
  templateUrl: './info-visiteur.component.html',
  styleUrls: ['./info-visiteur.component.css']
})
export class InfoVisiteurComponent implements OnInit {
  ckeditorContent = '';
  user = JSON.parse(sessionStorage.getItem('user'));
  constructor(private portailService : InformationsPortailService) { }

  ngOnInit() {
    this.GetPageInformations();
  }

  campusPage;
  action;
  GetPageInformations(){
    this.portailService.getPageInformations('infovisiteur').subscribe(getResponse => {
      this.campusPage = getResponse.content[0];
      if (getResponse.content.length > 0){
        this.ckeditorContent = getResponse.content[0].contenu;
        this.action = 'edit';
      }else {
        this.action = 'new';
      }

    })
  }

  submit(){
    if (this.action === "new"){
      this.SaveNewData();
    }else {
      this.SaveModifData();
    }
  }

  SaveNewData(){
    const body = {
      titre: 'Page info visiteur',
      type: 'infovisiteur',
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

  SaveModifData(){
    const body = {
      titre: 'Page info visiteurs',
      type: 'infovisiteur',
      id: this.campusPage.id,
      contenu: this.ckeditorContent,
      structure: {id: this.user.structure.id},
      date: Util_fonction.convertDate(new Date())
    }
    this.portailService.UpdatePageInformations(body).subscribe(updateResponse => {
      Util_fonction.SuccessMessage("Modification enregistrer avec succès !");
    }, error => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);

    })
  }
  save(event){
    console.log("event onChange==> ", event);
  }
}
