import {Component, OnInit, ViewChild} from '@angular/core';
import {DureeCongesService} from "./duree-conges.service";
import {MessageService} from "primeng/api";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Conge} from "../conge-abscence/conges/conge.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DureeConges} from "./duree-conges.model";
import {CongeService} from "../conge-abscence/conges/conge.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-duree-conges',
  templateUrl: './duree-conges.component.html',
  styleUrls: ['./duree-conges.component.css']
})
export class DureeCongesComponent implements OnInit {



  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  spinner = false;
  error = null;
  message = null;

  minDay = Date.now();
  mxDay = Date.now();



  dureeConges: DureeConges[];

  user: any;

  formPanel = false;
  structureId:number;


  // public id: number;
  // public conge: string;
  // public nbreEnDuree: number;
  // public stringEnDuree: string;

  displayedColumns: string[] = ['id', 'conge','nbreEnDuree','action'];
  dataSource;
  form: FormGroup;
  searchControl = new FormControl();
  dureeCongesSelected: DureeConges;

  constructor(
    public service: DureeCongesService,
    public messageService: MessageService,
    private fb: FormBuilder, public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.structureId = +this.route.snapshot.paramMap.get("id");
    this.user = JSON.parse(sessionStorage.getItem('user')).users;
    console.log('id_structure', this.structureId);
    console.log('current user', this.user);
    this.initData(this.structureId);
  }
  addOrdEdite(data){
    console.log('@@@ addOrdEdite @@@',this.dureeCongesSelected)
    if(this.form.valid){
      (this.dureeCongesSelected.id===null || this.dureeCongesSelected.id===undefined) ? this.save(this.dureeCongesSelected):this.edite(this.dureeCongesSelected.id,this.dureeCongesSelected);
    }
  }

  ngOnInit() {
    this.initData(this.user.id);
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
          console.log("add ue", response)
          this.message = response;
          this.spinner = false;
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.showSuccess('Congé',this.error)
          this.showSuccess('Création',this.message);

        },error => {
          this.error = error.error;
          this.showError('Erreur de congé',this.error)
          this.showError('Création',this.error);

          console.log("create error", error)
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
          console.log("edite ue", response)
          this.spinner = false;
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.showSuccess('Modification',this.message);

        },error => {
          this.error = error.error;
          this.showError('Erreur de congé',this.error)
          this.showError('Modification',this.error);

          console.log("edite error", error)
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
          this.showSuccess('Suppression',this.message);
          console.log("delete ", response)
          this.spinner = false;

        },error => {
          this.error = error.error;
          this.showError('Erreur de suppression',this.error);

          console.log("delete error", error)
          this.spinner = false;
        }
      )
  }


  addConge(){
    this.dureeCongesSelected = new DureeConges();
    console.log("addConge",this.dureeCongesSelected)
    this.initForm();
    this.formPanel = true;
  }

  showEdit(value: any){
    const values = value.duree.split(' ')
    this.dureeCongesSelected = value;
    this.dureeCongesSelected.nbreEnDuree = Number(values[0]);
    this.dureeCongesSelected.stringEnDuree = values[1];
    console.log("values", values)
    console.log("showEdit", this.dureeCongesSelected)
    this.initForm();
    this.formPanel = true;
  }

  initForm(){
    this.buildForm();
    this.subscribe();
  }

  initModel() {
    this.dureeCongesSelected =  new DureeConges();
  }



  protected buildForm() {
    // this.dureeCongesSelected.user=this.user;
    this.form = this.fb.group({
      conge: [this.dureeCongesSelected.conge, Validators.required],
      nbreEnDuree: [this.dureeCongesSelected.nbreEnDuree, Validators.required],
      stringEnDuree: [this.dureeCongesSelected.stringEnDuree, Validators.required],
    });
  }

  public conge: string;
  public nbreEnDuree: number;
  public stringEnDuree: string;

  protected subscribe() {
    if (!this.form) {
      this.buildForm();
    }
    this.form.get('conge').valueChanges.subscribe(value => this.dureeCongesSelected.conge = value);
    this.form.get('nbreEnDuree').valueChanges.subscribe(value => this.dureeCongesSelected.nbreEnDuree = value);
    this.form.get('stringEnDuree').valueChanges.subscribe(value => this.dureeCongesSelected.stringEnDuree = value);
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
    this.service.getAll(id)
      .subscribe(
        (data:any)=>{
          this.dureeConges = data;
          this.dataSource = new MatTableDataSource(this.dureeConges.reverse());
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log("initData", this.dureeConges)
          this.spinner = false;
        },error => {
          this.spinner = false;
          this.error = error.error;
          console.log("ERROR TYPE DUREE CONGES", error);
        }
      );
  }



  changePanel() {
    this.initForm();
    this.initData(this.structureId);
    this.formPanel=!this.formPanel;

  }


  showSuccess(title:string,msg: string) {
    this.messageService.add({severity:'success', summary: title, detail:msg});
  }

  showInfo(title:string,msg: string) {
    this.messageService.add({severity:'info',summary: title, detail:msg});
  }

  showWarn(title:string,msg: string) {
    this.messageService.add({severity:'warn', summary: title, detail:msg});
  }

  showError(title:string,msg: string) {
    this.messageService.add({severity:'error', summary: title, detail:msg});
  }



}



