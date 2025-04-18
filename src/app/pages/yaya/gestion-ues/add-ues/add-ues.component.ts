import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {ActivatedRoute, Router} from "@angular/router";
import { StructureService } from '../../../../services/structure.service';
import { DepartementService } from '../../../../services/departement.service';
import { UesServiceService } from '../../../../services/ues.service';
import Swal from 'sweetalert2';
import {Util_fonction} from "../../../models/util_fonction";


@Component({
  selector: 'ngx-add-ues',
  templateUrl: './add-ues.component.html',
  styleUrls: ['./add-ues.component.scss']
})
export class AddUesComponent implements OnInit {
  addUeForm:FormGroup

  constructor(private structureService: StructureService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private uesService: UesServiceService,

    private departementService: DepartementService) { }
  ngOnInit(): void {
    // initiation du formulaire
    this.initForm();
  }


  // foction initialisation du formulaire pour le lier au template dans ng OnInit
  initForm(){
    this.addUeForm = this.formBuilder.group({
      nomUe: ['', Validators.required],
      codeUe: ['', Validators.required],
      semestre:['', Validators.required],
      volumeHoraire:['', Validators.required],
      credit:['', Validators.required],
      chapitre:['', Validators.required],
      departement:{
        id : this.route.snapshot.paramMap.get("id"),
      },
    });
  }
  enregistrerUes(addUeForm: FormGroup) {
    this.uesService.createUes(addUeForm.value).subscribe(res =>{
      Util_fonction.SuccessMessage(res);
        this.router.navigate(['/pages', 'structure',this.route.snapshot.paramMap.get("id"),'departement',this.route.snapshot.paramMap.get("id")]);
      },

    );
  }
}

