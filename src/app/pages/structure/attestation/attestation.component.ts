import { Component, OnInit } from '@angular/core';
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StructureService} from "../../../services/structure.service";
import {NotesService} from "../../../services/GestionEtudiants/notes.service";
import Swal from "sweetalert2";
import {Util_fonction} from "../../models/util_fonction";
import {UNIV_FILIERE, UNIV_FILIERE_CODE, UNIV_MINISTERE, UNIV_NAME, UNIV_OPTION, UNIV_SIGLE} from "../../../CONSTANTES";
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";

@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css']
})
export class AttestationComponent implements OnInit {
  univ_Minist = UNIV_MINISTERE;
  univ = UNIV_SIGLE;
  univ_name = UNIV_NAME;
  univ_opt = UNIV_OPTION;


  getBody = {
    "numEtudiant" : null,
    "semestre" : "1", // int
    "anneeScolaire" : null
  }

  user: any;
  StructueID: any;
  StructureCurrentAnnee: any;
  releve_SearchForm: FormGroup;
  Annees: any[];
  export_spinner: boolean = false;
  ReleveData: any;
  Today: Date;
  doc_generated: boolean = false;
  notFind = false;
  search_spinner = false
  numEtudiant;
  CodeQR : any;
  QrBody = {
    numEtudiant: null,
    typeDocument: "ATTESTATION_REUSSITE",
    anneeObtentionDiplome: null,
    // semestre: null,
  }

  constructor(private formBuilder: FormBuilder, private structureService: StructureService,
              private noteService: NotesService, private etudiantService: EtudiantService) { }

  ngOnInit() {
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
      console.log(this.StructureCurrentAnnee);
      this.genereAnneeList();

    })
  }

  genereAnneeList() {
    const Annees = [];
    Annees.push(this.StructureCurrentAnnee);
    const endAnnee2 = this.StructureCurrentAnnee.substr(0,4); //new Date().getFullYear();
    let endAnnee: number = +this.StructureCurrentAnnee; //new Date().getFullYear();
    console.log("======>");
    console.log(endAnnee2);

    endAnnee = endAnnee - 1;
    for (let i = endAnnee2; i > 2010; i--) {
      let an = (i-1)+" - "+i ;
      Annees.push(an);
    }
    this.Annees = Annees;
    console.log(Annees);
  }

  releve_SearchForm_Submit() {
    this.getBody.anneeScolaire = this.releve_SearchForm.controls.anneeScolaire.value;
    // this.getBody.semestre = this.releve_SearchForm.controls.semestre.value;
    this.QrBody.anneeObtentionDiplome = this.releve_SearchForm.controls.anneeScolaire.value;
    this.getBody.numEtudiant = this.releve_SearchForm.controls.numEtudiant.value;
    this.QrBody.numEtudiant = this.releve_SearchForm.controls.numEtudiant.value;

    this.GetEtudiantNote();
  }

  GetEtudiantNote() {
    this.noteService.getEtudiantNotes(this.getBody).subscribe(NoteFetResponse => {
      this.ReleveData = NoteFetResponse;
      console.log(NoteFetResponse);
      this.search_spinner = false;
      if (Object.keys(this.ReleveData).length > 0){
        this.notFind = false;
      } else {
        this.notFind = true;
      }

      this.etudiantService.GeneratQRcode(this.QrBody).subscribe(res => {
        console.log(res);
        this.CodeQR = res;
        this.doc_generated = true;

      }, error => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      })

    }, error => {

      this.search_spinner = false;
      this.doc_generated = false;
      // this.ReleveData = RELEVETEST;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }

  exportpdf() {
    this.export_spinner = true;
    const data = document.getElementById('export-doc');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 280;
      const pageHeight = 100;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;
      console.log(imgHeight);

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('landscape', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 10, position, imgWidth, 200);
      pdf.save('Attestation_'+this.numEtudiant+'_.pdf'); // Generated PDF
      this.export_spinner = false;
    });
  }

  initForm() {
    this.releve_SearchForm = this.formBuilder.group({
      numEtudiant: new FormControl('', [Validators.required]),
      anneeScolaire: new FormControl('', [Validators.required]),
      // semestre: new FormControl('', [Validators.required]),

    });
  }


}
