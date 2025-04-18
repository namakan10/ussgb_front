import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {StructureService} from "../../../../services/structure.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DepartementService} from "../../../../services/departement.service";
import {FiliereService} from "../../../../services/GestionFilieres/filiere.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CandidatService} from "../../../../services/GestionEtudiants/candidat.service";
import {OptionsService} from "../../../../services/GestionFilieres/Options/options.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import Swal from 'sweetalert2';
import {Util_fonction} from "../../../models/util_fonction";
import {PAG_SMALL_SIZE, UNIV_FILIERE, UNIV_FILIERE_S, UNIV_OPTION, UNIV_OPTION_S} from "../../../../CONSTANTES";
declare var $: any;

export interface DialogDataForSepcialite {
  AllSpecialte: string;
  name: string;
}


@Component({
  selector: 'ngx-filiere',
  templateUrl: './filiere.component.html',
  styleUrls: ['./filiere.component.scss']
})
export class FiliereComponent implements OnInit {
  univ_fil = UNIV_FILIERE;
  univ_fil_s = UNIV_FILIERE_S;

  univ_opt = UNIV_OPTION;
  univ_opt_s = UNIV_OPTION_S;

  showForm :boolean = false;
  creatForm :boolean;
  spinner1 :boolean = false;
  DepSelectID;
  Filieres;
  Options;
  AllSpecialites;
  dialogName;
  checkResult;
  anneeScolaireChecking = null;
  structureID;
  structureEvenements;

  Dep_SelectForm: FormGroup;
  filiereForm: FormGroup;
  FilterForm: FormGroup;
  searchKey: string;
    dataSource: MatTableDataSource<any>;
    filiers: any[]=[];
  displayedColumns: string[] = [
    'code',
    'nom',
    'actions'
  ];
  filierBODY = {
    departement_id : null,
    codeFiliere: null,
    nom : null,
    cursus : null,
    selective : null
  }

  id_departement: any;
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort: MatSort;
  Specialites: any;
  SendArray =[{}];
  select_Fil: any;
  user: any;
  OPtions: any;
  Departements: any;
  change_spinner: boolean = false;
  DepSelected: any;
  departementLibelle: any;
  add_spinner: boolean = false;
  selectFiliere: any;
  editeID: any;
  hide: boolean= false;
  action: string;
  existIDArray =[];
  sendArray =[];
  ListArray =[];
  FiliereSpecialites: any;
  allStructure: any;
  select_FilName: any;
  selectModes: string = 'Structures';
  QuestionResponse: boolean;
  EditQuestionResponse: boolean;
  filiereListBody = {
    id_structure: null,
    id_departement: null,
    id_candidat: null,
    cursus: null,
  };

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private filiereService: FiliereService,
    private depaertementService: DepartementService,
    private optionService: OptionsService,
    private structureService: StructureService,
    private SpecService: CandidatService) { }


  ngOnInit(): void {
    this.initSelectForm();
    this.initForm();
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.id_departement = this.route.snapshot.paramMap.get("id_departement");
    this.structureID = sessionStorage.getItem('id_departement');
    if (this.user.structure.type === 'Structure administratif'){
      this.getStructures();
    }else {
      this.getFiliers();
      this. GetDep();
    }
    this.GetAllSpécialite();


  }


  search(filterValue:string) {
    console.log("### search value ===>>>",filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  /**
   *
   * @param row
   */
  getAllSpecialite(row){
    this.sendArray = [];
    this.ListArray = [];
    this.existIDArray = [];
    this.select_Fil = row.id;
    this.select_FilName = row.nom;
    this.SpecService.getSepcialitesByFiliereId(this.select_Fil).subscribe( specRes => {
    this.FiliereSpecialites = specRes;

    for (let specialit of this.FiliereSpecialites){
      this.existIDArray.push(specialit.id);
    }

    for (let spec of this.Specialites){
      if (this.existIDArray.includes(spec.id) ){
        this.ListArray.push({id: spec.id, nom: spec.nom, statut: 'ok'});
        this.sendArray.push({id: spec.id});
      } else {
        this.ListArray.push({id: spec.id, nom: spec.nom, statut: 'no'});
      }
  }



    $('#filiereAffectFormModal').modal('show');
    $('#filiereAffectFormModal').appendTo('body');
  });
}

  /**
   *
   * Toutes les spécialités
   */
  GetAllSpécialite(){
    this.SpecService.getSepcialites().subscribe(specialResponse=> {
      this.Specialites = specialResponse;
    });
  }


  /**
   * MY
   * @constructor
   */
  Affecter(){

this.SendArray.splice(0,1);


this.filiereService.updateFiliere_Specialite(this.select_Fil,this.sendArray).subscribe(update => {
  Util_fonction.SuccessMessage(update);
}, error => {
  Util_fonction.AlertMessage(error.error.status,error.error.message);
})

}


  /**
   *
   */
  getFiliers() {
    this.filiereListBody.id_structure = this.user.structure.id;
    this.filiereListBody.id_candidat = this.FilterForm.controls.id_candidat.value;
    this.filiereListBody.cursus = this.FilterForm.controls.cursus.value;
      if (Util_fonction.checkIfNoTEmpty(this.DepSelected)){
        this.filiereListBody.id_departement = this.DepSelected;
      }
    this.filiereService.GetStructureFilieres(this.filiereListBody).subscribe( resFill => {
        this.change_spinner = false;

        console.log("getFiliers resFill",resFill)
        this.filiers = resFill;
      this.dataSource = new MatTableDataSource(this.filiers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);

    })
  }

  GetDep() {
    this.depaertementService.getStructureDepartements(this.user.structure.id).subscribe( depRes =>{
      this.selectModes = 'Départements';
      this.Departements = depRes;
    });
  }
  getStructures() {
    this.Departements = [];
    this.structureService.getStuctures().subscribe(
      (res) => {
        console.log("getStructures",res)
        this.selectModes = 'Structures';
        for (const str of res) {
          // let st = ;
          if (str['type'] + '' !== 'Structure administratif') {
            this.Departements.push(str);
          }
        }
      },
      (error) => {
      });
  }


  GetDep_Filieres(){
  this.filiereService.getDepartementFilieres(this.DepSelected).subscribe( depRes =>{
    this.filiers = depRes;
    this.dataSource = new MatTableDataSource(this.filiers);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.change_spinner = false;
  });
}
  /**
   * Amene le filieres du département sélectionné
   * @constructor
   */
  GetStructure_Fileres(){
  this.filiereService.getStructureFilieres(this.DepSelected).subscribe( StructureFilieresRes =>{
    this.dataSource = StructureFilieresRes;
  });
}

active_Input(){
this.filiereForm.controls.departement.setValidators([Validators.required]);
this.filiereForm.controls.departement.updateValueAndValidity();
}

desactive_Input(){
this.filiereForm.controls.departement.reset();
this.filiereForm.controls.departement.clearValidators();
this.filiereForm.controls.departement.updateValueAndValidity();
}

  /**
   * MANAGEMENT DE LA REPONSE A LA QUESTION DU FORMULAIRE
   *
   */
  formQuestionResponse(response){
    this.QuestionResponse = response;
    this.filiereForm.controls.selective.setValue(response);
  }

  // change -
  GetServiceOfSelectDepartement(event){
      this.change_spinner = true;
      this.DepSelected = this.Dep_SelectForm.controls.listServiceDep.value;
  if  (this.DepSelected !== "null" && this.DepSelected !== undefined && this.DepSelected !== "null"){
      this.departementLibelle = event.target.options[event.target.options.selectedIndex].text;
      if (this.selectModes === 'Structures'){
        this.GetStructure_Fileres();
      } else {
        this.getFiliers();
      }
  } else {
    if (this.selectModes !== 'Structures'){
      this.getFiliers();
    }
    }
  }

/***
* Méthode qui remplie le formulaire d'edition
*
*/
fullEditForm(element){
  this.action='edit';
  this.show_Form_Modal();
  this.editeID = element.id;
  this.filiereForm.controls.codeFiliere.setValue(element.codeFiliere);
  this.filiereForm.controls.nom.setValue(element.nom);

  this.filiereForm.controls.departement.setValue(this.DepSelected);
  this.filiereForm.controls.cursus.setValue(element.cursus);
  // this.EditQuestionResponse = element.selective;
  this.QuestionResponse = element.selective;
}


  getSepcialite(){
    this.SpecService.getSepcialites().subscribe(specRes =>{
    this.AllSpecialites = specRes;

    });
  }

  /**
   *
   * @param idSpecial
   * @param event
   */
  handelRoleChecking(idSpecial,event){
    if (event.target.checked){
      // add
      this.sendArray.push({id: idSpecial});
    } else {
      // delete
      for (let i = 0; i < this.sendArray.length; i++ ) {
        if (this.sendArray[i]['id'] === idSpecial ) {
          this.sendArray.splice(i, 1);
          i--;
        }
      }
    }
  }

  plusFiliere(){
    // this.QuestionResponse = false;
    this.action='new';
    this.filiereForm.controls.selective.setValue(null);
    this.show_Form_Modal();
  }

  show_Form_Modal() {
    this.initForm();
    $('#filiereFormModal').modal('show');
    $('#filiereFormModal').appendTo('body');
}

  /**
   *
   */
  // -- Création
  submitMyfiliereForm(){
    this.spinner1 = true;
    this.filierBODY.departement_id = +this.filiereForm.controls.departement.value;
    this.filierBODY.nom = this.filiereForm.controls.nom.value;
    this.filierBODY.codeFiliere = this.filiereForm.controls.codeFiliere.value;
    this.filierBODY.cursus = this.filiereForm.controls.cursus.value;
    this.filierBODY.selective = this.QuestionResponse;
    this.filiereService.createFiliere(this.filierBODY).subscribe(res =>{
      this.spinner1 = false;
    $('#filiereFormModal').modal('hide');
      this.getFiliers();
      Util_fonction.SuccessMessage(res);
  },error1 => {
      this.spinner1 = false;
    Util_fonction.AlertMessage(error1.error.status, error1.error.message)
    });
  }

  /**
   * Méthode mise à jours d'une année
   *
   */
  UpdateFiliere(){
    this.spinner1 = true;
    this.filierBODY.departement_id = +this.filiereForm.controls.departement.value;
    this.filierBODY.nom = this.filiereForm.controls.nom.value;
    this.filierBODY.codeFiliere = this.filiereForm.controls.codeFiliere.value;
    this.filierBODY.cursus = this.filiereForm.controls.cursus.value;
    this.filierBODY.selective = this.QuestionResponse;

    this.filiereService.updateFiliere(this.editeID,this.filierBODY).subscribe(res =>{
      this.showForm = false;
      this.spinner1 = false;
      $('#filiereFormModal').modal('hide');
      this.getFiliers();
      Util_fonction.SuccessMessage(res);
    },error1 => {
      this.spinner1 = false;
      Util_fonction.AlertMessage(error1.error.status, error1.error.message)
    });
  }


//- SUPPRSSION DE FILIERE
  DeleteFiliere(element){
    Swal.fire({
      title: '',
      html: 'êtes-vous sûr de supprimer la filière <strong> ' + element.nom + '</strong>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'non, annuler',
      confirmButtonText: 'Oui, Supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.filiereService.deleteFiliere(element.id).subscribe( deletRes=>{
          this.getFiliers();
          Util_fonction.SuccessMessage(deletRes);
        }, deleerror => {
          this.add_spinner = false;
          Util_fonction.AlertMessage(deleerror.error.status, deleerror.error.message);
        })
      }
    });
  }
  /***
  * Initialisation du formulaire
  */
  initForm(){
    this.filiereForm = this.formBuilder.group({
      departement: new FormControl (null, Validators.required),
      codeFiliere : new FormControl (null, Validators.required),
      nom : new FormControl (null, Validators.required),
      cursus : new FormControl (null, Validators.required),
      selective : new FormControl (null, Validators.required)
    });

      this.FilterForm = this.formBuilder.group({
        id_departement: new FormControl (null),
        id_candidat: new FormControl (null),
        cursus : new FormControl (null)
      });
  };

  initSelectForm(){
    this.Dep_SelectForm = this.formBuilder.group({
      listServiceDep: new FormControl(null),
    });
  }





}

/** End For Modal Specialite **/
