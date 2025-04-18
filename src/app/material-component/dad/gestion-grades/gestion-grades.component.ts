import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {StructureService} from "../../../services/structure.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UesServiceService} from "../../../services/ues.service";
import Swal from 'sweetalert2';
import { PersonnelAdminService } from '../../../services/GestionPersonnelAdmin/personnel-admin.service';
import { FormBuilder } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-gestion-grades',
  templateUrl: './gestion-grades.component.html',
  styleUrls: ['./gestion-grades.component.css']
})
export class GestionGradesComponent implements OnInit {

  dataSource;
  //ecSource:any;
  searchKey: string;
  id = null;
  displayedColumns: string[] = [
    'Grade',
    'HeureSemaine',
    'tauxHoraire',
    'anneeDebut',
    'anneeFin',
    'statut',
    'Actions'
  ];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  structure: any;
  user:any;
  error: any;
  action:any;
  derData:any;
  nomGrade;
  HeureSemaine;
  tauxHoraire;
  anneeDebut;
  anneeFin;
  statut;
  message = null;
  isloading=true;
  spinner=false;
  type;
  idGrade:number

  constructor(private formBuilder: FormBuilder,
    private uesService: UesServiceService,
    private PersonnelService: PersonnelAdminService,) { }

  ngOnInit() {

    this.user = JSON.parse(sessionStorage.getItem('user'));
    const id =  this.user.structure.id;
    this.getGrades();
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

  getGrades(){
    this.PersonnelService.getGrades().subscribe(
      res => {
         this.handleSuccessfulResponse(res['content']);
      }, error1 => {
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
    this.isloading=false;
  }

 showModal() {

  //  this.inti();
    this.action = 'Ajouter un nouveau grade';
    this.type="Ajouter"
    $('#staticBackdrop').modal('show');
    $('#staticBackdrop').appendTo('body');
  }


  onSubmitGrade() {
    this.spinner = true;
    const data = {
      grade: this.nomGrade,
      heureSemaine: this.HeureSemaine,
      tauxHoraire: this.tauxHoraire,
      anneeDebut: this.anneeDebut,
      anneeFin: this.anneeFin,
      statut: this.statut,
    };
    this.PersonnelService.AjouterGrade(data).subscribe(
      (data) => {
        $('#staticBackdrop').modal('hide');
        this.spinner = false;
         Swal.fire({
            title: JSON.parse(data),
            icon: "success",
          });
          this.ngOnInit()
      },
      (error) => {
        this.spinner = false;
         // get the status as error.status
         Swal.fire({
          title: error.error !='' ? JSON.parse(error.error):'Erreur de serveur',
          icon: "error",
        });
      })
  }


  detailsGrade(grade) {
    this.type="Modifier"
    this.action = 'Modifier les paramètres du grade '+grade.grade;
    this.nomGrade = grade.grade;
    this.HeureSemaine = grade.heureSemaine;
    this.tauxHoraire = grade.tauxHoraire;
    this.anneeDebut = grade.anneeDebut;
    this.anneeFin = grade.anneeFin;
    this.statut = grade.statut;
    this.idGrade=grade.id

//this.derData.find(e => e.id === uE.departement.id).id;

    $('#staticBackdrop').modal('show');
    $('#staticBackdrop').appendTo('body');
  }
  editGrade(grades) {
    this.detailsGrade(grades)
  }
  deleteGrade(id: number) {
    this.spinner = true;
  Swal.fire({
    icon: 'info',
    title: 'Voulez-vous confirmer la suppression ?',
    showCancelButton: true,
    confirmButtonText: `Supprimer`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
       this.PersonnelService.deleteGrade(id).subscribe(
        (data) => {
          $('#staticBackdrop').modal('hide');
          this.spinner = false;
           Swal.fire({
              title: JSON.parse(data),
              icon: "success",
            });
            this.ngOnInit()
        },
        (error) => {
          this.spinner = false;
           // get the status as error.status
           Swal.fire({
            title: error.error !='' ? JSON.parse(error.error):'Erreur de serveur',
            icon: "error",
          });
        })
    } else {
      return false;
    }
  });

  }


  onUpdateGrade() {
    this.spinner = true;
    const data = {
      grade: this.nomGrade,
      heureSemaine: this.HeureSemaine,
      tauxHoraire: this.tauxHoraire,
      anneeDebut: this.anneeDebut,
      anneeFin: this.anneeFin,
      statut: this.statut,
    };


    this.PersonnelService.modifierGrade(data, this.idGrade).subscribe(
      (data) => {
        $('#staticBackdrop').modal('hide');
        this.spinner = false;
         Swal.fire({
            title: JSON.parse(data),
            icon: "success",
          });
          this.ngOnInit()
      },
      (error) => {
        this.spinner = false;
         // get the status as error.status
         Swal.fire({
          title: error.error !='' ? JSON.parse(error.error):'Erreur de serveur',
          icon: "error",
        });
      })
  }


  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }


}
