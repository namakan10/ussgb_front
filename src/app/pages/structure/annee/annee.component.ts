import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from 'sweetalert2';
import {StructureService} from "../../../services/structure.service";
import {Util_fonction} from "../../models/util_fonction";
declare var $: any;
// import {UtilsService} from "../../../services/utils.service";

@Component({
  selector: 'ngx-annee',
  templateUrl: './annee.component.html',
  styleUrls: ['./annee.component.scss']
})
export class AnneeComponent implements OnInit {
  showForm :boolean = false;
  creatForm :boolean;
  structureID;
  structureAnnees;
  AllStructures;
  AnneeForm: FormGroup;
  StructureForm: FormGroup;
  user: any;
  SendData = {
    anneeScolaire: null,
    id: null,
    semestre: null,
    statut: null
  }
  action: any;
  constructor(private formBuilder: FormBuilder,
              private structureService: StructureService,
              ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.structureID = this.user.structure.id;
    this.getStructureAnnee();
    this.initForm();
  }

    // getAllStructure(){
    //   this.structureService.getStuctures().subscribe(AllStruct =>{
    //     this.AllStructures = AllStruct;
    //   });
    // }

  plusAnnee(){
    this.initForm();
    this.action = "creat";
    this.showForm = true;
    $('#AnneFormModal').modal('show');
    $('#AnneFormModal').appendTo('body');
  }


  /**
   * Méthode création d'une année
   */
  saveAnnee() {

    this.SendData.anneeScolaire = this.AnneeForm.controls.anneeScolaire.value;
    this.SendData.semestre = this.AnneeForm.controls.semestre.value;
    this.SendData.statut = this.AnneeForm.controls.statut.value;

    this.structureService.addAnnee(this.SendData).subscribe(res => {
      this.showForm = false;
      $('#AnneFormModal').modal('hide');
      this.getStructureAnnee();
      this.initForm();
      Util_fonction.SuccessMessage(res.message);
    },error1 => {
      console.log(error1);
      console.log(error1.message);
      Util_fonction.AlertMessage(error1.error.status, error1.error.message);
    });
  }

  modifAnnee(element){
    console.log(element);
    this.initForm();

    this.AnneeForm.controls.anneeScolaire.setValue(element.anneeScolaire);
    this.AnneeForm.controls.semestre.setValue(element.semestre);
    this.AnneeForm.controls.statut.setValue(element.statut);
    this.SendData.id = element.id;

    this.action = "update";
    this.showForm = true;
    $('#AnneFormModal').modal('show');
    $('#AnneFormModal').appendTo('body');
  }

  /**
   * Méthode mise à jours d'une année
   */
  updateAnnee(){
    this.SendData.anneeScolaire = this.AnneeForm.controls.anneeScolaire.value;
    this.SendData.semestre = this.AnneeForm.controls.semestre.value;
    this.SendData.statut = this.AnneeForm.controls.statut.value;

    this.structureService.updateAnnee(this.SendData).subscribe(res =>{
      console.log(res);
      this.showForm = false;
      $('#AnneFormModal').modal('hide');
      this.getStructureAnnee();
      this.initForm();
      Util_fonction.SuccessMessage(res);
    },error1 => {
      Util_fonction.AlertMessage(error1.error.status, error1.error.message);
    });
  }

  /**
   * Amene les années créée par la structure courante
   */
  getStructureAnnee(){
    this.structureService.getStuctureAnnees(this.structureID).subscribe(getRes =>{
      this.structureAnnees = getRes;
    }, error1 => {
      Util_fonction.AlertMessage(error1.error.status, error1.error.message);
      console.log(error1);
    });
  }

  structureChange(){
    console.log("*************************************");
    console.log(this.StructureForm.controls.structure.value);
    if (this.StructureForm.controls.structure.value !== null && this.StructureForm.controls.structure.value !== '') {
        this.structureID = this.StructureForm.controls.structure.value;
    }
  }

  deleteStructureAnnee(anneeID){
    Swal.fire({
      title: '',
      text: "Êtes-vous sûre de vouloir supprimer cette années",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'oui, supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.structureService.deleteAnnee(anneeID).subscribe(delRes =>{
          this.getStructureAnnee();
          Util_fonction.SuccessMessage(delRes);
        }, error1 => {
          Util_fonction.AlertMessage(error1.error.status, error1.error.message);
        });
      }
    })
  }

  /***
   * Initialisation du formulaire
   */
  initForm(){
    this.AnneeForm = this.formBuilder.group({
      anneeScolaire: new FormControl (null, Validators.required),
      semestre: new FormControl (null, Validators.required),
      statut: new FormControl (null, Validators.required),

    });

    this.StructureForm = this.formBuilder.group({
        structure: new FormControl (''),
    })
  };
}
