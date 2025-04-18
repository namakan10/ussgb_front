import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {Affectation} from "../affectation.model";
import {FilesService} from "../../../../services/files.service";
import {AffectationService} from "../../../../services/affectation-service.service";
import {Util_fonction} from "../../../models/util_fonction";
import {PAG_SMALL_SIZE} from "../../../../CONSTANTES";
import {PersonnelAdminService} from "../../../../services/GestionPersonnelAdmin/personnel-admin.service";



@Component({
  selector: 'app-gpersonnels',
  templateUrl: './gpersonnels.component.html',
  styleUrls: ['./gpersonnels.component.css']
})
export class GpersonnelsComponent implements OnInit {


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  spinner = false;
  error = null;
  message = null;

  selectedFile: File

  affectations: any[];
  services: any[];
  divisions: any[];
  departements: any[];
  users: any[];
  fonctions: any[];

  user: any;

  formPanel = false;

  structureId: number;
  displayedColumns: string[] = ['id', 'date','personnel','fonction','departement','service','division','action'];
  dataSource;
  form: FormGroup;

  searchControl = new FormControl();
  affectationSelected: Affectation;
  minDay=  Date.now();

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;


  constructor(private service: AffectationService,private personnelService: PersonnelAdminService, private fb: FormBuilder, public dialog: MatDialog,
              private route: ActivatedRoute,
              private filesService: FilesService,
              private router: Router,) {
    this.structureId = +this.route.snapshot.paramMap.get("id");

    this.user = JSON.parse(sessionStorage.getItem('user')).users;
    this.initData(this.structureId);
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
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.filesService = null;
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
        (response:any) => {
          Util_fonction.SuccessMessage(response);
          this.spinner = false;
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.selectedFile = null;
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
    this.initServices(value.departement.id);
    this.initDivisions(value.service.id);
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
      service: [this.affectationSelected.service, Validators.required],
      division: [this.affectationSelected.division],
      fonction: [this.affectationSelected.fonction, Validators.required],
      // document: [this.affectationSelected.document, Validators.required],
    });
  }

  protected subscribe() {
    if (!this.form) {
      this.buildForm();
    }
    this.form.get('dateAffection').valueChanges.subscribe(value => this.affectationSelected.dateAffection = value);
    this.form.get('departement').valueChanges.subscribe(value => this.affectationSelected.departement = value);
    this.form.get('user').valueChanges.subscribe(value => this.affectationSelected.user = value);
    this.form.get('service').valueChanges.subscribe(value => this.affectationSelected.service = value);
    this.form.get('division').valueChanges.subscribe(value => this.affectationSelected.division = value);
    this.form.get('fonction').valueChanges.subscribe(value => this.affectationSelected.fonction = value);
    // this.form.get('document').valueChanges.subscribe(value => this.affectationSelected.document = value);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }




  initData(id:number){
    this.initAffectations(id);
    this.initUsers(id);
    this.initDepartements(id);
    this.initFonctions(id);
    this.initHistoriques(id);
  }

getBody ={
  id_structure: null,
  id_departement: null,
  typePersonnel: null,
  role: null
}
  initAffectations(id:number){
    this.spinner = true;
    this.getBody.id_structure = id;
    this.getBody.typePersonnel = "PERSONNEL_ADMINISTRATIF";
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

  initServices(id:number){
    this.spinner = true;
    this.service.getServicesByDepartement(id)
      .subscribe(
        (data:any)=>{
          this.services = data;
          this.spinner = false;
        },error => {
          this.spinner = false;
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      );
  }

  initDivisions(id:number){
    this.spinner = true;
    this.service.getDivisionByService(id)
      .subscribe(
        (data:any)=>{
          this.divisions = data;
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

  initUsers(id:number){
    this.spinner = true;
    this.getBody.id_structure = id;
    this.getBody.role = "ROLE_DECANAT";
    this.personnelService.getStructurePersonnel(this.getBody)
      .subscribe(
        (data:any)=>{
          this.users = data.content.map((u)=>u.user);
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

  initHistoriques(id:number){
    // this.service.getHistoriqueByStructureId(id)
    //   .subscribe(
    //     (data:any[])=>{
    //       this.spinner = false;
    //     },error => {
    //       this.spinner = false;
    //       Util_fonction.AlertMessage(error.error.status,error.error.message);
    //     }
    //   );
  }


  changePanel() {
    this.formPanel=!this.formPanel;
  }

  compareById(ob1, ob2) {
    return ob1.id === ob2.id;
  }

  onDepartement(value: any) {
    this.initServices(value.id);
  }

  onService(value: any) {
    this.initDivisions(value.id);
  }

  onDivision(value: any) {
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


