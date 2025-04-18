import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {ActivatedRoute, Router} from "@angular/router";

import Swal from 'sweetalert2';
import { DepartementService } from '../../../services/departement.service';
import { StructureService } from '../../../services/structure.service';
import { UesServiceService } from '../../../services/ues.service';
import {Util_fonction} from "../../../pages/models/util_fonction";

@Component({
  selector: 'app-ue-add',
  templateUrl: './ue-add.component.html',
  styleUrls: ['./ue-add.component.css']
})
export class UeAddComponent implements OnInit {
  addUeForm:FormGroup
  derData: any;
  ider;
  nomUE;
  cursus;
  codeUE
  semestre
  volumeHoraire
  credit;
  chapitre;
  spinner = false;
  user: any;
  constructor(private structureService: StructureService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private uesService: UesServiceService,
    private derService: DepartementService,

    private departementService: DepartementService) { }
    ngOnInit(): void {
      // initiation du formulaire
      this.loadDer();

    }
  loadDer(){
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.derService.getDerByStructure(this.user.structure.id).subscribe((data) => {
      this.derData = data;
      })
  }
    onSubmit() {
      this.spinner = true;
      const data = {
        nomUE: this.nomUE,
        codeUE: this.codeUE,
        cursus: this.cursus,
        semestre:this.semestre,
        volumeHoraire:this.volumeHoraire,
        credit:this.credit,
        chapitre:this.chapitre,
        departement:{
          id : this.ider,  //this.route.snapshot.paramMap.get("id"),
        },
      };
      this.uesService.createUes(data).subscribe(
        (data) => {
          this.spinner = false;
          Util_fonction.SuccessMessage(data);
            this.router.navigate(['/ueList']);
        },
        (error) => {
          this.spinner = false;
           // get the status as error.status
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        })
    }

    checkIfIsEmpty(element){
     return Util_fonction.checkIfNoTEmpty(element);
    }
}
