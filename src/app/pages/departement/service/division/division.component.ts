import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { DepartementService } from '../../../../services/departement.service';
import {Util_fonction} from "../../../models/util_fonction";
declare var $: any;

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.css']
})
export class DivisionComponent implements OnInit {
  user: any;
  Struc_Services: any;
  structureSelect: any;
  structureDivisions: any;
  Departements: any;
  selectDivision: any;

  divisionBody = {
      "nom" : null,
      "service" : {
      "id" : null
      }
    }
  DepSelected: any;
  creatAction: boolean= false;
  change_spinner: boolean= false;
  departementSelect: any;
  DivisionForm: FormGroup;
  Dep_SelectForm: FormGroup
  serviceOfDep: boolean= false;
  Services: any;
  add_spinner: boolean;
  ServSelected: any;
  structureDivSelect: string;

  constructor(private depaertementService: DepartementService,
    private formBuilder :FormBuilder,
    private routeActive: ActivatedRoute) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.initForm();
    this.initSelectForm();
    this.GetStruct_Division_of_Structure();
    this.GetDep();
    this.GetStruct_Services();
    // this.GetStruct_Division_By_Services();
  }

  /***
   * Get de toutes les divisions de la structure
   * @constructor
   */
  GetStruct_Division_of_Structure(){
    this.structureDivSelect = this.user.structure.nom +" "+this.user.structure.sigle;
    this.depaertementService.getStructureDivisions(this.user.structure.id).subscribe( structDivRes =>{
      this.structureDivisions = structDivRes;
      console.log(this.structureDivisions);

    });
  }

  // get Dep
  GetDep() {
    this.depaertementService.getStructureDepartements(this.user.structure.id).subscribe( depRes =>{
      console.log(depRes);
      this.Departements = depRes;
    });
  }

  GetStruct_Services(){
    this.depaertementService.getStructureServices(this.user.structure.id).subscribe( servRes =>{
      console.log(servRes);
      this.Services = servRes;
    });
  }
  divisionPlus(){
    this.initForm();
    this.creatAction = true;

    $('#CreatFormModal').modal('show');
    $('#CreatFormModal').appendTo('body');
  }

  DivisionModif(element){
    console.log(element);

    this.creatAction = false;
    // this.desactive_Input();
    this.selectDivision = element.id;
    this.initForm();
    this.DivisionForm.controls.nom.setValue(element.nom);
    this.DivisionForm.controls.service.setValue(element.service.id);

    $('#CreatFormModal').modal('show');
    $('#CreatFormModal').appendTo('body');
  }

  // GetStruct_Division_By_Services(){
  //   this.structureSelect = this.user.structure.nom +" "+this.user.structure.sigle;
  //   this.depaertementService.getStructureServices(this.user.structure.id).subscribe( servRes =>{
  //     this.Struc_Services = servRes;

  //     for (let serv of this.Struc_Services){

  //     }
  //   });
  // }

  // change -
  GetServiceOfSelectDepartement(event){
    this.change_spinner = true;
    this.DepSelected = this.Dep_SelectForm.controls.listServiceDep.value;
    console.log("*****************");
    console.log(this.DepSelected);
    if  (this.DepSelected !== null && this.DepSelected !== undefined && this.DepSelected !== "null"){
      this.departementSelect = event.target.options[event.target.options.selectedIndex].text;
      this.serviceOfDep = true;
      // liste de se
      this.GetDep_ServicesToSelectListe();
      this.DEP__DIVISION();
      this.change_spinner = false;
    } else {
      this.departementSelect = '';
      this.serviceOfDep = false;
      this.GetStruct_Division_of_Structure();
      this.change_spinner = false;
    }
  }

  GetDep_ServicesToSelectListe() {
    this.depaertementService.getDepartementServices(this.DepSelected).subscribe( Res=>{
      this.Services = Res;
    });
  }
  /***
   * Get les divisions du departement sélectionné
   * @constructor
   */
  DEP__DIVISION(){
    this.depaertementService.getDepartementDivisions(this.DepSelected).subscribe( DepDIvisionRes=>{
      this.structureDivisions = DepDIvisionRes;
      // this.change_spinner = false;
    });
  }

  //-- SAVE
  SaveDivision(){
    this.add_spinner = true;
    this.divisionBody.nom = this.DivisionForm.controls.nom.value;
    // if(this.DepSelected === null ||this.DepSelected === undefined || this.DepSelected === "null"){
      this.divisionBody.service.id = this.DivisionForm.controls.service.value;
    // } else {
    //   this.divisionBody.service.id = this.ServSelected;
    // }
    this.depaertementService.AddDivision(this.divisionBody).subscribe( addRes=>{
      this.add_spinner = false;
      $('#CreatFormModal').modal('hide');
      if(this.DepSelected === null ||this.DepSelected === undefined || this.DepSelected === "null"){
        this.GetStruct_Division_of_Structure();
      } else {
        this.DEP__DIVISION();
      }
      Util_fonction.SuccessMessage(addRes);
    }, error => {
      this.add_spinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }


  // -- MISE A JOUR
  UpdateDivision(){
    this.add_spinner = true;
    this.divisionBody.nom = this.DivisionForm.controls.nom.value;
    this.divisionBody.service.id = +this.DivisionForm.controls.service.value;
    console.log(this.divisionBody);
    this.depaertementService.UpdateDivision(this.selectDivision,this.divisionBody).subscribe( updateRes=>{
      this.add_spinner = false;
      $('#CreatFormModal').modal('hide');
      if(this.DepSelected === null || this.DepSelected === undefined || this.DepSelected === "null"){
        this.GetStruct_Division_of_Structure();
      } else {
        this.DEP__DIVISION();
      }

      Util_fonction.SuccessMessage(updateRes);
    }, error => {
      this.add_spinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }

  DeleteDivision(element){
    Swal.fire({
      title: '',
      html: 'êtes-vous sûr de supprimer cette division <strong> ' + element.nom + '</strong>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'non, annuler',
      confirmButtonText: 'Oui, Supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.depaertementService.DeleteDivision(element.id).subscribe( deletRes=>{
          if(this.DepSelected === null || this.DepSelected === undefined || this.DepSelected === "null"){
            this.GetStruct_Division_of_Structure();
          } else {
            this.DEP__DIVISION();
          }
          Util_fonction.SuccessMessage(deletRes);
        }, error => {
          // this.add_spinner = false;
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        })
      }
    });
  }

  initForm() {
    this.DivisionForm = this.formBuilder.group({
      nom: new FormControl(null,[Validators.required]),
      service: new FormControl(null),
    });
  }


  initSelectForm(){
    this.Dep_SelectForm = this.formBuilder.group({
      listServiceDep: new FormControl(null),
    });
  }

}
