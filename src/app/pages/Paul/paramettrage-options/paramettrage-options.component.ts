import {Component, OnInit, ViewChild} from '@angular/core';
import {StructureService} from "../../../services/structure.service";
import {FiliereService} from "../../../services/GestionFilieres/filiere.service";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {FormBuilder} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {PAG_SMALL_SIZE, UNIV_FILIERE, UNIV_OPTION, UNIV_OPTION_S} from "../../../CONSTANTES";
import {Util_fonction} from "../../models/util_fonction";
import Swal from "sweetalert2";
import {error} from "util";

declare var $: any;

@Component({
  selector: 'app-paramettrage-options',
  templateUrl: './paramettrage-options.component.html',
  styleUrls: ['./paramettrage-options.component.css']
})
export class ParamettrageOptionsComponent implements OnInit {
  univ_fil = UNIV_FILIERE;
  univ_opt = UNIV_OPTION;
  univ_opts = UNIV_OPTION_S;


  id_structure;
  user = JSON.parse(sessionStorage.getItem('user'));
  anneeScolaire;

  keyword="nom";

  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort: MatSort;

  dataSource:MatTableDataSource<any>;
  displayedColumns: string[] = [
    'check',
    'nom',
    'codeOption',
    'actions'
  ];
  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;

  selectedOpt;
  constructor(
    private structureService: StructureService,
    private filiereService: FiliereService,
    private optionsService: OptionsService,
    private formBluider: FormBuilder,
  ) { }

  ngOnInit() {
    this.id_structure = this.user.structure.id;
    this.getStructureFilieres();
    this.getStructureOptions();
    this.GetStuctureAnnees();

  }

  StructureAnnees;
  GetStuctureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id)
      .subscribe(res => {
        this.StructureAnnees = res;
      })
  }

  Filieres
  getStructureFilieres(){
    this.filiereService.getStructureFilieres(this.id_structure).subscribe(
      res => {
        this.Filieres = res.filter(r => r.nom = r.nom+" "+r.id);

      }
    )
  }

  Options;
  getStructureOptions(){
    this.optionsService.getStructure_Options(this.id_structure).subscribe(
      res => {
        this.Options = res.map(o => {return {id: o.id, nom: o.codeOption+" "+o.nom}});
        this.OptionsList = this.Options.filter(op => !this.currentListIds.includes(+op.id));
      }
    )
  }

  annee;
  filiere;
  niveau;
  change_spinner:boolean = false;
  isListed:boolean = false;
  dataSourceTemp;
  currentListIds = [];
  dataElements :any;
  idProgrammation = 0;
  Afficher(){
    console.log("filiere : ", this.filiere);
    const params = {
      id_annee: this.annee,
      niveau: this.niveau,
    }
    this.optionsService.getPramOptions2(params).subscribe(list => {
      console.log("List : ", list);
      const data = list.content.length > 0 ? list.content[0].options : [];
      this.dataElements = list.content;
      this.idProgrammation = list.content.length > 0 ? list.content[0].id : 0;
      this.dataSource = new MatTableDataSource(data);
      // this.currentListIds = list.map(c => +c.id);
      this.dataSource.sort = this.sort;
      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
      this.isListed = true;
      this.change_spinner = false;

    }, error =>{
      Util_fonction.AlertMessage(error, error.error.message);
    });

  }


  //========================================================
  //PARAMETTRER
  //========================================================
  showChekbox = false;
  isSelected = false;
  rowChecked = [];
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


  OptionsList;
  newAction = "";
  AddNew(action){
    this.newAction = action;
    this.selectedOpt = [];
      $('#OptionParamettreFormModal').modal({
        backdrop: 'static',
        keyboard: false
      });
      $('#OptionParamettreFormModal').appendTo('body');

  }

  saveParamettre(){
    if (this.selectedOpt.length <=0){
      Util_fonction.AlertMessage("warning"," veuillez sélectionner une "+this.univ_opt);
      return;
    }
    console.log(":: ", this.selectedOpt);
    // const options = this.rowChecked.map(rc => {
    //   return  { id : +rc }
    // });

     if (this.newAction === 'creation'){
      const body = {
        annee : { id : +this.annee },
        niveau : this.niveau,
      }
      this.optionsService.createProgrammationOptions(body).subscribe(paramRespond =>{
        console.log("body : -> ", paramRespond);
        this.isSelected = false;
        this.Afficher();
        $('#OptionParamettreFormModal').modal('hide');
        Util_fonction.SuccessMessage("Enregistré avec succès !");
      }, error => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
    }else {
       const options = this.selectedOpt.map(so => {return {id: +so}});

      this.optionsService.addOptionsToProgramme(this.idProgrammation, options).subscribe(paramRespond =>{
        console.log("body : -> ", paramRespond);
        this.isSelected = false;
        this.Afficher();
        $('#OptionParamettreFormModal').modal('hide');
        Util_fonction.SuccessMessage("Enregistré avec succès !");
      }, error => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });


    }

  }


  //Delete:
  SupprimerParamOption(action, element?){
    const msg = action === "mult" ? "Êtes-vous sûr de vouloir supprimer le(s) "+this.univ_opt+"(s)":
      "Êtes-vous sûr de vouloir supprimer "+element.nom;
    Swal.fire({
      title: '',
      html: msg,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'non, annuler',
      confirmButtonText: 'Oui, Supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        let options;
        if (action === "mult"){
          options = this.rowChecked.map(r => {return {id: +r}});
        }else {
          options = [{id: element.id}];
        }
          this.optionsService.deleteParamOptions(this.idProgrammation, options).subscribe( deletRes=>{
            console.log(deletRes);
            this.Afficher();
            Util_fonction.SuccessMessage("Supprimer avec succèd !! ");
          }, deleerror => {
            Util_fonction.AlertMessage(deleerror.error.status, deleerror.error.message);
          })
      }
    });
  }

  deleteProgrammation(){
    Swal.fire({
      title: '',
      html: "Êtes-vous sûr de vouloir supprimer la programmation "+this.dataElements[0].annee.anneeScolaire+" / "+this.dataElements[0].niveau,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'non, annuler',
      confirmButtonText: 'Oui, Supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.optionsService.delete_Programmation(this.idProgrammation).subscribe( deletRes2=>{
          console.log(deletRes2);
          this.Afficher();
          Util_fonction.SuccessMessage("Programmation supprimée avec succès !");
        }, deleerror => {
          Util_fonction.AlertMessage(deleerror.error.status, deleerror.error.message);
        })
      }
    });
  }

  checkUndefined(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

}
