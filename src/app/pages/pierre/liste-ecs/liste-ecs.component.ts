import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {StructureService} from "../../../services/structure.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UesServiceService} from "../../../services/ues.service";
import Swal from 'sweetalert2';
import { DepartementService } from '../../../services/departement.service';
import {Util_fonction} from "../../../pages/models/util_fonction";
import {PAG_SMALL_SIZE, UNIV_FILIERE, UNIV_FILIERE_S, UNIV_OPTION, UNIV_OPTION_S} from "../../../CONSTANTES";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {PersonnelAdminService} from "../../../services/GestionPersonnelAdmin/personnel-admin.service";
declare var $: any;

@Component({
  selector: 'app-liste-ecs',
  templateUrl: './liste-ecs.component.html',
  styleUrls: ['./liste-ecs.component.css']
})
export class ListeEcsComponent implements OnInit {
  univ_opt=UNIV_OPTION_S;
  dataSource;
  displayedColumns: string[] = [
    'nomEC',
    'codeEC',
    'poid',
    'volumeHoraire',
    'chapitre',
    'ue',
  ];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;
  searchKey: string;
  _spinner: boolean = false;


user = JSON.parse(sessionStorage.getItem('user'));
  constructor(private structureService: StructureService,
              private route: ActivatedRoute,
              private router: Router,
              private personnelService: PersonnelAdminService,
              private uesService: UesServiceService,
              private optionService: OptionsService,
              private derService: DepartementService,
              private refChange: ChangeDetectorRef,
             ) { }
  ngOnInit(): void {
    this.getEcsByStructure(this.user.structure.id);
  }

  getEcsByStructure(id){
    this._spinner = true;
      this.uesService.GetEcs({id_structure: id}).subscribe(
        res => {
          const data: any = res;
           this.dataSource = new MatTableDataSource(data);
           this.dataSource.paginator = this.paginator;
           this.dataSource.sort = this.sort;
          this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
          this._spinner = false;
           this.refChange.detectChanges();
        }, error1 => {
        });
    }


  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

}
