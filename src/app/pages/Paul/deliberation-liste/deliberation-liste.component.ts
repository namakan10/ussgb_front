import {Component, OnInit, ViewChild} from '@angular/core';
import {NotesService} from "../../../services/GestionEtudiants/notes.service";
import {Util_fonction} from "../../models/util_fonction";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PAG_SMALL_SIZE, UNIV_OPTION} from "../../../CONSTANTES";
import {StructureService} from "../../../services/structure.service";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {MatTableDataSource} from "@angular/material/table";
import {UesServiceService} from "../../../services/ues.service";
import {MatPaginator} from "@angular/material/paginator";

declare var $: any;


@Component({
  selector: 'app-deliberation-liste',
  templateUrl: './deliberation-liste.component.html',
  styleUrls: ['./deliberation-liste.component.css']
})
export class DeliberationListeComponent implements OnInit {
  sendBody ={

  };
  FilterBody ={
    annee_scolaire: null,
    niveau: null,
    id_option: null
  };
  FilterForm: FormGroup;
  JurryPointForm: FormGroup;
  univ_opt = UNIV_OPTION;
  StructureAnnees;

  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = ["numEtudiant", "ueValide", "ueNonValide"];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;


  user = JSON.parse(sessionStorage.getItem("user"));
  constructor(private noteService: NotesService,
              private structureService: StructureService,
              private uesService: UesServiceService,
              private optionService: OptionsService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initFilterForm();
    this.GetStuctureAnnees();
    this.GetOptions();

  }

  initFilterForm(){
    this.FilterForm = this.formBuilder.group({
      annee: new FormControl (null, [Validators.required]),
      option: new FormControl (null,[Validators.required]),
      niveau: new FormControl (null,[Validators.required])
    })
  }
  GetStuctureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id)
      .subscribe(res => {
        this.StructureAnnees = res;
      })
  }

  Options: any;
  GetOptions(){
    this.optionService.getStructure_Options(this.user.structure.id).subscribe(
      res =>{
        this.Options = res;
        this.Options.map(o => {o.nom = o.codeOption+" "+o.nom});
      }
    )
  }
  id_option :any;
  keyword = 'nom';
  OptionSelectEvent(event){
      this.FilterForm.controls.option.setValue( event.id);
      // this.GetOptionUes();
  }
  optUES:any[];
  GetOptionUes(){
    const data = {
      id_structure: this.user.structure.id,
      id_option: this.FilterForm.controls.option.value,
      semestre: null
    }
    this.uesService.getUes(data).subscribe(
      Uesres => {

        this.displayedColumns = ( Uesres.content.map(optUe =>{
          return optUe.codeUE.toString();
        }));
        this.displayedColumns.push("numEtudiant");

        // this.optUES.push({id:0, codeUE: "numEtudiant" });
        this.optUES = Uesres.content.map(optUe =>{
          return {id:optUe.id, codeUE: optUe.codeUE};
        });

        console.log("displayedColumns --", this.displayedColumns);
      },
      error =>{
        console.log(error);
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      }
    )
  }

  CheckUndefined(element){
    return Util_fonction.checkIfNoTEmpty(element)
  }
  GetDeliberationListe(){
    this.list_spinner = true;
    this.FilterBody.annee_scolaire = this.FilterForm.controls.annee.value;
    this.FilterBody.niveau = this.FilterForm.controls.niveau.value;
    this.FilterBody.id_option = this.FilterForm.controls.option.value;
    this.noteService.GetDeliberationListe(this.FilterBody).subscribe(delibrationListe =>{
      this.list_spinner = false;
      this.dataSource = new MatTableDataSource(delibrationListe);
      this.dataSource.paginator = this.paginator;
    }, error =>{
      this.list_spinner = false;
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    })
  }

  getNote(element, optUes) {
    // element.noteFinaleUES.map(noteFinaleUES => noteFinaleUES).map(optUe => {})
    // for (let optUes of this.optUES){
      for(let el of element.noteFinaleUES){
          console.log("el.idUE === optUes.id", el.codeUE +"==="+ optUes.codeUE)
          // if (el.idUE === optUes.id){
          if (el.codeUE === optUes.codeUE){
            return el.noteFinal;
          }
        }
      return optUes.codeUE;
    // }
    // return null;
  }

  notes;
  pointJurryNote;
  UeValidationList;
  ValidationAction = "ueNonValide";
  elementSelected;
  jury_spinner: boolean = false;
  list_spinner: boolean = false;
  AddJurryPoint(element, action){
    this.JurryPointBody = [];
    this.elementSelected = element;
    this.ValidationAction = action;
    if (action === "ueNonValide"){
      this.UeValidationList = element.noteFinaleUES.filter(ueNote => ueNote.noteFinal < 10);
    }else {
      this.UeValidationList = element.noteFinaleUES.filter(ueNote => ueNote.noteFinal > 10);
    }

    console.log("this.pointJurryNote", this.JurryPointBody);


    $('#JurryPointFormModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#JurryPointFormModal').appendTo('body');
  }

  JurryPointBody:any[] = [];
  SelectUe(event, ueNote){
    if (event.target.checked){
      this.JurryPointBody.push({id: ueNote.idNoteGenerale});
    }else {
      if (Util_fonction.checkIfNoTEmpty(this.JurryPointBody)){
        this.JurryPointBody = this.JurryPointBody.filter(p => p.id !== ueNote.idNoteGenerale);
      }
    }
  }

  SaveJurryPoint(){
    this.jury_spinner = true;
    this.noteService.AttribJuryPoint(this.JurryPointBody).subscribe(pointJuryResponse =>{
      console.log(pointJuryResponse);
      this.JurryPointBody = [];
      if(Object.keys(pointJuryResponse).length >0){
        Util_fonction.SuccessMessage("Les points jury ont été accordé avec succès!");
      }
      this.jury_spinner = false;

      this.GetDeliberationListe();
      $('#JurryPointFormModal').modal('hide');
    }, error =>{
      this.jury_spinner = false;
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });

  }
}
