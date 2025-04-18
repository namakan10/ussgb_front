import { Component, OnInit } from '@angular/core';
import {InformationsPortailService} from '../../../../services/informations-portail.service';
import {Util_fonction} from '../../../models/util_fonction';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.css']
})
export class CampusComponent implements OnInit {
  ckeditorContent = '';
  user = JSON.parse(sessionStorage.getItem('user'));
  constructor(private portailService : InformationsPortailService) { }

  ngOnInit() {
    this.GetPageInformations();
  }

  campusPage;
  action;
  GetPageInformations(){
    this.portailService.getPageInformations('campus').subscribe(getResponse => {
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
      titre: 'Page campus',
      type: 'campus',
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
      titre: 'Page campus',
      type: 'campus',
      contenu: this.ckeditorContent,
      structure: {id: this.user.structure.id},
      id: this.campusPage.id,
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
