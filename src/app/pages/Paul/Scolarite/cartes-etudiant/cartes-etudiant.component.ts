import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {StructureService} from "../../../../services/structure.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FraisScolariteService} from "../../../../services/GestionFrais/frais-scolarite.service";
import {Util_fonction} from "../../../models/util_fonction";
declare var $: any;

@Component({
  selector: 'app-cartes-etudiant',
  templateUrl: './cartes-etudiant.component.html',
  styleUrls: ['./cartes-etudiant.component.css']
})
export class CartesEtudiantComponent implements OnInit {
  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'numEtudiant',
    'numPayement',
    'date',
    'prenom',
    'nom',
    'statut',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  pageSize = 15;
  pageSizeOptions = [3, 5, 10, 25, 100];
  length = 100;

  StructureAnnees: any;
  user = JSON.parse(sessionStorage.getItem("user"));
  dateEnCours = JSON.parse(sessionStorage.getItem('dateEnCours'));
  toDay = new Date();

  FilterForm: FormGroup;
  searchBody = {
    anneeScolaire: null,
    numEtudiant: null
  }
  _spinner: boolean = false;
  showCarte: boolean = false;
  select: any;
  constructor(private structureService: StructureService,
              private formBuilder: FormBuilder, private scolariteService: FraisScolariteService) { }

  ngOnInit() {
    this.initFilterForm();
    this.GetStuctureAnnees();
  }

  GetStuctureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id)
      .subscribe(res => {
        this.StructureAnnees = res;
      })
  }

  /**
   * Liste des demande d'impression de cartes étudiants non traités
   * @constructor
   */
  GetList(){
    this.searchBody.anneeScolaire = this.FilterForm.controls.annee.value;
    this.searchBody.numEtudiant = this.FilterForm.controls.numEtudiant.value;
    this.scolariteService.GetDemandeCarteNonTraite(this.searchBody).subscribe(
      res =>{
        console.log(res);
        this.dataSource = new MatTableDataSource(res.content)
        this.dataSource.paginator = this.paginator;
      });
  }

  /**
   * IMPRIMER LA CARTE
   */
  GetCarte(element){
    this.scolariteService.GetEtudiantCarte(element.id).subscribe(
      res => {
        console.log(res);
        this.select = res;
        this.showCarte = true;

        $('#CarteEtudiantModal').modal({
          backdrop: 'static',
          keyboard: false
        });
        $('#CarteEtudiantModal').appendTo('body');
      }, error => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      }
    )
  }
  imprimerCarte(){
    this._spinner = true;
    Util_fonction.PrintCarteEtudiant();
    this._spinner = false;
  }
  logo(logo) {
    return logo.split('/')[5];
  }
  photo(photo) {
    return photo != null ? photo.split('/')[5] : '';
  }
  initFilterForm(){
    this.FilterForm = this.formBuilder.group({
      annee: new FormControl (null,Validators.required),
      numEtudiant: new FormControl (null)
    })
  }

}
