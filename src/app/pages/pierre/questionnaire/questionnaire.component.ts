import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
declare var $: any;
import Swal from 'sweetalert2';
import { PersonnelAdminService } from '../../../services/GestionPersonnelAdmin/personnel-admin.service';
import {Util_fonction} from "../../models/util_fonction";

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {
  error: any;
  allQuestion: any;
  message = null;
  spinner = false;
  action = '';
  productForm: FormGroup;
  user: any;

  constructor(private fb: FormBuilder, private personnelAdminService: PersonnelAdminService) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.productForm = this.fb.group({
      type: '',
      quantities: this.fb.array([]) ,
    });
   }

   quantities(): FormArray {
    return this.productForm.get('quantities') as FormArray;
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      type: this.productForm.get('type'),
      question: '',
      structure: {
        id: this.user.structure.id
      }
    });
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }

  ngOnInit() {
    this.productForm.reset();
    this.quantities().clear();
    this.personnelAdminService.getEvaluationEnseignements(this.user.structure.id).subscribe(
      (res) => {
        this.allQuestion = res;
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      });
  }

  deleteQuestion(id) {
    this.spinner = true;
  this.error = null;
  this.message = null;
  Swal.fire({
    icon: 'info',
    title: 'Voulez-vous confirmer la suppression ?',
    showCancelButton: true,
    confirmButtonText: `Supprimer`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      this.personnelAdminService.removeQuestion(id).subscribe(res => {
        this.ngOnInit();
          Util_fonction.SuccessMessage(res);
        this.spinner = false;
         },
         (error) => {
           Util_fonction.AlertMessage(error.error.status,error.error.message);
           this.spinner = false;
         });
    } else {
      this.spinner = false;
    }
  });
  }

  showModal() {
    this.message = null;
    this.error = null;
    // this.inti();
    this.action = 'Ajout des questions';
    $('#staticBackdrop').modal('show');
    $('#staticBackdrop').appendTo('body');
  }

  onSubmit() {
    this.spinner = true;
    this.personnelAdminService.evaluationEnseignementsAdd(this.productForm.get('quantities').value).subscribe(
      (res) => {
        this.ngOnInit();
        Util_fonction.SuccessMessage(res);
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      });
  }

  onUpdate() {
  }


}
