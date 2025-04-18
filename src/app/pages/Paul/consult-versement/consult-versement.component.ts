import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {VersementService} from "../../../services/versement.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StructureService} from "../../../services/structure.service";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {Util_fonction} from "../../models/util_fonction";
import Swal from "sweetalert2";
import {PAG_SMALL_SIZE} from "../../../CONSTANTES";
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'app-consult-versement',
  templateUrl: './consult-versement.component.html',
  styleUrls: ['./consult-versement.component.css']
})
export class ConsultVersementComponent implements OnInit {
  @Input() comptaData;
  user: any;
  comptaVersementSearchForm:FormGroup;
  comptaVersementForm:FormGroup;
  versementOfCompta: any;

  searchBody = {
    type: "LIST",
    annee: null,
    dateDebut: null,
    dateFin: null,
    montant: null,
    motif: null,

    idAgentComptable: null,
    idChefComptable: null,
    idStructure: null,
    page: null,
    size: null
  }

  VersermentBody ={
    agentComptable_id: null,
    dateDeVersenement: null,
    montant: 0,
    motif: null,
    structure_id: 0
  }

  structureAnnees:any;
  Versement_Data: any;
  Annees: any;
  selectAgentId: any;
  versementId: any;
  vermentUpdateSpinner: boolean = false;
  searchIsDone:boolean = false;
  roleAdmin:boolean = false;
  hideTable : boolean = false;
  SommePer : any;

  displayedColumns: string[] = ['montant', 'motif', 'chefComptable', 'date', 'action'];
  dataSource = new MatTableDataSource<any>();

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;



  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(private versementService: VersementService,
              private formBuilder: FormBuilder,
              private structureService: StructureService) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));

    for (let rol of this.user.users.roles){
      if (rol.nom === 'ROLE_ADMIN'){
        this.roleAdmin = true;
      }
    }

    this.initSearchForm();
    this.initVersemntForm();
    this.searchBody.idStructure = this.user.structure.id;
    this.genereAnneeList();
    this.GetVersementComptable();
  }

  exportexcel() {
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Versements-comptable.xlsx');
 }

  GetVersementComptable() {
    this.searchBody.idAgentComptable = this.comptaData.id;
    this.versementService.GetVersements(this.searchBody).subscribe(resVersment => {
      console.log(resVersment);
      this.searchBody.idStructure = this.user.structure.id;
      this.versementOfCompta = resVersment.content;
      this.searchIsDone = false;
      this.dataSource = new MatTableDataSource(resVersment.content);
      this.dataSource.paginator = this.paginator;

      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
    });
  }

  genereAnneeList() {
    const Annees = [];
    let endAnnee: number = new Date().getFullYear();
    const limit = endAnnee - 5;
    for (let i = endAnnee; i >= limit ; i--) {
      Annees.push(i);
    }
    this.Annees = Annees;
  }

  comptaVersementSearch() {
    this.searchBody.annee = this.comptaVersementSearchForm.controls.annee.value;
    this.searchBody.dateDebut = this.comptaVersementSearchForm.controls.dateDebut.value;
    this.searchBody.dateFin = this.comptaVersementSearchForm.controls.dateFin.value;
    this.searchBody.montant = this.comptaVersementSearchForm.controls.montant.value;
    this.searchBody.motif = this.comptaVersementSearchForm.controls.motif.value;
    this.searchBody.type = this.comptaVersementSearchForm.controls.type.value;
    this.searchBody.page = "0";// this.comptaVersementSearchForm.controls.page.value;
    this.searchBody.size = "500";// this.comptaVersementSearchForm.controls.size.value;

    this.searchBody.idAgentComptable = this.comptaData.id;
    // this.searchBody.idChefComptable = this.comptaVersementSearchForm.controls.annee.value;
    this.searchBody.idStructure = this.user.structure.id;

    this.Search();
  }

  Search(){
    this.versementService.GetVersements(this.searchBody).subscribe( getResponse => {
      this.searchIsDone = true;
      if ((typeof getResponse === 'function') || (typeof getResponse === 'object')) {
        this.versementOfCompta = getResponse.content;
        this.dataSource = getResponse.content;
      } else {

        this.hideTable = true;
        this.SommePer = getResponse;

        $('#sommeModal').modal('show');
        $('#sommeModal').appendTo('body');
      }

    });
  }

  modif(element){
    console.log(element);
    this.selectAgentId = element.agentComptable.id;
    this.versementId = element.id;
    const util = new Util_fonction();
    this.comptaVersementForm.controls.montant.setValue(element.montant);
    this.comptaVersementForm.controls.motif.setValue(element.motif);
    this.comptaVersementForm.controls.dateDeVersenement.setValue(util.DateConvert(element.dateDeVersement));

    $('#VersementFormModal').modal('show');
    $('#VersementFormModal').appendTo('body');
  }

  UpdateVersement(){
    this.vermentUpdateSpinner = true;
    this.VersermentBody.agentComptable_id = this.selectAgentId;
    this.VersermentBody.structure_id = this.user.structure.id;
    this.VersermentBody.montant = this.comptaVersementForm.controls.montant.value;
    this.VersermentBody.motif = this.comptaVersementForm.controls.motif.value;

    this.versementService.UpdateVersement(this.versementId, this.VersermentBody).subscribe(updateResponse => {
      this.vermentUpdateSpinner = false;
      $('#VersementFormModal').modal('hide');
      if (this.searchIsDone){
        this.Search();
      } else {
        this.GetVersementComptable();
      }
      // this.showForm = false;
      Util_fonction.SuccessMessage(updateResponse);
      }, error => {
      this.vermentUpdateSpinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }


  DeleteDivision(element){
    Swal.fire({
      title: '',
      html: 'êtes-vous sûr de supprimer cette le versement de <strong> ' + element.montant +
        '</strong> ayant pour motif <strong> ' + element.motif + '</strong>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'non, annuler',
      confirmButtonText: 'Oui, Supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.versementService.DeleteVersement(element.id).subscribe( deletRes=>{
          if (this.searchIsDone){
            this.Search();
          } else {
            this.GetVersementComptable();
          }
          Util_fonction.SuccessMessage(deletRes);
        }, error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        })
      }
    });
  }


  initSearchForm(){
    this.comptaVersementSearchForm = this.formBuilder.group({
      type: new FormControl(null),
      annee: new FormControl(null),
      dateDebut: new FormControl(null),
      dateFin: new FormControl(null),
      montant: new FormControl(null),
      motif: new FormControl(null),
    })
  }

  /**
   * INITIALISATION DU FORMULAIRE DE VERSEMENT
   */
  initVersemntForm(){
    this.comptaVersementForm = this.formBuilder.group({
      dateDeVersenement: new FormControl(null,[Validators.required]),
      montant: new FormControl(null,[Validators.required]),
      motif: new FormControl(null, [Validators.required]),
    })
  }

}
