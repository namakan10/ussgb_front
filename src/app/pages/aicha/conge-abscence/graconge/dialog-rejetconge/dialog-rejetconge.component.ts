import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Conge} from "../../conges/conge.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CongeService} from "../../conges/conge.service";
import {AbsenceService} from "../../absences/absence.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";



@Component({
  selector: 'app-dialog-rejetconge',
  templateUrl: './dialog-rejetconge.component.html',
  styleUrls: ['./dialog-rejetconge.component.css']
})
export class DialogRejetCongeComponent implements OnInit {


  // @ViewChild('htmlData') htmlData:ElementRef;
  conge:Conge;
  structureId:number;
  now = Date.now();
  form:FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogRejetCongeComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,

              private service: CongeService,private absenceService: AbsenceService, private fb: FormBuilder,
              private messageService: MessageService,
              ) {
    console.log('MAT_DIALOG_DATA', data)
    this.conge=data.conge;
    this.structureId=data.structureId;
  }

  ngOnInit() {
  this.initForm();
  }


  initForm(){
    this.buildForm();
    this.subscribe();
  }


  protected buildForm() {
    this.form = this.fb.group({
      commentaire: [this.conge.commentaire, Validators.required],
    });
  }

  protected subscribe() {
    if (!this.form) {
      this.buildForm();
    }
    this.form.get('commentaire').valueChanges.subscribe(value => this.conge.commentaire = value);
  }

  traitement() {
    this.conge.statut = 'Rejeté';
    console.log("id ====>>>", this.conge.id);
    console.log("this.conge", this.conge);
    this.service.traitement2(this.conge.id,this.conge)
      .subscribe(
        (response:any)=> {
          console.log("traitement", response)
          this.showSuccess('Traitement de congé',response);
          this.form.reset();
          this.dialogRef.close();
        },error => {
          this.showError('Traitement de congé',error.error);
        }
      )
  }


  showSuccess(title:string,msg: string) {
    this.messageService.add({severity:'success', summary: title, detail:msg});
  }

  showError(title:string,msg: string) {
    this.messageService.add({severity:'error', summary: title, detail:msg});
  }

}
