import { Component, OnInit } from '@angular/core';
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StructureService} from "../../../services/structure.service";
import {NotesService} from "../../../services/GestionEtudiants/notes.service";
import {Util_fonction} from "../../models/util_fonction";
import {UNIV_FILIERE, UNIV_FILIERE_CODE, UNIV_NAME, UNIV_SIGLE} from "../../../CONSTANTES";
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";

@Component({
  selector: 'app-certificat-frequentation',
  templateUrl: './certificat-frequentation.component.html',
  styleUrls: ['./certificat-frequentation.component.css']
})
export class CertificatFrequentationComponent implements OnInit {
  univ_sigle = UNIV_SIGLE;
  univ_name = UNIV_NAME;

  getBody = {
    "numEtudiant" : null,
    "semestre" : null, // int
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
  search_spinner: boolean = false;
  numEtudiant;
  notFind: boolean = false;
  CodeQR : any;
  QrBody = {
    numEtudiant: null,
    typeDocument: "CERTIFICAT_FREQUENTATION",
    anneeObtentionDiplome: null,
    semestre: null,
  }

  constructor(private formBuilder: FormBuilder, private structureService: StructureService,private noteService: NotesService,
              private etudiantService: EtudiantService) { }

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
    this.getBody.anneeScolaire = this.releve_SearchForm.controls.anneeScolaire.value;
    this.QrBody.anneeObtentionDiplome = this.releve_SearchForm.controls.anneeScolaire.value;
    this.getBody.semestre = this.releve_SearchForm.controls.semestre.value;
    this.getBody.numEtudiant = this.releve_SearchForm.controls.numEtudiant.value;
    this.QrBody.numEtudiant = this.releve_SearchForm.controls.numEtudiant.value;

    this.GetEtudiantNote();
  }

  GetEtudiantNote() {
    this.noteService.getEtudiantReleveNotes(this.getBody).subscribe(NoteFetResponse => {
      this.ReleveData = NoteFetResponse;
      this.search_spinner = false;
      if (Object.keys(this.ReleveData).length > 0){
        this.notFind = false;
      } else {
        this.notFind = true;
      }
      this.etudiantService.GeneratQRcode(this.QrBody).subscribe(res => {
        this.CodeQR = res;
        this.doc_generated = true;

      }, error => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      })

    }, error => {
      this.search_spinner = false;
      this.doc_generated = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }

  exportpdf() {
    this.export_spinner = true;
    const data = document.getElementById('export-doc');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 15;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('certificat_Frequentation_'+this.numEtudiant+'.pdf'); // Generated PDF
      this.export_spinner = false;
    });
  }

  initForm() {
    this.releve_SearchForm = this.formBuilder.group({
      numEtudiant: new FormControl('', [Validators.required]),
      anneeScolaire: new FormControl('', [Validators.required]),
      semestre: new FormControl('', [Validators.required]),

    });
  }

}
