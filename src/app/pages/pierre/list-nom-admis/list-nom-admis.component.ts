import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CandidatureService } from '../../../services/candidature.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
declare var $: any;
import * as XLSX from 'xlsx';
import {StructureService} from "../../../services/structure.service";
import {Util_fonction} from "../../models/util_fonction";

@Component({
  selector: 'app-list-nom-admis',
  templateUrl: './list-nom-admis.component.html',
  styleUrls: ['./list-nom-admis.component.css']
})
export class ListNomAdmisComponent implements OnInit {
  spinner1 = true;
  spinner = false;
  annee_scolaire;
  approbation;
  id_structure;
  error: any;
  message = null;
  type = 'false';

  FilterData ={
    annee_scolaire : null,
    admis : null,
    id_structure : null,
    niveau : null,
    page : 0,
    size : 500,
  }

  niveau: any;
  annee_scolaireF : any;
  anneeStructure : any;
  user : any;

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['numDossier', 'prenom', 'nom', 'telephone', 'genre', 'modeAdmission', 'typeCandidat', 'dateCandidature', 'codeOption'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(private route: ActivatedRoute,
              private structureService: StructureService,
              private candidatureService: CandidatureService) {
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.route.params.subscribe(param => {
      this.spinner1 = true;
      // tslint:disable-next-line:radix
      this.id_structure = parseInt(param['id_structure']);
      this.annee_scolaire = param['annee_scolaire'];
    });
  }

  ngOnInit() {
    this.GetStructureAnnee();
  }

  GetStructureAnnee(){
    this.structureService.getStuctureAnnees(this.user.structure.id).subscribe(
      (res) => {
        this.anneeStructure = res;
        this.spinner1 = false;
      });
  }

  chargePage() {
    this.spinner = true;
    this.FilterData.id_structure = this.user.structure.id;
    this.FilterData.admis = this.type;
    this.FilterData.annee_scolaire = this.annee_scolaire;
    this.FilterData.niveau = this.niveau;
    this.candidatureService.admisList(this.FilterData).subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner1 = false;
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
        this.spinner1 = false;
        this.spinner = false;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  acceptation(admis, id) {
    this.message = null;
    this.error = null;
    this.spinner = true;
    const data = {
      admis : admis
    };
    this.candidatureService.changeValidateToAdmis(id, data).subscribe(
      (res) => {
        this.message = res;
        this.chargePage();
        this.spinner = false;
      },
      (error) => {
        this.error = error;
        this.spinner = false;
      });
  }

  exportexcel() {
    /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.type === 'true' ? 'Admis' : 'Non admis' + '.xlsx');
 }

 exportpdf() {
   const data = document.getElementById('excel-table');
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
   pdf.save(this.type === 'true' ? 'Admis' : 'Non admis' + '.pdf'); // Generated PDF
   this.spinner = false;
   });
 }


}
