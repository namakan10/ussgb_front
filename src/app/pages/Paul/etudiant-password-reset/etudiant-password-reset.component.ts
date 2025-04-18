import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CandidatureService } from '../../../services/candidature.service';
import { PreInscriptionServiceService } from '../../../services/pre-inscription-service.service';
import { StructureService } from '../../../services/structure.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {FilesService} from "../../../services/files.service";
import { DatePipe } from '@angular/common';
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";
import {Util_fonction} from "../../models/util_fonction";
import {FiliereService} from "../../../services/GestionFilieres/filiere.service";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {NgxImageCompressService} from "ngx-image-compress";
import {UNIV_NAME} from "../../../CONSTANTES";

declare var $: any;
@Component({
  selector: 'app-etudiant-password-reset',
  templateUrl: './etudiant-password-reset.component.html',
  styleUrls: ['./etudiant-password-reset.component.css']
})
export class EtudiantPasswordResetComponent implements OnInit {
  annee_scolaire: any;
  anneeStructure: any;
  user = JSON.parse(sessionStorage.getItem('user'));
  dateEnCours = JSON.parse(sessionStorage.getItem('dateEnCours'));
  spinner1: boolean = false;
  spinner: boolean = false;
  minDate = new Date();
  dateExpiration;
  constructor(private structureService: StructureService,
              private formBuilder: FormBuilder,
              private etudiantService: EtudiantService
  ) {

    this.structureService.getStuctureAnnees(this.user.structure.id).subscribe(
      (res) => {
        this.anneeStructure = res;
        this.spinner1 = false;
      },
      (error) => {
        // this.error = error;
        // this.spinner = false;
      });
  }
  ngOnInit(): void {

  }

  ChangerLesPasses(){
    this.spinner = true;
    const data = {
      idStructure: this.user.structure.id,
      dateExpiration: this.dateExpiration,
      anneeScolaire: this.annee_scolaire,
    };
    this.etudiantService.ChangePasswords(data).subscribe(
      res => {
        console.log(res);
        Util_fonction.SuccessMessage(res);
        this.spinner = false;
      }, error => {
        console.log(error);
        Util_fonction.AlertMessage(error.error.status, error.error.message);
        this.spinner = false;
      }
    )
  }

  // getEtudiants(){
  //   this.etudiantService.getEtudiant_s().subscribe(
  //     res =>{
  //       this.dataSource = new MatTableDataSource(res.content);
  //       this.dataSource.paginator = this.paginator;
  //       // this.search_spinner = false;
  //     }, error => {
  //       Util_fonction.AlertMessage(error.error.status, error.error.message);
  //     });
  // }

}
