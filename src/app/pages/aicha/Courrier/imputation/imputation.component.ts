import { Component, OnInit } from '@angular/core';
import {CourrierService} from "../courrier.service";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService, SelectItem} from "primeng/api";
import {Courrier} from "../courrier.model";

@Component({
  selector: 'app-imputation',
  templateUrl: './imputation.component.html',
  styleUrls: ['./imputation.component.css']
})
export class ImputationComponent implements OnInit {

  form: FormGroup;

  structureId:number;
  user:any;
  courriers:any[]=[];
  courrier: Courrier;

  formPanel = false;
  loading = false;

  sortOptions: SelectItem[];

  sortKey: string;

  sortField: string;

  sortOrder: number;


  constructor(
    public service: CourrierService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
  ) {

    this.structureId = +this.route.snapshot.paramMap.get("id");
    this.user = JSON.parse(sessionStorage.getItem('user')).users;
    console.log('id_structure', this.structureId);
    console.log('current user', this.user);
    this.initData(this.structureId);

  }
  ngOnInit() {
    this.sortOptions = [
      {label: 'Numero courrier', value: 'numeroCourrier'},
      {label: 'Année', value: 'annee'},
      {label: 'object', value: 'object'},
      {label: 'Type', value: 'type'},
      {label: 'Imputé', value: 'Impute'},
      {label: 'Non imputé', value: 'non impute'},
    ];
    this.fb = new FormBuilder();
    this.initModel();
    this.initForm();
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  private initModel() {
    this.courrier=new Courrier();
  }

  initForm(){
    this.buildForm();
    this.subscribeForm();
  }

  protected buildForm() {
    this.form = this.fb.group({
      numeroCourrier: [this.courrier.numeroCourrier, Validators.required],
      dateArrivee: [this.courrier.dateArrivee, Validators.required],
      dateCorrespondance: [this.courrier.dateCorrespondance, Validators.required],
      statut: [this.courrier.statut, Validators.required],
      object: [this.courrier.object, Validators.required],
      expediteur: [this.courrier.expediteur, Validators.required],
      //structure: [this.courrier.structure, Validators.required],

    });
  }

  protected subscribeForm() {
    if (!this.form) {
      this.buildForm();
    }
    this.form.get('numeroCourrier').valueChanges.subscribe(value => this.courrier.numeroCourrier = value);
    this.form.get('dateArrivee').valueChanges.subscribe(value => this.courrier.dateArrivee = value);
    this.form.get('dateCorrespondance').valueChanges.subscribe(value => this.courrier.dateCorrespondance = value);
    this.form.get('statut').valueChanges.subscribe(value => this.courrier.statut = value);
    this.form.get('object').valueChanges.subscribe(value => this.courrier.object = value);
    this.form.get('expediteur').valueChanges.subscribe(value => this.courrier.expediteur = value);
  }

  initData(id: number) {
    this.loading = true;
    this.initCourriersImputation(id);
  }


  initCourriersImputation(id:number) {
    this.service.getCourriersByEtat(id,'IMPUTE')
      .subscribe(
        (response:any)=>{
          this.courriers = response.content;
          console.log('getCourrierImputationId courriers',this.courriers)
          this.loading = false;
        },error => {
          this.loading = false;
          console.log('getCourrierImputationId error',error)
          this.showError('Courriers imputés par structure',error.error);
        }
      )
  }

  traiterCourrier(value: Courrier, val:string) {
    value.etat = val
    this.edite(value.id,value);
  }

  edite(id:number, value) {
    console.log("id ====>>>", id);
    console.log("edite ====>>>", value);
    value.id = id;
    value.structure = {id:this.structureId}
    this.service.updateCourriersSortant(id,value)
      .subscribe(
        (response:any)=> {
          console.log("edite ue", response)
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.showSuccess('Courrier sortant',response)
        },error => {
          this.showError('Courrier sortant',error.error)
          console.log("edite error", error)
        }
      )
  }





  hasRoleCourrier() {
    let hasRole = false;

    console.log('this.user[users]', this.user)
    if (this.user) {
      this.user.roles.forEach(item => {
        if (item.nom === 'ROLE_COURRIER') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  repondre(id:number) {
    console.log("id ====>>>", id);
    const structure = {id:this.structureId}
    this.service.repondreCourriersImputation(id,structure)
      .subscribe(
        (response:any)=> {
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.showSuccess('Courrier imputé',response)
        },error => {
          this.showError('Courrier imputé',error.error)
          console.log("edite error", error)
        }
      )
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

  loadData($event: any) {

  }

  newCourrier() {
    this.formPanel = true;
  }

  compareById(ob1, ob2) {
    return ob1.id === ob2.id;
  }

  applySave() {

  }

  applyEdite() {

  }

  applyAnnuler() {
    this.initModel();
    this.formPanel = false;
    this.initData(this.structureId);
  }
}
