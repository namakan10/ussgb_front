import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Util_fonction} from "../../models/util_fonction";
import {StructureService} from "../../../services/structure.service";
import {BatimentSalleService} from "../../../services/batiment-salle.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import Swal from "sweetalert2";
import {PAG_SMALL_SIZE} from "../../../CONSTANTES";
declare var $: any;


@Component({
  selector: 'app-batiments',
  templateUrl: './batiments.component.html',
  styleUrls: ['./batiments.component.css']
})
export class BatimentsComponent implements OnInit {

  sendBody ={
    libelle: null,
    nbreNiveau: null,
    nbreSalle: null,
    structure: {id: null}
  }

  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'libelle',
    'nbreNiveau',
    'nbreSalle',
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


  BatimentsForm: FormGroup;
  user = JSON.parse(sessionStorage.getItem("user"));
  HasRoleRectorat = false;
  byBatiment = false;
  _RECTORAT: boolean =  this.user.structure.type === 'RECTORAT';
  structureId;
  constructor(
    private formBuilder: FormBuilder,
    private structureService: StructureService,
    private batimentService: BatimentSalleService
  ) { }

  ngOnInit() {
    // if (this._RECTORAT){
    //   this.GetAllStructures();
    //   console.log("a");
    // } else {
      console.log("s");
      this.structureId = this.user.structure.id;
      this.GetStrutureBatiments();

    // }
  }

//GET
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

  Batiments;
  totalElements;
  GetStrutureBatiments() {
    this.batimentService.Get_StructureBatuments(this.structureId).subscribe(
      res => {
        this.totalElements = res.length;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
      }, error => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      }
    )
  }
//  ADD BATIMENT
  action = 'creat';
  showForm: boolean = false;
  newBatiment(){
    this.initForm();
    this.action = "creat";
    this.showForm = true;
    $('#BatimentsFormModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#BatimentsFormModal').appendTo('body');
  }
  creatBatiment(){
    this.sendBody.libelle = this.BatimentsForm.controls.libelle.value;
    this.sendBody.nbreNiveau = this.BatimentsForm.controls.nbreNiveau.value;
    this.sendBody.nbreSalle= this.BatimentsForm.controls.nbreSalle.value;
    this.sendBody.structure.id = this.structureId;

    this.batimentService.AddBatiment(this.sendBody).subscribe(batiment =>{
        this.GetStrutureBatiments();
      $('#BatimentsFormModal').modal('hide');
      this.showForm = false;
      Util_fonction.SuccessMessage("Le bâtiment "+this.sendBody.libelle+" a été ajouter avec succès !");
    }, adderror => {
      Util_fonction.AlertMessage(adderror.error.status, adderror.error.message);
    });
  }

// EDIT
  idBatiment: boolean = false;
  fullEditForm(element){
    this.initForm();
    this.action = "update";
    this.idBatiment = element.id;
    this.showForm = true;

    this.BatimentsForm.controls.libelle.setValue(element.libelle);
    this.BatimentsForm.controls.nbreSalle.setValue(element.nbreSalle);
    this.BatimentsForm.controls.nbreNiveau.setValue(element.nbreNiveau);

    $('#BatimentsFormModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#BatimentsFormModal').appendTo('body');
  }

  updateBatiment(){
    this.sendBody.structure.id = +this.structureId;
    this.sendBody.nbreSalle = this.BatimentsForm.controls.nbreSalle.value;
    this.sendBody.nbreNiveau = this.BatimentsForm.controls.nbreNiveau.value;
    this.sendBody.libelle = this.BatimentsForm.controls.libelle.value;

    this.batimentService.UpdateBatiment(this.idBatiment, this.sendBody).subscribe(res => {
        this.GetStrutureBatiments();
      $('#BatimentsFormModal').modal('hide');
      this.showForm = false;
      Util_fonction.SuccessMessage("Le bâtiment "+this.sendBody.libelle+" a été mise à jour avec succès !");

    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }

  //List des salles du bâtiment
  SalleSId;
  ShowSalles:boolean = false;
  SalleEquipements(element){
    this.SalleSId = element;
    console.log("this.SalleSId -",this.SalleSId);
    this.ShowSalles = true;
    $('#SallesModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#SallesModal').appendTo('body');
  }


  //SUPRESSION
  //DELETE
  Delete_Batiment(element){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer cet bâtiment '"+element.libelle+"'",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.batimentService.DeleteBatiment(element.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
          this.GetStrutureBatiments();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })

  }

  checkUndefined(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }



//  INIT FORM
  initForm(){
    this.BatimentsForm = this.formBuilder.group({
      nbreNiveau: new FormControl (null,[Validators.required]),
      nbreSalle: new FormControl (null,[Validators.required]),
      libelle: new FormControl (null,[Validators.required]),
    })
  }
}
