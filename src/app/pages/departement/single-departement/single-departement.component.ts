import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Util_fonction} from "../../models/util_fonction";
import Swal from "sweetalert2";
import {SubscriptionHandle} from "../../models/SubscriptionHandle";
import {DepartementService} from "../../../services/departement.service";
import {PersonnelAdminService} from "../../../services/GestionPersonnelAdmin/personnel-admin.service";
import {PAG_SMALL_SIZE} from "../../../CONSTANTES";

declare var $: any;

@Component({
  selector: 'ngx-single-departement',
  templateUrl: './single-departement.component.html',
  styleUrls: ['./single-departement.component.scss']
})
export class SingleDepartementComponent implements OnInit {


  /* */
  showForm :boolean = false;
  creatForm :boolean = false;
  Ens :boolean = false;


  /* */
  action: any;
  Enseignants: any;// any;
  DepID: any;
  modifID: any;

  /* */
  body = {
    nom: null,
    email: null,
    contact: null,
    description: null,
    type: null,
    structure:{
      id: null
    },
    chefDepartement: null
  }

  selectDerName = null;

  DepartementForm: FormGroup;

  /* Material table data */
  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'nom',
    'email',
    'contact',
    'chef',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /* Pagination */
  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;




  user = JSON.parse(sessionStorage.getItem('user'));

  sub = new SubscriptionHandle();
  constructor(private formBuilder: FormBuilder,
              private departementService: DepartementService,
              private personnelService: PersonnelAdminService,

  ) { }

  ngOnInit(): void {
    this.initForm();
    this.GetDepartements();
    this.GetEnseignants();
  }

  ngOnDestroy(){
    this.sub.dispose();
  }

  /**
   * Liste des départements de la structure currente
   * @constructor
   */
  GetDepartements(){
    this.sub.addToSubcription = this.departementService.getStructureDepartements(this.user.structure.id)
      .subscribe(res => {
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
      }, error => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      });
  }

  /**
   * Liste de tous les enseignants de la strucuture
   * @constructor
   */
  GetEnseignants(){
    this.Enseignants = null;
    let data = {role: "ROLE_ENSEIGNANT",id_structure: this.user.structure.id };


    this.sub.addToSubcription = this.personnelService.getStructurePersonnel(data).subscribe(res => {

      this.Enseignants = res.content;
    }, error => {

      Util_fonction.AlertMessage(error.error.status, error.error.message)
    });
  }

  checkIfIsNotNull(data){
    return Util_fonction.checkIfNoTEmpty(data);
  }

  //===================================== ===========================
  //===================================== Changement de chef de DER
  //===================================== ===========================
  DepartementEnseignant: any;
  _SpinnerChefBtn: boolean = false;
  selectChefDER(element: any){
    this._SpinnerChefBtn = true;

    this.initForm();
    this.DepID = +element.id;
    this.selectDerName = element.nom;

    this.DepartementEnseignant  = this.Enseignants.filter(d => d.departement.id === this.DepID);
    if (Object.keys(this.DepartementEnseignant).length > 0){
      this.body.nom = element.nom;
      this.body.email = element.email;
      this.body.contact = element.contact;
      this.body.type = element.type;
      this.body.structure.id = this.user.structure.id;
      this.Ens = true;

      $('#chefDERModal').modal('show');
      $('#chefDERModal').appendTo('body');

      this.GetEnseignants();
      this._SpinnerChefBtn = false;
    } else {
      this._SpinnerChefBtn = false;
      Util_fonction.AlertMessage('info', 'Le DER <strong>'+element.nom+'</strong> ne comporte pas d\'enseignants pour le moment !');
    }
  }

  ChangeChefDER() {
    this.body.chefDepartement = {id: +this.DepartementForm.controls.chefDepartement.value};
    this.sub.addToSubcription = this.departementService.updateDepartement(this.DepID, this.body).subscribe(res=>{
      this.GetDepartements();
      $('#chefDERModal').modal('hide');
      this.showForm = false;
      this.Ens = false;
      Util_fonction.SuccessMessage(res);
    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }

  //===================================== ===========================
  //===================================== Création de DER
  //===================================== ===========================
  _SpinnerDepBtn: boolean = false;
  /**
   * Modal de création de département
   */
  newDepartement(){
    this.initForm();
    this.action = "creat";
    this.showForm = true;
    $('#DepartementFormModal').modal('show');
    $('#DepartementFormModal').appendTo('body');
  }

  /***
   * CREATION
   */
  creatDepartement(){
    this._SpinnerDepBtn = true;
    this.body.nom = this.DepartementForm.controls.nom.value;
    this.body.email = this.DepartementForm.controls.email.value;
    this.body.contact = this.DepartementForm.controls.contact.value;
    this.body.description = this.DepartementForm.controls.descriptionDer.value;
    this.body.type = this.DepartementForm.controls.type.value;
    this.body.structure.id = this.user.structure.id;

    this.sub.addToSubcription = this.departementService.addDepartement(this.body).subscribe(res=>{
      this.GetDepartements();
      $('#DepartementFormModal').modal('hide');
      this.showForm = false;
      this._SpinnerDepBtn = false;
      Util_fonction.SuccessMessage(res);
    }, error => {
      this._SpinnerDepBtn = false;
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }


  //===================================== ===========================
  //===================================== Mise à jour de DER
  //===================================== ===========================
  /**
   * Remplissage du formulaire de mise à jour
   * @param element
   */
  modifDepartement(element){
    this.initForm();
    this.modifID = element.id;
    this.action = "update";
    this.showForm = true;
    $('#DepartementFormModal').modal('show');
    $('#DepartementFormModal').appendTo('body');

    this.DepartementForm.controls.nom.setValue(element.nom);
    this.DepartementForm.controls.email.setValue(element.email);
    this.DepartementForm.controls.contact.setValue(element.contact);
    this.DepartementForm.controls.description.setValue(element.description);
    this.DepartementForm.controls.type.setValue(element.type);

    if (Util_fonction.checkIfNoTEmpty(element.chefDepartement)){
      this.body.chefDepartement = {id: element.chefDepartement.id}
    }
  }

  /**
   * Mise à jour
   */
  update_Departement() {
    this._SpinnerDepBtn = true;
    this.body.nom = this.DepartementForm.controls.nom.value;
    this.body.email = this.DepartementForm.controls.email.value;
    this.body.contact = this.DepartementForm.controls.contact.value;
    this.body.description = this.DepartementForm.controls.descriptionDer.value;
    this.body.type = this.DepartementForm.controls.type.value;
    this.body.structure.id = this.user.structure.id;



    this.sub.addToSubcription = this.departementService.updateDepartement(this.modifID, this.body).subscribe(res=>{
      this.GetDepartements();
      $('#DepartementFormModal').modal('hide');
      this.showForm = false;
      this._SpinnerDepBtn = false;
      Util_fonction.SuccessMessage(res);
    }, error => {
      this._SpinnerDepBtn = false;
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }

  //===================================== ===========================
  //===================================== Supression de DER
  //===================================== ===========================

  /**
   * Suppression de departement
   * @param element
   * @constructor
   */
  Delete_Departement(element){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer ce département  '"+element.nom+"'",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sub.addToSubcription = this.departementService.deleteDepartement(element.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
          this.GetDepartements();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })
  }



  /*** ***********************************************
   * Initialisation du formulaire
   * **************************************************
   */
  initForm(){
    this.DepartementForm = this.formBuilder.group({
      nom: ['', Validators.required],
      email: ['', Validators.email],
      contact: ['', Validators.required],
      type: ['', Validators.required],
      descriptionDer: [''],
      chefDepartement: [''],
    });

    this.body = {
      nom: null,
      email: null,
      contact: null,
      type: null,
      description: null,
      structure:{
        id: null
      },
      chefDepartement: null
    }

  }



}
