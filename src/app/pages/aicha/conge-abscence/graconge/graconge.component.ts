import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Conge} from "../conges/conge.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CongeService} from "../conges/conge.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {AbsenceService} from "../absences/absence.service";
import {MessageService} from "primeng/api";
import {DialogCongeComponent} from "./dialog-conge/dialog-conge.component";
import {logger} from "codelyzer/util/logger";
import {DialogRejetCongeComponent} from "./dialog-rejetconge/dialog-rejetconge.component";

@Component({
  selector: 'app-graconge',
  templateUrl: './graconge.component.html',
  styleUrls: ['./graconge.component.css']
})
export class GracongeComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  spinner = false;
  error = null;
  message = null;

  minDay = Date.now();
  mxDay = Date.now();

  selectedFile:File;

  conges: Conge[];



  statutConges = ['En attente de validation','Validé','Rejeté'];

  typeConge = ['CongeNormal','congesFormation','congesMaladie','congesRaisonFamiliales','congesSpeciaux'];

  typeConges: any[];
  allConges: any[];
  structureId: any;
  user: any;
  users: any[];

  formPanel = false;

  displayedColumns: string[] = ['id', 'user','type','depart','retour','status','action'];
  dataSource;
  form: FormGroup;
  searchControl = new FormControl();
  congeSelected: Conge;


  constructor(private service: CongeService,private absenceService: AbsenceService, private fb: FormBuilder, public dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,

              ) {
    this.structureId = this.route.snapshot.paramMap.get("id");
    this.user = JSON.parse(sessionStorage.getItem('user')).users;
    console.log('id_structure', this.structureId);
    console.log('current user', this.user);
    this.initData(+this.structureId);
    this.initTypeCong();
  }

  addOrdEdite(data){
    console.log('@@@ addOrdEdite @@@',this.congeSelected)
    if(this.form.valid){

      // this.congeSelected.dateDepart=new Date(this.congeSelected.dateDepart.getFullYear()+"-"+this.congeSelected.dateDepart.getMonth()+"-"+this.congeSelected.dateDepart.getDate());

      (this.congeSelected.id===null || this.congeSelected.id===undefined) ? this.save(this.congeSelected):this.edite(this.congeSelected.id,this.congeSelected);
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
          console.log("add ue", response)
          this.message = response;
          this.spinner = false;
          this.initModel();
          this.initData(+this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.showSuccess('Congé',response);
        },error => {
          this.error = error.error;
          this.showError('Congé',error.error);
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
          this.initData(+this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.showSuccess('Congé',response);
        },error => {
          this.error = error.error;
          this.showError('Congé',error.error);
          this.error = error.error;
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
          this.initData(+this.structureId);
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


  addConge(){

    this.congeSelected = new Conge();
    console.log("addConge",this.congeSelected)
    this.initForm();
    this.formPanel = true;
  }

  showEdit(value: Conge){
    this.congeSelected = value;
    const date1 = new Date(value.dateDepart[0], value.dateDepart[1], value.dateDepart[2]);
    const date2 = new Date(value.dateRetour[0], value.dateRetour[1], value.dateRetour[2]);
    this.congeSelected.dateDepart = date1;
    this.congeSelected.dateRetour = date2;
    this.allConges = this.typeConges[this.congeSelected.type];
    console.log("showEdit", value)
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
    this.form = this.fb.group({
      dateDepart: [this.congeSelected.dateDepart, Validators.required],
      dateRetour: [this.congeSelected.dateRetour, Validators.required],
      type: [this.congeSelected.type, Validators.required],
      commentaire: [this.congeSelected.commentaire],
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
    this.form.get('commentaire').valueChanges.subscribe(value => this.congeSelected.commentaire = value);
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
          console.log("SUCCES TYPE CONGES" , this.typeConges);
        },error => {
          this.error = error.error;
          console.log("ERROR TYPE CONGES", error);
        }
      );
  }

  initData(id:number){
    this.initUsers(id);
    this.initStructures(id);
  }
  initStructures(id:number){
    this.spinner = true;
    this.service.getAllCongesByStructureId(id)
      .subscribe(
        (data:any)=>{
          this.conges = data;
          this.dataSource = new MatTableDataSource(this.conges.reverse());
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log("initData", this.conges)
          this.spinner = false;
        },error => {
          this.spinner = false;
          this.error = error.error;
          console.log("ERROR TYPE CONGES", error);
        }
      );
  }

  initTypeConge(value: string) {
    console.log('initTypeConge', value);
    this.allConges = this.typeConges[value]
    console.log('this.allConges', this.allConges);
  }

  changePanel() {
    this.formPanel=!this.formPanel;
  }

  setConge(value: any) {
    if(value=="Congé annuel" || value=="Congé d’intérêt public" || value=="Accomplissement de perfection"){
      console.log('OBLIGATOIRE', value);
      this.form.controls['dateRetour'].setValidators([Validators.required])
    }
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


  compareById(ob1, ob2) {
    return ob1.id === ob2.id;
  }


  uploadAdd() {
    if(!this.selectedFile) {
      this.save(this.congeSelected);
    }else{
      this.service.onUpload2(this.selectedFile)
        .subscribe(
          response => {
            console.log('upload event', response);
          },error => {
            console.log('upload error', error);
            this.congeSelected.fichierJustificatif = error.error.text;
            this.save(this.congeSelected);
          }
        );
    }

  }

  uploadUpdate() {
    if(!this.selectedFile) {
      this.edite(this.congeSelected.id,this.congeSelected);
    }else {
      this.service.onUpload2(this.selectedFile)
        .subscribe(
          response => {
            console.log('upload event', response);
            // this.showSuccess('Uploade reussie','Uploade effectué avec succes')
          },error => {
            console.log('upload error', error);
            // this.showError('Erreur uploade','Uploade non effectué')

            this.congeSelected.fichierJustificatif = error.error.text;
            this.edite(this.congeSelected.id,this.congeSelected);
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

  openDialog(data) {
    const dialogRef = this.dialog.open(DialogCongeComponent, {
      width: '60%',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`result: ${result}`);
    });
  }

  rejeter(data) {
    const dialogRef = this.dialog.open(DialogRejetCongeComponent, {
      width: '30%',
      data: {
        conge:data,
        structureId:this.structureId,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`result: ${result}`);
    });
  }

  onStatut(value: any) {
    console.log('onStatut',value)
    console.log('this.conges',this.conges)
    this.service.getAllCongesByStructureId(this.structureId)
      .subscribe(
        (data:any)=>{
          this.conges = data;
          this.conges = this.conges.filter(val => val.statut==value);
          console.log('this.conges',this.conges)
          this.dataSource = new MatTableDataSource(this.conges.reverse());
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log("initData", this.conges)
          this.spinner = false;
        },error => {
          this.spinner = false;
          this.error = error.error;
          console.log("ERROR TYPE CONGES", error);
        }
      );
  }

}


