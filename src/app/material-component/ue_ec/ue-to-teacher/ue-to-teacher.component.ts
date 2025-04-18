import { Component, OnInit } from '@angular/core';
//import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl,FormArray,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DepartementService } from '../../../services/departement.service';
import { EnseignantsService } from '../../../services/enseignants.service';
import { UesServiceService } from '../../../services/ues.service';
import {Util_fonction} from "../../../pages/models/util_fonction";
import {PersonnelAdminService} from "../../../services/GestionPersonnelAdmin/personnel-admin.service";
declare var $: any;

@Component({
  selector: 'app-ue-to-teacher',
  templateUrl: './ue-to-teacher.component.html',
  styleUrls: ['./ue-to-teacher.component.css']
})
export class UeToTeacherComponent implements OnInit {

  form : FormGroup;dataform: FormGroup;
  send=[];
  search_text;
  test=[];
  sum: number=0;
  user: any;
  teacher:any;
  allEc:any
  allUe:any;
  idTeacher: any;
  idEc: any;
  spinner = false;
  checkEcSelect=false;
  UE;
  teacherIdData=[];

  GetBody = {
    id_structure: null,
    id_departement: null,
    role: null
  }

  typeChoix ="ROLE_ENSEIGNANT";

    constructor(private teacherService: EnseignantsService,
              private route: ActivatedRoute,
              private router: Router,
              private uesService: UesServiceService,
              private derService: DepartementService,
              private personnelService: PersonnelAdminService,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    const id =  this.user.structure.id;
    this.GetBody.id_structure = this.user.structure.id;
    this.uesService.getUesByStructure(id).subscribe((data:any)=>{
      this.allUe = data.content;
      this.allUe.map(ue => {ue.nomUE = ue.nomUE+' '+ ue.codeUE});
    });

    this.GetEnseignants("ROLE_ENSEIGNANT");

    this.form = new FormGroup({
      ue :new FormArray([])
    });
  }

  getTeacherByDer(value){
    this.GetBody.role = "ROLE_ENSEIGNANT";
    this.GetBody.id_departement = value.departement.id;
    // this.teacherService.getTeacherByDer(this.GetBody)
    this.personnelService.getStructurePersonnel(this.GetBody)
      .subscribe((data : any) =>{
        this.teacher = data.content;
      });
    this.checkEcSelect=false
    this.allEc=null
    this.idEc=null
    this.getEcByUE(value.id)
  }

  getEcByUE(id){
    // this.teacherService.getTeacherByDer(this.GetBody)
    this.uesService.GetUesElementsConstitufis(id)
      .subscribe((data : any) =>{
        this.allEc = data;
      });
  }

//    keyword = 'nomUE';
  keyword = 'categorie';
  selectEvent(item) {
    // do something with selected item
    const formdata= {
      id: item.id,
    };
    if(this.test.find(x => x.id ===item.id)){
    }else{
      this.send.push(formdata);
      this.test.push(item);
      this.test = this.test

    }
    this.sum=1;
  }
  //for Ec
  changeValue(event){
    if(event=="A")
      this.checkEcSelect=true
    else{
      this.checkEcSelect=false
      this.idEc=null
    }
  }

  onChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something
  }

  remove(index,id){
//  this.removedata(index);
    this.test.splice(index,1);
    this.send.splice(index);
  }

  submit(){
    this.spinner = true;

    //this.idTeacher
    /**
     * Affectation UE
     */
    if(this.idEc==null){
      this.uesService.AffectUeToTeacher(this.send,this.UE.id).subscribe(
        (data) => {
          this.spinner = false;
          Util_fonction.SuccessMessage(data);
          this.ngOnInit()
        },
        (error) => {
          this.spinner = false;
          // get the status as error.status
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      )

    }else{
      /**
       * Affecter Ec
       */
      this.uesService.AffectEcToTeacher(this.idEc.id,this.send).subscribe(
        (data) => {
          this.spinner = false;
          Util_fonction.SuccessMessage(data);
          this.ngOnInit()
        },
        (error) => {
          this.spinner = false;
          // get the status as error.status
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      )
    }

  }

  /**
   * Auto complet pour la liste des UE
   * Differnet methode
   */
  selectEventUe(item) {
    // do something with selected item
    // this.GetBody.id_departement = item.departement.id;
    // this.teacherService.getTeacherByDer(this.GetBody)

    this.checkEcSelect=false
    this.allEc=null

    this.getEcByUE(item.id)
    //this.UE=item
  }

  GetEnseignants(role){
    this.typeChoix = role;
    this.GetBody.role = role;
    this.GetBody.id_departement = null;
    this.personnelService.getStructurePersonnel(this.GetBody)
      .subscribe((data : any) =>{
        this.teacher = data.content;
        this.teacher.map(t => {t.prenom = t.prenom + ' ' + t.nom});
      });
  }

  GetVaccataires(){
    this.typeChoix = "ROLE_VACATAIRE";
    this.GetEnseignants("ROLE_VACATAIRE");
  }

  onChangeSearchUe(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedUe(e) {
    // do something
  }
}
