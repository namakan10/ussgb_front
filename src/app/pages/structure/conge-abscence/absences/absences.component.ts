import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {Absence} from "./absence.model";
import {AbsenceService} from "../../../../services/absence-service.service";
import {Util_fonction} from "../../../models/util_fonction";


@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.css']
})
export class AbsencesComponent implements OnInit {


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  spinner = false;
  error = null;
  message = null;

  minDay = Date.now();
  mxDay = Date.now();


  absences: Absence[];

  user: any;

  formPanel = false;



  displayedColumns: string[] = ['id', 'depart','motif','duree','statut','action'];
  dataSource;
  form: FormGroup;
  searchControl = new FormControl();
  absenceSelected: Absence;


  constructor(private service: AbsenceService, private fb: FormBuilder, public dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,) {
    const id = this.route.snapshot.paramMap.get("id");
    this.user = JSON.parse(sessionStorage.getItem('user')).users;
  }

  addOrdEdite(data){
    if(this.form.valid){

      // this.absenceSelected.dateDepart=new Date(this.absenceSelected.dateDepart.getFullYear()+"-"+this.absenceSelected.dateDepart.getMonth()+"-"+this.absenceSelected.dateDepart.getDate());

      (this.absenceSelected.id===null || this.absenceSelected.id===undefined) ? this.save(this.absenceSelected):this.edite(this.absenceSelected.id,this.absenceSelected);
    }
  }

  ngOnInit() {
    this.initData(this.user.id);
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
          this.initData(this.user.id);
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
          this.initModel();
          this.initData(this.user.id);
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
          this.initData(this.user.id);
          Util_fonction.SuccessMessage(response);
          this.spinner = false;
        },error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        }
      )
  }


  addAbsence(){
    this.absenceSelected = new Absence();
    this.absenceSelected.users = this.user;
    this.initForm();
    this.formPanel = true;
  }

  showEdit(value: Absence){
    this.absenceSelected = value;
    const date1 = new Date(value.dateDepart[0], value.dateDepart[1], value.dateDepart[2]);
    this.absenceSelected.dateDepart = date1;
    this.absenceSelected.users = this.user;
    this.initForm();
    this.formPanel = true;
  }

  initForm(){
    this.buildForm();
    this.subscribe();
  }

  initModel() {
    this.absenceSelected =  new Absence();
  }

  protected buildForm() {
    this.absenceSelected.users=this.user;
    this.form = this.fb.group({
      dateDepart: [this.absenceSelected.dateDepart, Validators.required],
      motif: [this.absenceSelected.motif, Validators.required],
      duree: [this.absenceSelected.duree, Validators.required],
      users: [this.absenceSelected.users, Validators.required],
    });
  }

  protected subscribe() {
    if (!this.form) {
      this.buildForm();
    }
    this.form.get('dateDepart').valueChanges.subscribe(value => this.absenceSelected.dateDepart = value);
    this.form.get('motif').valueChanges.subscribe(value => this.absenceSelected.motif = value);
    this.form.get('duree').valueChanges.subscribe(value => this.absenceSelected.duree = value);
    this.form.get('users').valueChanges.subscribe(value => this.absenceSelected.users = value);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  initData(id:number){
    this.spinner = true;
    this.service.getAllAbsencesByUserId(id)
      .subscribe(
        (data:any)=>{
          this.absences = data;
          this.dataSource = new MatTableDataSource(this.absences.reverse());
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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


  traitement(id: any, annulé: string) {

  }
}


