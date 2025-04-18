import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
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
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

declare var $: any;
@Component({
  selector: 'app-etudiant-update-password',
  templateUrl: './etudiant-update-password.component.html',
  styleUrls: ['./etudiant-update-password.component.css']
})
export class EtudiantUpdatePasswordComponent implements OnInit {
  user = JSON.parse(sessionStorage.getItem('user'));
  spinner: boolean = false;
  hideOldPassword = true;
  hide = true;

  constructor(
    public etudiantService: EtudiantService,
    public dialogRef: MatDialogRef<EtudiantUpdatePasswordComponent>,
  ) {}

  ngOnInit(): void {}

  form = new FormGroup({
    oldPassword: new FormControl('',[Validators.required, Validators.min(6)]),
    newPassword: new FormControl('',[Validators.required, Validators.min(6)]),
    confirmPassword: new FormControl('',[Validators.required, Validators.min(6)]),
  });

  updatePassword(data){
    if(this.form.value && this.form.value.newPassword !== this.form.value.confirmPassword){
      this.dialogRef.close();
      Util_fonction.AlertMessage("Changement de mot de passe", "Le nouveau mot de passe et confirmation sont differents");
      return;
    }
    data.token = sessionStorage.getItem('token')
    console.log("FORM DATA", data);
    this.spinner = true;
    this.etudiantService.updatePasswords(data).subscribe(
      res => {
        console.log(res);
        this.spinner = false;
        this.dialogRef.close(res);
      }, error => {
        this.dialogRef.close(error);
        this.spinner = false;
      }
    )
  }

}
