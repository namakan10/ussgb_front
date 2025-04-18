import {Component, OnInit, ViewChild} from '@angular/core';
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";
import {StructureService} from "../../../services/structure.service";


import {Util_fonction} from "../../models/util_fonction";
import {NotesService} from "../../../services/GestionEtudiants/notes.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {_HTTP, PAG_SMALL_SIZE,pageSize,pageSizeOptions,totalElements,pageIndex,totalPages} from "../../../CONSTANTES";
import {error} from "util";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ClassesService} from "../../../services/classes.service";
import {SpinnerService} from "../spinner.service";
import {SelectionModel} from "@angular/cdk/collections";
import {AichaHelpers} from "../aicha.helpers";
declare var $: any;

@Component({
  selector: 'app-student-reset-password',
  templateUrl: './student-reset-password.component.html',
  styleUrls: ['./student-reset-password.component.css']
})
export class StudentResetPasswordComponent implements OnInit {


  user = JSON.parse(sessionStorage.getItem("user"));
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

  etudiants: any[];
  anneeStructures: any[]=[];
  options: any[]=[];
  spinner1: any;

  id_groupe: any;
  id_classe: any;


  dataSource= new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'selection',
    'idEtudiant',
    'prenom',
    'nom',
    'telephone',
    'email',
    'numMatricule',
    'typeCandidat',
     'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

   pageSize = pageSize;
   totalElements = totalElements;
   pageIndex = pageIndex;
  totalPages = totalPages;
   pageSizeOptions = pageSizeOptions;


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
  form: FormGroup;


  selection = new SelectionModel<number>(true, []);
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...(this.dataSource.data.map(x=>x.id)));
    console.log("this.selection ", this.selection);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'Deselectionner' : 'Selectionner'} Tous`;
    }
    return `${this.selection.isSelected(row.id) ? 'Deselectionner' : 'Selectionner'} Ligne ${row.position + 1}`;
  }

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
    this.getOptionsByStructureId(id);
    this.getAnneeByStructureId(id);
  }

  protected buildForm() {
    this.form = this.fb.group({
      niveau: [, Validators.required],
      annee: [, Validators.required],
      idOption: [, Validators.required],
    });
  }




  public CheckIfIsNull(element: any): boolean {
    return Util_fonction.checkIfNoTEmpty(element);
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
      res =>{
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence2(PAG_SMALL_SIZE, res.totalElements);
        this.spinner = false;

      }, error =>{
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })
  }



  getEtudiant(data:any,page?,size?){


    if(!this.form.valid){
      return;
    }

    this.spinnerService.show();

    this.etudiantService.getEtutiants(data.annee,data.idOption.id,data.niveau,page,size).subscribe(
      (res:any) => {
        console.log('res',res)
        this.etudiants = AichaHelpers.getListOthers(res);
        this.totalElements = AichaHelpers.getTotalElements(res);
        this.pageSizeOptions =  Util_fonction.paginatSequence2(PAG_SMALL_SIZE, res.totalElements);


        this.spinnerService.hide();
        this.dataSource = new MatTableDataSource(this.etudiants);
       // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }, error =>{
        console.log('getEtutiants error', error)
        this.spinnerService.hide();
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })

  }


  selectedResetStudentPassword(){

    if(!this.form.valid){
      return;
    }

    console.log('etudiant ', this.selection.selected)


    this.selection.selected.forEach((id,index)=> {
      this.spinnerService.show();
      const value = {
        anneeScolaire: this.form.value.annee,
        dateExpiration: "2050-01-01",
        idEtudiant: id,
        idStructure: this.user.structure.id
      }

      this.etudiantService.resetStudentPassword(value).subscribe(
        (res:any) =>{
          this.spinnerService.hide();
          if((index + 1)===this.selection.selected.length){
            Util_fonction.SuccessMessage(res);
          }
        }, error =>{
          console.log('selectedResetStudentPassword error '  + id, error)
          this.spinnerService.hide();
          Util_fonction.AlertMessage(error.error.status, error.error.message);
        });

    });




  }


  resetStudentPassword(etudiant:any){

    if(!this.form.valid){
      return;
    }

    this.spinnerService.show();
    const value = {
        anneeScolaire: this.form.value.annee,
        dateExpiration: "2050-01-01",
        idEtudiant: etudiant.id,
        idStructure: this.user.structure.id
      }

    this.etudiantService.resetStudentPassword(value).subscribe(
      (res:any) =>{
        console.log('resetStudentPassword',res)
        this.spinnerService.hide();

        Util_fonction.SuccessMessage(res);
      }, error =>{
        console.log('resetStudentPassword error', error)
        this.spinnerService.hide();
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })

  }


  printData(){
    var divToPrint = document.getElementById("idPrint");
   const newWin = window.open("");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();
  }
  getOptionsByStructureId(id:number){
    this.etudiantService.getOptionsByStructureId(id).subscribe(
      (res:any[]) =>{
        this.options = res;
        this.spinner = false;
      }, error =>{
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })
  }

  getAnneeByStructureId(id:number){
    this.structureService.getStuctureAnnees(id).subscribe(
      res => {
        this.anneeStructures = res;
        console.log("anneeStructures", this.anneeStructures)
      }, error =>{
        console.log("anneeStructures", error)
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

  displayFn(val: any): string {
    return val && val.nom ? (val.codeOption + ' - ' + val.nom) : '';
  }



  pageChange(event: PageEvent) {
    console.log("pageChanged ===>> ", event)
     this.getEtudiant(this.form.value,event.pageIndex,event.pageSize)
  }

}
