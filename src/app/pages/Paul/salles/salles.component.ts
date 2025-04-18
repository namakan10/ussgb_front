import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {Util_fonction} from "../../models/util_fonction";
import {BatimentSalleService} from "../../../services/batiment-salle.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {error} from "util";
import {ActivatedRoute, Router} from "@angular/router";
import {PAG_SMALL_SIZE} from "../../../CONSTANTES";
import {StructureService} from "../../../services/structure.service";
declare var $: any;


@Component({
  selector: 'app-salles',
  templateUrl: './salles.component.html',
  styleUrls: ['./salles.component.css']
})
export class SallesComponent implements OnInit {
  SalleSId;
  Batiments: any;
  action: any;
  idSalle: any;
  showForm: boolean = false;
sendBody = {
  batiment: {
    id: null
  },
  nbrePlace: null,
  numSalle: null,
  typeSalle: null
}
SallesForm: FormGroup;


  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'numSalle',
    'nbrePlace',
    'typeSalle',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @Input() inputBatiment;
  @Input() batimentStructID;

  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50, 100];
  length = 100;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  id_batiment: any;
  batiment;
  user = JSON.parse(sessionStorage.getItem("user"));
  HasRoleRectorat = false;
  byBatiment = false;
  _RECTORAT: boolean =  this.user.structure.type === 'RECTORAT';
  structureId;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private structureService: StructureService,
              private salleService: BatimentSalleService) {
    this.HasRoleRectorat = Util_fonction.checkIfAsRole2(
      this.user, ["ROLE_RECTEUR","ROLE_VRECTEUR","ROLE_SCOLARITE_RECTORAT"]);
  }

  ngOnInit() {
    // if (this._RECTORAT){
    //   this.GetAllStructures();
    //   // this.GetStrutureBatiments();
    //   console.log("a");
    // } else {
      console.log("s");
      this.structureId = this.user.structure.id;
      this.GetStrutureSalles();
      this.GetStrutureBatiments();

      // if(!Util_fonction.checkIfNoTEmpty(this.inputSalle)){
      //   this.GetStrutureSalles();
      //   this.GetEquipments();
      // }

    // }


  }

  ngOnChanges(): void {
    console.log("this.inputBatiment exist ->", this.inputBatiment);
    this.structureId = this.user.structure.id;
    this.byBatiment = Util_fonction.checkIfNoTEmpty(this.inputBatiment);
    if (!this._RECTORAT) {
      this.GetStrutureSalles();
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
    this.GetStrutureBatiments();
  }

  GetStrutureBatiments() {
    this.salleService.Get_StructureBatuments(this.structureId).subscribe(
      res => {
        this.Batiments = res;
      }, error => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      }
    )
  }

  Salles;
  batimentSelected;
  BatimentS;
  totalElements;
  GetStrutureSalles() {
    this.ShowEquipements = false;
    this.BatimentS = Util_fonction.checkIfNoTEmpty(this.id_batiment) ? this.Batiments.find(s => s.id.toString() === this.id_batiment.toString()) : null;
    const data = {
      id_structure: this.byBatiment && this._RECTORAT ? this.batimentStructID :this.structureId,
      id_batiment: this.byBatiment ? this.inputBatiment.id : Util_fonction.checkIfNoTEmpty(this.id_batiment) ? this.id_batiment : null,
      pages: "0",
      size: 10000
    }
    this.salleService.GetStructureSalles2(data).subscribe(
      res => {
        this.totalElements = res.totalElements;
        this.Salles = res;
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
      }, error => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      }
    )
  }

  GetListSallesbyBatiment() {
    this.ShowEquipements = false;
    const data = {
      id_structure: this.structureId,
      id_batiment: this.id_batiment,
      pages: "0",
      size: 10000
    }
    this.salleService.GetSallesOfBatiment(data).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
      }, error => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      }
    )
  }

  //===============
  //CHANGE
  //===============
  BatimentSelected(event){
    console.log("event ->", event);
    this.batiment = event.target.value;
    this.id_batiment = event.target.value;
    this.BatimentS = this.Batiments.find(b => b.id === this.id_batiment);
    // if (Util_fonction.checkIfNoTEmpty(this.id_batiment)){
    //   this.GetListSallesbyBatiment();
    // }else {
      this.GetStrutureSalles();
    // }
  }

  newSalles(){
    this.initForm();
    this.action = "creat";
    this.showForm = true;
    $('#SallesFormModal').modal('show');
    $('#SallesFormModal').appendTo('body');
  }

  creatSalles(){
    this.sendBody.batiment.id = +this.SallesForm.controls.batiment.value;
    this.sendBody.nbrePlace = this.SallesForm.controls.nbrePlace.value;
    this.sendBody.numSalle = this.SallesForm.controls.numSalle.value;
    this.sendBody.typeSalle = this.SallesForm.controls.typeSalle.value;

    this.salleService.AddSalle(this.sendBody).subscribe(resp =>{
      if (Util_fonction.checkIfNoTEmpty(this.batiment)){
        this.GetListSallesbyBatiment();
      }else {
        this.GetStrutureSalles();
      }
      $('#SallesFormModal').modal('hide');
      this.showForm = false;
      Util_fonction.SuccessMessage(resp);
    }, adderror => {
      Util_fonction.AlertMessage(adderror.error.status, adderror.error.message);
    });
  }


  fullEditForm(element){
    this.initForm();
    this.action = "update";
    this.idSalle = element.id;
    this.showForm = true;

    this.SallesForm.controls.batiment.setValue(element.batiment.id);
    this.SallesForm.controls.nbrePlace.setValue(element.nbrePlace);
    this.SallesForm.controls.numSalle.setValue(element.numSalle);
    this.SallesForm.controls.typeSalle.setValue(element.typeSalle);

    $('#SallesFormModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#SallesFormModal').appendTo('body');
  }

  update_Salles(){
    this.sendBody.batiment.id = +this.SallesForm.controls.batiment.value;
    this.sendBody.nbrePlace = this.SallesForm.controls.nbrePlace.value;
    this.sendBody.numSalle = this.SallesForm.controls.numSalle.value;
    this.sendBody.typeSalle = this.SallesForm.controls.typeSalle.value;

    this.salleService.UpdateSalle(this.idSalle, this.sendBody).subscribe(res => {
      if (Util_fonction.checkIfNoTEmpty(this.batiment)){
        this.GetListSallesbyBatiment();
      }else {
        this.GetStrutureSalles();
      }
      $('#SallesFormModal').modal('hide');
      this.showForm = false;
      Util_fonction.SuccessMessage(res);
    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }

  Delete_Salles(element){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer cette salle '"+element.numSalle+"'",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.salleService.DeleteSalle(element.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
          if (Util_fonction.checkIfNoTEmpty(this.batiment)){
            this.GetListSallesbyBatiment();
          }else {
            this.GetStrutureSalles();
          }
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })

  }

  Annuler(){
    this.router.navigate(['/structure/'+this.user.structure.id+'/batiment']);

  }


  ShowEquipements:boolean = false;
  SalleEquipements(element){
    this.SalleSId = element;
    console.log("this.SalleSId -",this.SalleSId);
    this.ShowEquipements = true;
    $('#EquipementModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#EquipementModal').appendTo('body');
  }

  checkUndefined(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

  initForm(){
    this.SallesForm = this.formBuilder.group({
      batiment: new FormControl (null, [Validators.required]),
      nbrePlace: new FormControl (null,[Validators.required]),
      numSalle: new FormControl (null,[Validators.required]),
      typeSalle: new FormControl (null,[Validators.required]),
    })
  }

}
