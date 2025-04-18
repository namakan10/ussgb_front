import {Component, OnInit, ViewChild} from '@angular/core';
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";
import {StructureService} from "../../../services/structure.service";
import * as XLSX from 'xlsx';

import {Util_fonction} from "../../models/util_fonction";
import {NotesService} from "../../../services/GestionEtudiants/notes.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

import {_HTTP, PAG_SMALL_SIZE, UNIV_FILIERE, UNIV_OPTION} from "../../../CONSTANTES";
import {error} from "util";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ClassesService} from "../../../services/classes.service";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {environment} from "../../../../environments/environment";
import Swal from "sweetalert2";
import {FiliereService} from "../../../services/GestionFilieres/filiere.service";
import { PersonnelAdminService } from '../../aicha/personnel/personnel-admin/personnel-admin.service';
declare var $: any;
@Component({
  selector: 'app-liste-etudiants-non-inscrit',
  templateUrl: './liste-etudiants-non-inscrit.component.html',
  styleUrls: ['./liste-etudiants-non-inscrit.component.css']
})
export class ListeEtudiantsNonInscritComponent implements OnInit {

  env = environment.env;
  univ_opt = UNIV_OPTION
  univ_fil = UNIV_FILIERE
  dateExpiration: any;
  annee_scolaireF: any;
  annee_etudiant: any;
  annee_inscription: any;
  dataExp: any= {};
  user = JSON.parse(sessionStorage.getItem("user"));
  searchBody = {
    annee_etudiant: null,
    annee_inscription: null,
    id_structure: null,
    id_classe: null,
    id_filiere: null,
    id_groupe: null,
    id_option: null,
    niveau: null,
    nom: null,
    prenom: null,
    telephone: null,
    numEtudiant: null,
    size: null,
    page: null,
  };

  SendData = {
    idOption: null,
    nationalite: null,
    telephoneTuteur: null,
    user:{
      dateDeNaissance: null,
      email: null,
      genre: null,
      lieuDeNaissance: null,
      nom: null,
      numMatricule: null,
      photo: null,
      porte: null,
      prenom: null,
      quartier: null,
      rue: null,
      telephone: null,
      ville: null
    }
  }

  niveau: any;
  annee_scolaire: any;
  numEtudiant: any;
  prenom: any;
  nom: any;
  telephone: any;

  anneeStructure: any;
  spinner1: any;

  id_groupe: any;
  id_classe: any;


  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'check',
    'numEtudiant',
    'prenom',
    'nom',
    'nationalite',
    'telephone',
    'codeFiliere',
    'codeOption',
    'typeCandidat',
    'statut',
    'scolarite',
    'dateExpiration',
    'etat',
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;


  EtudiantBody = {
    anneeScolaire: null,
    dateExpiration: null,
    idOption: null,
    nationalite: null,
    scolarite: null,
    statut: null,
    telephoneTuteur: null,
    typeCandidat: null,
    user: {
      dateDeNaissance: null,
      email: null,
      genre: null,
      lieuDeNaissance: null,
      nom: null,
      numMatricule: null,
      photo: null,
      porte: null,
      prenom: null,
      quartier: null,
      rue: null,
      telephone: null,
      typeUtilisateur: null,
      ville: null,
    }
  }
  several: boolean = false;
  hideFields: boolean = false;
  HasRoleRectoratAction: boolean = false;
  HasRoleRectoratRead: boolean = false;
  TransfertForm: FormGroup;
  SendDataArray: any = [];
  _http = _HTTP;
  Structures;
  anneeSelected;
  structure;
  _RECTORAT: boolean =  this.user.structure.type == 'RECTORAT';
  constructor(private etudiantService : EtudiantService,
              private notesService: NotesService,
              private optionService: OptionsService,
              private classeService: ClassesService,
              private fb: FormBuilder,
              private personnelService: PersonnelAdminService,
              private structureService: StructureService,
              private filiereService: FiliereService,
              private optionSService: OptionsService,
              ) {
    this.HasRoleRectoratAction = Util_fonction.checkIfAsRole2(
      this.user, ["ROLE_ADMIN", "ROLE_SCOLARITE_RECTORAT"]);

    this.HasRoleRectoratRead = Util_fonction.checkIfAsRole2(
      this.user, ["ROLE_RECTEUR","ROLE_VRECTEUR","ROLE_DGA","ROLE_DG"]);

    this.initForm();
    this.initEtudiantDataChangeForm();
    this.initTranfertForm();
    this.initExterneTranfertForm();

  }

  ngOnInit() {

    this.GetAllStructures();

    // if (this._RECTORAT){
    //   this.GetAllStructures();
    // } else {
      this.structureId = this.user.structure.id;
      this.GetOptionsCurrentS();
      this.GetAnneeCurrentS();
    // }

  }

  public CheckIfIsNull(element: any): boolean {
    return Util_fonction.checkIfNoTEmpty(element);
  }

  structureId;
  GetAnneeCurrentS(){
    this.structureService.getStuctureAnnees(this.structureId).subscribe(
      (res) => {
        this.anneeStructure = res;
        this.spinner1 = false;
      });
  }
  exportexcel() {
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Liste-etudiant.xlsx');
 }
  StructuresTemp;
  GetAllStructures(){
    this.structureService.getStuctures().subscribe(
      (res) => {
        this.Structures = res.filter(s => s.type !== "RECTORAT");
        this.StructuresTemp = this.Structures;
        this.spinner1 = false;
      });
  }

  ClassParamBody ={
    idStructure: null,
    annee: null,
    idOption: null
  }
  classes: any;
  classspinner: boolean = false;
  GetClasses(){
    this.ClassParamBody.idStructure = this.user.structure.id;
    this.ClassParamBody.annee = this.annee_scolaire;
    this.classeService.getClasses(this.ClassParamBody).subscribe(
      (res) => {
        this.classes = res.content;
        this.classspinner = false;
      },
      (error) => {
      });
  }

  changeAnnee(event){
    this.annee_scolaire = event.target.value;
    this.GetClasses();
  }

  bloqueDebloquer(idUser, status): void {
    this.spinner = true;
    this.personnelService.bloqueDebloquer(idUser, {statut: status})
      .subscribe(value => {
        this.spinner = false;
        Util_fonction.SuccessMessage(value);
        this.Afficher();
      }, error => {
        this.spinner = false;
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })
  }

  StructureSelected;
  StructureChange(event){
    this.structureId = +event.target.value;
    this.dataSource = new MatTableDataSource([]);
    this.StructureSelected = this.Structures.find(s => s.id.toString() === event.target.value.toString());
    this.GetAnneeCurrentS();
    this.GetOptionsCurrentS();
  }

  spinner: boolean = false;
  Afficher(){
    this.SendDataArray = [];
    this.spinner = true;
    this.searchBody.id_structure = this.structureId;
    this.searchBody.annee_etudiant = this.annee_etudiant;
    this.searchBody.annee_inscription = this.annee_inscription;
    this.searchBody.niveau = this.niveau;
    this.searchBody.telephone = this.telephone;
    this.searchBody.numEtudiant = this.numEtudiant;
    this.searchBody.prenom = this.prenom;
    this.searchBody.nom = this.nom;
    this.searchBody.id_classe = this.id_classe;
    this.searchBody.id_groupe = this.id_groupe;
    this.searchBody.id_option = this.id_option;
    this.etudiantService.getEtudiantNonInscrit(this.searchBody).subscribe(
      res =>{
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence2(PAG_SMALL_SIZE, res.totalElements);
        this.spinner = false;
      }, error => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })
  }

  Options: any;
  GetOptionsCurrentS(){
    this.optionService.getStructure_Options(this.structureId).subscribe(
      res =>{
        this.Options = res;
        this.Options.map(o => {o.nom = o.codeOption+" "+o.nom});
      }
    )
  }



  UesNotInCourse: any;
  EtudiantData: any;
  getUeNotInCourse(dataItem){

    this.EtudiantData = dataItem;
    this.notesService.GetEtudiantUeNotInCourse(dataItem.id).subscribe(
      res =>{

          if (Object.keys(res).length > 0){
            Util_fonction.AlertMessage("info", "Liste vide !");
          }else {
            this.UesNotInCourse = res;
            $('#uesNotFormModal').modal({
              backdrop: 'static',
              keyboard: false
            });
            $('#uesNotFormModal').appendTo('body');

          }

      }, error => {

      });
  }

  //================================================================
  //MODIFICATION DES INFO ETUDIANTS
  //================================================================

  EtudiantEditData:any={};
  EditEtudiants(element){
    // this.EtudiantBody.statut = element.statut;
    // this.EtudiantBody.typeCandidat = element.typeCandidat;

    this.EtudiantForm.controls.statut.setValue(element.statut);
    this.EtudiantForm.controls.typeCandidat.setValue(element.typeCandidat);

    this.EtudiantEditData = element;
    this.EtudiantBody.anneeScolaire = element.anneeScolaire;
    this.EtudiantBody.dateExpiration = element.dateExpiration;
    this.EtudiantBody.idOption = element.option.id;
    this.EtudiantBody.nationalite = element.nationalite;
    this.EtudiantBody.scolarite = element.scolarite;
    this.EtudiantBody.telephoneTuteur = element.telephoneTuteur;

    this.EtudiantBody.user.dateDeNaissance = element.user.dateDeNaissance;
    this.EtudiantBody.user.email = element.user.email;
    this.EtudiantBody.user.genre = element.user.genre;
    this.EtudiantBody.user.lieuDeNaissance = element.user.lieuDeNaissance;
    this.EtudiantBody.user.nom = element.user.nom;
    this.EtudiantBody.user.numMatricule = element.user.numMatricule;
    this.EtudiantBody.user.photo = element.user.photo;
    this.EtudiantBody.user.prenom = element.user.prenom;
    this.EtudiantBody.user.quartier = element.user.quartier;
    this.EtudiantBody.user.rue = element.user.rue;
    this.EtudiantBody.user.telephone = element.user.telephone;
    this.EtudiantBody.user.typeUtilisateur = element.user.typeUtilisateur;
    this.EtudiantBody.user.ville = element.user.ville;


    $('#EditEtudiantModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#EditEtudiantModal').appendTo('body');
  }
  _spinner2: boolean = false;
  saveEtudiantChange(){
    this._spinner2 = true;
    this.EtudiantBody.statut = this.EtudiantForm.controls.statut.value;
    this.EtudiantBody.typeCandidat = this.EtudiantForm.controls.typeCandidat.value;
    this.etudiantService.UpdateEtudiantInfo(this.EtudiantEditData.id, this.EtudiantBody).subscribe(
      res =>{
        this._spinner2 = false;
        Util_fonction.SuccessMessage(res);
        $('#EditEtudiantModal').modal('hide');
        this.Afficher();
      }, error =>{
        this._spinner2 = false;
        Util_fonction.AlertMessage(error.error.statut, error.error.message);
      }
    )
  }

  etudiantID
  LaunchEtudiantDataModif(element){
    this.EtudiantEditData = element;
    this.ChangeDataForm.controls.nationalite.setValue(element.nationalite);
    this.ChangeDataForm.controls.telephoneTuteur.setValue(element.telephoneTuteur);

    this.ChangeDataForm.controls.dateDeNaissance.setValue(Util_fonction.DateConvert2(element.user.dateDeNaissance));
    this.ChangeDataForm.controls.email.setValue(element.user.email);
    this.ChangeDataForm.controls.genre.setValue(element.user.genre);
    this.ChangeDataForm.controls.lieuDeNaissance.setValue(element.user.lieuDeNaissance);
    this.ChangeDataForm.controls.nom.setValue(element.user.nom);
    this.ChangeDataForm.controls.numMatricule.setValue(element.user.numMatricule);
    this.ChangeDataForm.controls.photo.setValue(element.user.photo);
    this.ChangeDataForm.controls.prenom.setValue(element.user.prenom);
    this.ChangeDataForm.controls.porte.setValue(element.user.porte);
    this.ChangeDataForm.controls.quartier.setValue(element.user.quartier);
    this.ChangeDataForm.controls.rue.setValue(element.user.rue);
    this.ChangeDataForm.controls.telephone.setValue(element.user.telephone);
    this.ChangeDataForm.controls.ville.setValue(element.user.ville);
    this.ChangeDataForm.controls.option.setValue(element.option.id);
// -- In TS import par

    $('#etutiandInfoChangeModal').modal('show');
    $('#etutiandInfoChangeModal').appendTo('body');

  }
  modifSpinner: boolean = false;
  SaveEtudiantData() {
    this.modifSpinner = true;
    this.SendData.nationalite = this.ChangeDataForm.controls.nationalite.value;
    this.SendData.telephoneTuteur = this.ChangeDataForm.controls.telephoneTuteur.value;

    this.SendData.user.dateDeNaissance = this.ChangeDataForm.controls.dateDeNaissance.value;
    this.SendData.user.email = this.ChangeDataForm.controls.email.value;
    this.SendData.user.genre = this.ChangeDataForm.controls.genre.value;
    this.SendData.user.lieuDeNaissance = this.ChangeDataForm.controls.lieuDeNaissance.value;
    this.SendData.user.nom = this.ChangeDataForm.controls.nom.value;
    this.SendData.user.numMatricule = this.ChangeDataForm.controls.numMatricule.value;
    this.SendData.user.photo = this.ChangeDataForm.controls.photo.value;
    this.SendData.user.prenom = this.ChangeDataForm.controls.prenom.value;

    if (this.ChangeDataForm.controls.porte.value !== null &&
      this.ChangeDataForm.controls.porte.value !== "" &&
      this.ChangeDataForm.controls.porte.value !== undefined){
      this.SendData.user.porte = +this.ChangeDataForm.controls.porte.value;
    }
    this.SendData.user.quartier = this.ChangeDataForm.controls.quartier.value;
    if (this.ChangeDataForm.controls.rue.value !== null &&
      this.ChangeDataForm.controls.rue.value !== "" &&
      this.ChangeDataForm.controls.rue.value !== undefined) {
      this.SendData.user.rue = this.ChangeDataForm.controls.rue.value;
    }
    this.SendData.user.telephone = this.ChangeDataForm.controls.telephone.value;
    this.SendData.user.ville = this.ChangeDataForm.controls.ville.value;
    this.SendData.idOption = this.ChangeDataForm.controls.option.value;


    this.etudiantService.UpdateEtudiantInfo(this.EtudiantEditData.id,this.SendData).subscribe(Updateresponse =>{
      this.Afficher();
      $('#etutiandInfoChangeModal').modal('hide');
      this.modifSpinner = false;
      Util_fonction.SuccessMessage(Updateresponse);

    }, updateError => {

      this.modifSpinner = false;
      Util_fonction.AlertMessage(updateError.error.status, updateError.error.message);
    })
  }



  champ = null;
  changeChoix(event){
    if (event.target.name === 'id_classe'){
      if (!Util_fonction.checkIfNoTEmpty(event.target.value)){
        this.champ ='niveau';
      }else {
        this.champ ='classe';
      }

    }
    if (event.target.name === 'niveau'){
      if (!Util_fonction.checkIfNoTEmpty(event.target.value)){
        this.champ ='classe';
      }else {
        this.champ ='niveau';
      }
    }
  }

  id_option :any;
  keyword = 'nom';
  OptionSelected;
  OptionSelectEvent(event){
    this.OptionSelected = event
    if (Util_fonction.checkIfNoTEmpty(event)){
      this.id_option = event.id;
    }
  }

  ChangeDateExpiration(){
    this._spinner2 = true;
    let path = '';
    // tslint:disable-next-line:no-unused-expression
    this.dataExp.dateExpiration = this.dateExpiration;
    if (this.EtudiantEditData.id !== undefined) {
      this.dataExp.idEtudiant = this.EtudiantEditData.id;
      path = 'prolongerCompteParEtudiant';
    } else {
      this.dataExp.anneeScolaire = this.annee_scolaireF;
      this.dataExp.idStructure = this.user.structure.id;
      path = 'prolongerCompteParAnneeScolaire';
    }
    this.etudiantService.changeDateExpiration(path, this.dataExp).subscribe(
      resPonse => {
        this._spinner2 = false;
        Util_fonction.SuccessMessage(resPonse);
        $('#dateExpirationModal').modal('hide');
        this.Afficher();
      }, errorResponse => {
        this._spinner2 = false;
        Util_fonction.AlertMessage(errorResponse.error.statut, errorResponse.error.message)
      }
    )
  }
  
  TranfertOptionSelectEvent(element){
    if (Util_fonction.checkIfNoTEmpty(element)){
      this.TransfertForm.controls.optionTransfert.setValue(element);
    }
  }


  TransfertChoose(action){
    Swal.fire({
      title: '',
      text: "Type de transfert",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Interne',
      cancelButtonText: 'Autre structure',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.InterneTranfertModal(action);
      }else if (result.dismiss === Swal.DismissReason.cancel){
        this.ExterneTransfert(action);
      }
    })
  }

  SingleEtudiantData = undefined;
  // formTab : FormGroup;
  InterneTranfertModal(action){
    this.initTranfertForm();
    if (action === 'several'){
      this.SingleEtudiantData = undefined;
    }else {
      // Sigle Send cas
      this.SingleEtudiantData = action;
      this.SendDataArray = {
        date: null,
        etudiant_id: action.id,
        option_id: null,
        statut: null,
        type: 'TRANSFERT'
      };

      //Tous décoché
      let element = $('.ck');
        for (let i = 0; i < element.length; i++) {
          element[i].checked = false;
        }
    }
    $('#InterneTranfertFormModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#InterneTranfertFormModal').appendTo('body');

  }

  //CELA EST INDIVIDUEL POUR LE MOMENT
  ExterneTransfert(actionData){
    this.SingleEtudiantData = actionData;

    $('#ExterneTranfertFormModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#ExterneTranfertFormModal').appendTo('body');
  }


 
  expirationModal(data){
    this.EtudiantEditData = data;
    $('#dateExpirationModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#dateExpirationModal').appendTo('body');
  }

  Filieres;
  ArrivalStructureID;
  structureChange(event){
    //GetFilières
    let strucID = event.target.value;
    this.ArrivalStructureID = strucID;
    this.filiereService.getStructureFilieres(strucID).subscribe(filieres =>{
      this.Filieres = filieres;
    });
  }

  OptionsOfFil;
  fil_keyword = "nom";
  FiliereChange(event){
    //GetFilières
    let filiereID = event.id;
    this.optionSService.getOptionsByFiliereID(filiereID).subscribe(options =>{
      this.OptionsOfFil = options.filter(op => op.id != this.user.structure.id);
      this.OptionsOfFil.map(o => {o.nom = o.codeOption+" "+o.nom});
    });
  }

  path = null;
  SaveTransfertData(){

    if (this.SingleEtudiantData === undefined){
      this.path = "transfert_list";
      this.SendDataArray.map(data => {
        data.option_id = this.TransfertForm.controls.optionTransfert.value.id;
        data.statut = this.TransfertForm.controls.statutTransfert.value;
      })
    } else {
      this.path = "transfert";
      this.SendDataArray.option_id = this.TransfertForm.controls.optionTransfert.value.id;
      this.SendDataArray.statut = this.TransfertForm.controls.statutTransfert.value;
    }

    this.etudiantService.getEtudiantTransfert(this.path, this.SendDataArray).subscribe(
      resPonse =>{
        Util_fonction.SuccessMessage(resPonse);
        $('#TranfertFormModal').modal('hide');
        this.Afficher();
      },errorResponse =>{
        Util_fonction.AlertMessage(errorResponse.error.statut, errorResponse.error.message)
      }
    )

  }

  ConfirmExterneTransferSave(){
    Swal.fire({
      title: "",
      text: "Êtes-vous sûr des données fournies, pour le transfert de : "+this.SingleEtudiantData.numEtudiant+
      " : "+this.SingleEtudiantData.prenom+" "+this.SingleEtudiantData.nom,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui! valider',
      cancelButtonText: 'Non!',
      reverseButtons:true
    }).then((result) => {
      if (result.isConfirmed) {
        this.SaveExterneTransfert();
      }
    })
  }
  SaveExterneTransfert(){
    const data = {
      idArrivalStructure: +this.ArrivalStructureID,
      idDepartStructure: +this.user.structure.id,
      idEtudiant: +this.SingleEtudiantData.id,
      idOption: +this.ExterneTransfertForm.controls.newStructureoption.value.id
    }

    this.etudiantService.saveEtudiantExterneTransfert(data).subscribe(
      transfResp =>{
        Util_fonction.SuccessMessage(transfResp);
        $('#ExterneTranfertFormModal').modal('hide');
      },errorResponse =>{
        Util_fonction.AlertMessage(errorResponse.error.statut, errorResponse.error.message)
      });
  }

  data = {
    date: null,
    etudiant_id: null,
    option_id: null,
    statut: null,
    type: 'TRANSFERT'
  }
  isCheckedOrNot(event){
    this.data.type = "";

    if (event.target.name === 'allSelector'){
     this.CheckALl(event.target.checked);
    }else {
      this.CheckSing(event);
    }
  }
  CheckALl(status){
    // let element = document.getElementsByClassName('ck');
    let element = $('.ck');
    if (status){
      this.SendDataArray = [];
      for (let i = 0; i < element.length; i++) {
        this.SendDataArray.push({
          date: null,
          etudiant_id: element[i].value,
          option_id: null,
          statut: null,
          type: 'TRANSFERT'
        });
        element[i].checked = status;
      }
      this.several = Object.keys(this.SendDataArray).length > 1;
    } else {
      for (let j = 0; j < element.length; j++) {
        element[j].checked = status;
        this.SendDataArray = this.SendDataArray.filter(d => d.etudiant_id !== element[j].value);
      }
    }
  }

  CheckSing(event){
    if (event.target.checked){
      // this.data.etudiant_id = event.target.value;
      this.SendDataArray.push({
        date: null,
        etudiant_id: event.target.value,
        option_id: null,
        statut: null,
        type: 'TRANSFERT'
      });

    }else {
      this.SendDataArray = this.SendDataArray.filter(data => {
        return data.etudiant_id !== event.target.value && data;
      });
    }

    this.several = Object.keys(this.SendDataArray).length > 1;

  }



  EtudiantForm: FormGroup;
  ChangeDataForm: FormGroup;
  initForm(){
    this.EtudiantForm = this.fb.group({
      statut: new FormControl(null, Validators.required),
      typeCandidat: new FormControl(null, Validators.required),
      anneeScolaire: new FormControl(null, Validators.required),
      dateExpiration: new FormControl(null),
      idOption: new FormControl(null,Validators.required),
      nationalite: new FormControl(null,Validators.required),
      scolarite: new FormControl(null,Validators.required),
      telephone: new FormControl(null,Validators.required),
      telephoneTuteur: new FormControl(null,Validators.required),
      //  Utilisateur
      nom: new FormControl(null,Validators.required),
      prenom: new FormControl(null,Validators.required),
      photo: new FormControl(null,Validators.required),
      numMatricule: new FormControl(null,Validators.required),
      dateDeNaissance: new FormControl(null,Validators.required),
      email: new FormControl(null,Validators.required),
      genre: new FormControl(null,Validators.required),
      lieuDeNaissance: new FormControl(null,Validators.required),
      ville: new FormControl(null,Validators.required),
      quartier: new FormControl(null,Validators.required),
      rue: new FormControl(null),
      porte: new FormControl(null),


    })
  }

  initTranfertForm(){
    this.TransfertForm = this.fb.group({
      statutTransfert: new FormControl('ACCEPTEE', Validators.required),
      optionTransfert: new FormControl(null, Validators.required),
    })
  }

  ExterneTransfertForm: FormGroup;
  initExterneTranfertForm(){
    this.ExterneTransfertForm = this.fb.group({
      arrivalStructure: new FormControl(null, Validators.required),
      newStructureoption: new FormControl(null, Validators.required),
    })
  }

  initEtudiantDataChangeForm(){
    this.ChangeDataForm = this.fb.group({
      nationalite: new FormControl(null,[Validators.required]),
      telephoneTuteur: new FormControl(null),

      dateDeNaissance: new FormControl(null,[Validators.required]),
      email: new FormControl(null,[Validators.required]),
      genre: new FormControl(null,[Validators.required]),
      lieuDeNaissance: new FormControl(null,[Validators.required]),
      nom: new FormControl(null,[Validators.required]),
      numMatricule: new FormControl(null,[Validators.required]),
      photo: new FormControl(null,[Validators.required]),
      porte: new FormControl(null),
      prenom: new FormControl(null,[Validators.required]),
      quartier: new FormControl(null,[Validators.required]),
      rue: new FormControl(null),
      telephone: new FormControl(null),
      ville: new FormControl(null,[Validators.required]),

      filiere: new FormControl(null),
      option: new FormControl(null)
    });
  }

}
