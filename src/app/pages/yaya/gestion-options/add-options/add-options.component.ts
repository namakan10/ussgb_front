import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FiliereService } from '../../../../services/GestionFilieres/filiere.service';
import {OptionsService} from "../../../../services/GestionFilieres/Options/options.service";
import {Util_fonction} from "../../../models/util_fonction";


@Component({
  selector: 'ngx-add-options',
  templateUrl: './add-options.component.html',
  styleUrls: ['./add-options.component.scss']
})
export class AddOptionsComponent implements OnInit {

  addOptionForm: FormGroup;
  id_structure: any;
Filiere:any;
CreatPersonnelData1={
  id:'',
  nom:'',
  codeOption:'',
  filiere:{
    id: '',
  }
}
  constructor(private formBuilder: FormBuilder,
              private filiereService: FiliereService,
              private router: Router,
              private optionsService:OptionsService,
              private route: ActivatedRoute,
             ) { }

  ngOnInit(): void {
    // initiation du formulaire
    this.id_structure = this.route.snapshot.paramMap.get("id"),
    this.getFilieres(this.id_structure);
    this.initForm()
  }

 getFilieres(id){
  this.filiereService.getDepartementFilieres(id).subscribe(filiereRes => {
    console.log(filiereRes);
    this.Filiere = filiereRes;
 });
 }

  // foction initialisation du formulaire pour le lier au template dans ng OnInit
  initForm(){
    //const id_structure = this.route.snapshot.paramMap.get("id_structure");
    this.addOptionForm = this.formBuilder.group({
      nom: new FormControl(null, [Validators.required]),
     codeOption: new FormControl(null, [Validators.required]),
      filiere: new FormControl(null, [Validators.required]),

    });
  }
  fullCreatFormDataSend(){
    this.CreatPersonnelData1.nom= this.addOptionForm.controls.nom.value;
    this.CreatPersonnelData1.codeOption = this.addOptionForm.controls.codeOption.value;

        // departement
        this.CreatPersonnelData1.filiere.id = this.addOptionForm.controls.filiere.value;
  };

  saveOptions(){
    this.fullCreatFormDataSend();
    console.log(this.CreatPersonnelData1);
    this.enregistrerOption();

  }

  Annuler(){
    this.router.navigate(['/pages', 'filiere',this.route.snapshot.paramMap.get("id"),'Options']);

  }

  enregistrerOption() {
    this.optionsService.createOptions(this.CreatPersonnelData1).subscribe(res=> {
      Util_fonction.SuccessMessage(res);
      this.router.navigate(['/pages', 'filiere',this.route.snapshot.paramMap.get("id"),'Options']);
    }, error => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    });
  }
}




