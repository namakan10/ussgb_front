import {Component, OnInit, ViewChild} from '@angular/core';
import {StructureService} from "../../../../services/structure.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {Absence} from "./absence.model";
import {AbsenceService} from "./absence.service";
import {MessageService} from "primeng/api";

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

  selectedFile: File;



  displayedColumns: string[] = ['id', 'depart','motif','duree','statut','action'];
  dataSource;
  form: FormGroup;
  searchControl = new FormControl();
  absenceSelected: Absence;


  constructor(private service: AbsenceService, private fb: FormBuilder, public dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,
              ) {
    const id = this.route.snapshot.paramMap.get("id");
    this.user = JSON.parse(sessionStorage.getItem('user')).users;
    console.log('id_structure', id);
    console.log('current user', this.user);
  }

  addOrdEdite(data){
    console.log('@@@ addOrdEdite @@@',this.absenceSelected)
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
    console.log("add ====>>>", value);
    this.spinner = true;


    this.service.create(value)
      .subscribe(
        (response:any)=> {
          console.log("add", response)
          this.message = response;
          this.spinner = false;
          this.initModel();
          this.initData(this.user.id);
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
          console.log("edite ue", response)
          this.spinner = false;
          this.initModel();
          this.initData(this.user.id);
          this.form.reset();
          this.formPanel = false;
          this.showSuccess('Permission',response)

        },error => {
          this.error = error.error;
          this.showError('Permission',error.error)

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
          this.initData(this.user.id);
          this.message = response;
          console.log("delete ", response)
          this.spinner = false;
          this.showSuccess('Permission',response)

        },error => {
          this.error = error.error;
          this.showError('Permission',error.error)
          console.log("delete error", error)
          this.spinner = false;
        }
      )
  }


  addAbsence(){
    this.absenceSelected = new Absence();
    this.absenceSelected.users = this.user;
    console.log("addAbsence",this.absenceSelected)
    this.initForm();
    this.formPanel = true;
  }

  showEdit(value: Absence){
    this.absenceSelected = value;
    const date1 = new Date(value.dateDepart[0], value.dateDepart[1], value.dateDepart[2]);
    this.absenceSelected.dateDepart = date1;
    this.absenceSelected.users = this.user;
    console.log("showEdit", value)
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
          console.log("initData", this.absences)
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


  traitement(id: any, annulé: string) {
  }


  uploadAdd() {
    if(!this.selectedFile) {
      this.save(this.absenceSelected);
    }else{
      this.service.onUpload2(this.selectedFile)
        .subscribe(
          response => {
            console.log('upload event', response);
          },error => {
            console.log('upload error', error);
            this.absenceSelected.fichierJustificatif = error.error.text;
            this.save(this.absenceSelected);
          }
        );
    }

  }

  uploadUpdate() {
    if(!this.selectedFile) {
      this.edite(this.absenceSelected.id,this.absenceSelected);
    }else {
      this.service.onUpload2(this.selectedFile)
        .subscribe(
          response => {
            console.log('upload event', response);
            // this.showSuccess('Uploade reussie','Uploade effectué avec succes')
          },error => {
            console.log('upload error', error);
            // this.showError('Erreur uploade','Uploade non effectué')

            this.absenceSelected.fichierJustificatif = error.error.text;
            this.edite(this.absenceSelected.id,this.absenceSelected);
          }
        );
    }

  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
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


