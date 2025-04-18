import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { DatePipe } from '@angular/common';

import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import { UesServiceService } from '../../../services/ues.service';
import Swal from 'sweetalert2';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { PersonnelAdminService } from '../../../services/GestionPersonnelAdmin/personnel-admin.service';

import * as _ from 'lodash';
import { DepartementService } from '../../../services/departement.service';
import {Util_fonction} from "../../../pages/models/util_fonction";
declare var $: any;

@Component({
  selector: 'app-voir-enseignant-effectivite',
  templateUrl: './voir-enseignant-effectivite.component.html',
  styleUrls: ['./voir-enseignant-effectivite.component.css']
})
export class VoirEnseignantEffectiviteComponent implements OnInit {
  UEs:any
  ensegnants:any
  action:any;
  departemnts:any
  idSt:any
  dateDebut:any
  dateFin:any
  effectiviteForm:FormGroup
  effectiviteFormdpt:FormGroup
  users:any
  heuresDue
  spinner=false
  details:any=[]
  listEffectivites
  listEffectivites2
  cecklist=0;
  displayedColumns: string[] = [
    'prenom', 'nom', 'grade', 'matricule', 'heures','heuresDue','heuresSup','Actions'
  ];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource
  isloading :boolean=false

  @ViewChild('EffectiviteForm', { static: false })
  EffectiviteForm: NgForm;

  searchKey: string;
  idteacher: any;
  keyword="nom";
  keywordUE="nomUE";

  constructor(private formBuilder: FormBuilder,
    private uesService: UesServiceService,
    private PersonnelService: PersonnelAdminService,
    private departemntService: DepartementService,
    public datepipe: DatePipe) {

     }

  ngOnInit() {

    this.users= JSON.parse(sessionStorage.getItem('user'));
    this.idSt=this.users.structure.id
    this.initForm()
    this.initFormDpt()
    //this.getUesByStructure(this.idSt)
    this.getEnseignantByStructure(this.idSt)
    this.getDeptmntByStructure(this.idSt)
  }

  initForm(){
    this.effectiviteForm = this.formBuilder.group({
      UeId: [''],
      idTeacher: ['', Validators.required],
      datestart: ['', Validators.required],
      datefin: ['', Validators.required],

    });
  }

  initFormDpt(){
    this.effectiviteFormdpt = this.formBuilder.group({
      iddepmnt: ['', Validators.required],
      datestart1: ['', Validators.required],
      datefin1: ['', Validators.required],

    });
  }


  getUesByStructure(element) {
    console.log("ddd", element);
    this.uesService.getUesByEnseignant(element.id).subscribe((data) => {
    if (data.length <=0){
      Util_fonction.AlertMessage("info", "UE vide pour "+element.prenom+' '+element.nom);
    }
      this.UEs = data;
    //print()
    });
  }
  showModal3(element) {
    //  this.inti();
      this.action = 'Détails des heures effectuées par '+element.nom+' '+element.prenom;
      $('#listEC').modal('show');
      $('#listEC').appendTo('body');
    }

  getDeptmntByStructure(id) {
    this.departemntService.getStructureDepartements(id).subscribe((data) => {
    this.departemnts = data;

    //print()
    })
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

 // teste data

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

  Ensegnants;
  EnseignantsVacataires;
  getEnseignantByStructure(id) {
    const data = {
      id_structure: id,
      role: "ROLE_ENSEIGNANT"
    }
    this.PersonnelService.getStructurePersonnel(data).subscribe((dataresponse) => {
      this.Ensegnants = dataresponse.content;
      const data2 = {
        id_structure: id,
        role: "ROLE_VACATAIRE"
      }
      this.PersonnelService.getStructurePersonnel(data2).subscribe((data2response) => {
        let enVac = this.Ensegnants.concat(data2response.content).filter(e => e.nom +=' ' + e.prenom);
        this.EnseignantsVacataires = enVac;
        console.log("this.EnseignantsVacataires  -->", this.EnseignantsVacataires );
      });
    })
  }


  onSubmit() {
    this.spinner = true;
    this.cecklist=0
    const idens=this.effectiviteForm.controls.idTeacher.value.id
    console.log("idens", idens);
    const data = {

        dateDebut : this.datepipe.transform(this.effectiviteForm.controls.datestart.value,
          'yyyy-MM-dd'),
        dateFin : this.datepipe.transform(this.effectiviteForm.controls.datefin.value,
          'yyyy-MM-dd'),

        idUE : this.effectiviteForm.controls.UeId.value.id

    };
    console.log("data", data);
    this.PersonnelService.getEffectiviteEnseignant(data,idens).subscribe((data) => {
      this.listEffectivites2=data
      this.spinner = false;
     // this.handleSuccessfulResponse(data);
      //print()
      })

      this.PersonnelService.getHeureDueByTeacher(idens).subscribe((data) => {
        this.heuresDue=data
        this.spinner = false;
       // this.handleSuccessfulResponse(data);
        //print()
        })
  }






  onSubmit2() {
    this.spinner = true
    this.cecklist=1
    const iddpt=this.effectiviteFormdpt.controls.iddepmnt.value.id
    const data = {

      idDepartement:+iddpt,
      dateDebut : this.datepipe.transform(this.effectiviteFormdpt.controls.datestart1.value,
        'yyyy-MM-dd'),
      dateFin : this.datepipe.transform(this.effectiviteFormdpt.controls.datefin1.value,
        'yyyy-MM-dd'),

    };

    this.isloading=true
    this.PersonnelService.getEffectiviteByDepartement(data).subscribe((data) => {
      this.listEffectivites=data
      console.log(data);
      this.handleSuccessfulResponse(data);
      this.spinner = false;
      this.isloading=false
     // this.handleSuccessfulResponse(data);
      //print()
      })
  }

  showDetails(element, typeOP:String) {

    this.isloading=true;
    if(typeOP=="departement"){

      this.dateDebut = this.datepipe.transform(this.effectiviteFormdpt.controls.datestart1.value,
        'yyyy-MM-dd')
       this.dateFin = this.datepipe.transform(this.effectiviteFormdpt.controls.datefin1.value,
        'yyyy-MM-dd')

    } else{

      this.dateDebut = this.datepipe.transform(this.effectiviteForm.controls.datestart.value,
        'yyyy-MM-dd')
       this.dateFin = this.datepipe.transform(this.effectiviteForm.controls.datefin.value,
        'yyyy-MM-dd')

    }

    this.idteacher=element.id
    this.PersonnelService.getEnseignantEffectivite(this.dateDebut,this.dateFin,this.idteacher).subscribe((data) => {
      this.details=data
      this.isloading=false
      },(error) => {
        this.isloading = false;
         // get the status as error.status
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      })

    this.showModal3(element);
   // this.router.navigate(['/pages', 'structure',this.route.snapshot.paramMap.get("id") , 'filiere', 'Ue', id]);
  }



  deleteEffectivite(id) {

  Swal.fire({
    icon: 'info',
    title: 'Voulez-vous confirmer la suppression ?',
    showCancelButton: true,
    confirmButtonText: `Supprimer`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
       this.PersonnelService.deleteEff(id).subscribe(
        (data) => {
          //this.spinner = false;
          Util_fonction.SuccessMessage(data);
            this.ngOnInit()
        },
        (error) => {
          //this.spinner = false;
           // get the status as error.status
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        })
    } else {
      return false;
    }
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
