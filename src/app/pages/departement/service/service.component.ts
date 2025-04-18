import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { DepartementService } from '../../../services/departement.service';
import {Util_fonction} from "../../models/util_fonction";
declare var $: any;

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  Struc_Services: any;
  id_Departement: any;
  selectService: any;
  user: any;
  serviceBody = {
    "nom" : null,
    "departement" : {
    "id" : null
    }
  }
  ServiceForm: FormGroup;
  Dep_SelectForm: FormGroup;
  Departements: any;

  add_spinner = false;
  creatAction = false;
  modifWithDep = false;
  DepSelected: any;
  change_spinner: boolean = false;
  serviceOfDep = false;
  departementSelect: any;
  structureSelect: string;
  constructor(private depaertementService: DepartementService,
              private formBuilder :FormBuilder,
              private routeActive: ActivatedRoute) { }

  ngOnInit() {
    // this.id_Departement = this.routeActive.snapshot.params.get('id_departement');
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.initForm();
    this.initSelectForm();
    this.GetDep_Services();
    this.GetDep();
  }

  GetDep() {
    this.depaertementService.getStructureDepartements(this.user.structure.id).subscribe( depRes =>{
      console.log(depRes);
      this.Departements = depRes;
    })
  }

  servicePlus(){
    this.initForm();
    console.log(this.DepSelected );
    if(this.DepSelected === null ||this.DepSelected === undefined || this.DepSelected === "null"){
      // no id
      this.creatAction = true;
      this.active_Input();
    } else {
      this.creatAction = true;
      this.active_Input();
      this.ServiceForm.controls.departement.setValue(this.DepSelected);
    }
    $('#CreatFormModal').modal('show');
    $('#CreatFormModal').appendTo('body');
  }

  serviceModif(element){
    this.creatAction = false;
    this.initForm();
    console.log("element", element);
    console.log(this.DepSelected);
    // if(this.DepSelected === null || this.DepSelected === undefined || this.DepSelected === "null"){
    //   Util_fonction.AlertMessage("warning", "Veuillez Séléctionner un département avant!");
    //
    // } else {
      this.modifWithDep = true;
      this.active_Input();
      this.ServiceForm.controls.departement.setValue(element.departement.id);
      this.selectService = element.id;

      this.ServiceForm.controls.nom.setValue(element.nom);

      $('#CreatFormModal').modal('show');
      $('#CreatFormModal').appendTo('body');
    // }
  }

  active_Input(){
    this.ServiceForm.controls.departement.setValidators([Validators.required]);
    this.ServiceForm.controls.departement.updateValueAndValidity();
  }

  desactive_Input(){
    this.ServiceForm.controls.departement.reset();
    this.ServiceForm.controls.departement.clearValidators();
    this.ServiceForm.controls.departement.updateValueAndValidity();
  }

  /**
   * CREATION
   */
  SaveService(){
    this.add_spinner = true;
    this.serviceBody.nom = this.ServiceForm.controls.nom.value;
    // if(this.DepSelected === null){
      this.serviceBody.departement.id = this.ServiceForm.controls.departement.value;
    // } else {
    //   this.serviceBody.departement.id = this.DepSelected;
    // }
    this.depaertementService.AddService(this.serviceBody).subscribe( addRes=>{
      this.add_spinner = false;
      $('#CreatFormModal').modal('hide');
      if(this.DepSelected === null || this.DepSelected === undefined || this.DepSelected === "null"){
        this.GetDep_Services();
      } else {
        this.DEP_SERVICES();
      }
      Util_fonction.SuccessMessage(addRes);

    }, error => {
      this.add_spinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }

    /**
   * MISE A JOURS
   */
  UpdateService(){
    this.add_spinner = true;
    // if (this.DepSelected !== null || this.DepSelected == undefined || this.DepSelected ==='null'){
    //
    // } else {
    //
    // }
    let body = {nom:this.ServiceForm.controls.nom.value, departement:{id:this.ServiceForm.controls.departement.value} };
    this.depaertementService.UpdateService(this.selectService,body).subscribe( addRes=>{
      this.add_spinner = false;
      if(this.DepSelected === null){
        this.GetDep_Services();
      } else {
        this.DEP_SERVICES();
      }

      Util_fonction.SuccessMessage(addRes);
      $('#CreatFormModal').modal('hide');
    }, error => {
      this.add_spinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }

  DeleteService(element){
    Swal.fire({
      title: '',
      html: 'êtes-vous sûr de supprimer le service <strong> ' + element.nom + '</strong>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'non, annuler',
      confirmButtonText: 'Oui, Supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.depaertementService.DeleteService(element.id).subscribe( deletRes=>{
          if(this.DepSelected === null || this.DepSelected === undefined || this.DepSelected === "null"){
            this.GetDep_Services();
          } else {
            this.DEP_SERVICES();
          }
          Util_fonction.SuccessMessage(deletRes);
        }, error => {
          this.add_spinner = false;
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        })
      }
    });
  }

  // change -
  GetServiceOfSelectDepartement(event){
    this.DepSelected = this.Dep_SelectForm.controls.listServiceDep.value;
    this.change_spinner = true;
    if  (this.DepSelected !== "null"){
      // this.DepSelected = this.Dep_SelectForm.controls.listServiceDep.value;
      this.change_spinner = false;
      this.departementSelect = event.target.options[event.target.options.selectedIndex].text;
      this.serviceOfDep = true;
      this.DEP_SERVICES();
    } else {
      // this.DepSelected = null;
      this.serviceOfDep = false;
      this.GetDep_Services();
      this.change_spinner = false;
    }
  }

  /**
   * Get Les service du Departement semlectionné
   * @constructor
   */
  DEP_SERVICES(){
    this.depaertementService.getDepartementServices(this.DepSelected).subscribe( DepServiceRes=>{
      this.Struc_Services = DepServiceRes;
      console.log("Dep Services");
      console.log(this.Struc_Services);
      this.change_spinner = false;
    });
  }

  /**
   * Get les service de la structure
   * @constructor
   */
  GetDep_Services(){
    this.structureSelect = this.user.structure.nom +" "+this.user.structure.sigle;
    this.depaertementService.getStructureServices(this.user.structure.id).subscribe( servRes =>{
      this.Struc_Services = servRes;
    });
  }


  initForm() {
    this.ServiceForm = this.formBuilder.group({
      nom: new FormControl('',[Validators.required]),
      departement: new FormControl(null),
    });
  }

  initSelectForm(){
    this.Dep_SelectForm = this.formBuilder.group({
      listServiceDep: new FormControl(null),
    });
  }

}
