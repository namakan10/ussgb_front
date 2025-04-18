import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Courrier, CourrierImpute} from "../../courrier.model";
import {CourrierService} from "../../courrier.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {ViewEncapsulation} from "@angular/cli/lib/config/schema";



@Component({
  selector: 'app-dialog-imputation-courrier',
  templateUrl: './dialog-imputation-courrier.component.html',
  styleUrls: ['./dialog-imputation-courrier.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogImputationCourrierComponent implements OnInit {


  form:FormGroup;
  services:any;
  courrierImpute:any;
  courrier:any;
  structureId:number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogImputationCourrierComponent>,

    public service: CourrierService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
  ) {
    console.log('MAT_DIALOG_DATA', data)
    this.courrier=data.courrier;
    this.structureId=data.structureId;
    this.initData(this.structureId);
  }

  ngOnInit() {
    this.fb = new FormBuilder();
    this.initModel();
    this.initForm();
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


  initForm(){
    this.buildForm();
    this.subscribeForm();
  }

  protected buildForm() {
    this.courrier.statut = this.courrier.statut.toUpperCase();
    this.form = this.fb.group({
      services_id: [this.courrierImpute.services_id,Validators.required],
      rapport: [this.courrierImpute.rapport],
      reprendre: [this.courrierImpute.reprendre],
      suiteDonnee: [this.courrierImpute.suiteDonnee],
      exploitation: [this.courrierImpute.exploitation],
      instance: [this.courrierImpute.instance],
      projetDeResponse: [this.courrierImpute.projetDeResponse],
      information: [this.courrierImpute.information],
      etudeAvis: [this.courrierImpute.etudeAvis],
      suivre: [this.courrierImpute.suivre],
      disposition: [this.courrierImpute.disposition],
      remise: [this.courrierImpute.remise],
      parler: [this.courrierImpute.parler],
      urgent: [this.courrierImpute.urgent],
      photoCopier: [this.courrierImpute.photoCopier],
      classe: [this.courrierImpute.classe],
      attribution: [this.courrierImpute.attribution],
      diffusion: [this.courrierImpute.diffusion],
    });
  }

  protected subscribeForm() {
    if (!this.form) {
      this.buildForm();
    }
    this.form.get('diffusion').valueChanges.subscribe(value => this.courrierImpute.diffusion = value);;
    this.form.get('classe').valueChanges.subscribe(value => this.courrierImpute.classe = value);;
    this.form.get('attribution').valueChanges.subscribe(value => this.courrierImpute.attribution = value);;
    this.form.get('photoCopier').valueChanges.subscribe(value => this.courrierImpute.photoCopier = value);;
    this.form.get('urgent').valueChanges.subscribe(value => this.courrierImpute.urgent = value);;
    this.form.get('remise').valueChanges.subscribe(value => this.courrierImpute.remise = value);;
    this.form.get('parler').valueChanges.subscribe(value => this.courrierImpute.parler = value);;
    this.form.get('disposition').valueChanges.subscribe(value => this.courrierImpute.disposition = value);;
    this.form.get('suivre').valueChanges.subscribe(value => this.courrierImpute.suivre = value);;
    this.form.get('etudeAvis').valueChanges.subscribe(value => this.courrierImpute.etudeAvis = value);;
    this.form.get('services_id').valueChanges.subscribe(value => this.courrierImpute.services_id = value);;
    this.form.get('reprendre').valueChanges.subscribe(value => this.courrierImpute.reprendre = value);;
    this.form.get('projetDeResponse').valueChanges.subscribe(value => this.courrierImpute.projetDeResponse = value);;
    this.form.get('information').valueChanges.subscribe(value => this.courrierImpute.information = value);;
    this.form.get('instance').valueChanges.subscribe(value => this.courrierImpute.instance = value);;
    this.form.get('suiteDonnee').valueChanges.subscribe(value => this.courrierImpute.suiteDonnee = value);;
    this.form.get('exploitation').valueChanges.subscribe(value => this.courrierImpute.exploitation = value);;
    this.form.get('rapport').valueChanges.subscribe(value => this.courrierImpute.rapport = value);;
  }

  initData(id: number) {
    this.initService(id);
  }


  initService(id:number) {
    this.service.getServiceByStructureId(id)
      .subscribe(
        (response:[any])=>{
          this.services = response;
          console.log('this.services',this.services)
        },error => {
          console.log('this.services error',error)
          this.showError('Courrier par structure',error.error);
        }
      )
  }


  imputater(value) {
    value.courrier_id = this.courrier.id;
    value.date = new Date;
    console.log('this.save',value);
    const response = {type:'Imputer',data: value}
    this.dialogRef.close(response);

   /* this.service.saveImputations(value)
      .subscribe(
        (response:any)=>{
          this.showSuccess('Imputation courrier', response);
          this.dialogRef.close(response);
        },error => {
          console.log('Imputation courrier error',error)
          this.showError('Imputation courrier', error.error.errors ? error.error.errors:error.error  );
        }
      )*/
  }

  triater(value) {
    value.courrier_id = this.courrier.id;
    value.date = new Date;
    console.log('this.save',value);
    const response = {type:'Traiter',data: value}
    this.dialogRef.close(response);

   /* this.service.saveImputations(value)
      .subscribe(
        (response:any)=>{
          this.showSuccess('Imputation courrier', response);
          this.dialogRef.close(response);
        },error => {
          console.log('Imputation courrier error',error)
          this.showError('Imputation courrier', error.error.errors ? error.error.errors:error.error  );
        }
      )*/
  }

  private initModel() {
    this.courrierImpute = new CourrierImpute();
  }

  setService(value: any) {
    console.log('setService',value)
  }
}
