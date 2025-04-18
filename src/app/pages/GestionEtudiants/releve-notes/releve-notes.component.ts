import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import Swal from 'sweetalert2';
import { NotesService } from '../../../services/GestionEtudiants/notes.service';
import { StructureService } from '../../../services/structure.service';
import {REST_URL } from '../../REST_URL';
import {Util_fonction} from "../../models/util_fonction";
import {_HTTP, _HTTP_PHOTO, UNIV_MINISTERE, UNIV_NAME} from "../../../CONSTANTES";
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";
import {take} from "rxjs/operators";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-releve-notes',
  templateUrl: './releve-notes.component.html',
  styleUrls: ['./releve-notes.component.css']
})
export class ReleveNotesComponent implements OnInit {
  _http = _HTTP;
  univ_Minist = UNIV_MINISTERE;
  univ_name = UNIV_NAME;
  _asset_image = environment._ASSET_IMAGE;
getBody = {
  "numEtudiant" : null,
  "semestre" : null, // int
  "anneeScolaire" : null,
  "niveau" : null
}
  typeChoix = '0';
user: any;
  StructueID: any;
  StructureCurrentAnnee: any;
  releve_SearchForm: FormGroup;
  Annees: any[];
  export_spinner: boolean = false;
  search_spinner: boolean = false;
  findReleve: boolean = false;
  notFind: boolean = false;
  ReleveData: any;
  Today: Date;
  doc_generated:boolean= false;
  CodeQR : any;
  QrBody = {
    numEtudiant: null,
    typeDocument: "RELEVE_NOTE",
    anneeObtentionDiplome: null,
    semestre: null,
  }
  constructor(private formBuilder: FormBuilder, private structureService: StructureService,private noteService: NotesService,
              private etudiantService: EtudiantService) { }

  ngOnInit() {
    this.typeChoix = '0';
    this.initForm();
    // this.StructureCurrentAnnee = "2020 - 2021";
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.StructueID = this.user.structure.id;
    this.Today = new Date();
    this.GetStructureAnnée();
    // this.genereAnneeList();
  }

  GetStructureAnnée(){
    this.structureService.getStructureCurrentAnnee(this.StructueID).subscribe(anneeResponse => {
      this.StructureCurrentAnnee = anneeResponse.anneeScolaire;
      this.genereAnneeList();

    })
  }

  genereAnneeList() {
    const Annees = [];
    Annees.push(this.StructureCurrentAnnee);
    const endAnnee2 = this.StructureCurrentAnnee.substr(0,4); //new Date().getFullYear();
    let endAnnee: number = +this.StructureCurrentAnnee; //new Date().getFullYear();

    endAnnee = endAnnee - 1;
    for (let i = endAnnee2; i > 2010; i--) {
      let an = (i-1)+" - "+i ;
        Annees.push(an);
    }
    this.Annees = Annees;
  }

  releve_SearchForm_Submit() {
    this.search_spinner = true;
    // this.getBody.anneeScolaire = this.releve_SearchForm.controls.anneeScolaire.value;
    this.getBody.semestre = this.releve_SearchForm.controls.semestre.value;
    this.getBody.numEtudiant = this.releve_SearchForm.controls.numEtudiant.value;
    this.getBody.niveau = this.releve_SearchForm.controls.rel_niveau.value;

    // this.QrBody.anneeObtentionDiplome = this.releve_SearchForm.controls.anneeScolaire.value;
    // this.QrBody.numEtudiant = this.releve_SearchForm.controls.numEtudiant.value;
    // this.QrBody.semestre = this.releve_SearchForm.controls.semestre.value;

    this.GetEtudiantNote();
  }

  etudiantData: any;
  GetEtudiantNote() {
    this.noteService.getEtudiantReleveNotes(this.getBody).subscribe(res => {
      this.ReleveData = res;
      this.search_spinner = false;

      if (Object.keys(this.ReleveData).length > 0){

        // this.BindCrosImage('structLogo', this.user.structure.logo);

        this.notFind = false;
        this.doc_generated = true;
      } else {
        this.notFind = true;
      }
    }, error => {
      this.search_spinner = false;
      this.doc_generated = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }

  exportpdf() {
    this.export_spinner = true;
    const data = document.getElementById('export-doc');
    html2canvas(data, { useCORS: true}).then(canvas => {
    // Few necessary setting options
    const imgWidth = 208;
    const pageHeight = 295;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    const heightLeft = imgHeight;

    const contentDataURL = canvas.toDataURL('image/png');
    const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    const position = 15;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    pdf.save('RELEVE_DE_NOTE.pdf'); // Generated PDF
    this.export_spinner = false;
    });
  }


  choixSelected(event){
    if (event.target.value.toString() === '1'){
      this.releve_SearchForm.controls.semestre.reset();
      this.releve_SearchForm.controls.semestre.clearValidators();
      this.releve_SearchForm.controls.semestre.updateValueAndValidity();

      this.releve_SearchForm.controls.rel_niveau.reset();
      this.releve_SearchForm.controls.rel_niveau.setValidators([Validators.required])
      this.releve_SearchForm.controls.rel_niveau.updateValueAndValidity();
    } else if (event.target.value.toString() === '2') {
      this.releve_SearchForm.controls.rel_niveau.reset();
      this.releve_SearchForm.controls.rel_niveau.clearValidators();
      this.releve_SearchForm.controls.rel_niveau.updateValueAndValidity();

      this.releve_SearchForm.controls.semestre.reset();
      this.releve_SearchForm.controls.semestre.setValidators([Validators.required])
      this.releve_SearchForm.controls.semestre.updateValueAndValidity();
    } else {

      this.releve_SearchForm.controls.semestre.reset();
      this.releve_SearchForm.controls.semestre.clearValidators();
      this.releve_SearchForm.controls.semestre.updateValueAndValidity();

      this.releve_SearchForm.controls.rel_niveau.reset();
      this.releve_SearchForm.controls.rel_niveau.clearValidators();
      this.releve_SearchForm.controls.rel_niveau.updateValueAndValidity();

    }
    this.typeChoix = event.target.value.toString();
  }

  logo(logo) {
    return logo.split('/')[5];
  }

  BindCrosImage(iD, image){
    fetch(_HTTP_PHOTO+image)
      .then(function(data){
        return data.blob();
      })
      .then(function(img){
        let dd = URL.createObjectURL(img);

        if (iD !== 'photo_etudiant'){
          $('.'+iD).attr('src', dd);
        }else {
          $('#'+iD).attr('src', dd);
        }
      })
  }

  initForm() {
    this.releve_SearchForm = this.formBuilder.group({
      numEtudiant: new FormControl('', [Validators.required]),
      anneeScolaire: new FormControl(''),
      rel_niveau: new FormControl('', [Validators.required]),
      semestre: new FormControl('', [Validators.required]),

    });
  }
}
