import {Component, OnInit, ViewChild} from '@angular/core';
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";
import {StructureService} from "../../../services/structure.service";


import {Util_fonction} from "../../models/util_fonction";
import {NotesService} from "../../../services/GestionEtudiants/notes.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {_HTTP, PAG_SMALL_SIZE} from "../../../CONSTANTES";
import {error} from "util";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ClassesService} from "../../../services/classes.service";
import {SpinnerService} from "../spinner.service";
declare var $: any;

@Component({
  selector: 'app-responsable-groupe-etudiants',
  templateUrl: './responsable-groupe-etudiants.component.html',
  styleUrls: ['./responsable-groupe-etudiants.component.css']
})
export class ResponsableGroupeEtudiantsComponent implements OnInit {


  user = JSON.parse(sessionStorage.getItem("user"));
  form:FormGroup
  groupes:any[];
  etudiants:any[];
  anneeStructures:any[];
  groupeSelected:any;

  searchBody = {
    anneeScolaire: null,
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
    'numEtudiant',
    'prenom',
    'nom',
    'nationalite',
    'telephone',
    'codeFiliere',
    'scolarite',
    'actions'
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
  _http = _HTTP;
  constructor(private etudiantService : EtudiantService,
              private notesService: NotesService,
              private classeService: ClassesService,
              private fb: FormBuilder,
              private structureService: StructureService,
              private spinnerService: SpinnerService,
  ) {
    this.initForm();

  }

  ngOnInit() {


    this.initData(this.user.structure.id)

    this.fb = new FormBuilder();
    this.buildForm();

  }

  initData(id:number):void{
    this.getAnneeByStructureId(id);
  }


  protected buildForm() {
    this.form = this.fb.group({
      annee: [, Validators.required],
      niveau: [, Validators.required],
      groupe: [, Validators.required],
    });
  }


  public CheckIfIsNull(element: any): boolean {
    return Util_fonction.checkIfNoTEmpty(element);
  }

  ClassParamBody = {
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
        console.log(res);
      },
      (error) => {
        console.log(error);
      });
  }

  changeAnnee(event){
    this.annee_scolaire = event.target.value;
    this.GetClasses();
  }

  spinner: boolean = false;
  Afficher(){
    this.spinner = true;
    this.searchBody.anneeScolaire = this.annee_scolaire;
    this.searchBody.niveau = this.niveau;
    this.searchBody.numEtudiant = this.numEtudiant;
    this.searchBody.prenom = this.prenom;
    this.searchBody.nom = this.nom;
    this.searchBody.id_classe = this.id_classe;
    this.searchBody.id_groupe = this.id_groupe;
    this.etudiantService.getEtudiant_s(this.searchBody).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence2(PAG_SMALL_SIZE, res.totalElements);
        this.spinner = false;

      }, error =>{
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })
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

  EtudiantEditData:any;
  EditEtudiants(element){
    console.log(element);
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

    console.log(this.EtudiantBody);

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

  EtudiantForm: FormGroup;
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





  getGroupe(annee:string,niveau:string){
    this.spinnerService.show();
    this.structureService.getGroupes(annee,this.user.structure.id).subscribe(
      (res:any[]) => {
        this.spinnerService.hide();
        console.log("groupes", res)
        this.groupes = res.filter(g=>g.niveau===niveau);
        console.log("groupes filter", this.groupes)
      },
      (error) => {
        this.groupes = [];
        this.spinnerService.hide();
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      });
  }


  getEtudiantByGroupe(value){
    console.log("getEtudiantByGroupe===>>",value)
    this.spinnerService.show();
    this.structureService.getEtudiantsByGroupeID(value.groupe).subscribe(
      (res:any) => {
        this.spinnerService.hide();

        this.etudiants = res;
        this.spinnerService.hide();
        this.dataSource = new MatTableDataSource(this.etudiants);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      (error) => {
        this.spinnerService.hide();
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      });
  }


  setResponsalbe(value){
    this.groupeSelected=event;

    console.log("getEtudiantByGroupe===>>",event)
    this.spinnerService.show();
    this.structureService.addResponsableGroupe({  idEtudiant: value.id, idGroupe: this.form.value.groupe}).subscribe(
      (res:any) => {
        this.spinnerService.hide();
        console.log("addResponsableGroupe ===>", res);
        Util_fonction.SuccessMessage(res);
      },
      (error) => {
        this.spinnerService.hide();
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      });
  }

  getAnneeByStructureId(id:number){
    this.structureService.getStuctureAnnees(id).subscribe(
      res => {
        this.anneeStructures = res;
      }, error =>{
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })
  }


}
