import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { UesServiceService } from '../../../services/ues.service';
import Swal from 'sweetalert2';
import { PersonnelAdminService } from '../../../services/GestionPersonnelAdmin/personnel-admin.service';
import {Util_fonction} from "../../../pages/models/util_fonction";

@Component({
  selector: 'app-effectivite-enseignants',
  templateUrl: './effectivite-enseignants.component.html',
  styleUrls: ['./effectivite-enseignants.component.css']
})
export class EffectiviteEnseignantsComponent implements OnInit {

  UEs:any
  Ensegnants:any
  idSt:any
  ecForUe:any
  effectiviteForm:FormGroup
  users:any
  heures=["07","08","09","10","11","12","13","14","15","16","17","18","19","20","21"]
  minutes=["00","05","10","15","20","30","35","40","45","50","55"]
  spinner=false
  keyword = "prenom";
  constructor(private formBuilder: FormBuilder,
    private uesService: UesServiceService,
    private PersonnelService: PersonnelAdminService,) { }

  ngOnInit() {

    this.users= JSON.parse(sessionStorage.getItem('user'));
    this.idSt=this.users.structure.id
    this.getUesByStructure(this.idSt)
    this.getEnseignantByStructure(this.idSt)
    this.initForm()


  }

  getUesByStructure(id) {
    this.uesService.getUesByStructure(id).subscribe((data) => {
    this.UEs = data.content;
    //print()
    })
  }
  EnseignantsVacataires = [];
  getEnseignantByStructure(id) {
   const data = {
      id_structure: id,
      role: "ROLE_ENSEIGNANT"
    }
    this.PersonnelService.getStructurePersonnel(data).subscribe((dataresponse) => {
    this.Ensegnants = dataresponse.content;
      console.log("---->", dataresponse);
        const data2 = {
          id_structure: id,
          role: "ROLE_VACATAIRE"
        }
        this.PersonnelService.getStructurePersonnel(data2).subscribe((data2response) => {
          console.log("---> 2 ", data2response);
          this.EnseignantsVacataires = this.Ensegnants.concat(data2response.content);
          console.log("---> F", this.EnseignantsVacataires);
        });
    });
  }

  initForm(){
    this.effectiviteForm = this.formBuilder.group({
      UeId: ['', Validators.required],
      EcId: ['',],
      idTeacher: ['', Validators.required],
      motif: ['', Validators.required],
      heured: ['', Validators.required],
      minud: ['', Validators.required],
      heuref: ['', Validators.required],
      minuf: ['', Validators.required],
      dateEmg: ['', Validators.required],


    });
  }

  onSubmit() {

    if(this.ecForUe==null){
      this.onSubmitUe()
    }else{
      this.onSubmitEC()
    }

  }

  onSubmitUe() {
    this.spinner = true;


    const data = {
      dateEmargement : this.effectiviteForm.controls.dateEmg.value,
      heureDebut : this.effectiviteForm.controls.heured.value+":"+this.effectiviteForm.controls.minud.value,
      heureFin : this.effectiviteForm.controls.heuref.value+":"+this.effectiviteForm.controls.minuf.value,
      motif : this.effectiviteForm.controls.motif.value,
      enseignant : {
        id : this.effectiviteForm.controls.idTeacher.value.id
      },

      ue : {
        id : this.effectiviteForm.controls.UeId.value.id
      },
      verificateur : {
        id : this.users.users.id
      }

    };

    this.PersonnelService.EmargerEnseignant(data).subscribe(

      (data) => {
        this.spinner = false;
        Util_fonction.SuccessMessage(data);
      },
      (error) => {
        this.spinner = false;
         // get the status as error.status
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      })




  }


  onSubmitEC() {
    this.spinner = true;


    const data = {
      dateEmargement : this.effectiviteForm.controls.dateEmg.value,
      heureDebut : this.effectiviteForm.controls.heured.value+":"+this.effectiviteForm.controls.minud.value,
      heureFin : this.effectiviteForm.controls.heuref.value+":"+this.effectiviteForm.controls.minuf.value,
      motif : this.effectiviteForm.controls.motif.value,
      enseignant : {
        id : this.effectiviteForm.controls.idTeacher.value.id
      },

      elementConstitutif : {
        id : this.effectiviteForm.controls.EcId.value.id
      },
      verificateur : {
        id : this.users.users.id
      }

    };

    this.PersonnelService.EmargerEnseignant(data).subscribe(

      (data) => {
        this.spinner = false;
        Util_fonction.SuccessMessage(data);
      },
      (error) => {
        this.spinner = false;
         // get the status as error.status
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      })




  }


  checkeltscts(element){
    if(element.elementConstitutifs.length==0){
      this.ecForUe=null
    } else
    this.ecForUe=element.elementConstitutifs;

  }

}
