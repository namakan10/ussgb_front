import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Conge} from "./conge.model";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {CongeService} from "../../../../services/conge-service.service";
import {Util_fonction} from "../../../models/util_fonction";

@Component({
  selector: 'app-conges',
  templateUrl: './conges.component.html',
  styleUrls: ['./conges.component.css']
})
export class CongesComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  spinner = false;
  error = null;
  message = null;

  minDay = Date.now();
  mxDay = Date.now();


  conges: Conge[];



  typeConge = ['CongeNormal','congesFormation','congesMaladie','congesRaisonFamiliales','congesSpeciaux'];

  typeConges: any[];
  allConges: any[];
  user: any;

  formPanel = false;

  displayedColumns: string[] = ['id', 'type','depart','retour','status','action'];
  dataSource;
  form: FormGroup;
  searchControl = new FormControl();
  congeSelected: Conge;


  constructor(private service: CongeService, private fb: FormBuilder, public dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,) {
    const id = this.route.snapshot.paramMap.get("id");
    this.user = JSON.parse(sessionStorage.getItem('user')).users;
    this.initTypeCong();
  }

  addOrdEdite(data){
    if(this.form.valid){

      // this.congeSelected.dateDepart=new Date(this.congeSelected.dateDepart.getFullYear()+"-"+this.congeSelected.dateDepart.getMonth()+"-"+this.congeSelected.dateDepart.getDate());

      (this.congeSelected.id===null || this.congeSelected.id===undefined) ? this.save(this.congeSelected):this.edite(this.congeSelected.id,this.congeSelected);
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


  addConge(){
    this.congeSelected = new Conge();
    this.congeSelected.user = this.user;
    this.initForm();
    this.formPanel = true;
  }

  showEdit(value: Conge){
    this.congeSelected = value;
    const date1 = new Date(value.dateDepart[0], value.dateDepart[1], value.dateDepart[2]);
    const date2 = new Date(value.dateRetour[0], value.dateRetour[1], value.dateRetour[2]);
    this.congeSelected.dateDepart = date1;
    this.congeSelected.dateRetour = date2;
    this.congeSelected.user = this.user;
//    this.allConges = this.typeConges[this.congeSelected.type];
    this.initForm();
    this.formPanel = true;
  }

  initForm(){
    this.buildForm();
    this.subscribe();
  }

  initModel() {
    this.congeSelected =  new Conge();
  }

  protected buildForm() {
    this.congeSelected.user=this.user;
    this.form = this.fb.group({
      dateDepart: [this.congeSelected.dateDepart, Validators.required],
      dateRetour: [this.congeSelected.dateRetour, Validators.required],
      type: [this.congeSelected.type, Validators.required],
      user: [this.congeSelected.user, Validators.required],
    });
  }

  protected subscribe() {
    if (!this.form) {
      this.buildForm();
    }
    this.form.get('dateDepart').valueChanges.subscribe(value => this.congeSelected.dateDepart = value);
    this.form.get('dateRetour').valueChanges.subscribe(value => this.congeSelected.dateRetour = value);
    this.form.get('type').valueChanges.subscribe(value => this.congeSelected.type = value);
    this.form.get('user').valueChanges.subscribe(value => this.congeSelected.user = value);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  initTypeCong(){
    this.service.getAllTypeConge()
      .subscribe(
        (data:any)=>{
          this.typeConges = data;
        },error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      );
  }

  initData(id:number){
    this.spinner = true;
    this.service.getAllCongesByUserId(id)
      .subscribe(
        (data:any)=>{
          this.conges = data;
          this.dataSource = new MatTableDataSource(this.conges.reverse());
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinner = false;
        },error => {
          this.spinner = false;
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      );
  }

  initTypeConge(value: string) {
    this.allConges = this.typeConges[value]
  }

  changePanel() {
    this.formPanel=!this.formPanel;
  }

  setConge(value: any) {
    if(value=="Congé annuel" || value=="Congé d’intérêt public" || value=="Accomplissement de perfection"){
      this.form.controls['dateRetour'].setValidators([Validators.required])
    }
  }
}


