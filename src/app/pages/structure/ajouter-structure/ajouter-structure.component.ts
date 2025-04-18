import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { StructureService } from 'app/services/structure.service';
import {Util_fonction} from "../../models/util_fonction";
// import {UtilsService} from "../../../services/utils.service";

@Component({
  selector: 'ngx-ajouter-structure',
  templateUrl: './ajouter-structure.component.html',
  styleUrls: ['./ajouter-structure.component.scss']
})
export class AjouterStructureComponent implements OnInit {

  // cration du formulaire reactive
  addStructureForm: FormGroup;
  fileToUpload = null;
  fileName = null;

  constructor(private formBuilder: FormBuilder,
              private structureService: StructureService,
              // private utilsService: UtilsService,
              private router: Router) { }

  ngOnInit(): void {
    // initiation du formulaire
    this.initForm();
  }
  // declaration d'une url vide pour la preview de l'image
  url = '';
  // le block n'est visible qu'après avoir selectionner une image
  prewiewImg = 'display:none';
  onselectFile(e){
    if(e.target.files) {
      var reader = new FileReader();
        this.fileToUpload = e.target.files[0];
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.url=event.target.result;
      }
    }
    this.prewiewImg = 'display:block';
  }

  // foction initialisation du formulaire pour le lier au template dans ng OnInit
  initForm(){
    this.addStructureForm = this.formBuilder.group({
      id: new FormControl(null),
      nom:  new FormControl(null,[Validators.required]),
      type: new FormControl(null,[Validators.required]),
      sigle: new FormControl(null,[Validators.required]),
      adresse: new FormControl(null,[Validators.required]),
      logo: new FormControl(this.fileName),
      premierRespondable: new FormControl(null),
      secondRespondable: new FormControl(null),
    });
  }


  enregistrerStructure(addStructureForm: FormGroup) {
    this.structureService.addStructure(addStructureForm.value).subscribe(
      (res)=> {
        this.router.navigate(['/pages/structure']);
      },error => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
    );
  }

}
