import {Component, OnInit, ViewChild} from '@angular/core';
import {PAG_SMALL_SIZE, UNIV_FILIERE} from "../../../CONSTANTES";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StructureService} from "../../../services/structure.service";
import {ListePassagesService} from "../../../services/liste-passages.service";
import {Util_fonction} from "../../models/util_fonction";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {NotesService} from "../../../services/GestionEtudiants/notes.service";
declare var $: any;

@Component({
  selector: 'app-list-passage-all',
  templateUrl: './list-passage-all.component.html',
  styleUrls: ['./list-passage-all.component.css']
})
export class ListPassageAllComponent implements OnInit {
  user = JSON.parse(sessionStorage.getItem("user"));

  displayedColumns: string[] = ['num', 'nom', 'prenom', 'codeOption', 'dette'];
  dataSource = new MatTableDataSource();

  displayedColumns2: string[] = ['num', 'nom', 'prenom', 'codeOption', 'dette', 'action'];
  dataSource2 = new MatTableDataSource();

  // displayedColumns3: string[] = ['num', 'nom', 'prenom', 'codeOption', 'action'];
  // dataSource3 = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild(MatPaginator, {static: true}) paginator2: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort2: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  // applyFilter3(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource3.filter = filterValue.trim().toLowerCase();
  //
  //   if (this.dataSource3.paginator) {
  //     this.dataSource3.paginator.firstPage();
  //   }
  // }

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;

  pageSize2 = PAG_SMALL_SIZE;
  pageSizeOptions2 = [PAG_SMALL_SIZE];
  length2 = 100;



  structureData : any;
  univ_fil = UNIV_FILIERE;
  SeachForm: FormGroup;

  structureAnnees: any;
  idStructure: any;
  searchBody = {
    id_structure: null,
    annee_scolaire: null,
    code_option: null,
    num_etudiant: null,
  }

  _spinner : boolean = false;
  constructor(private formBuilder: FormBuilder,
              private structureService: StructureService,
              private noteService: NotesService,
              private listService : ListePassagesService) {

    if (Util_fonction.checkIfNoTEmpty(sessionStorage.getItem("structureSelected"))){
      this.structureData = JSON.parse(sessionStorage.getItem("structureSelected"));

      this.idStructure = this.structureData.Data.id;
    } else {
      this.idStructure = JSON.parse(sessionStorage.getItem("user")).structure.id;
    }
  }

  ngOnInit() {
    this.initForm();
    this.getStructureAnnee();
    console.log(this.idStructure);
  }

  /**
   * Amene les années créée par la structure courante
   */
  getStructureAnnee(){
    this.structureService.getStuctureAnnees(this.idStructure).subscribe(getRes =>{
      this.structureAnnees = getRes;
    }, error1 => {
      Util_fonction.AlertMessage(error1.error.status, error1.error.message);
      console.log(error1);
    });
  }

  SearchList(){
    this._spinner = true;
    this.searchBody.id_structure = this.idStructure;
    this.searchBody.annee_scolaire = this.SeachForm.controls.anneeScolaire.value;
    this.searchBody.num_etudiant = this.SeachForm.controls.num_etudiant.value;
    this.searchBody.code_option = this.SeachForm.controls.filiere.value;

    if (this.SeachForm.controls.type.value === "Admis licence"){
      this.Get_Admin_Licence();
    }

    if (this.SeachForm.controls.type.value === "Admis sans dettes L2"){
      this.Get_SansDetteL2();
    }

    if (this.SeachForm.controls.type.value === "Admis sans dettes L3"){
      this.Get_SansDetteL3();
    }

    if (this.SeachForm.controls.type.value === "Admis avec dettes L2"){
      this.Get_AvecDetteL2();
    }

    if (this.SeachForm.controls.type.value === "Admis avec dettes L3"){
      this.Get_AvecDetteL3();
    }

    if (this.SeachForm.controls.type.value === "Redoublant L1"){
      this.Get_RedoublantL1();
    }

    if (this.SeachForm.controls.type.value === "Redoublant L2"){
      this.Get_RedoublantL2();
    }
    if (this.SeachForm.controls.type.value === "Redoublant L3"){
      this.Get_RedoublantL3();
    }

    if (this.SeachForm.controls.type.value === "note manquantes l1"){
      this.Get_NoteManquantL1();
    }

    if (this.SeachForm.controls.type.value === "note manquantes l2"){
      this.Get_NoteManquantL2();
    }

    if (this.SeachForm.controls.type.value === "note manquantes l3"){
      this.Get_NoteManquantL3();
    }
  }

  Get_Admin_Licence(){
    this.listService.Get__Admin_Licence(this.searchBody).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this._spinner = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }

  Get_NoteManquantL1(){
    this.listService.Get__NoteManquantL1(this.searchBody).subscribe(
      res => {
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource2.data);
        this.dataSource2 = new MatTableDataSource(res.content);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this._spinner = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }
  Get_NoteManquantL2(){
    this.listService.Get__NoteManquantL2(this.searchBody).subscribe(
      res => {
        this.dataSource2 = new MatTableDataSource(res.content);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource2.data);
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this._spinner = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }
  Get_NoteManquantL3(){
    this.listService.Get__NoteManquantL3(this.searchBody).subscribe(
      res => {
        this.dataSource2 = new MatTableDataSource(res.content);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource2.data);
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this._spinner = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }

  Get_SansDetteL2(){
    this.listService.Get__SansDetteL2(this.searchBody).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this._spinner = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }

  Get_SansDetteL3(){
    this.listService.Get__SansDetteL3(this.searchBody).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this._spinner = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }

  Get_AvecDetteL2(){
    this.listService.Get__AvecDetteL2(this.searchBody).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this._spinner = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }

  Get_AvecDetteL3(){
    this.listService.Get__AvecDetteL3(this.searchBody).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this._spinner = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }

  Get_RedoublantL1(){
    this.listService.Get__RedoublantL1(this.searchBody).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this._spinner = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }


  Get_RedoublantL2(){
    this.listService.Get__RedoublantL2(this.searchBody).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this._spinner = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }


  Get_RedoublantL3(){
    this.listService.Get__RedoublantL3(this.searchBody).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this._spinner = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }

  _Numspinner: boolean = false; // TODO: CORRIGER LISTE DE PASSAGE;
  EtudiantSelected: any;
  Get_UENonEvaluee(element) {
    console.log(element);
    this.EtudiantSelected = element;
    this.listService.Get__UeNonEvaluee(element.numEtudiant).subscribe(
      res => {
        console.log(res);
        this.Ues = res.ues;
        $('#uesModal').modal({
          backdrop: 'static',
          keyboard: false
        });
        $('#uesModal').appendTo('body');

        this._spinner = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }

  searchF: boolean = false;
  searchDrop: boolean = false;
  numEtudiant2: any;

  tabClick(event){
    this.pageSize2 = PAG_SMALL_SIZE;
    this.pageSizeOptions2 = [PAG_SMALL_SIZE];
    this.length2 = 100;

    this.SeachForm.reset();
    if (event.index === 0){
      this.searchF = false;
      this.searchDrop = false;
    }
    if (event.index === 1){
      this.searchF = false;
      this.searchDrop = true;
    }
    if (event.index === 2){
      this.initForm();
      this.searchF = true;
      this.searchDrop = false;
    }
  }

  checkIfNotNull(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

  Ues: any;
  noteBody = {
    annee : null,
    coeffDev : null,
    coeffEx: 1,
    coeffTP: null,
    session: 2,
    type: 'EXAMEN',
    noteDevoir: null,
    noteExamen: null,
    noteFinal: null,
    noteTP: null,
    pointJury: null,
    statut: null,
    elementConstitutif: null,
    etudiant: {
      id: null,
    },
    ue: {
      id: null,
    }
  }
  noteToAdded= [];
  usesID= [{ueID: 0, note: 0}];
  inputNoteIsEmpty: boolean = true;
  note_spinner: boolean = false;
  AttributeNote(ue, event){
    document.getElementById("note_spinner"+ue.id).hidden = false;
    this.noteToAdded= [];
    if (Util_fonction.checkIfNoTEmpty(event.target.value)){
      this.inputNoteIsEmpty = false;
      this.noteBody.annee = this.EtudiantSelected.annee;
      this.noteBody.etudiant.id = +this.EtudiantSelected.idEtudiant;
      this.noteBody.ue.id = ue.id;
      this.noteBody.noteDevoir = parseFloat(event.target.value);
      this.noteBody.noteExamen = parseFloat(event.target.value);
      this.noteToAdded.push(this.noteBody);
      console.log(this.noteToAdded);

      this.noteService.AttribNoteToEtudiantUEManquante(this.noteToAdded).subscribe(
        res => {
          document.getElementById("note_spinner"+ue.id).hidden = true;
          console.log(res);
          this.noteToAdded= [];
          Util_fonction.SuccessMessage(res);
        }, error => {
          console.log("error part");
          document.getElementById("note_spinner"+ue.id).hidden = true;
          Util_fonction.AlertMessage(error.error.status, error.error.message);
          this.noteToAdded= []
        })

    } else {
      document.getElementById("note_spinner"+ue.id).hidden = true;
      this.inputNoteIsEmpty = true;
    }
  }


  initForm(){
    this.SeachForm = this.formBuilder.group({

      type: new FormControl(null, [Validators.required]),
      anneeScolaire: new FormControl(null, [Validators.required]),
      filiere: new FormControl(null),
      num_etudiant: new FormControl(null),
    })
  }

}
