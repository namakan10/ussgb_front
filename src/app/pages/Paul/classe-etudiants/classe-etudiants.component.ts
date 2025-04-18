import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {PAG_SMALL_SIZE} from "../../../CONSTANTES";
import {ActivatedRoute, Router} from "@angular/router";
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";
import {Util_fonction} from "../../models/util_fonction";
import {ClassesService} from "../../../services/classes.service";

@Component({
  selector: 'app-classe-etudiants',
  templateUrl: './classe-etudiants.component.html',
  styleUrls: ['./classe-etudiants.component.css']
})
export class ClasseEtudiantsComponent implements OnInit {
  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'numEtudiant',
    'prenom',
    'nom',
    'nationalite',
    'telephone',
    'codeFiliere',
    'scolarite'
    // 'actions'
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
  Id_Classe: any;

  constructor(private routeActive: ActivatedRoute,
              private route: Router,
              private classeService: ClassesService,
              private etudiantsServices: EtudiantService) {
    this.Id_Classe = routeActive.snapshot.params.id;
  }

  ngOnInit() {
    this.GetClasseEtudiant();
    this.GetClasseById();
  }

  classeName = null;
  GetClasseById(){
    if (Util_fonction.checkIfNoTEmpty(this.Id_Classe)){
      this.classeService.getClasse(this.Id_Classe).subscribe(
        fetchResponse =>{
          this.classeName = fetchResponse.libelle;
        }
      );

  } else {
  Util_fonction.AlertMessage("warning", "Désolé, Aucune classe trouvée avec cet identifiant!");
}

}

  classspinner:boolean = false;
  GetClasseEtudiant(){
    if (Util_fonction.checkIfNoTEmpty(this.Id_Classe)){
      this.etudiantsServices.GetClasseEtudiants(this.Id_Classe).subscribe(
        res =>{
          console.log(res);
          this.dataSource = new MatTableDataSource(res[0]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.pageSizeOptions =  Util_fonction.paginatSequence2(PAG_SMALL_SIZE, res.totalElements);
          this.classspinner = false;
        }
      )
    } else {
      Util_fonction.AlertMessage("warning", "Désolé, Aucune classe trouvée avec cet identifiant!");
    }

  }

  BackToClasse(){
    this.route.navigate(["/Classes"]);
  }
}
