import {AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Util_fonction} from "../../models/util_fonction";
import {PAG_SMALL_SIZE} from "../../../CONSTANTES";
import {BatimentSalleService} from "../../../services/batiment-salle.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {StructureService} from "../../../services/structure.service";
declare var $: any;

@Component({
  selector: 'app-equipements',
  templateUrl: './equipements.component.html',
  styleUrls: ['./equipements.component.css']
})
export class EquipementsComponent implements OnInit, OnChanges {
  salleSelected ;
  user = JSON.parse(sessionStorage.getItem("user"));

  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'salle',
    'nom',
    'identifiant',
    'type',
    'caracteristique',
    'etat',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @Input() inputSalle;
  @Input() salleStructID;


  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50, 100];
  length = 100;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  EquipmentForm: FormGroup;
  sendBody={
    caracteristique: null,
    etat: null,
    // id	null,
    identifiant: null,
    nom: null,
    salle: {id: null},
    type: null
}
  bySalle = false;
  HasRoleRectorat = false;
  _RECTORAT: boolean =  this.user.structure.type === 'RECTORAT';
  structureId;
  constructor(
    private equipementService: BatimentSalleService,
    private structureService: StructureService,
    private fb: FormBuilder,
    ) {
    this.HasRoleRectorat = Util_fonction.checkIfAsRole2(
      this.user, ["ROLE_RECTEUR","ROLE_VRECTEUR","ROLE_SCOLARITE_RECTORAT"]);
  }
  ngOnInit() {
    console.log("this.salleStructID ->", this.salleStructID);
    this.initForm();
    // if (this._RECTORAT){
    //   this.GetAllStructures();
    // } else {
      this.structureId = this.user.structure.id;
      this.GetStrutureSalles();

      if(!Util_fonction.checkIfNoTEmpty(this.inputSalle)){
        this.GetStrutureSalles();
        this.GetEquipments();
    }
  }

  ngOnChanges(): void {
    this.bySalle = Util_fonction.checkIfNoTEmpty(this.inputSalle);
    console.log("this.salleStructID 2 ->", this.salleStructID);
    this.structureId = this.user.structure.id;
    if (!this._RECTORAT) {
      this.GetEquipments();
    }
  }

  Structures;
  GetAllStructures(){
    this.structureService.getStuctures().subscribe(
      (res) => {
        this.Structures = res.filter(s => s.type !== "RECTORAT");
      });
  }

  StructureSelected;
  StructureChange(event){
    this.structureId = +event.target.value;
    this.StructureSelected = this.Structures.find(s => s.id.toString() === event.target.value.toString());
    this.GetStrutureSalles();
  }

  Salles;
  SalleS
  GetStrutureSalles() {
    this.equipementService.GetStructureSalles(this.structureId).subscribe(
      res => {
        this.Salles = res;
      }, error => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      }
    )
  }


  totalElements;
  GetEquipments() {
    console.log("this.inputSalle ->88", this.inputSalle);
    this.SalleS = this.salleSelected ? this.Salles.find(s => s.id.toString() === this.salleSelected.toString()) : null;

    const data = {
      id_structure: this.bySalle && this._RECTORAT ? this.salleStructID : this.structureId,
      id_salle: this.bySalle ? this.inputSalle.id : this.salleSelected ? this.salleSelected : null
    }
    this.equipementService.GetEquipementsByCritere(data).subscribe(
      res => {
        console.log("res -", res);
        this.totalElements = res.totalElements;

        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
      }, error => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      }
    )
  }


  //save
  action = "creat";
  showForm: boolean =false;
  newEquipement(){
    this.initForm();
    this.action = "creat";
    this.showForm = true;
    $('#EquipmentsFormModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#EquipmentsFormModal').appendTo('body');
  }


  creatEquipement(){
    this.sendBody.salle.id = +this.EquipmentForm.controls.salle.value;
    this.sendBody.nom = this.EquipmentForm.controls.nom.value;
    this.sendBody.etat = this.EquipmentForm.controls.etat.value;
    this.sendBody.type = this.EquipmentForm.controls.type.value;
    this.sendBody.caracteristique = this.EquipmentForm.controls.caracteristique.value;
    this.sendBody.identifiant = this.EquipmentForm.controls.identifiant.value;

    this.equipementService.AddEquipement(this.sendBody).subscribe(resp =>{
      this.GetEquipments();
      $('#EquipmentsFormModal').modal('hide');
      this.showForm = false;
      Util_fonction.SuccessMessage(resp);
    }, adderror => {
      Util_fonction.AlertMessage(adderror.error.status, adderror.error.message);
    });
  }

  //UPDATE
  idEquipement;
  fullEditForm(element){
    this.initForm();
    this.showForm = true;
    this.action = "update";
    this.idEquipement = element.id;

    this.EquipmentForm.controls.nom.setValue(element.nom);
    this.EquipmentForm.controls.identifiant.setValue(element.identifiant);
    this.EquipmentForm.controls.caracteristique.setValue(element.caracteristique);
    this.EquipmentForm.controls.salle.setValue(element.salle.id);
    this.EquipmentForm.controls.type.setValue(element.type);
    this.EquipmentForm.controls.etat.setValue(element.etat);

    $('#EquipmentsFormModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#EquipmentsFormModal').appendTo('body');
  }

  updateEquipement(){
    this.sendBody.salle.id = +this.EquipmentForm.controls.salle.value;
    this.sendBody.nom = this.EquipmentForm.controls.nom.value;
    this.sendBody.etat = this.EquipmentForm.controls.etat.value;
    this.sendBody.type = this.EquipmentForm.controls.type.value;
    this.sendBody.caracteristique = this.EquipmentForm.controls.caracteristique.value;
    this.sendBody.identifiant = this.EquipmentForm.controls.identifiant.value;

    this.equipementService.UpdateEquipement(this.idEquipement, this.sendBody).subscribe(res => {
     this.GetEquipments();
      $('#EquipmentsFormModal').modal('hide');
      this.showForm = false;
      Util_fonction.SuccessMessage(res);
    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }
  //DELETE
  Delete_Equipement(element){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer cet equipement '"+element.nom+"'",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.equipementService.DeleteEquipement(element.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
         this.GetEquipments();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })

  }

  Annuler(){

  }

  checkUndefined(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

  initForm(){
    this.EquipmentForm = this.fb.group({
      nom: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      caracteristique: new FormControl(null, Validators.required),
      etat: new FormControl(null, Validators.required),
      identifiant: new FormControl(null, Validators.required),
      salle: new FormControl(null, Validators.required),
    })
  }



}
