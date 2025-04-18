import {Component, OnInit} from '@angular/core';
// import {FormBuilder, FormControl} from "@angular/forms";
// import {VersementService} from "../../../services/versement.service";
// import {MatPaginator, MatTableDataSource} from "@angular/material";
// import Swal from "sweetalert2";
// declare var $: any;

@Component({
  selector: 'app-consult-encaissement',
  templateUrl: './consult-encaissement.component.html',
  styleUrls: ['./consult-encaissement.component.css']
})
export class ConsultEncaissementComponent implements OnInit {
  // @Input() comptaData;
  // searchBody = {
  //   type: "LIST",
  //   annee: null,
  //   dateDebut: null,
  //   dateFin: null,
  //   montant: null,
  //   motif: null,
  //
  //   idAgentComptable: null,
  //   idChefComptable: null,
  //   idStructure: null,
  //   page: null,
  //   size: null
  // }
  //
  // comptaEncaissementSearchForm: any;
  // user: any;
  //
  //
  // searchIsDone :boolean = false;
  // hideTable: boolean = false
  // roleAdmin: boolean = false
  // SommePer: any;
  //
  //
  // displayedColumns: string[] = ['montant', 'motif', 'chefComptable', 'date', 'action'];
  // dataSource = new MatTableDataSource<any>();
  //
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor() { }

  ngOnInit() {
    // this.searchBody.idAgentComptable = this.comptaData.id;
    // this.user = JSON.parse(sessionStorage.getItem('user'));
    // this.initSearchForm();
    //
    // console.log(this.comptaData);
    //
    // for (let rol of this.user.users.roles){
    //   if (rol.nom === 'ROLE_ADMIN'){
    //     this.roleAdmin = true;
    //   }
    // }
  }

  /**
   * RECHERCHE DES ENCAISSEMENT DU COMPTABLE
   */
  // comptaEncaissemntSearch() {
  //   this.searchBody.dateDebut = this.comptaEncaissementSearchForm.controls.dateDebut.value;
  //   this.searchBody.dateFin = this.comptaEncaissementSearchForm.controls.dateFin.value;
  //
  //   this.searchBody.type = this.comptaEncaissementSearchForm.controls.type.value;
  //   this.searchBody.page = "0";
  //   this.searchBody.size = "500";
  //
  //   this.searchBody.idAgentComptable = this.comptaData.id;
  //   this.searchBody.idStructure = this.user.structure.id;
  //
  //   this.Search();
  // }

  // Search(){
  //   this.versementService.GetEncaissements(this.searchBody).subscribe( getResponse => {
  //     this.searchIsDone = true;
  //     if ((typeof getResponse === 'function') || (typeof getResponse === 'object')) {
  //       // this.versementOfCompta = getResponse.content;
  //       // this.dataSource = getResponse.content;
  //       console.log(getResponse);
  //     } else {
  //
  //       this.hideTable = true;
  //       this.SommePer = getResponse;
  //
  //       $('#sommeModal').modal('show');
  //       $('#sommeModal').appendTo('body');
  //     }
  //
  //   });
  // }

  // initSearchForm(){
  //   this.comptaEncaissementSearchForm = this.formBuilder.group({
  //     type: new FormControl(null),
  //     dateDebut: new FormControl(null),
  //     dateFin: new FormControl(null),
  //   })
  // }

}
