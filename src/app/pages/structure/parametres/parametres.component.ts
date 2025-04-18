import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ParametreService } from '../../../services/parametre.service';
import {Util_fonction} from "../../models/util_fonction";
declare var $: any;

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.css']
})
export class ParametresComponent implements OnInit {
  user: any;
  list_params: any;

  creat_action: boolean = false;
  exist: boolean = false;
  Parametre_Form: FormGroup;

  sendBody = {
    "nbreEtudiantGroupe" : null,
    "noterEtudiantPresent" : false,
    "structure" : {
    "id" : null
    }
  }

  editID: any;
  _spinner:boolean = false;
  _spinner2: boolean= false;
  constructor(private parameterService: ParametreService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.INIT_FORM();
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.GET_STRUCTURE_PARAMS();
  }

  /**
   * METHODE POUR AMENER LES INFOS PARMAMETRE POUR LA STRUCTURE COURANTE
   */
  GET_STRUCTURE_PARAMS(){
    this.parameterService.getParametreByStructure(this.user.structure.id).subscribe(res => {
      this.list_params = res;
      if (this.list_params !== null) {
        if (Object.keys(this.list_params).length > 0){
          console.log("uu");

          this.exist = true;
        }
      } else {
        this.exist = false;
      }

    });
  }


  /**
   * CONTROLE SI CREATION PARAMETRE OU MISE A JOUR
   * @param action
   */
  FORM_ACTION_MANAGER(action){
    console.log(action);
    if (action.toString() === 'creat'){
      this.INIT_FORM();
      this.creat_action = true;
    } else {
      this.creat_action = false;
    }
    $('#ParametreFormModal').modal('show');
    $('#ParametreFormModal').appendTo('body');
  }

  FULL_FORM_FOR_UPDATE(elementID,element) {
    this.INIT_FORM();
    this.Parametre_Form.controls.nbreEtudiantGroupe.setValue(element);
    this.editID = elementID;
    console.log("full ok "+elementID+" "+element);

  }

  /**
   * METHODE POUR CREER LES PARAMETRE
   */
  CREAT_PARAMETRE() {
    this._spinner2 = true;
    this.sendBody.nbreEtudiantGroupe = this.Parametre_Form.controls.nbreEtudiantGroupe.value;
    // this.sendBody.noterEtudiantPresent = this.Parametre_Form.controls.noterEtudiantPresent.value;
    this.sendBody.structure.id = this.user.structure.id;
    this.parameterService.AddParametre(this.sendBody).subscribe((res) => {
      this.GET_STRUCTURE_PARAMS();
      $('#ParametreFormModal').modal('hide');
      this._spinner2 = false;
      Util_fonction.SuccessMessage(res);
    }, error => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
      this._spinner2 = false;
    })
  }

    /**
   * METHODE POUR CREER LES PARAMETRE
   */
  UPDATE_PARAMETRE() {
    this._spinner2 = true;
    this.sendBody.nbreEtudiantGroupe = this.Parametre_Form.controls.nbreEtudiantGroupe.value;
    // this.sendBody.noterEtudiantPresent = this.Parametre_Form.controls.noterEtudiantPresent.value;
    this.sendBody.structure.id = this.user.structure.id;
    this.parameterService.UpdateParametre(this.editID, this.sendBody).subscribe((res) => {
      this.GET_STRUCTURE_PARAMS();
      $('#ParametreFormModal').modal('hide');
      this._spinner2 = false;
      Util_fonction.SuccessMessage(res);
    }, error => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
      this._spinner2 = false;
    })
  }

  DELETE_PARAM(id){
    Swal.fire({
      title: '',
      html: 'êtes-vous sûr de supprimer le paramtre',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'non, annuler',
      confirmButtonText: 'Oui, Supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._spinner2 = true;
        this.parameterService.DeleteParametre(id).subscribe( deletRes=>{

          Util_fonction.SuccessMessage(deletRes);
        }, error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this._spinner2 = false;
        })
      }
    });
  }

  INIT_FORM() {
    this.Parametre_Form = this.formBuilder.group({
      nbreEtudiantGroupe: new FormControl ('', [Validators.required , Validators.pattern('[0-9]*')]),
      noterEtudiantPresent: new FormControl (''),
      structureID: new FormControl ('')
    })
  }



}
