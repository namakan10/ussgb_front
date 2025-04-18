import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CandidatureService } from '../../../services/candidature.service';
import {StructureService} from "../../../services/structure.service";
import {Util_fonction} from "../../models/util_fonction";
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-dossier-traiter',
  templateUrl: './dossier-traiter.component.html',
  styleUrls: ['./dossier-traiter.component.css']
})
export class DossierTraiterComponent implements OnInit {
  spinner1 = false;
  spinner = false;
  annee_scolaire;
  approbation;
  id_structure;
  error: any;
  message = null;

  FilterData ={
    nom: null,
    prenom: null,
    telephone: null,
    annee_scolaire : null,
    admis : null,
    approbation : null,
    dateCandidature : null,
    id_structure : null,
    niveau : null,
    numDossier : null,
    page : 0,
    size : 500,
  }

  nom : any;
  prenom: any;
  telephone: any;
  niveau: any;
  dateCandidature: any;
  annee_scolaireF : any;

  anneeStructure : any;
  user : any;
  _spinner1 : boolean = false;

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['numDossier', 'prenom', 'telephone', 'genre', 'modeAdmission', 'typeCandidat', 'dateCandidature', 'codeOption', 'action'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(private route: ActivatedRoute,
              private structureService: StructureService,
              private candidatureService: CandidatureService) {
    this.route.params.subscribe(param => {
      // tslint:disable-next-line:radix
      this.id_structure = parseInt(param['id_structure']);
      this.annee_scolaire = param['annee_scolaire'];
      this.approbation = param['approbation'];
      console.log(this.approbation);
      this.dataSource = [];
    });
  }

  ngOnInit() {
    this.checkApprobationStat();
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.StructureAnnees();
  }

  checkApprobationStat(){
    if (!this.approbation){

    }
  }

  StructureAnnees(){
    this._spinner1 = true;
    this.structureService.getStuctureAnnees(this.user.structure.id).subscribe(
      (res) => {
        this.anneeStructure = res;
        this._spinner1 = false;
      });
  }

  chargePage() {
    this.spinner = true;
    this.FilterData.id_structure = this.user.structure.id;
    this.FilterData.annee_scolaire = this.annee_scolaireF;
    this.FilterData.niveau = this.niveau;
    this.FilterData.nom = this.nom;
    this.FilterData.prenom = this.prenom;
    this.FilterData.telephone = this.telephone;
    this.FilterData.dateCandidature = this.dateCandidature;
    this.FilterData.approbation = this.approbation;

    this.candidatureService.dossiersTraiter(this.FilterData).subscribe(
      (res) => {
        this.spinner = false;
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      (error) => {
        this.spinner = false;
        this.error = error;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  acceptation(admis, element) {
    console.log(element);
    this.message = null;
    this.error = null;
    this.spinner = true;
    const data = {
      admis : admis,
      approbation : true,
      commentaire : 'OK',
      modeAdmission : element.modeAdmission
    };
    this.candidatureService.changeValidateToAdmis(element.idCandidature, data).subscribe(
      (res) => {
        Util_fonction.SuccessMessage(res);
        this.chargePage();
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
        this.spinner = false;
      });
  }

  checkIfIsnull(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }
  ExcelEntete: boolean = true;

  exportexcel() {
    this.ExcelEntete = false;
    /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const filename = "Liste des candidatures acceptées "+this.annee_scolaireF+"_"+this.niveau;
    /* save to file */
    XLSX.writeFile(wb, filename+'.xlsx');
    this.ExcelEntete = true;
  }

}
