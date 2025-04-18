import { Component, LOCALE_ID, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location, registerLocaleData} from "@angular/common";
import localeDe from '@angular/common/locales/fr';
import {UNIV_MINISTERE, UNIV_NAME, UNIV_OPTION, UNIV_SIGLE} from "../../../CONSTANTES";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";
import {Util_fonction} from "../../models/util_fonction";
import {StructureService} from "../../../services/structure.service";
import jsPDF from "jspdf";
import {environment} from "../../../../environments/environment";

registerLocaleData(localeDe);
@Component({
  selector: 'app-multiple-attestations',
  templateUrl: './multiple-attestations.component.html',
  styleUrls: ['./multiple-attestations.component.css'],
  providers: [{provide: LOCALE_ID, useValue: 'fr'}]
})
export class MultipleAttestationsComponent implements OnInit {
  univ_Minist = UNIV_MINISTERE;
  univ = UNIV_SIGLE;
  univ_name = UNIV_NAME;
  univ_opt = UNIV_OPTION;
  _http = environment._HTTP;
  _asset_image = environment._ASSET_IMAGE;

  recteur;
  directeur;
  Delivrance;
  entete = 'Vu les textes en vigueur relatifs à l\'accès et aux regimes des études et des examens académiques à l\'Université des Sciences, des Techniques et des Technologies de Bamako';

  user = JSON.parse(sessionStorage.getItem("user"));
  _RECTORAT: boolean =  this.user.structure.type === 'RECTORAT';
  structureId = this.user.structure.id;
  param;
  constructor(
    private etudiantService: EtudiantService,
    private structureService: StructureService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.route
      .queryParams
      .subscribe(params => {
        console.log(params);
        this.param = params['param'];
      });
  }

  AttestationDATA = [];
  Today: Date;
  Structures;
  structure;
  retoratStructure;
  ngOnInit() {
    if (this._RECTORAT){
      this.retoratStructure = JSON.parse(sessionStorage.getItem("retoratStructure"));
    }
    // else {
      this.getStructureAnnee();
    // }
    // console.log("this.location.getState()",this.location.getState());
    this.Today = new Date();
  }
  structureAnnees;
  structureName= "";
  getStructureAnnee(){
    this.structureService.getStuctureAnnees(this.structureId).subscribe(getRes => {
      this.structureAnnees = getRes;
      this.spinner = false;
    }, error1 => {
      this.spinner = false;
      Util_fonction.AlertMessage(error1.error.status, error1.error.message);
      console.log(error1);
    });
  }

  GetAllStructures(){
    this.spinnerS = true;
    this.structureService.getStuctures().subscribe(
      (res) => {
        this.Structures = res.filter(s => s.type !== "RECTORAT");
        this.spinnerS = false;
      });
  }
  structureChange(event){
    this.spinner = true;
    this.structureId = this.structure;
    const struct = this.Structures.find(s => +s.id === +this.structure);

    this.structureName = struct.sigle;

    this.AttestationDATA = [];
    this.anneeScolaire = null;
    this.numEtudiant = null;
    this.getStructureAnnee();
  }

  spinner: boolean = false;
  spinnerS: boolean = false;
  spinnerA: boolean = false;
  show: boolean = false;
  exportpdf() {
    this.spinner = true;
    const data = document.getElementById('export-part');
    html2canvas(data, { useCORS: true}).then(canvas => {
      // Few necessary setting options
      //normal
      const imgWidth = 208;
      const pageHeight = 295;
      //paysage
      // const imgWidth = 295;
      // const pageHeight = 208;

      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/jpeg');
      let pdf = new jspdf("l","mm",[210, 297]); // A4 size page of PDF
      //'landscape', 'mm', 'a4'
      const position = 15;
      pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
      pdf.save('LISTE_DE_PASSAGE.pdf'); // Generated PDF
      this.spinner = false;
    });
  }

  multiplePDF_0(){
    this.spinner = true;
    const data = document.getElementById('export-part');
    html2canvas(data, { useCORS: true}).then((canvas:any) => {
      console.log("canvas data", canvas);
      //Port
      // const imgWidth = 208;
      // const pageHeight = 297;

      //Land
      const imgWidth = 297;//295
      const pageHeight = 210;//204.9215686275;//210;//208
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0 ;//0 | 15
      heightLeft -= pageHeight;

      const contentDataURL = canvas.toDataURL('image/jpeg');
      // "l","mm",[210, 297]
      const doc = new jspdf("l","mm",[210, 297]);
      doc.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      const parm = this.param === "diplo" ? "DIPLOME" : "ATTESTATION";
      const fileName = parm+""+this.structureName+"_"+this.anneeScolaire+"_"+this.numEtudiant;
      doc.save(fileName);
    });
    
    this.spinner = false;
  }

  multiplePDF(){
    this.spinner = true;
    const data = document.getElementById('export-part');
    html2canvas(data, { useCORS: true}).then(canvas => {
      let doc = new jsPDF('l', 'mm', 'a4');

      let imgData = canvas.toDataURL('image/png');
      let pageHeight = 210; //doc.internal.pageSize.getHeight();
      let pageWidth = doc.internal.pageSize.getWidth();
      const imgWidth = 295;
      let imgheight =  Math.ceil((canvas.height * imgWidth) / canvas.width);
      // let imgheight = $('export-part').height() * 25.4 / 96; //px to mm
      let pagecount = Math.ceil(imgheight / pageHeight);

      console.log("canvas.height -->", canvas.height);
      console.log("canvas.width -->", canvas.width);
      console.log("===================== -->", pageHeight);
      console.log("pageHeight -->", pageHeight);
      console.log("pageWidth -->", pageWidth);
      console.log("imgheight -->", imgheight);
      console.log("pagecount -->", pagecount);
      /* add initial page */
      // doc.addPage();
      // doc.addImage(imgData, 'PNG', 2, 0, pageWidth - 4, 0);

      /* add extra pages if the div size is larger than a a4 size */
      if (pagecount > 0) {
        let j = 1;
        while (j <= pagecount) {
          // console.log("-(j * pageHeight) ---->", -Math.ceil(j * pageHeight));
          console.log("-(j * pageHeight) ---->", -(j * pageHeight));
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, (-j * 210), imgWidth , imgheight);
          j++;
        }
      }

      const parm = this.param === "diplo" ? "DIPLOME" : "ATTESTATION";
      const fileName = parm+""+this.structureName+"_"+this.anneeScolaire+"_"+this.numEtudiant;
      doc.save(fileName);
    });
    this.spinner = false;
  }

  anneeScolaire;
  getEtudiantBody = {
    anneeScolaire: null,
    id_structure: null,
    id_classe: null,
    id_filiere: null,
    id_groupe: null,
    id_option: null,
    niveau: null,
    nom: null,
    prenom: null,
    telephone: null,
    numEtudiant: null,
    statut: null,
    size: null,
    page: null,
  };
  EtudiantsTemp;
  EtudiantsLot = [];
  lotLength;
  currentLot = 1;
  numEtudiant;
  GetEtudiantsAdmis() {
    this.spinnerA = true;
    this.show = true;
    this.AttestationDATA = [];
    let arr = [];
    this.EtudiantsTemp = [];
    this.EtudiantsLot = [];
    this.getEtudiantBody.id_structure = this.user.structure.id;
    this.getEtudiantBody.anneeScolaire = this.anneeScolaire;
    this.getEtudiantBody.numEtudiant = this.numEtudiant;
    this.getEtudiantBody.statut = 'ADMIS_CREDIT_L3';
    this.etudiantService.getEtudiant_s(this.getEtudiantBody).subscribe(allEtudiants => {

      let  i = 1;


      this.EtudiantsTemp = allEtudiants.content;
      this.AttestationDATA = [];
      this.EtudiantsTemp.forEach(etudiant => {
        if (i <= 15 ){
          arr.push({
            nom: etudiant.nom,
            prenom: etudiant.prenom,
            numEtudiant: etudiant.numEtudiant,
            lieuDeNaissance: etudiant.user.lieuDeNaissance, //this.Today,//*
            dateDeNaissance: etudiant.user.dateDeNaissance,
            filiereNom: etudiant.filiere.nom,//*
            filiereCode:etudiant.filiere.codeFiliere,//*
            optionNom: etudiant.option.nom, //*,
            optionCode: etudiant.option.codeOption,
            anneeScolaire: etudiant.anneeScolaire,
            niveau: etudiant.niveau

          })
        }else {
          //51
          console.log("arr", arr);
          this.EtudiantsLot.push(arr);
          arr = [];
          arr.push({
            nom: etudiant.nom,
            prenom: etudiant.prenom,
            numEtudiant: etudiant.numEtudiant,
            lieuDeNaissance: etudiant.user.lieuDeNaissance, //this.Today,//*
            dateDeNaissance: etudiant.user.dateDeNaissance, //this.Today,//*
            filiereNom: etudiant.filiere.nom,//*
            filiereCode: etudiant.filiere.codeFiliere,//*
            optionNom: etudiant.option.nom, //*,
            optionCode: etudiant.option.codeOption,
            anneeScolaire: etudiant.anneeScolaire,
            niveau: etudiant.niveau
            // CodeQR: this.GenerateCode(etudiant),
          });
          i = 0;
        }

        i++;
      });
      this.EtudiantsLot.push(arr);
      this.lotLength = this.EtudiantsLot.length;
      let epuration = this.EtudiantsLot.filter(et => et.length >0);

      this.AttestationDATA = epuration[0];
      this.spinnerA = false;

      console.log("this.AttestationDATA ====", this.AttestationDATA);
      if (!this.checkIfNotNull(this.AttestationDATA) || this.AttestationDATA.length <=0){
        Util_fonction.AlertMessage("info", "Aucun résultat");
      }
      console.log("this.EtudiantsLot ====", this.EtudiantsLot);
    });
  }

  QrBody = {
    numEtudiant: null,
    typeDocument: "ATTESTATION_REUSSITE",
    anneeObtentionDiplome: null,
  }
  test(element){
    let varr = this.GenerateCode(element);
    console.log("var ->",varr);
  }
  CodeQR;
  GenerateCode(etudiant){
    // CodeQR.qrCode
    this.QrBody.numEtudiant = etudiant.numEtudiant;
    this.QrBody.anneeObtentionDiplome = etudiant.anneeScolaire;
    return this.etudiantService.GeneratQRcode(this.QrBody).subscribe(res => {
      return res;
    }, error => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    });
  }

  next(){
    if (this.currentLot < this.lotLength){
      this.currentLot +=1;
      this.AttestationDATA = this.EtudiantsLot[this.currentLot -1]
    }
  }
  precent(){
    if (this.currentLot > 1){
    this.currentLot -=1;
      this.AttestationDATA = this.EtudiantsLot[this.currentLot -1]

    }
  }



  checkIfNotNull(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }
  level(element){
    return element.includes("L") ? "Diplôme de Licence" : "Diplôme de master";
  }
}
