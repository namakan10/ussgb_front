import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PAG_MIDLE_SIZE, PAG_SMALL_SIZE, UNIV_FILIERE} from "../../../../CONSTANTES";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StructureService} from "../../../../services/structure.service";
import {NotesService} from "../../../../services/GestionEtudiants/notes.service";
import {ListePassagesService} from "../../../../services/liste-passages.service";
import {Util_fonction} from "../../../models/util_fonction";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Subject} from "rxjs";
declare var $: any;

@Component({
  selector: 'app-list-ue-non-valider',
  templateUrl: './list-ue-non-valider.component.html',
  styleUrls: ['./list-ue-non-valider.component.css']
})
export class ListUeNonValiderComponent implements OnInit {
  user = JSON.parse(sessionStorage.getItem("user"));

  displayedColumns2: string[] = ['num', 'nom', 'prenom', 'codeOption', 'dette', 'action'];
  dataSource2 = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator2: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort2: MatSort;


  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  pageSize2 = PAG_MIDLE_SIZE;
  pageSizeOptions2 = [PAG_MIDLE_SIZE];
  length2 = 100;

  structureData : any;
  univ_fil = UNIV_FILIERE;

  idStructure: any;
  @Input() searchBody;
  @Input() typeSearch;
  @Output() stopSpinner = new EventEmitter<string>();
  @Input() changing: Subject<string>;
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
    this.changing.subscribe(v => {
      console.log('value is changing', v);
      console.log('this.typeSearch', this.typeSearch);
      this.SearchList2(v);
    });

  }


   SearchList2(typeSearch){
    this._spinner = true;

    if (typeSearch === "note manquantes l1"){
      this.Get_NoteManquantL1();
    }

    if (typeSearch === "note manquantes l2"){
      this.Get_NoteManquantL2();
    }

    if (typeSearch === "note manquantes l3"){
      this.Get_NoteManquantL3();
    }
  }


  Get_NoteManquantL1(){
    this.listService.Get__NoteManquantL1(this.searchBody).subscribe(
      res => {
        this.dataSource2 = new MatTableDataSource(res.content);
        this.dataSource2.paginator = this.paginator2;//TODO: Voir
        this.dataSource2.sort = this.sort2;
        this.pageSizeOptions2 =  Util_fonction.paginatSequence(PAG_MIDLE_SIZE, this.dataSource2.data);
        console.log("this.dataSource2.data ==>", this.dataSource2.data);
        console.log("this.pageSizeOptions2 ==>", this.pageSizeOptions2);
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this.stopSpinner.emit("ok");
      }, error => {
        this.stopSpinner.emit("er");
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }
  Get_NoteManquantL2(){
    this.listService.Get__NoteManquantL2(this.searchBody).subscribe(
      res => {
        this.dataSource2 = new MatTableDataSource(res.content);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
        this.pageSizeOptions2 =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource2.data);
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this.stopSpinner.emit("ok");
      }, error => {
        this.stopSpinner.emit("er");
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }
  Get_NoteManquantL3(){
    this.listService.Get__NoteManquantL3(this.searchBody).subscribe(
      res => {
        this.dataSource2 = new MatTableDataSource(res.content);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
        this.pageSizeOptions2 =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource2.data);
        if (res.content.length <= 0){
          Util_fonction.AlertMessage('info', "Pas de résultat, liste vide !");
        }
        this.stopSpinner.emit("ok");
      }, error => {
        this.stopSpinner.emit("er");
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }

  EtudiantSelected: any;
  Ues: any;
  async Get_UENonEvaluee(element) {
    console.log(element);
    this.Ues = [];
    this.EtudiantSelected = element;

    this.listService.Get__UeNonEvaluee(element.numEtudiant).subscribe(
      res => {
        this.Ues = res.ues;
        console.log(res);
        this._spinner = false;

        if (this.Ues.length > 0){
          $('#uesModal').modal({
            backdrop: 'static',
            keyboard: false
          });
          $('#uesModal').appendTo('body');
        }
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });

  }


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
      this.noteBody.noteFinal = parseFloat(event.target.value);
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


  checkIfNotNull(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

  CheckIfAsRoles(roles){
    return Util_fonction.checkIfAsRole(this.user, roles)
  }



}
