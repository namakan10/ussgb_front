import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FraisInscriptionService} from "../../../services/GestionFrais/frais-inscription.service"
// import {UtilsService} from "../../../services/utils.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'ngx-frais-inscription',
  templateUrl: './frais-inscription.component.html',
  styleUrls: ['./frais-inscription.component.scss']
})
export class FraisInscriptionComponent implements OnInit {

  searchKey: string;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'type',
    'frais',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private fraisInscriptionService: FraisInscriptionService,
              // private  utilsService: UtilsService
              ) { }

  ngOnInit(): void {
    this.getFrais();
  }

  ajouterFrais() {
    this.router.navigate(['pages','ajouter_frais_inscription',]);
  }

  modifierFrais(id: number) {
    this.router.navigate(['pages','modifier_frais_inscription',id]);
  }
  supprimerFrais(id: number) {
    const r = confirm('Voulez-vous supprimer ce frais ?');
    if (r) {
      this.fraisInscriptionService.deleteFrais(id).subscribe(
        response => {
          // this.utilsService.showToast("success", 'Suppression terminé',
          //   response['response']);
          this.fraisInscriptionService.getFraisInscriptions().subscribe(
            // res => this.handleSuccessfulResponse(res)
          )
        }, error => {
          // this.utilsService.showToast("danger", 'Erreur de suppression',
          //   error['error']['response']);
        },
      );
    } else {
      return false;
    }
  }

  getFrais() {
    this.fraisInscriptionService.getFraisInscriptions().subscribe(
      // res => this.handleSuccessfulResponse(res)
    );
  }


  // handleSuccessfulResponse(response) {
  //   this.dataSource = this.utilsService.handleSuccessfullyResponse(
  //     this.dataSource,
  //     response,
  //     this.displayedColumns,
  //     this.sort,
  //     this.paginator
  //   );
  // }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

}
