import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {StructureService} from "../../../services/structure.service";
import {ActivatedRoute, Router} from "@angular/router";

import {UesServiceService} from "../../../services/ues.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import Swal from 'sweetalert2';
import {Util_fonction} from "../../models/util_fonction";

export interface DialogDataForSepcialite {
  AllSpecialte: string;
  name: string;
}

@Component({
  selector: 'ngx-gestion-ues',
  templateUrl: './gestion-ues.component.html',
  styleUrls: ['./gestion-ues.component.scss']
})
export class GestionUesComponent implements OnInit {

  Ue: Object = {
    id: '',
    nomUe: '',
    codeUe: '',
    semestre: '',
    volumeHoraire: '',
    credit: '',
    chapitre: '',
    options:'',
    elementConstitutifs:'',
    departement:{
      id : this.route.snapshot.paramMap.get("id"),
      nom: this.route.snapshot.paramMap.get("nom"),
      contact: this.route.snapshot.paramMap.get("contact"),
      email: this.route.snapshot.paramMap.get("email"),
      type: this.route.snapshot.paramMap.get("type"),
    },
  };
  id = null;
  searchKey: string;

  dataSource;
  displayedColumns: string[] = [
    'nomUe',
    'codeUe',
    'semestre',
    'volumeHoraire',
    'credit',
    'chapitre',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

structure: any;

  constructor(private structureService: StructureService,

              private route: ActivatedRoute,
              private router: Router,
              private uesService: UesServiceService,
              // private utilsService: UtilsService,
             ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    sessionStorage.setItem('id_structure', id);

    this.getDepartementUes(id)
    this.getStructure(id);

  }


  /*handleSuccessfulResponse(res) {
    this.Ues = res;
    console.log(this.Ues);
  }*/
  getStructure(id) {
    this.structureService.getStucture(id).subscribe((data) => {
    this.structure = data;
    })
    }


    getDepartementUes(id){
      this.uesService.getDepartementUes(id).subscribe(
        res => {
          console.log(res);

           this.handleSuccessfulResponse(res);
           console.log(res);
        }, error1 => {
          console.log("***error**");
          console.log(error1);
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



  modifStructure(id: number) {
    this.router.navigate(['/pages', 'modifier_structure', id]);
  }

  supprimerStructure(id: number) {
    const r = confirm('Voulez-vous supprimer la structure ?');
    if (r) {
      this.structureService.deleteStructure(id).subscribe(
        response => {
          // this.utilsService.showToast("success", 'Succès','Suppression terminé',);
          this.router.navigate(['/pages', 'structure']);
        }, error => {
          // this.utilsService.showToast("danger", 'Erreur',
          //   error['error']['response']);
        },
      );
    } else {
      return false;
    }
  }

  afficheUes(id: number) {
    this.router.navigate(['/pages', 'structure',this.route.snapshot.paramMap.get("id") , 'filiere', 'Ue', id]);
  }
  addPersonnel(id: number) {
    this.router.navigate(['/pages', 'Ue', id, 'personnelAdministratifs']);
  }

  modifUes(id_Ue: number,id_structure: number) {
    this.router.navigate(['/pages','modifier_Ues',id_Ue,id_structure]);
  }
  //redirection vers le formulaire d'ajout a transformer plus tard en modal
  ajouterUes() {
    this.router.navigate(['/pages', 'departement',this.route.snapshot.paramMap.get("id"),'ajouter_ues']);
  }

  supprimerUe(id: number) {
    const r = confirm('Voulez-vous supprimer l ue ?');
    if (r) {
      this.uesService.deleteUes(id).subscribe(
        res => {
          Util_fonction.SuccessMessage(res);
          const id_structure = this.route.snapshot.paramMap.get("id");
          this.getDepartementUes(id_structure);
        }, error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        },
      );
    } else {
      return false;
    }
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


