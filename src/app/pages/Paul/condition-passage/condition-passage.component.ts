import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ConditionPassageService} from "../../../services/condition-passage.service";
import {Util_fonction} from "../../models/util_fonction";
import {StructureService} from "../../../services/structure.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import Swal from "sweetalert2";
import {PAG_SMALL_SIZE} from "../../../CONSTANTES";
declare var $: any;

@Component({
  selector: 'app-condition-passage',
  templateUrl: './condition-passage.component.html',
  styleUrls: ['./condition-passage.component.css']
})
export class ConditionPassageComponent implements OnInit {

  displayedColumns: string[] = ['annee', 'semestre', 'all', 'dMaxN', 'dMaxP', 'action'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: true}) sort: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ConditionForm : FormGroup;
  action: any;
  choix_Dette: any = null;

  SendBody = {
    anneeScolaire: null,
    avoirToutesLesNotes: null,
    dettesMax: null,
    pourcentagesCreditRequis: null,
    semestre: null,
    structure_id: null
  }
  user = JSON.parse(sessionStorage.getItem("user"));
  structureAnnees : any;
  editId : any;
  checkNum_spinner : boolean = false;

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;


  constructor(private formBuilder: FormBuilder,
              private structureService : StructureService,
              private conditionPassageService : ConditionPassageService) { }

  ngOnInit() {
    this.initForm();
    this.getStructureAnnee();
    this.GetStructureCondition();
  }

  GetStructureCondition() {
    this.conditionPassageService.GetConditions(this.user.structure.id).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
      }, error => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      })
  }

  getStructureAnnee(){
    this.structureService.getStuctureAnnees(this.user.structure.id).subscribe(getRes =>{
      this.structureAnnees = getRes;
    }, error1 => {
      Util_fonction.AlertMessage(error1.error.status, error1.error.message);
      console.log(error1);
    });
  }

  Chose_selected(){
    this.choix_Dette = this.ConditionForm.controls.choix.value;
    if (this.choix_Dette === "nbr"){
      this.ConditionForm.controls.dettesMax.setValidators([Validators.required, Validators.pattern('[0-9]*')]);
      this.ConditionForm.controls.dettesMax.updateValueAndValidity();

      this.ConditionForm.controls.pourcentagesCreditRequis.reset();
      this.ConditionForm.controls.pourcentagesCreditRequis.clearValidators();
      this.ConditionForm.controls.pourcentagesCreditRequis.updateValueAndValidity();
    } else {
      this.ConditionForm.controls.pourcentagesCreditRequis.setValidators([Validators.required, Validators.pattern('[0-9]*')]);
      this.ConditionForm.controls.pourcentagesCreditRequis.updateValueAndValidity();

      this.ConditionForm.controls.dettesMax.reset();
      this.ConditionForm.controls.dettesMax.clearValidators();
      this.ConditionForm.controls.dettesMax.updateValueAndValidity();
    }
  }

  addCondition(){
    this.initForm();
    this.action = "creat";
    $('#ContraintModal').modal('show');
    $('#ContraintModal').appendTo('body');
  }

  modifCondition(element){
    console.log(element);
    this.initForm();
    this.action = "update";
    this.editId = element.id;

    this.ConditionForm.controls.anneeScolaire.setValue(element.anneeScolaire);
    this.ConditionForm.controls.avoirToutesLesNotes.setValue(""+element.avoirToutesLesNotes);
    this.ConditionForm.controls.semestre.setValue(element.semestre);

    if (Util_fonction.checkIfNoTEmpty(element.dettesMax)){
      this.choix_Dette = "nbr";
      this.ConditionForm.controls.dettesMax.setValue(element.dettesMax);
    }

    if (Util_fonction.checkIfNoTEmpty(element.pourcentagesCreditRequis)){
      this.choix_Dette = "pourcentage";
      this.ConditionForm.controls.pourcentagesCreditRequis.setValue(element.pourcentagesCreditRequis);
    }


    $('#ContraintModal').modal('show');
    $('#ContraintModal').appendTo('body');
  }
  SaveCondition(){
    this.checkNum_spinner = true;
    this.SendBody.anneeScolaire = this.ConditionForm.controls.anneeScolaire.value;
    this.SendBody.avoirToutesLesNotes = this.ConditionForm.controls.avoirToutesLesNotes.value;

    if (Util_fonction.checkIfNoTEmpty(this.ConditionForm.controls.dettesMax.value)){
      this.SendBody.dettesMax = +this.ConditionForm.controls.dettesMax.value;
    }

    this.SendBody.semestre = +this.ConditionForm.controls.semestre.value;
    this.SendBody.pourcentagesCreditRequis = this.ConditionForm.controls.pourcentagesCreditRequis.value;
    this.SendBody.structure_id = +this.user.structure.id;

    console.log(this.SendBody);
    this.conditionPassageService.AddCondition(this.SendBody).subscribe(
      res => {
        this.checkNum_spinner = false;
        this.GetStructureCondition();
        $('#ContraintModal').modal('hide');
        Util_fonction.SuccessMessage(res);
      }, error => {
        this.checkNum_spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      })
    console.log(this.ConditionForm.controls.avoirToutesLesNotes.value);
  }

  UpdateCondition(){
    this.checkNum_spinner = true;
    this.SendBody.anneeScolaire = this.ConditionForm.controls.anneeScolaire.value;
    this.SendBody.avoirToutesLesNotes = this.ConditionForm.controls.avoirToutesLesNotes.value;
    if (Util_fonction.checkIfNoTEmpty(this.ConditionForm.controls.dettesMax.value)){
      this.SendBody.dettesMax = + this.ConditionForm.controls.dettesMax.value;
    }
    this.SendBody.semestre = +this.ConditionForm.controls.semestre.value;
    this.SendBody.pourcentagesCreditRequis = this.ConditionForm.controls.pourcentagesCreditRequis.value;
    this.SendBody.structure_id = +this.user.structure.id;

    console.log(this.SendBody);
    this.conditionPassageService.UpdatCondition(this.editId, this.SendBody).subscribe(
      res => {
        this.checkNum_spinner = false;
        $('#ContraintModal').modal('hide');
        this.GetStructureCondition();
        Util_fonction.SuccessMessage(res);
      }, error => {
        this.checkNum_spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      })
    console.log(this.ConditionForm.controls.avoirToutesLesNotes.value);
  }


  delete_Condition(element) {
    Swal.fire({
      title: '',
      text: "Êtes-vous sûre de vouloir supprimer cette condition de passage !?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'oui, supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.conditionPassageService.DeleteCondition(element.id).subscribe(delRes =>{
          this.GetStructureCondition();
          Util_fonction.SuccessMessage(delRes);
        }, error1 => {
          Util_fonction.AlertMessage(error1.error.status, error1.error.message);
        });
      }
    })
  }

  initForm(){
    this.ConditionForm = this.formBuilder.group({
      anneeScolaire: new FormControl(null, [Validators.required]),
      avoirToutesLesNotes: new FormControl(null, [Validators.required]),
      dettesMax: new FormControl(null),
      pourcentagesCreditRequis: new FormControl(null),
      semestre: new FormControl(null, [Validators.required]),
      structure_id: new FormControl(null),

      choix: new FormControl(null)

    });

    this.SendBody = {
      anneeScolaire: null,
      avoirToutesLesNotes: null,
      dettesMax: null,
      pourcentagesCreditRequis: null,
      semestre: null,
      structure_id: null
    }
  }


}
