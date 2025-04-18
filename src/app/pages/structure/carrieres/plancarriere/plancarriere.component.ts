import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Carrier} from "../carriere.model";
import {CarriereService} from "../../../../services/carriere-service.service";
import {Util_fonction} from "../../../models/util_fonction";


@Component({
  selector: 'app-plancarriere',
  templateUrl: './plancarriere.component.html',
  styleUrls: ['./plancarriere.component.css']
})
export class PlancarriereComponent implements OnInit {

  spinner = false;
  error = null;
  message = null;

  @ViewChild(MatPaginator, {static: true}) paginatorPersonnel: MatPaginator;
  @ViewChild(MatSort, {static: true}) sortPersonnel: MatSort;
  displayedColumnsPersonnel: string[] = ['id','enseignant','fonction','dateDernierAvancement','niveau_etude','statut','indice','etatService','corps','categorie','classe','echelon','action'];

  dataSourcePersonnel;


  @ViewChild(MatPaginator, {static: true}) paginatorEnseignant: MatPaginator;
  @ViewChild(MatSort, {static: true}) sortEnseignant: MatSort;
  displayedColumnsEnseignant: string[] = ['id','enseignant','dateDernierAvancement','niveau_etude','statut','indice','etatService','corps','categorie','classe','echelon','action'];
  dataSourceEnseignant;

  user: any;
  structureId: number;
  enseignants: any[];
  personnels: any[];
  fonctions: any[];
  donneePersonnel: any;

  form: FormGroup;
  carrier: Carrier
  private formPanelEnseignant: boolean;
  private formPanelPersonnel: boolean;
  private type: string;



  constructor(
    private service: CarriereService,
    public dialog: MatDialog,private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,) {
    this.structureId = +this.route.snapshot.paramMap.get("id");

    this.user = JSON.parse(sessionStorage.getItem('user')).users;
    this.initData(this.structureId);
  }

  ngOnInit() {
    this.fb = new FormBuilder();
    this.initModel();
    this.initForm();
  }


  initData(id:number){
    this.initDonneePersonnels();
    this.initEnseignants(id);
    this.initPersonnel(id);
    this.initFonctions(id);
  };


  initForm(){
    this.buildForm();
    this.subscribe();
  }

  initModel() {
    this.carrier =  new Carrier();
  }

  protected buildForm() {
    this.form = this.fb.group({
      etatService: [this.carrier.etatService],
      statut: [this.carrier.statut],
      indice: [this.carrier.indice, Validators.required],

      corps: [this.carrier.corps],

      categorie: [this.carrier.categorie],
      classe: [this.carrier.classe],

      echelon: [this.carrier.echelon],
      niveau_etude: [this.carrier.niveau_etude],

      dateDernierAvancement: [this.carrier.dateDernierAvancement],

      fonction: [this.carrier.fonction],
    });
  }

  protected subscribe() {
    if (!this.form) {
      this.buildForm();
    }
    this.form.get('etatService').valueChanges.subscribe(value => this.carrier.etatService = value);
    this.form.get('statut').valueChanges.subscribe(value => this.carrier.statut = value);
    this.form.get('corps').valueChanges.subscribe(value => this.carrier.corps = value);
    this.form.get('categorie').valueChanges.subscribe(value => this.carrier.categorie = value);
    this.form.get('classe').valueChanges.subscribe(value => this.carrier.classe = value);
    this.form.get('echelon').valueChanges.subscribe(value => this.carrier.echelon = value);
    this.form.get('indice').valueChanges.subscribe(value => this.carrier.indice = value);
    this.form.get('niveau_etude').valueChanges.subscribe(value => this.carrier.niveau_etude = value);
    this.form.get('dateDernierAvancement').valueChanges.subscribe(value => this.carrier.dateDernierAvancement = value);
    this.form.get('fonction').valueChanges.subscribe(value => this.carrier.fonction = value);
  }


  initFonctions(id:number){
    this.service.getFonctionsByStructureId(id)
      .subscribe(
        (data:any[])=>{
          this.fonctions = data;
        },error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      );
  }

  initDonneePersonnels(){
    this.service.getDonneePersonnel()
      .subscribe(
        (data:any)=>{
          this.donneePersonnel = data;
        },error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      );
  }



  applyFilterEnseignant(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEnseignant.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceEnseignant.paginator) {
      this.dataSourceEnseignant.paginator.firstPage();
    }
  }

  applyFilterPersonnel(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePersonnel.filter = filterValue.trim().toLowerCase();

    if (this.dataSourcePersonnel.paginator) {
      this.dataSourcePersonnel.paginator.firstPage();
    }
  }



  initEnseignants(id:number){
    this.service.getEnseignantByStructureId(id)
      .subscribe(
        (data:any[])=>{;
          this.enseignants = data;
          this.dataSourceEnseignant = new MatTableDataSource(this.enseignants.reverse());
          this.dataSourceEnseignant.paginator = this.paginatorEnseignant;
          this.dataSourceEnseignant.sort = this.sortEnseignant;
        },error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      );
  }



  onEtatService(value: any) {

    this.service.getUsersByStructureId(this.structureId)
      .subscribe(
        (data:any[])=>{
          this.personnels = data.map((p)=>p.etatService==value);
          this.dataSourcePersonnel = new MatTableDataSource(this.personnels.reverse());
          this.dataSourcePersonnel.paginator = this.paginatorPersonnel;
          this.dataSourcePersonnel.sort = this.sortPersonnel;
        },error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      );

  }

  initPersonnel(id:number){
    this.service.getUsersByStructureId(id)
      .subscribe(
        (data:any[])=>{
          this.personnels = data;
          this.dataSourcePersonnel = new MatTableDataSource(this.personnels.reverse());
          this.dataSourcePersonnel.paginator = this.paginatorPersonnel;
          this.dataSourcePersonnel.sort = this.sortPersonnel;
        },error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      );
  }



  editeEnseignant(id:number, value) {
    this.service.updateEnseignant(id,value)
      .subscribe(
        (response:any) => {
          this.enseignants = response;
          this.spinner = false;
          this.initData(this.structureId);
        },error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        }
      )
  }

  editePersonnel(id:number, value) {
    this.service.updatePersonnel(id,value)
      .subscribe(
        (response:any) => {
          this.personnels = response;
          this.spinner = false;
          this.initData(this.structureId);
        },error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        }
      )
  }

  onFonction(value: any) {
  }

  changePanelEnseignant() {
    this.formPanelEnseignant=!this.formPanelEnseignant;
  }

  changePanelPersonnel() {
    this.formPanelPersonnel=false;
  }

  compareById(ob1, ob2) {
    return ob1.id === ob2.id;
  }



  showEdite(type: string, value) {
    this.type = type
    this.carrier.fonction = value.fonction;
    this.carrier.categorie = value.categorie
    this.carrier.etatService = value.etatService
    this.carrier.statut = value.statut
    this.carrier.corps = value.corps
    this.carrier.classe = value.classe
    this.carrier.echelon = value.echelon
    this.carrier.indice = value.indice
    this.carrier.niveau_etude = value.niveau_etude

    // this.carrier.dateDernierAvancement = value.dateDernierAvancement
    this.carrier.dateDernierAvancement = new Date(value.dateDernierAvancement[0], value.dateDernierAvancement[1], value.dateDernierAvancement[2]);
    this.initForm();
    this.type==='personnel' ?
      this.formPanelPersonnel=true:this.formPanelEnseignant=true;

  }

  addOrdEdite(value: any) {
    this.carrier.fonction = value.fonction;
    this.carrier.categorie = value.categorie
    this.carrier.etatService = value.etatService
    this.carrier.statut = value.statut
    this.carrier.corps = value.corps
    this.carrier.classe = value.classe
    this.carrier.echelon = value.echelon
    this.carrier.indice = value.indice
    this.carrier.niveau_etude = value.niveau_etude
    this.carrier.dateDernierAvancement = value.dateDernierAvancement

  }

}
