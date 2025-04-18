import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {Affectation} from "../affectation.model";
import {FilesService} from "../../../../services/files.service";
import {AffectationService} from "../../../../services/affectation-service.service";
import {Util_fonction} from "../../../models/util_fonction";
import {PAG_SMALL_SIZE} from "../../../../CONSTANTES";


@Component({
  selector: 'app-gdepartements',
  templateUrl: './gdepartements.component.html',
  styleUrls: ['./gdepartements.component.css']
})
export class GdepartementsComponent implements OnInit {


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  spinner = false;
  error = null;
  message = null;

  selectedFile: File

  affectations: any[];
  departements: any[];

  user: any;

  structureId: number;
  displayedColumns: string[] = ['id', 'date','personnel','fonction','departement','service','division','action'];
  dataSource;

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;



  constructor(private service: AffectationService, private fb: FormBuilder,
              private route: ActivatedRoute,
              private filesService: FilesService,
              private router: Router,) {
    this.structureId = +this.route.snapshot.paramMap.get("id");

    this.user = JSON.parse(sessionStorage.getItem('user')).users;
    this.initData(this.structureId);
  }


  ngOnInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  initData(id:number){
    this.initDepartements(id);
  }


  initDepartements(id:number){
    this.spinner = true;
    this.service.getDepartementByStructure(id)
      .subscribe(
        (data:any)=>{
          this.departements = data;
          this.spinner = false;
        },error => {
          this.spinner = false;
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      );
  }


  onDepartement(value: any) {
    this.initAffectations(value.id);
  }

  initAffectations(id:number){
    this.spinner = true;
    this.service.getAffectationByDepartementId(id)
      .subscribe(
        (data:any)=>{
          this.affectations = data;
          this.dataSource = new MatTableDataSource(this.affectations.reverse());
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
          this.spinner = false;
        },error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        }
      );
  }


}


