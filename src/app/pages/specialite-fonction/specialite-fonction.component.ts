import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {StructureService} from "../../services/structure.service";
import {ActivatedRoute, Router} from "@angular/router";
// import {UtilsService} from "../../services/utils.service";
import {DepartementService} from "../../services/departement.service";
import {SpecialiteFonctionService} from "../../services/specialite-fonction.service";
import {Util_fonction} from "../models/util_fonction";

@Component({
  selector: 'ngx-specialite-fonction',
  templateUrl: './specialite-fonction.component.html',
  styleUrls: ['./specialite-fonction.component.scss']
})
export class SpecialiteFonctionComponent implements OnInit {
  structure: Object = {
    id: '',
    nom: '',
    type: '',
    logo: '',
  };
  searchKey: string;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'nom',
    'type',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private specialiteFoctionService: SpecialiteFonctionService,
              private structureService: StructureService,
              private route: ActivatedRoute,
              private router: Router,
              ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.getSpecialiteFoctions(id);
    this.getStructure(id);
  }

  getStructure(id) {
    this.structureService.getStucture(id).subscribe((data) => {
      this.structure= data;
    })
  }

  getSpecialiteFoctions(id) {
    this.specialiteFoctionService.getSpecialiteFoctions(id).subscribe(
      // res => this.handleSuccessfulResponse(res)
    );
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }


  modifSpecialiteFoction(id_specialite_fonction: number,id_structure: number) {
    this.router.navigate(['/pages','modifier_departement',id_specialite_fonction,id_structure]);
  }
  //redirection vers le formulaire d'ajout a transformer plus tard en modal
  ajouterSpecialiteFoction() {
    this.router.navigate(['/pages', 'structure',this.route.snapshot.paramMap.get("id"),'ajouter_specialite_fonction']);
  }

  supprimerSpecialiteFoction(id: number) {
    const r = confirm('Voulez-vous supprimer la structure ?');
    if (r) {
      this.specialiteFoctionService.deleteSpecialiteFoction(id).subscribe(
        response => {
          Util_fonction.SuccessMessage(response);
          const id_structure = this.route.snapshot.paramMap.get("id");
          this.getSpecialiteFoctions(id_structure);
        }, error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        },
      );
    } else {
      return false;
    }
  }

}
