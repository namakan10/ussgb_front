import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {StructureService} from '../../../services/structure.service';
import {GestionFraisService} from '../../../services/gestion-frais.service';
import {Router} from '@angular/router';
import {FiliereService} from "../../../services/GestionFilieres/filiere.service";
import {Util_fonction} from "../../models/util_fonction";
import * as Util from "util";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {PAG_SMALL_SIZE} from "../../../CONSTANTES";
declare var $: any;


@Component({
  selector: 'app-frais',
  templateUrl: './frais.component.html',
  styleUrls: ['./frais.component.css']
})
export class FraisComponent implements OnInit {
  FraisForm: FormGroup;
  Structures;
  AllFrais;
  EditOrNewAction = false;
  showForm = false;
  requestBody1 = {
    typeFrais: '',
    structures: [],
    type: '',
    frais : '',
  };
  requestBody2 = {
    typeFrais: '',
    structures: [],
    id: '',
    type: '',
    frais : '',
  };

  SendBody = {
    filiere_id: null,
    frais: null,
    typeCandidat: null,
    typeFrais: null
  }

  structureSelectSigle = null;
  structureSelectID = null;
  currentAction = 'creat';
  EditID = null;
  FraisEditId = null;
  user:any;
  action:any;
  Filieres:any;
  masterIsSelect:boolean = false;
  _spinner1 :boolean = false;
  _spinner2 :boolean = false;

  autreFraisIsSelect :boolean = false;

  FilterBoby = {
    id_structure: null,
    id_filiere: null,
    type_candidat: null,
    type_frais: null
  }
  FilterForm: FormGroup;
  AutreFraisForm: FormGroup;

  displayedColumns: string[] = ['porfile', 'Type_frais', 'Montant', 'Filiere', 'action'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private structureService: StructureService,
              private filiereService: FiliereService,
              private formBuilder: FormBuilder,
              private router: Router,
              private fraisService: GestionFraisService) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.initForm();
    this.initFiliterForm();
    this.GetListFrais();
    this.getStructures();
    this.getStructureFilieres();


  }

  /**
   * GET STRUCTURE FILIERES
   */
  getStructureFilieres(){
      this.filiereService.getStructureFilieres(this.user.structure.id)
        .subscribe(res => {
          console.log("===Filières");
          console.log(res);
          this.Filieres = res;
        });
  }


  getStructures() {
    this.structureService.getStuctures().subscribe(
      res => {
        // console.log(res);
        this.Structures = res;

      }, error1 => {
        Util_fonction.AlertMessage('info', 'Un problème est survenu. Veuillez vérifier votre connexion!');
      });
  }


  GetListFrais() {
    this.FilterBoby.id_filiere = this.FilterForm.controls.id_filiere.value;
    this.FilterBoby.id_structure = this.user.structure.id;
    this.FilterBoby.type_candidat = this.FilterForm.controls.type_candidat.value;
    this.FilterBoby.type_frais = this.FilterForm.controls.type_frais.value;
    this.fraisService.getAllFrais(this.FilterBoby).subscribe(
      res => {
        this.dataSource = new MatTableDataSource<any>(res);
        this.dataSource.paginator = this.paginator;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
        this.AllFrais = res;
      }, error3 => {
        Util_fonction.AlertMessage('info', 'Un problème est survenu. Veuillez vérifier votre connexion!');
      });
  }

  /**
   * PROFILE SELECTOR CHANGE
   */
  profileSelect(){
    let selected = this.FraisForm.controls.type.value;
    this.masterIsSelect = selected === "MASTER" || selected === "MASTER_BOURSIER";
  }

  onTabClick(event) {
    if (event.index === 0){
      this.autreFraisIsSelect = false;
      this.AutreFraisForm.reset();
      console.log("univaersity form is select");
    } else {
      this.autreFraisIsSelect = true;
      this.FraisForm.reset();
      console.log("autr form is select");
    }
  }

  plusFrais(){
    this.action = "creat";
    this.showForm = true;
    this.masterIsSelect = false;
    this.initForm();

    $('#FraisFormModal').modal('show');
    $('#FraisFormModal').appendTo('body');

  }


  /**
   *  ADJOUT DE FRAIS
   * @constructor
   */
  AddFrais(){
    this._spinner1 = true;
    this.SendBody.filiere_id = this.FraisForm.controls.filiere.value;
    this.SendBody.typeCandidat = this.FraisForm.controls.type.value;

    if (this.autreFraisIsSelect){
      this.SendBody.frais = +this.AutreFraisForm.controls.autrefrais.value;
      this.SendBody.typeFrais = this.AutreFraisForm.controls.autretypeFrais.value;
    } else {
      this.SendBody.frais = +this.FraisForm.controls.frais.value;
      this.SendBody.typeFrais = this.FraisForm.controls.typeFrais.value;
    }


    this.fraisService.enregistrerFrais(this.SendBody).subscribe(creatRes => {
      this.showForm = false;
      this._spinner1 = false;
      $('#FraisFormModal').modal('hide');
      this.GetListFrais();
     Util_fonction.SuccessMessage(creatRes);

    }, CreatError => {
      this._spinner1 = false;
      Util_fonction.AlertMessage(CreatError.error.status, CreatError.error.message);
    });
  }

  modifFrais(element){
    this.FraisEditId = element.id;
    this.masterIsSelect = false;
    this.FraisForm.controls.filiere.setValue(null);
    this.action = "modif";
    this.showForm = true;
    this.initForm();

    if (Util_fonction.checkIfNoTEmpty(element.filiere)){
      this.masterIsSelect = true;
      this.FraisForm.controls.filiere.setValue(element.filiere.id);
    }

    if (element.typeCandidat === "MASTER" || element.typeCandidat === "MASTER_BOURSIER"){
      this.masterIsSelect = true;
    }


    this.FraisForm.controls.frais.setValue(element.frais);
    this.FraisForm.controls.type.setValue(element.typeCandidat);
    this.FraisForm.controls.typeFrais.setValue(element.typeFrais);

    $('#FraisFormModal').modal('show');
    $('#FraisFormModal').appendTo('body');

  }
  EditFrais() {
    this._spinner1 = true;
    this.SendBody.filiere_id = this.FraisForm.controls.filiere.value;
    this.SendBody.frais = +this.FraisForm.controls.frais.value;
    this.SendBody.typeCandidat = this.FraisForm.controls.type.value;
    this.SendBody.typeFrais = this.FraisForm.controls.typeFrais.value;

    this.fraisService.modifierFrais(this.FraisEditId, this.SendBody).subscribe(updateRes => {

      this.showForm = false;
      this._spinner1 = false;
      $('#FraisFormModal').modal('hide');
      this.GetListFrais();
      Util_fonction.SuccessMessage(updateRes);

    }, UpdateError => {
      this._spinner1 = false;
     Util_fonction.AlertMessage(UpdateError.error.status, UpdateError.error.message);
    });
  }

  confirmDelete(idFrais, sigle, typeFrais){
    Swal.fire({
      title: '',
      html: 'êtes-vous sûr de supprimer le type de frais \'<strong>' + typeFrais + '</strong>\' de la structure ' +
      '<strong>' + sigle + '</strong> ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'non, annuler',
      confirmButtonText: 'Oui, Supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.DeleteFrais(idFrais);
      }
    });
  }

  DeleteFrais(id) {
    this.fraisService.deleteFrais(id).subscribe(deleteRes => {
      this.GetListFrais();
      Util_fonction.SuccessMessage(deleteRes);
    }, DeleteError => {
      Util_fonction.AlertMessage(DeleteError.error.status, DeleteError.error.message);
    } );
  }

  initForm() {
    this.FraisForm = this.formBuilder.group({
      frais: new FormControl(null, Validators.required),
      filiere: new FormControl(null),
      type: new FormControl(null, Validators.required),
      typeFrais: new FormControl(null, Validators.required),
    });

    this.AutreFraisForm = this.formBuilder.group({
      autrefrais: new FormControl(null, Validators.required),
      autretypeFrais: new FormControl(null, Validators.required),
    });
  }

  initFiliterForm() {
    this.FilterForm = this.formBuilder.group({
      id_filiere: new FormControl(null),
      id_structure: new FormControl(null),
      type_candidat: new FormControl(null),
      type_frais: new FormControl(null),
    });
  }
}
