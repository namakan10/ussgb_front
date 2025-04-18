import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CandidatureService } from '../../../services/candidature.service';
import { PreInscriptionServiceService } from '../../../services/pre-inscription-service.service';
import { StructureService } from '../../../services/structure.service';
import jspdf from 'jspdf';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {fromArray} from "rxjs-compat/observable/fromArray";
import {Util_fonction} from "../../models/util_fonction";
import {PAG_MIDLE_SIZE, UNIV_NAME, UNIV_SIGLE} from "../../../CONSTANTES";
import {ThemePalette} from "@angular/material/core";
import {FraisService} from "../../../services/GestionFrais/frais.service";
import * as Util from "util";
import {environment} from "../../../../environments/environment";
import {EtatPaiementsService} from "./etat.paiements.service";
import {SpinnerService} from "../spinner.service";
declare var $: any;
@Component({
  selector: 'ngx-aicha-paiement',
  templateUrl: './etat-paiements.component.html',
  styleUrls: ['./etat-paiements.component.scss']
})
export class EtatPaiementsComponent implements OnInit  {

  univ_sigle = UNIV_SIGLE;
  univ_name = UNIV_NAME;

  // tslint:disable-next-line:max-line-length
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // tslint:disable-next-line:max-line-length
  dataSource2;
  @ViewChild(MatPaginator, {static: true}) paginator2: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort2: MatSort;

  user: any;
  id_personnel: any;
  anneeStructure: any;
  listComptable: any = [];
  caissiers: any = [];
  paiements: any = [];

  pageSizeOptions = [3,5,10,20,50,100,300,500,1000,5000,10000,100000,100000];

  currentPage= 0
  numberOfElementsPerPage: 20
  pageSize= 20
  totalElements: number
  totalPages: number

  form:FormGroup;

  showForm: boolean = false;
  scolarite : boolean = false;

  CurrentAnnee: any;

  displayedColumns: string[] = ['id','date','numPaiement','author', 'etudiant','montant','action'];

  now= new Date();
  constructor(private structureService: StructureService,
              private preinscription: PreInscriptionServiceService,
              private fraisService: FraisService,
              private route: ActivatedRoute, public datepipe: DatePipe,
              private candidatureService: CandidatureService,
              private service: EtatPaiementsService,
              private fb: FormBuilder,
              private spinner: SpinnerService,
              private datePipe: DatePipe
  ) {

  }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('user'));

    this.initForm();

    if(this.user) {
      this.initAnneeScolaire();
      this.search();
      if (this.user.users.personnel) {
        this.id_personnel = this.user.users.personnel.id;
      }
    }
  }



  afficher(da=null,page=0,size=20) {
    console.log(da)
    if(!this.form.value){
      return;
    }
   const data = {
        id:this.user.structure.id,
        debut: this.datePipe.transform(this.form.value.date_debut, 'yyyy-MM-dd'),
        fin: this.datePipe.transform(this.form.value.date_fin, 'yyyy-MM-dd'),
        annee: this.form.value.annee,
        personnel: this.form.value.personnel ? this.form.value.personnel.id:undefined,
        page: page,
        size: size,
      }

    console.log("data ===", data);

    this.spinner.show();

    this.service.getPaiements(data).subscribe(
        (res:any) => {
          this.spinner.hide();
          this.paiements = res.content;
          this.dataSource = new MatTableDataSource(this.paiements);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.currentPage=res.currentPage
          this.numberOfElementsPerPage=res.numberOfElementsPerPage
          this.pageSize=res.pageSize
          this.totalElements=res.totalElements
          this.totalPages=res.totalPages
        },
        (error) => {
          this.spinner.hide();
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });


  }


  search(value?,pagination?: any) {

   console.log("search ===", pagination);


   const data = {
        id:this.user.structure.id,
        nom:value,
        prenom:value,
        role:"ROLE_COMPTABLE",
      }

    console.log("data ===", data);

    this.spinner.show();
    this.service.getPersonnels(data).subscribe(
        (res:any) => {
        //  const personnels: any[] = res.content;
          console.log("RESPONSE caissier ===", res);
         // this.caissiers = personnels.filter(p => p && p.specialiteFonction.id === 7)
          this.caissiers = res.content
          console.log("RESPONSE caissiers  ===", this.caissiers);
          this.spinner.hide();
        },
        (error) => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner.hide();
        });


  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }






  checkeIfIsEmpty(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }


  logo(logo) {
    return logo.split('/')[5];
  }





  initForm(){
    this.form = this.fb.group({
      annee: new FormControl(null, [Validators.required]),
      date_debut: new FormControl(null, [Validators.required]),
      date_fin: new FormControl(null, [Validators.required]),
      personnel: new FormControl( ),
    })
  }


  initAnneeScolaire(){

    this.structureService.getStuctureAnnees(this.user.structure.id).subscribe(
      (res) => {
        console.log("RES ANNEESCOLAIRE", res)
        for (let ans of res){
          if (ans.statut = "EN_COURS"){
            this.CurrentAnnee = ans.anneeScolaire;
          }
        }
        this.anneeStructure = res;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }



  reload(){
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if(this.user) {
      this.initAnneeScolaire();
      this.search();
      if (this.user.users.personnel) {
        this.id_personnel = this.user.users.personnel.id;
      }
    }

  }


  toDate(val){
    return new Date(val[0],val[1],val[2],);
  }
  displayFn(val: any): string {
    return val ? (val.prenom + ' ' + val.nom) : '';
  }
}



