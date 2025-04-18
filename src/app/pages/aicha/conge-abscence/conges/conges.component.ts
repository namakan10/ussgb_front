import {Component, OnInit, ViewChild} from '@angular/core';
import {StructureService} from "../../../../services/structure.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CongeService} from "./conge.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Conge} from "./conge.model";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MessageService} from "primeng/api";
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
  selectedFile: File


  constructor(private service: CongeService, private fb: FormBuilder, public dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,
              ) {
    const id = this.route.snapshot.paramMap.get("id");
    this.user = JSON.parse(sessionStorage.getItem('user')).users;
    console.log('id_structure', id);
    console.log('current user', this.user);
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
          this.initData(this.user.id);
          this.form.reset();
          this.formPanel = false;
          this.showSuccess('Congé',this.error)
        },error => {
          this.error = error.error;
          this.showError('Congé',this.error)

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
          this.initData(this.user.id);
          this.form.reset();
          this.formPanel = false;
          this.showSuccess('Congé',this.error)

        },error => {
          this.error = error.error;
          this.showError('Congé',this.error)

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
        },error => {
          this.error = error.error;
          console.log("delete error", error)
          this.spinner = false;
        }
      )
  }


  addConge(){
    this.congeSelected = new Conge();
    this.congeSelected.user = this.user;
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
    this.congeSelected.user = this.user;
//    this.allConges = this.typeConges[this.congeSelected.type];
    console.log("showEdit", this.congeSelected)
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
      commentaire: [this.congeSelected.commentaire],
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
    this.spinner = true;
    this.service.getAllCongesByUserId(id)
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
    console.log('initTypeConge allConges', this.allConges);
    console.log('initTypeConge value', value);
  }

  changePanel() {
    this.formPanel=!this.formPanel;
  }

  setConge(value: any) {
    if(value=="Congé annuel" || value=="Congé d’intérêt public" || value=="Accomplissement de perfection"){
      this.form.controls['dateRetour'].setValidators([Validators.required])
    }
       console.log('setConge', value);
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

}


