import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Absence} from "../absences/absence.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {AbsenceService} from "../../../../services/absence-service.service";


@Component({
  selector: 'app-grabsence',
  templateUrl: './grabsence.component.html',
  styleUrls: ['./grabsence.component.css']
})
export class GrabsenceComponent implements OnInit {


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  spinner = false;
  error = null;
  message = null;

  minDay = Date.now();
  mxDay = Date.now();

  structureId:number;

  absences: Absence[];
  users: any[];

  formPanel = false;



  displayedColumns: string[] = ['id','user', 'depart','motif','duree','statut','action'];
  dataSource;
  form: FormGroup;
  searchControl = new FormControl();
  absenceSelected: Absence;


  constructor(private service: AbsenceService, private fb: FormBuilder, public dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,) {
    this.structureId = +this.route.snapshot.paramMap.get("id");
    this.initData(this.structureId);
    console.log('id_structure', this.structureId);
  }

  addOrdEdite(data){
    console.log('@@@ addOrdEdite @@@',this.absenceSelected)
    if(this.form.valid){

      // this.absenceSelected.dateDepart=new Date(this.absenceSelected.dateDepart.getFullYear()+"-"+this.absenceSelected.dateDepart.getMonth()+"-"+this.absenceSelected.dateDepart.getDate());

      (this.absenceSelected.id===null || this.absenceSelected.id===undefined) ? this.save(this.absenceSelected):this.edite(this.absenceSelected.id,this.absenceSelected);
    }
  }

  ngOnInit() {

    this.fb = new FormBuilder();
    this.initModel();
    this.initForm();

  }


  save(value) {
    console.log("add ====>>>", value);
    this.spinner = true;


    this.service.create(value)
      .subscribe(
        (response:any)=> {
          console.log("add", response)
          this.message = response;
          this.spinner = false;
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
        },error => {
          this.error = error.error;
          console.log("add error", error)
          this.spinner = false;
        }
      )
  }

  edite(id:number, value) {
    console.log("id ====>>>", id);
    console.log("edite ====>>>", value);
    this.spinner = true;
    value.id = id;
    this.service.update(id,value)
      .subscribe(
        (response:any)=> {
          this.message = response;
          console.log("edite", response)
          this.spinner = false;
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
        },error => {
          this.error = error.error;
          console.log("edite error", error)
          this.spinner = false;
        }
      )
  }

  traitement(id:number,statut) {
    console.log("id ====>>>", id);
    this.spinner = true;
    this.service.traitement(id,statut)
      .subscribe(
        (response:any)=> {
          this.message = response;
          console.log("traitement ue", response)
          this.spinner = false;
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
        },error => {
          this.error = error.error;
          console.log("traitement error", error)
          this.spinner = false;
        }
      )
  }


  delete(id:number, value) {
    console.log("id ====>>>", id);
    console.log("edite ====>>>", value);
    this.spinner = true;
    this.service.delete(id)
      .subscribe(
        (response:any)=> {
          this.initData(this.structureId);
          this.message = response;
          console.log("delete ", response)
          this.spinner = false;
        },error => {
          this.error = error.error;
          console.log("delete error", error)
          this.spinner = false;
        }
      )
  }


  addAbsence(){
    this.absenceSelected = new Absence();
    console.log("addAbsence",this.absenceSelected)
    this.initForm();
    this.formPanel = true;
  }

  showEdit(value: any){
    this.absenceSelected = value;
    const date = new Date(value.dateDepart[0], value.dateDepart[1], value.dateDepart[2]);
    this.absenceSelected.dateDepart = date;
    console.log("date", date)
    console.log("showEdit", this.absenceSelected.dateDepart)
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
    this.initPersmission(id);
    this.initUsers(id);
  }

  initPersmission(id:number){
    this.spinner = true;
    this.service.getPermissionsByStructureId(id)
      .subscribe(
        (data:any)=>{
          this.absences = data;
          console.log("initPersmission", this.absences)
          this.dataSource = new MatTableDataSource(this.absences.reverse());
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinner = false;
        },error => {
          this.spinner = false;
          this.error = error.error;
          console.log("ERROR TYPE AbsenceS", error);
        }
      );
  }

  initUsers(id:number){
    this.spinner = true;
    this.service.getUsersByStructureId(id)
      .subscribe(
        (data:any[])=>{
          this.users = data.map((u)=>u.user);
          console.log("initUsers", this.users)
          this.spinner = false;
        },error => {
          this.spinner = false;
          this.error = error.error;
          console.log("ERROR TYPE AbsenceS", error);
        }
      );
  }



  changePanel() {
    this.formPanel=!this.formPanel;
  }

  compareById(ob1, ob2) {
    return ob1.id === ob2.id;
  }

}


