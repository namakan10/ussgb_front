import {Component, OnInit, ViewChild} from '@angular/core';
import {NotesService} from "../../../services/GestionEtudiants/notes.service";
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Util_fonction} from "../../models/util_fonction";
import {PAG_SMALL_SIZE} from "../../../CONSTANTES";
import {StructureService} from "../../../services/structure.service";

@Component({
  selector: 'app-etudian-note-consultation',
  templateUrl: './etudian-note-consultation.component.html',
  styleUrls: ['./etudian-note-consultation.component.css']
})
export class EtudianNoteConsultationComponent implements OnInit {
etudiant = JSON.parse(sessionStorage.getItem('user'));
  // noteForm: FormGroup;
  dateSelect = this.etudiant.users.etudiant.anneeScolaire;
  type = "NotesGenerales";
  body = {
    annee_scolaire: this.dateSelect,
    id_etudiant: this.etudiant.users.etudiant.id,
    typeNote: "NotesGenerales"
  }

  dataSource= new MatTableDataSource<any>();
  dataSource2= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'ue',
    'elementConstitutif',

    'noteDevoir',
    'noteTP',
    'noteExamen',
    'noteFinal',
    'coeffDev',
    'coeffTP',
    'coeffEx',
    'session',
    'statut'
  ];
  displayedColumns2: string[] = [
    'dateEvaluation',
    'type',
    'ue',
    'elementConstitutif',
    'note',
    'dateNote',
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild(MatSort, {static: true}) sort2: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator2: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;

  pageSize2 = PAG_SMALL_SIZE;
  pageSizeOptions2 = [PAG_SMALL_SIZE];
  length2 = 100;
  structureAnnees: any;
  constructor(private fb: FormBuilder,
              private noteService: NotesService,
              private structureService: StructureService,
              private etudianService: EtudiantService) { }

  ngOnInit() {
    this.GetMyNotes();
    this.getStructureAnnee();
  }

  /**
   * Amene les années créée par la structure courante
   */
  getStructureAnnee(){
    this.structureService.getStuctureAnnees(this.etudiant.structure.id).subscribe(getRes =>{
      this.structureAnnees = getRes;
    }, error1 => {
      Util_fonction.AlertMessage(error1.error.status, error1.error.message);
      console.log(error1);
    });
  }

  GetMyNotes() {
    this._spinner = true;
    this.body.id_etudiant = this.etudiant.users.etudiant.id;
    this.body.annee_scolaire = this.dateSelect;
    if (Util_fonction.checkIfNoTEmpty(this.type) && this.type !== "NotesGenerales"){
      this.body.typeNote = this.type;
    }
    this.noteService.GetEtudiantNote(this.body).subscribe(
      res => {
        console.log(res);
        if (this.type === "NotesGenerales"){
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource2 = new MatTableDataSource(res);
          this.dataSource2.paginator = this.paginator2;
          this.dataSource2.sort = this.sort2;
        }

        this._spinner = false;
      }, error => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
        this._spinner = false;
      }
    )
  }

  _spinner: boolean = false;
  DateSelect(){
    if (Util_fonction.checkIfNoTEmpty(this.dateSelect)){
      this.GetMyNotes();
    }
  }

  tabClick(event){
    if (event.index === 0){
      this.type = "NotesGenerales";
    }
    if (event.index === 1){
      this.type = "NotesParEvaluation";
    }
  }
  checkIfIsNotNull(elmente){
    return Util_fonction.checkIfNoTEmpty(elmente);
  }

  // initForm(){
  //   this.noteForm = this.fb.group({
  //     type: new FormControl(null)
  //   })
  // }
}
