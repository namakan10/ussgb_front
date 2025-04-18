import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PersonnelAdminService} from "../../../services/GestionPersonnelAdmin/personnel-admin.service";
import {MatTableDataSource} from "@angular/material/table";
import {Util_fonction} from "../../models/util_fonction";
import {PAG_SMALL_SIZE, UNIV_FILIERE, UNIV_OPTION} from "../../../CONSTANTES";
import {UesServiceService} from "../../../services/ues.service";
import {StructureService} from "../../../services/structure.service";
import {SallesComponent} from "../salles/salles.component";
import {BatimentSalleService} from "../../../services/batiment-salle.service";
import {ClassesService} from "../../../services/classes.service";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: 'app-programmer-seances',
  templateUrl: './programmer-seances.component.html',
  styleUrls: ['./programmer-seances.component.css']
})
export class ProgrammerSeancesComponent implements OnInit {

  Univ_opt = UNIV_OPTION;
  showList:boolean =true;
  typeList;
  enseignantL;
  optionL;
  jour;
  //==================

  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'typeSeance',
    'dateDebut',
    'heure',
    'enseignant',
    'ue',
    'ec',
    'salle',

    'actions'
  ];

  // 'lundi',
  // 'mardi',
  // 'mercredi',
  // 'jeudi',
  // 'vendredi',
  // 'samedi',
  // 'dimanche',
  //

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @Input() inputBatiment;
  @Input() batimentStructID;

  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50, 100];
  length = 100;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  //==================
  seanceForm: FormGroup;
  user = JSON.parse(sessionStorage.getItem('user'));
  personnelBody = {
    id_structure: null,
    role: null
  };
  groupeBody = {
    idStructure: null,
    annee : null,
    niveau : null,
    idOption : null
  };
  seanceBody= {
    annee: {id: null},
    dateDebut: null,
    enseignant: {id:null},
    heureDebut:null,
    heureFin: null,
    nbreSemaine: null,
    salle: {id:null},
    typeSeance: null,
    ue: null,
    elementConstitutif: null,
    groupes: [],
    key: null,
    showData: {
      selectSalle:null,
      selectUE:null,
      selectEC:null,
      selectEns:null,
      selectGroup:null
    }
  }
  constructor(private formBuilder: FormBuilder, private anneeService: StructureService,
              private salle: BatimentSalleService, private groupe: ClassesService,
              private optionService: OptionsService,
              private personnel: PersonnelAdminService, private ueService: UesServiceService) { }

  ngOnInit() {
    this.initSeanceForm();
    this.GetAnnees();
    this.GetSalles();
    this.GetEnseignantsANDvacataire();
    this.GetStructureOptions();
  }

  Paserelle(){
    this.showList = !this.showList;
    this.dataSource = new MatTableDataSource([]);
    this.WeekSeance = null;
    this.initSeanceForm();
  }
  grisBtn:boolean =true
  ListChange(){
    this.enseignantL = null;
    this.optionL = null;
    this.jour = null;
    this.grisBtn = this.typeList !== "All";
  }

  is_Change(event){
    console.log("dd ",event);
    this.enseignantL = this.typeList === "Ens" ? event : null;
    this.optionL = this.typeList === "Opt" ? event : null;
    this.jour = this.typeList === "Jour" ? event.target.value : null;
    this.grisBtn = false;
    console.log("--->this.enseignantL ", this.enseignantL);
  }

  Annees: any;
  showAnnee = false;
  GetAnnees(){
    this.anneeService.getStuctureAnnees(this.user.structure.id).subscribe(
      (annees) => {
        this.Annees = annees;
      });
  }

  Options;
  OptionKeyword = "nom";
  _SpinnerOptions = false;
  GetStructureOptions(){
    this._SpinnerOptions = true;
    const univFil = UNIV_FILIERE;
    this.optionService.getStructureOptions(this.user.structure.id).subscribe(
      (structureOptions) => {
        this.Options = structureOptions;
        this.Options.map(op => op.codeOption+' '+op.nom+' | '+univFil+': '+op.filiere.codeFiliere);

        this.seanceForm.controls.option.reset();
        this.seanceForm.controls.option.setValidators([Validators.required]);
        this.seanceForm.controls.option.updateValueAndValidity();

        this.chowOptions = true;
        this._SpinnerOptions = false;

      });
  }
  OptionSelected(element){
    this.seanceForm.controls.option.setValue(element);
    this.GetGoupes();
  }


  handleTypeVisibility(){
  // && this.seanceForm.controls.niveau.valid
    if (this.seanceForm.controls.annee.valid){
      this.showAnnee = true;
    } else {
      this.seanceForm.controls.annee.reset();
      this.seanceForm.controls.annee.updateValueAndValidity();

      this.showAnnee = false;
    }
  }


  Salles: any;
  SalleKeyword = 'numSalle';
  GetSalles(){
    this.salle.GetStructureSalles(this.user.structure.id).subscribe(
      (salles) => {
        this.Salles = salles;
        this.Salles.map(s=> s.numSalle += ' | '+s.nbrePlace+' places '+' | type: '+s.typeSalle);
      });
  }
  salleSelectEvent(event){
    this.seanceForm.controls.salle.setValue(event);
  }

  Enseignants: any;
  Vacataires: any;
  AllEnseignant: any;
  EnseignantKeyword= 'nom';
  ensID;
  showChoose = false;
  GetEnseignantsANDvacataire(){
    this.personnelBody.id_structure = this.user.structure.id;
    this.personnelBody.role = 'ROLE_ENSEIGNANT';
    this.personnel.getStructurePersonnel(this.personnelBody).subscribe(
      (enseignants) => {
        this.Enseignants = enseignants.content;

        this.personnelBody.id_structure = this.user.structure.id;
        this.personnelBody.role = 'ROLE_VACATAIRE';
        this.personnel.getStructurePersonnel(this.personnelBody).subscribe(
          (vacataires) => {
            this.Vacataires = vacataires.content;
            let filt = this.Enseignants.concat(this.Vacataires);
            this.AllEnseignant = filt.filter(ev => ev.user.typeUtilisateur === "VACATAIRE" || ev.user.typeUtilisateur === "ENSEIGNANT")
            this.AllEnseignant.map(e => e.nom += ' '+e.prenom+' | Spécialite/Fonction: '+e.specialiteFonction.nom+' | statut: '+e.statut)
          });

      });
  }
  enseignantSelectEvent(event){
    this.ensID = event.id;
    this.seanceForm.controls.enseignant.setValue(event);
    this.showChoose = true;


  }

  EnseignantUes;
  UeKeyword='nomUE';
  GetAllUe(){
    let body = {
      id_structure: this.user.structure.id,
      semestre: null,
      id_option:null
    }
    this.ueService.getUes(body).subscribe(allUE =>{
      this.EnseignantUes = allUE.content;
      this.EnseignantUes.map(ue => ue.nomUE = ue.codeUE+' | '+ue.nomUE);
      this._Spinner = false;
      this.showUe = true;
      this.showEc = false;
      this.seanceForm.controls.elementConstitutif.reset();
      this.seanceForm.controls.elementConstitutif.setValidators(null);
      this.seanceForm.controls.elementConstitutif.updateValueAndValidity();

      this.seanceForm.controls.ue.reset();
      this.seanceForm.controls.ue.setValue(null);
      this.seanceForm.controls.ue.setValidators([Validators.required]);
      this.seanceForm.controls.ue.updateValueAndValidity();

    });
  }
  GetUeOfSelectEnseignant(){
    if (Util_fonction.checkIfNoTEmpty(this.ensID)){
      this.ueService.getUeByTeacher(this.ensID).subscribe(enseignantUE =>{
        this.EnseignantUes = enseignantUE;
        this.EnseignantUes.map(ue => ue.nomUE = ue.codeUE+' | '+ue.nomUE);
        this._Spinner = false;
        this.showUe = true;
        this.showEc = false;
        this.seanceForm.controls.elementConstitutif.reset();
        this.seanceForm.controls.elementConstitutif.setValidators(null);
        this.seanceForm.controls.elementConstitutif.updateValueAndValidity();

        this.seanceForm.controls.ue.reset();
        this.seanceForm.controls.ue.setValue(null);
        this.seanceForm.controls.ue.setValidators([Validators.required]);
        this.seanceForm.controls.ue.updateValueAndValidity();

      });
    }else {
      Util_fonction.AlertMessage("warning", "Veuillez selectionner un enseignant ! dans le champs Enseignant.")
    }

  }
  ueSelectEvent(event){
    this.seanceForm.controls.ue.setValue(event);
  }

  EnseignantECs;
  EcKeyword ='nomEC';
  _Spinner = false;
  GetEcOfEnseignant(){
    if (Util_fonction.checkIfNoTEmpty(this.ensID)){
      this.ueService.getEcsByEnseignant(this.ensID).subscribe(enseignantEC =>{
        this.EnseignantECs = enseignantEC;
        this.EnseignantECs.map(ec => ec.nomEC = ec.codeEC+' | '+ec.nomEC);

        this._Spinner = false;
        this.showEc = true;
        this.showUe = false;
        this.seanceForm.controls.ue.reset();
        this.seanceForm.controls.ue.setValidators(null);
        this.seanceForm.controls.ue.updateValueAndValidity();

        this.seanceForm.controls.elementConstitutif.reset();
        // this.seanceForm.controls.elementConstitutif.setValue(null);
        this.seanceForm.controls.elementConstitutif.setValidators([Validators.required]);
        this.seanceForm.controls.elementConstitutif.updateValueAndValidity();
      })
    }else {
      Util_fonction.AlertMessage("warning", "Veuillez selectionner un enseignant ! dans le champs Enseignant.")
    }

  }
  GetAllEc(){
    let body = {
      id_structure: this.user.structure.id,
      semestre: null,
      id_option:null
    }
    this.ueService.GetEcs(body).subscribe(allEC =>{
      this.EnseignantECs = allEC;
      this.EnseignantECs.map(ec => ec.nomEC = ec.codeEC+' | '+ec.nomEC);

      this._Spinner = false;
      this.showEc = true;
      this.showUe = false;
      this.seanceForm.controls.ue.reset();
      this.seanceForm.controls.ue.setValidators(null);
      this.seanceForm.controls.ue.updateValueAndValidity();

      this.seanceForm.controls.elementConstitutif.reset();
      this.seanceForm.controls.elementConstitutif.setValidators([Validators.required]);
      this.seanceForm.controls.elementConstitutif.updateValueAndValidity();
    })
  }
  ecSelectEvent(event){
    this.seanceForm.controls.elementConstitutif.setValue(event);
  }

  getSeances
  paramBady = {
    id_option:null,
    date:null,
    id_structure:null,
  }
  WeekSeance;
  Afficher(){
    const id = this.typeList === "Ens" ? this.enseignantL.id : null;
    if (this.typeList ==="Opt"){
      this.paramBady.id_option = this.optionL.id;
    }
    if ( this.typeList ==="Jour" || this.typeList ==="All"){
      this.paramBady.id_structure = this.user.structure.id;
      this.paramBady.date = this.jour;
    }
    this.personnel.getSeances(this.typeList,this.paramBady, id).subscribe(seanceResponse => {
      if (this.typeList === "Opt" || this.typeList === "Jour" || this.typeList === "All"){
        this.dataSource = new MatTableDataSource(seanceResponse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
      }else {
        this.WeekSeance = seanceResponse;

        console.log("this.WeekSeance : "+this.WeekSeance);
      }
      console.log("seanceResponse : "+seanceResponse);
    });
  }

  deleteSeance(seance){
    console.log("seance = ", seance);
    Swal.fire({
      title: '',
      text: "Êtes-vous sûre de vouloir supprimer cette seance",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'oui, supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.personnel.deleteSeance(seance.id).subscribe(delRes =>{
          Util_fonction.SuccessMessage(delRes);
          this.Afficher();
        }, error1 => {
          Util_fonction.AlertMessage(error1.error.status, error1.error.message);
        });
      }
    })
  }


  showUe = false;
  showEc = false;
  CheckSelectBetweenUeAndEc(event){
    let action = '';
    if (typeof event === 'string'){
      action = event;
    }else {
      action = event.target.value;
    }

    this._Spinner = true;

    if (this.seanceForm.controls.typeSeance.value === 'CM'){
      //CAS BY ENSEIGNANT SELECTED
      if (action === 'ue'){
        this.GetUeOfSelectEnseignant()
      }else {
        this.GetEcOfEnseignant();
      }
    }else {
      // CAS ALL
      if (action === 'ue'){
        this.GetAllUe();
      }else {
        this.GetAllEc();
      }
    }
  }


  Groupes: any;
  GroupesFilter: any;
  _Spinner2 = false;
  GetGoupes(){
    this._Spinner2 = true;
    this.groupeBody.annee = this.seanceForm.controls.annee.value;
    this.groupeBody.niveau = this.seanceForm.controls.niveau.value;
    this.groupeBody.idStructure = this.user.structure.id;
    this.groupeBody.idOption = this.seanceForm.controls.option.value.id;
    this.groupe.getGroupes(this.groupeBody).subscribe(
      (groupes) => {
        this.Groupes = groupes;
        this.GroupesFilter = groupes;
        this.GroupesFilter.map (g => g.libelle = 'G '+g.libelle+' | '+g.filiere.codeFiliere+' | '+g.option.codeOption);

        this.chowGroupe = true;
        if  (this.GroupesFilter.length > 0){
          this.seanceForm.controls.groupes.setValidators([Validators.required]);
          this.seanceForm.controls.groupes.updateValueAndValidity();
        }else {
          this.seanceForm.controls.groupes.reset();
          this.seanceForm.controls.groupes.setValidators([]);
          this.seanceForm.controls.groupes.updateValueAndValidity();
        }

        this._Spinner2 = false;
      },error => {
        this._Spinner2 = false;
      });
  }

  chowGroupe = false;
  chowOptions = false;
  CheckTDGroupeVisibility(){
    this.seanceForm.controls.ue.reset();
    this.seanceForm.controls.elementConstitutif.reset();
    if ((this.seanceForm.controls.typeSeance.value === 'TD' || this.seanceForm.controls.typeSeance.value === 'TP') &&
      this.seanceForm.controls.niveau.valid && this.seanceForm.controls.annee.valid){
      this.GetStructureOptions();
    }else {
      this.chowOptions = false;
      this.chowGroupe = false;

      this.seanceForm.controls.groupes.reset();
      this.seanceForm.controls.groupes.setValidators(null);
      this.seanceForm.controls.groupes.updateValueAndValidity();

      this.seanceForm.controls.option.reset();
      this.seanceForm.controls.option.setValidators(null);
      this.seanceForm.controls.option.updateValueAndValidity();
    }

    this.CheckSelectBetweenUeAndEc(this.seanceForm.controls.typeSeance.value.toString())
  }

  GroupeFilter(event){
    event.preventDefault();
    let text = event.target.value;
    this.GroupesFilter = this.Groupes;
    this.GroupesFilter = this.GroupesFilter.filter(gf => gf.libelle.toLowerCase().includes(text.toLowerCase()));

    console.log("this.GroupesFilter ==>",this.GroupesFilter)
  }

  GroupArr = [];
  GroupSeleted(event){
    const iD = event.target.value;
    if (event.target.checked){
      this.GroupesFilter.map(gf => {
        if (+gf.id === +iD) gf.selected = true;
      });
      this.Groupes.map(g => {
        if (+g.id === +iD) g.selected = true;
      });
      this.GroupArr.push({id:+iD});
    }else {

      this.GroupesFilter.map(gf => {
        if (+gf.id === +iD) gf.selected = false;
      });
      this.Groupes.map(gf => {
        if (+gf.id === +iD) gf.selected = true;
      });
      this.GroupArr = this.GroupArr.filter(gr => +gr.id !== +iD);
    }

    this.seanceForm.controls.groupes.setValue(this.GroupArr);
    console.log(this.GroupArr);
    console.log(this.GroupesFilter);
  }


  seanceToSend = [];
  selectEns;
  selectSalle;
  selectGroup;
  selectUE;
  selectEC;
  addToList(){
    console.log("Form DATA :",this.seanceForm.value);
    const ans = this.Annees;
    console.log(this.seanceForm.controls.annee.value);
    const an = ans.filter(a => a.anneeScolaire.toString() === this.seanceForm.controls.annee.value.toString() && a);
    this.seanceBody.key = (new Date()).getTime();
    this.seanceBody.annee.id = an[0].id;
    // this.seanceBody.annee.id = this.seanceForm.controls.annee.value;
    this.seanceBody.typeSeance = this.seanceForm.controls.typeSeance.value;
    this.seanceBody.dateDebut = this.seanceForm.controls.dateDebut.value;
    this.seanceBody.heureDebut = this.seanceForm.controls.heureDebut.value+":00";
    this.seanceBody.heureFin = this.seanceForm.controls.heureFin.value+":00";
    this.seanceBody.nbreSemaine = this.seanceForm.controls.nbreSemaine.value;

    this.seanceBody.salle.id = this.seanceForm.controls.salle.value.id;
    this.seanceBody.showData.selectSalle = this.Salles.find(s => +s.id === +this.seanceForm.controls.salle.value.id);
    console.log("selected Salle :", this.seanceBody.showData.selectSalle);


    this.seanceBody.enseignant.id = this.seanceForm.controls.enseignant.value.id;
    this.seanceBody.showData.selectEns = this.Enseignants.find(e => +e.id === +this.seanceForm.controls.enseignant.value.id);
    console.log("selected Enseignant :", this.seanceBody.showData.selectEns);

    if (Util_fonction.checkIfNoTEmpty(this.seanceForm.controls.ue.value)){
      this.seanceBody.ue = {id: +this.seanceForm.controls.ue.value.id};
      this.seanceBody.showData.selectUE = this.EnseignantUes.find(eu => +eu.id === +this.seanceForm.controls.ue.value.id)
      console.log("selected UE :", this.seanceBody.showData.selectUE);
    }
    if (Util_fonction.checkIfNoTEmpty(this.seanceForm.controls.elementConstitutif.value)){
      this.seanceBody.elementConstitutif = {id: +this.seanceForm.controls.elementConstitutif.value.id};
      this.seanceBody.showData.selectEC = this.EnseignantECs.find(ec => +ec.id === +this.seanceForm.controls.elementConstitutif.value.id)
      console.log("selected EC :", this.seanceBody.showData.selectEC);
    }

    if (Util_fonction.checkIfNoTEmpty(this.GroupArr)){
      this.seanceBody.groupes = this.GroupArr;
      // this.selectGroup = this.Groupes.map(g => +g.id === +this.seanceForm.controls.ec.value.id)
    }

    console.log("seanceBody==:", this.seanceBody);

    this.seanceToSend.push(this.seanceBody);

    console.log(this.seanceToSend)
    console.log(this.seanceForm.value);

      this.initSeanceForm();
  }

  SubmitForm(){
    this.seanceToSend.forEach(s => {
      delete s['key'];
      delete s['showData'];
    });
    console.log("Finale result ==> ", this.seanceToSend);
      this.personnel.SaveSeance(this.seanceToSend, this.user.structure.id).subscribe( seancePost => {
        console.log(seancePost);
        this.seanceToSend = [];
        this.initSeanceForm();
        Util_fonction.SuccessMessage(seancePost);
      }, error => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      });
  }

  deleteToList(seance){
    console.log("seance ==> ", seance);
    this.seanceToSend = this.seanceToSend.filter(s => s.key.toString() !== seance.key.toString())
  }

  checkUndefined(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

  initSeanceForm(){
    this.seanceForm = this.formBuilder.group({
      annee: ['', Validators.required],
      dateDebut: ['', Validators.required],
      enseignant: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      nbreSemaine: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      salle: [null, Validators.required],
      typeSeance: ['', Validators.required],
      ue: [''],
      elementConstitutif: [''],
      groupes: [''],
      id: [''],
      niveau: ['',Validators.required],
      option: [''],
    });

    this.seanceBody= {
      annee: {id: null},
      dateDebut: null,
      enseignant: {id:null},
      heureDebut:null,
      heureFin: null,
      nbreSemaine: null,
      salle: {id:null},
      typeSeance: null,
      ue: null,
      elementConstitutif: null,
      groupes: [],
      key: null,
      showData: {
        selectSalle:null,
        selectUE:null,
        selectEC:null,
        selectEns:null,
        selectGroup:null
      }
    };
    this.selectUE = null;
    this.selectSalle = null;
    this.selectEC = null;
    this.selectEns = null;
    this.selectGroup = null;
  }

}
