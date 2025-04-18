import {Component, OnInit, ViewChild} from '@angular/core';
import {StructureService} from "../../../services/structure.service";
import {ActivatedRoute, Router} from "@angular/router";
// import {UtilsService} from "../../../services/utils.service";
import {DepartementService} from "../../../services/departement.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import Swal from 'sweetalert2';
import {Util_fonction} from "../../models/util_fonction";

@Component({
  selector: 'ngx-single-structure',
  templateUrl: './single-structure.component.html',
  styleUrls: ['./single-structure.component.scss']
})
export class SingleStructureComponent implements OnInit {
  [x: string]: Object;
  departement: Object = {
    id: '',
    nom: '',
    type: '',
    contact: '',
  };

  searchKey: string;

  dataSource;
  displayedColumns: string[] = [
    'nom',
    'type',
    'email',
    'contact',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  departements: any;
  id_structure: any;
  user = JSON.parse(sessionStorage.getItem('user'));
  constructor(private structureService: StructureService,
              private route: ActivatedRoute,
              private router: Router,
              private departementService: DepartementService) { }

  ngOnInit(): void {
    this.id_structure  = this.user.structure.id;
    this.getDepartements();
    this.getStructure();
  }

  getStructure() {
    this.structureService.getStucture(this.id_structure).subscribe((data) => {
      this.structure= data;
    });
  }

  getDepartements() {
    this.departementService.getStructureDepartements(this.id_structure).subscribe(
      res => {

         this.handleSuccessfulResponse(res);
      }, error => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }


  handleSuccessfulResponse(response) {
    this.dataSource = this.handleSuccessfullyResponse(
      this.dataSource,
      response,
      this.displayedColumns,
      this.sort,
      this.paginator
    );
 }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }


  supprimerStructure(id: number) {
    const r = confirm('Voulez-vous supprimer la structure ?');
    if (r) {
      this.structureService.deleteStructure(id).subscribe(
        response => {
          this.router.navigate(['/pages', 'structure']);
        }, error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        },
      );
    } else {
      return false;
    }
  }

  afficheDepartement(id_departement: number) {
    this.router.navigate(['/structure/'+this.id_structure+'/departement/'+id_departement]);
  }
  afficheBatiment(id_batiment: number) {
    this.router.navigate(['/pages', 'batiment', id_batiment]);
  }
  addPersonnel(id: number) {
    this.router.navigate(['/pages', 'departement', id, 'personnelAdministratifs']);
  }

  modifDepartement(element) {
    this.router.navigate(['/structure','modifier_departement',element.id,this.user.structure.id]);
  }
  //redirection vers le formulaire d'ajout a transformer plus tard en modal
  ajouterDepartement() {
    this.router.navigate(['/structure/'+this.id_structure+'/ajouter_departement']);
  }

  Delete_Departement(element){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer le département '"+element.nom+"'",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.departementService.deleteDepartement(element.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
          this.getDepartements();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })

  }


  handleSuccessfullyResponse(dataSource: MatTableDataSource<any>, response, displayedColumns: string[], sort: MatSort,
    paginator: MatPaginator, customFilter = null) {
    dataSource = new MatTableDataSource(response);
    dataSource.sort = sort;
    dataSource.paginator = paginator;
    if (customFilter != null) {
        dataSource.filterPredicate =
      (data, filtersJson: string) => {
        const matchFilter = [];
        const filters = JSON.parse(filtersJson);

      filters.forEach(filter => {
        const val = data[filter.id] === null ? '' : data[filter.id];
        matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
      });
      return matchFilter.every(Boolean);
      };
    } else {
    dataSource.filterPredicate = (data, filter) => {
        const accumulator = (currentTerm, key) => {
        return this.nestedFilterCheck(currentTerm, data, key);
    };
        const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
        // Transform the filter by converting it to lowercase and removing whitespace.
        const transformedFilter = filter.trim().toLowerCase();
        return dataStr.indexOf(transformedFilter) !== -1;
    };
}
    return dataSource;
}

nestedFilterCheck(search, data, key) {
if (typeof data[key] === 'object') {
for (const k in data[key]) {
if (data[key][k] !== null) {
search = this.nestedFilterCheck(search, data[key], k);
}
}
} else {
search += data[key];
}
return search;
}

ngAfterViewInit(): void {
}

}
