import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DepartementService } from '../../../services/departement.service';
import { ReclamationServiceService } from '../../../services/GestionEtudiants/reclamation-service.service';
import {Util_fonction} from "../../models/util_fonction";
declare var $: any;



@Component({
  selector: 'app-gestion-reclamation',
  templateUrl: './gestion-reclamation.component.html',
  styleUrls: ['./gestion-reclamation.component.css']
})
export class GestionReclamationComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'matricule', 'option','motif', 'noteMotif','note','action'];
  dataSource: MatTableDataSource<any>;


  IdDepartement: any;
  user: any;
  Select_Departement: boolean = false;
  Departement: any;
  ReclamationTraitementForm: FormGroup;
  ShowNewNote: boolean = false;

  Body ={
    "decision" : "",
    "nouvelleNote" : null
  }
  ReclamID: any;
  _spinner1: boolean = false;
  _spinner: boolean = false;
  departementSelect: any;


  constructor(private reclamationService: ReclamationServiceService, private formBuilder: FormBuilder,
    private departementService: DepartementService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.Liste_Departement(this.user.structure.id);
    if(this.user.typeUtilisateur = 'Personnel administratif'){
      this.Select_Departement = true;
      this.Liste_Departement(this.user.structure.id);
    }
    this.IdDepartement = sessionStorage.getItem('idDepartement');
    this.initForm();
  }

  TraiterReclamation(row){
    this.initForm();
    this.ReclamID = row.id;
    $('#TraiterReclamationModal').modal('show');
    $('#TraiterReclamationModal').appendTo('body');
  }

  GeneratForm(){
    if(this.ReclamationTraitementForm.controls.decission.value === 'Favorable'){
      this.ShowNewNote = true;
      this.ActiveOmition_UE_Input();
    } else {
      this.ShowNewNote = false;
      this.DesactiveAllInput();
    }

  }

  ActiveOmition_UE_Input(){
    this.ReclamationTraitementForm.controls.newNote.setValidators([Validators.required]);
    this.ReclamationTraitementForm.controls.newNote.updateValueAndValidity();
  }

  DesactiveAllInput(){
    this.ReclamationTraitementForm.controls.newNote.reset();
        this.ReclamationTraitementForm.controls.newNote.clearValidators();
        this.ReclamationTraitementForm.controls.newNote.updateValueAndValidity();
  }


  Liste_Departement(id_struture){
    this.departementService.getStructureDepartements(id_struture).subscribe(depListres => {
      this.Departement =depListres;
    }, getListerror => {
    })
  }

  SelectDep(Iddep, departementSelect) {
    this.IdDepartement = Iddep;
    this.departementSelect = departementSelect;
    this.Select_Departement = false;
    this.ListReclam();
  }

  ListReclam() {
    this._spinner1 = true;
    this.reclamationService.getDepartementReclamation(this.IdDepartement).subscribe(resReclam => {
      this._spinner1 = false;
      this.dataSource = resReclam;
    }, getListerror => {
      this._spinner1 = false;
    })

  }

  ValidReclamationForm(){
    this._spinner =true;
    this.Body.decision = this.ReclamationTraitementForm.controls.decission.value;
    this.Body.nouvelleNote = +this.ReclamationTraitementForm.controls.newNote.value;
    if (this.Body.nouvelleNote === 0){
      this.Body.nouvelleNote = null;
    }
    this.SendTraitement();
  }

  SendTraitement(){
    this.reclamationService.TraitementReclamation(this.ReclamID,this.Body).subscribe(resTraitement =>{
      this._spinner =false;
      Swal.fire({
        icon: 'success',
        title: 'Enregistré',
        text: ''+resTraitement,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'Ok'
       }).then((result) => {
        this._spinner =false;
         if (result.isConfirmed) {
          this. ListReclam();
           $('#TraiterReclamationModal').modal('hide');
         }
       })
   }, error => {
    this._spinner =false;
      Util_fonction.AlertMessage("warning",error.error.message);
   });
  }

  initForm(){
    this.ReclamationTraitementForm = this.formBuilder.group({
      decission: new FormControl ('', [Validators.required]),
      newNote: new FormControl ('', [Validators.pattern('[0-9]*')]),
    })
  }
}
