import {Component, OnInit, ViewChild} from '@angular/core';
import {StructureService} from "../../../services/structure.service";
import {ActivatedRoute, Router} from "@angular/router";

import {DepartementService} from "../../../services/departement.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import { OptionsService } from '../../../services/GestionFilieres/Options/options.service';
import Swal from 'sweetalert2';
import { FiliereService } from '../../../services/GestionFilieres/filiere.service';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Util_fonction} from "../../models/util_fonction";
import {PAG_SMALL_SIZE, UNIV_FILIERE, UNIV_FILIERE_S, UNIV_OPTION, UNIV_OPTION_S} from "../../../CONSTANTES";
declare var $: any;
@Component({
  selector: 'ngx-gestion-options',
  templateUrl: './gestion-options.component.html',
  styleUrls: ['./gestion-options.component.scss']
})
export class GestionOptionsComponent implements OnInit {
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort: MatSort;
univ_fil = UNIV_FILIERE;
univ_fil_s = UNIV_FILIERE_S;

univ_opt = UNIV_OPTION;
univ_opt_s = UNIV_OPTION_S;

  OptionsBody1 = {
    nom: null,
    codeOption: null,
    filiere: {
      id:null
    },
  };

  OptionsBody2 = {
    id: null,
    nom: null,
    codeOption: null,
    filiere: {
      id:null
    },
  };
  id = null;
  searchKey: string;

  dataSource:MatTableDataSource<any>;
  displayedColumns: string[] = [
    // 'check',
    'nom',
    'codeOption',
    'actions'
  ];

  structure: any;
  id_filiere: string;
  filiere: any;
  id_structure: any;
  user: any;
  action: any;
  Filieres: any;
  FiliereSelected: any;
  FiliereLibelle: any;
  Options: any;
  editID: any;
  OptionForm: FormGroup
  OptionParamForm: FormGroup
  Filiere_SelectForm: FormGroup
  change_spinner: boolean = false;

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;

  StructureAnnees;
  niveau;
  anneeScolaire;

  constructor(private structureService: StructureService,
  private route: ActivatedRoute,
  private router: Router,
  private filiereService: FiliereService,
  private optionsService: OptionsService,
  private formBluider: FormBuilder,
  private departementService: DepartementService) { }

ngOnInit(): void {
  this.user = JSON.parse(sessionStorage.getItem('user'));
  this.id_structure = this.user.structure.id;
  this.initSelectForm();
  this.initForm();
  this.initOptionParamForm();
  this.getStructureFilieres();
  this.getStructureOptions();
  this.GetStuctureAnnees();
}

  GetStuctureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id)
      .subscribe(res => {
        this.StructureAnnees = res;
      })
  }

  search(filterValue:string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  getStructureFilieres(){
    this.filiereService.getStructureFilieres(this.id_structure).subscribe(
      res => {
        this.Filieres = res;
        console.log(res);
      }
    )
  }

  getStructureOptions(){
    this.optionsService.getStructure_Options(this.id_structure).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.change_spinner = false;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);

      }
    )
  }
  GetOption_by_Filieres(){
    this.optionsService.getOptionsByFiliereID(this.FiliereSelected).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.change_spinner = false;
      }
    )
  }

  showModal(){
    this.initForm();
    $('#OptionFormModal').modal('show');
    $('#OptionFormModal').appendTo('body');
  }
  newOption(){
    this.action = 'new';
    this.showModal()
  }

  editOption(element){
    this.editID = element.id;
    this.action = 'edit';
    this.showModal();

    this.OptionForm.controls.nom.setValue(element.nom);
    this.OptionForm.controls.codeOption.setValue(element.codeOption);
    this.OptionForm.controls.filiere.setValue(this.FiliereSelected);
  }

  ChangeFiliereSelector(event) {
    this.change_spinner = true;
    this.FiliereSelected = this.Filiere_SelectForm.controls.listFileres.value;
    console.log(this.FiliereSelected);
    if  (this.FiliereSelected !== "null" && this.FiliereSelected !== undefined && this.FiliereSelected !== "null"){
      this.FiliereLibelle = event.target.options[event.target.options.selectedIndex].text;
        this.GetOption_by_Filieres();
    } else {
        this.getStructureOptions();
      this.FiliereLibelle = this.user.structure.nom+' ('+this.user.structure.sigle+')';
    }
  }

  /**
   * CR2ATION D'UNE OPTION
   */
  ajouteroptions(){
    this.OptionsBody1.filiere.id = +this.OptionForm.controls.filiere.value;
    this.OptionsBody1.filiere.id = +this.OptionForm.controls.filiere.value;
    this.OptionsBody1.nom = this.OptionForm.controls.nom.value;
    this.OptionsBody1.codeOption = this.OptionForm.controls.codeOption.value;
    this.change_spinner = true;
    this.optionsService.createOptions(this.OptionsBody1).subscribe(res =>{
      $('#OptionFormModal').modal('hide');
      this.change_spinner = false;
      if(this.FiliereSelected === null || this.FiliereSelected === undefined || this.FiliereSelected === "null"){
        this.getStructureOptions();
      } else {
        this.GetOption_by_Filieres();
      }
      Util_fonction.SuccessMessage(res);
    }, error => {
      this.change_spinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    });
  }

  modifOption(){
    this.OptionsBody2.id = +this.editID;
    this.OptionsBody2.filiere.id = +this.OptionForm.controls.filiere.value;
    this.OptionsBody2.nom = this.OptionForm.controls.nom.value;
    this.OptionsBody2.codeOption = this.OptionForm.controls.codeOption.value;
    this.change_spinner = true;
    this.optionsService.updateOption(this.OptionsBody2).subscribe(res =>{
      $('#OptionFormModal').modal('hide');
      this.change_spinner = false;
      if(this.FiliereSelected === null || this.FiliereSelected === undefined || this.FiliereSelected === "null"){
        this.getStructureOptions();
      } else {
        this.GetOption_by_Filieres();
      }
      Util_fonction.SuccessMessage(res);
    }, error => {
      this.change_spinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    });
  }
  supprimerOption(element){

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
        this.optionsService.deleteOptions(element.id).subscribe( deletRes=>{
          if(this.FiliereSelected === null || this.FiliereSelected === undefined || this.FiliereSelected === "null"){
            this.getStructureOptions();
          } else {
            this.GetOption_by_Filieres();
          }
          Util_fonction.SuccessMessage(deletRes);
        }, deleerror => {
          Util_fonction.AlertMessage(deleerror.error.status, deleerror.error.message);
        })
      }
    });

  }

  //========================================================
  //PARAMETTRER
  //========================================================
  showChekbox = false;
  isSelected = false;
  rowChecked = [];
  Parametrer(){
    this.showChekbox = !this.showChekbox;
    this.rowChecked = [];
    // @ts-ignore
    let che = document.getElementsByClassName('ckb');//.checked = false;

    // @ts-ignore
    for(let i = 0; i < che.length; ++i) {
      // @ts-ignore
      che[i].checked = false;
    }

  }
  HandleChecked($event, element,  action){
    if ($event.target.checked){
      if (action === 'all'){
        // @ts-ignore
        let che = document.getElementsByClassName('ckb');//.checked = true;
        this.rowChecked = this.dataSource.data.map(el =>{
          return +el.id
        });
        // @ts-ignore
        for(let i = 0; i < che.length; ++i) {
          // @ts-ignore
          che[i].checked = true;
        }
      }else {
        // @ts-ignore
        document.getElementsByClassName('ckb'+element.id).checked = true;
        this.rowChecked.push(+element.id);
      }
    }else { //uncheked
      if (action === 'all'){
        // @ts-ignore
        let che = document.getElementsByClassName('ckb');//.checked = false;
        this.rowChecked = [];
        // @ts-ignore
        for(let i = 0; i < che.length; ++i) {
          // @ts-ignore
          che[i].checked = false;
        }
      }else {
        this.rowChecked  = this.rowChecked.filter(f => +f != +element.id);
        // @ts-ignore
        document.getElementsByClassName('ckb'+element.id).checked = false;

      }
    }

    console.log("eee ", element);
    this.isSelected = this.rowChecked.length > 0;
    console.log("this.rowChecked : ", this.rowChecked);
  }
  ValiderParams(){
    $('#OptionParamettreFormModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#OptionParamettreFormModal').appendTo('body');

  }

  // saveParamettre(){
  //   const options = this.rowChecked.map(rc => {
  //     return  { id : +rc }
  //   });
  //   const body = {
  //     annee : { id : +this.anneeScolaire },
  //     niveau : this.niveau,
  //     options: options
  //   }
  //   console.log("OOO: ", body);
  //   this.optionsService.createParamOptions(body).subscribe(paramRespond =>{
  //     console.log("body : -> ", paramRespond);
  //     this.isSelected = false;
  //     Util_fonction.SuccessMessage("Enregistré avec succès !");
  //     this.Parametrer();
  //   }, error => {
  //     Util_fonction.AlertMessage(error.error.status,error.error.message);
  //   });
  // }

  initSelectForm() {
    this.Filiere_SelectForm = this.formBluider.group({
      listFileres: new FormControl(null),
    });
  }


  initForm(){
    this.OptionForm = this.formBluider.group({
      filiere: new FormControl (null, Validators.required),
      codeOption : new FormControl (null, Validators.required),
      nom : new FormControl (null, Validators.required),
    });
  }
  initOptionParamForm(){
    this.OptionParamForm = this.formBluider.group({
      niveau: new FormControl (null, Validators.required),
      annee : new FormControl (null, Validators.required),
    });
  }
}

