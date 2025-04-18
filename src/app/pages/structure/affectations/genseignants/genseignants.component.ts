import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Affectation} from "../affectation.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {AffectationService} from "../../../../services/affectation-service.service";
import {Util_fonction} from "../../../models/util_fonction";
import {PAG_SMALL_SIZE} from "../../../../CONSTANTES";
import {PersonnelAdminService} from "../../../../services/GestionPersonnelAdmin/personnel-admin.service";



@Component({
  selector: 'app-gservice',
  templateUrl: './genseignants.component.html',
  styleUrls: ['./genseignants.component.css']
})
export class GenseignantsComponent implements OnInit {


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  spinner = false;
  error = null;
  message = null;

  selectedFile: File

  affectations: any[];
  enseignants: any[];
  departements: any[];
  fonctions: any[];


  structureId: number;

  user: any;

  formPanel = false;

  displayedColumns: string[] = ['id', 'date','enseignant','fonction','departement','action'];

  dataSource;
  form: FormGroup;
  searchControl = new FormControl();
  affectationSelected: Affectation;

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;



  constructor(private service: AffectationService, private personnelService: PersonnelAdminService, private fb: FormBuilder, public dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,) {
    this.structureId = +this.route.snapshot.paramMap.get("id");
    this.user = JSON.parse(sessionStorage.getItem('user')).users;
    this.initData(+this.structureId);
  }

  addOrdEdite(data){
    if(this.form.valid){

      (this.affectationSelected.id===null || this.affectationSelected.id===undefined) ? this.save(this.affectationSelected):this.edite(this.affectationSelected.id,this.affectationSelected);
    }
  }

  ngOnInit() {
    this.fb = new FormBuilder();
    this.initModel();
    this.initForm();

  }


  save(value) {
    this.spinner = true;
    this.service.create(value)
      .subscribe(
        (response:any)=> {
          Util_fonction.SuccessMessage(response);
          this.spinner = false;
          this.initData(this.structureId);
          this.initModel();
          this.form.reset();
          this.formPanel = false;
        },error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        }
      )
  }

  edite(id:number, value) {
    this.spinner = true;
    value.id = id;
    this.service.update(id,value)
      .subscribe(
        (response:any)=> {
          Util_fonction.SuccessMessage(response);
          this.spinner = false;
          this.initData(this.structureId);
          this.initModel();
          this.form.reset();
          this.formPanel = false;
        },error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        }
      )
  }


  delete(id:number, value) {
    this.spinner = true;
    this.service.delete(id)
      .subscribe(
        (response:any)=> {
          this.initData(this.structureId);
          Util_fonction.SuccessMessage(response);
          this.spinner = false;
        },error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        }
      )
  }


  addAffectation(){
    this.affectationSelected = new Affectation();
    this.initForm();
    this.formPanel = true;
  }

  showEdit(value: any){
    value.dateAffection = new Date(value.dateAffection[0], value.dateAffection[1], value.dateAffection[2]);
    this.affectationSelected = value;
    this.initForm();
    this.formPanel = true;
  }

  initForm(){
    this.buildForm();
    this.subscribe();
  }

  initModel() {
    this.affectationSelected =  new Affectation();
  }

  protected buildForm() {
    this.form = this.fb.group({
      dateAffection: [this.affectationSelected.dateAffection, Validators.required],
      departement: [this.affectationSelected.departement, Validators.required],
      user: [this.affectationSelected.user, Validators.required],
      fonction: [this.affectationSelected.fonction, Validators.required],
    });
  }

  protected subscribe() {
    if (!this.form) {
      this.buildForm();
    }
    this.form.get('dateAffection').valueChanges.subscribe(value => this.affectationSelected.dateAffection = value);
    this.form.get('departement').valueChanges.subscribe(value => this.affectationSelected.departement = value);
    this.form.get('user').valueChanges.subscribe(value => this.affectationSelected.user = value);
    this.form.get('fonction').valueChanges.subscribe(value => this.affectationSelected.fonction = value);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getBody ={
    id_structure: null,
    id_departement: null,
    typePersonnel: null,
    role: null
  }
  initData(id:number){
    this.initAffectations(id);
    this.initEnseignants(id);
    this.initDepartements(id);
    this.initFonctions(id);
  }


  initAffectations(id:number){
    this.spinner = true;
    this.getBody.id_structure = id;
    this.getBody.typePersonnel = "ENSEIGNANT";
    this.service.getAffectationPersonnelByStructure(this.getBody)
      .subscribe(
        (data:any)=>{
          this.affectations = data;
          this.dataSource = new MatTableDataSource(this.affectations.reverse());
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
          this.spinner = false;
        },error => {
          this.spinner = false;
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      );
  }

  initFonctions(id:number){
    this.spinner = true;
    this.service.getFonctionsByStructureId(id)
      .subscribe(
        (data:any[])=>{
          this.fonctions = data
          this.spinner = false;
        },error => {
          this.spinner = false;
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      );
  }



  initDepartements(id:number){
    this.spinner = true;
    this.service.getDepartementByStructure(id)
      .subscribe(
        (data:any)=>{
          this.departements = data;
          this.spinner = false;
        },error => {
          this.spinner = false;
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      );
  }

  initEnseignants(id:number){
    this.spinner = true;
    this.getBody.id_structure = id;
    this.getBody.role = "ROLE_ENSEIGNANT";
    this.personnelService.getStructurePersonnel(this.getBody)
      .subscribe(
        (data:any)=>{
          // this.enseignants = data.map((u)=>u.user);
          this.enseignants = data.content;
          this.spinner = false;
        },error => {
          this.spinner = false;
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      );
  }


  changePanel() {
    this.formPanel=!this.formPanel;
  }

  compareById(ob1, ob2) {
    return ob1.id === ob2.id;
  }

  onDepartement(value: any) {
  }
  onFonction(value: any) {
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
  }


  applySave() {
    if(this.form.valid) {
      if(this.selectedFile) {
        this.upload();
      }else {
        Util_fonction.AlertMessage(404,"Le document est obligatoire");
        return;
      }
    }
  }

  applyEdite() {
    if(this.form.valid) {
      if(this.selectedFile) {
        this.upload();
      } else {
        this.edite(this.affectationSelected.id,this.affectationSelected);
      }
    }
  }


  upload() {

    if(this.selectedFile===null) {
      return;
    }

    this.service.onUpload2(this.selectedFile)
      .subscribe(
        event => {
        },error => {
          this.affectationSelected.structure = {id:this.structureId};
          this.affectationSelected.document = error.error.text;
          this.affectationSelected.id==null ?  this.save(this.affectationSelected):this.edite(this.affectationSelected.id,this.affectationSelected);
        }
      );
  }


}


