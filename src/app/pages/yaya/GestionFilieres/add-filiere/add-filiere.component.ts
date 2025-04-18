import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { DepartementService } from '../../../../services/departement.service';
import { FiliereService } from '../../../../services/GestionFilieres/filiere.service';
import Swal from "sweetalert2";
import {Util_fonction} from "../../../models/util_fonction";

@Component({
  selector: 'ngx-add-filiere',
  templateUrl: './add-filiere.component.html',
  styleUrls: ['./add-filiere.component.scss']
})
export class AddFiliereComponent implements OnInit {
  addFiliereForm : FormGroup
  id_structure: string;
  Departement: any;
  CreatPersonnelData1 = {

    nom: '',
   codeFiliere : '',
    departement :{
      id:'',
    }
  }
 constructor(private formBuilder: FormBuilder,
             private route: ActivatedRoute,

             //private utilsService: UtilsService,
             private filiereService: FiliereService,
             private departementService: DepartementService,
             private router: Router,
           ) { }

 ngOnInit(): void {

   this.id_structure = this.route.snapshot.paramMap.get("id");
this.getDepartement(this.id_structure);
   // initiation du formulaire
   this.initForm();
 }
 // foction initialisation du formulaire pour le lier au template dans ng OnInit
 initForm(){

   this.addFiliereForm = this.formBuilder.group({
     nom: new FormControl(null, [Validators.required]),
     codeFiliere: new FormControl(null, [Validators.required]),
     departement:new FormControl(null, [Validators.required]),
   });
 }
 fullCreatFormDataSend1() {

  this.CreatPersonnelData1.nom = this.addFiliereForm.controls.nom.value;
  this.CreatPersonnelData1.codeFiliere = this.addFiliereForm.controls.codeFiliere.value;
  this.CreatPersonnelData1.departement.id = this.addFiliereForm.controls.departement.value;
}
 saveFiliere(){
  this.fullCreatFormDataSend1();
  console.log(this.CreatPersonnelData1);
  this.enregistrerFiliere();

}
 getDepartement(id) {
  this.departementService.getStructureDepartements(id).subscribe(depRes => {
     console.log(depRes);
    this.Departement = depRes;
  });
}
Annuler(){
  this.router.navigate(['/pages','structure',this.id_structure,'filieres']);

}
  enregistrerFiliere() {
    this.filiereService.createFiliere(this.CreatPersonnelData1).subscribe(
      res=> {
        Util_fonction.SuccessMessage(res);
        this.router.navigate(['/pages','structure',this.id_structure,'filieres']);
      },error =>{
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      },

    );
  }
}
