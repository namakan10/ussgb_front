import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, throwToolbarMixedModesError } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CandidatureService } from '../../../services/candidature.service';
import Swal from 'sweetalert2';
import {StructureService} from "../../../services/structure.service";
import {Util_fonction} from "../../models/util_fonction";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import * as XLSX from 'xlsx';
declare var $: any;



@Component({
  selector: 'app-candidature-a-traiter',
  templateUrl: './candidature-a-traiter.component.html',
  styleUrls: ['./candidature-a-traiter.component.css']
})
export class CandidatureATraiterComponent implements OnInit {

  spinner1 = false;
  spinner = false;
  changeMode = false;
  annee_scolaire;
  id_structure;
  id;
  data2: any = {};
  error: any;
  message = null;
  data: any = [];

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

  user : any;
  anneeStructure : any;
  mode : any;
  cur_option : any;
  showData : boolean = false;
  FileArray : any[] =  [];
  UrlPhoto = null;

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['numDossier', 'prenom', 'telephone', 'dateDeNaissance', 'typeCandidat', 'dateCandidature', 'codeOption', 'action'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private route: ActivatedRoute,
              private structureService: StructureService,
              private optionService: OptionsService,
              private candidatureService: CandidatureService) {
    this.route.params.subscribe(param => {
      // tslint:disable-next-line:radix
      this.id_structure = parseInt(param['id_structure']);
      this.annee_scolaire = param['annee_scolaire'];
    });
   }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.StructureAnnees();
    this.GetOption();
  }

  StructureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id).subscribe(
      (res) => {
        this.anneeStructure = res;
      });
  }
  exportexcel() {
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Candidature-a-traiter.xlsx');
 }

  GetOption(){
    this.optionService.getStructureOptions(this.user.structure.id).subscribe(
      res => {
        this.cur_option = res;
      }
    )

    return true;

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  validation(approbation, id) {
    this.message = null;
    this.error = null;
    this.id = id;
    this.data2 = {
      admis : false,
      approbation : approbation,
      commentaire : 'OK',
      modeAdmission : this.mode
    };
    if (!approbation) {
      this.data2.commentaire = '';
      $('#staticBackdrop2').modal('show');
      $('#staticBackdrop2').appendTo('body');
    } else {
      this.changeValidation(id, this.data2);
    }
  }

  Document(data) {
    this.data = null;
    this.UrlPhoto = null;
    this.FileArray = [];
    this.data = data;
    this.mode = data.modeAdmission;

    let i =0;
    for (i = 0; i < Object.keys(data.fichiers).length; i++){
      if (Object.keys(data.fichiers)[i].includes("Photo")){
        // console.log("Object.values(data.fichiers)[i] ", Object.values(data.fichiers)[i]);
        this.UrlPhoto = Object.values(data.fichiers)[i];
      }
      this.FileArray.push({nom: Object.keys(data.fichiers)[i], url: Object.values(data.fichiers)[i]});
    }


    this.showData = true;
    console.log(this.data);
    $('#staticBackdrop').modal('show');
    $('#staticBackdrop').appendTo('body');
  }

  getKey(dat){
    return Object.keys(dat);
  }

  changeValidation(id, data) {
    this.spinner = true;
    console.log(data);
    this.candidatureService.changeValidate(id, data).subscribe(
      (res) => {
        $('#staticBackdrop').modal('hide');
        $('#staticBackdrop2').modal('hide');
        Util_fonction.SuccessMessage(res);
        this.chargePage();
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
        this.spinner = false;
      });
  }

  chargePage() {

    this.FilterData.id_structure = this.user.structure.id;
    this.FilterData.annee_scolaire = this.annee_scolaireF;
    this.FilterData.niveau = this.niveau;
    this.FilterData.nom = this.nom;
    this.FilterData.prenom = this.prenom;
    this.FilterData.telephone = this.telephone;
    this.FilterData.dateCandidature = this.dateCandidature;

    this.candidatureService.getCandidatureATraiter(this.FilterData).subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      });
  }

}
