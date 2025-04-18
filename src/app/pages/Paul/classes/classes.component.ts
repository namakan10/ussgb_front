import {Component, OnInit, ViewChild} from '@angular/core';
import {ClassesService} from "../../../services/classes.service";
import {StructureService} from "../../../services/structure.service";
import {MatTableDataSource} from "@angular/material/table";
import {Util_fonction} from "../../models/util_fonction";
import {_HTTP, PAG_SMALL_SIZE} from "../../../CONSTANTES";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Route, Router} from "@angular/router";
import * as XLSX from "xlsx";
declare var $: any;

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {

  user = JSON.parse(sessionStorage.getItem("user"));
  Groups;
  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'Libelle',
    'Nom',
    'niveau',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;
  ClassParamBody ={
    idStructure: null,
    annee: null,
    idOption: null,
    niveau: null
  }
  searchBody = {
    annee: null,
    idStructure: null,
    size: null,
    page: null,
  };
  classes: any;
  classspinner: boolean = false;
  annee_scolaire: any;
  niveau: any;
  anneeStructure: any;
  _http = _HTTP;
  constructor(private classeService: ClassesService,
              private structureService: StructureService,
              private router: Router,) { }

  ngOnInit() {


    // this.GetClasses();
    this.GetStructureAnnees();
  }

  
parseImage(img: string): string {
  if(!img) return;
  return img.includes("public.") ? "https://" + img : "http://" + img ;
}
  GetStructureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id).subscribe(
      (res) => {
        this.anneeStructure = res;
      },
      (error) => {
        // this.error = error;
        // this.spinner = false;
      });
  }

  GetClasses(){
    this.classspinner = true;
    this.ClassParamBody.annee = this.annee_scolaire;
    this.ClassParamBody.niveau = this.niveau;
    this.ClassParamBody.idStructure = this.user.structure.id;
    console.log(this.ClassParamBody);
    this.classeService.getClasses(this.ClassParamBody).subscribe(
      (res) => {

        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence2(PAG_SMALL_SIZE, res.totalElements);
        this.classspinner = false;
      },
      (error) => {
        console.log(error);
      });
  }

  classeEtudiants;
  classeEtudiantsTemp;
  loading: boolean = false;
  classeName = "";
  classeNameTemp = "";
  getEtudiants(element){
    this.loading = true;
    this.classeName =  element.libelle+" / "+element.niveau+" / "+element.anneeScolaire;
    this.classeNameTemp =  element.libelle+" / "+element.niveau+" / "+element.anneeScolaire;
    $('#ListClassEtudiantsModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#ListClassEtudiantsModal').appendTo('body');

    this.classeService.getClasseEtudiant(element.id).subscribe(classeEtudiantResp => {
      this.classeEtudiants = classeEtudiantResp[0];
      this.classeEtudiantsTemp = classeEtudiantResp[0];
      const gps = classeEtudiantResp[0].filter((fam, i, row) => row.findIndex(t => t.groupe.libelle === fam.groupe.libelle) === i);

      this.Groups = gps.map(g => { return g.groupe.libelle});
      this.loading = false;
    })
  }

  PrintPDF(){
    Util_fonction.Print("");
  }

  ExcelEntete : boolean = false;
  exportexcel() {
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Classes.xlsx');
 }

  filterGroup($event){
    const selected = $event.target.value;
    console.log("selected1 ", $event);
    console.log("selected ", selected);
    if (Util_fonction.checkIfNoTEmpty(selected)){
      const temp = this.classeEtudiantsTemp;
      this.classeEtudiants = temp.filter(f => f.groupe.libelle.toString() === selected.toString())
      this.classeName += " /groupe : "+selected;
    }else {
      const txt = this.classeNameTemp;
      this.classeName = txt;

    }
  }


}
