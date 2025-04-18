import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StructureService} from "../../../services/structure.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {EvenementService} from "../../../services/evenement.service";
import Swal from 'sweetalert2';
import {Util_fonction} from "../../models/util_fonction";
import {PAG_SMALL_SIZE, UNIV_FILIERE} from "../../../CONSTANTES";
declare var $: any;

@Component({
  selector: 'ngx-evenements',
  templateUrl: './evenements.component.html',
  styleUrls: ['./evenements.component.scss']
})
export class EvenementsComponent implements OnInit {
  showForm :boolean = false;
  creatForm :boolean = false;
  StructureSelected: boolean = false;
  checkResult;
  anneeScolaireChecking = null;
  structureID;
  structureEvenements;
  EvenementForm: FormGroup;
  FilterForm: FormGroup;

  StructureSelectForm: FormGroup;
  AllStructures =[];

  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'AnneeScolaire',
    'Cursus',
    'Date',
    'Type',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

body = {
  annee_id: null,
  cursus: null,
  dateDebut: null,
  dateFin: null,
  type: null
}
  user: any;
  action: any;
  StructureAnnees: any;
  IDEven: any;
  seleviteCursus: boolean = false;

  listBody = {
    cursus: null,
    id_annee: null,
    id_structure: null,
    type_evenement: null,
  }

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;



  constructor(private formBuilder: FormBuilder,
              private evenementService: EvenementService,
              private structureService: StructureService,
              private anneeServe: StructureService
              ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.structureID = this.user.structure.id;
    this.initForm();
    this.initFilterForm();
    this.initStrucForm();
    // this.GetListEvenement();
    this.GetStuctureAnnees();
    this.GetListEvenement();
  }

  GetStuctureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id)
      .subscribe(res => {
        this.StructureAnnees = res;
      })
  }

  GetListEvenement(){
    this.listBody.id_structure = +this.structureID;
    if (Util_fonction.checkIfNoTEmpty(this.FilterForm.controls.annee.value)){
      this.listBody.id_annee = +this.FilterForm.controls.annee.value;
    }
    this.listBody.type_evenement = this.FilterForm.controls.type.value;
    this.listBody.cursus = this.FilterForm.controls.cursus.value;
    this.evenementService.getStucturesEvenements(this.listBody).subscribe( res =>{
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
    });
  }


  CursusSelection(){
    this.seleviteCursus = this.EvenementForm.controls.cursus.value !== 'LICENCE';
  }

  newEvenement(){
    this.initForm();
    this.action = "creat";
    this.showForm = true;
    $('#EvenementFormModal').modal('show');
    $('#EvenementFormModal').appendTo('body');
  }

  /***
   * CREATION
   */
  creatEvenement(){
    this.body.annee_id = +this.EvenementForm.controls.annee.value;
    this.body.type = this.EvenementForm.controls.type.value;
    this.body.cursus = this.EvenementForm.controls.cursus.value;
    this.body.dateDebut = this.EvenementForm.controls.dateDebut.value;
    this.body.dateFin = this.EvenementForm.controls.dateFin.value;


    this.evenementService.addEvenement(this.body).subscribe(res=>{
      this.GetListEvenement();
      $('#EvenementFormModal').modal('hide');
      this.showForm = false;
      Util_fonction.SuccessMessage(res);
    }, errorSpecialite => {
      Util_fonction.AlertMessage(errorSpecialite.error.status, errorSpecialite.error.message);
    });
  }

  modifEvenement(element){
    this.initForm();
    this.action = "update";
    this.showForm = true;
    this.fullEditForm(element);

    // $('#EvenementFormModal').modal('show');
    // $('#EvenementFormModal').appendTo('body');
  }

  fullEditForm(element){
      this.IDEven = element.id;
      // let DDebut = null;
      // let DFin = '';
      //
      // if(element.dateDebut[1].toString().length <= 1){
      //   element.dateDebut[1] = '0'+element.dateDebut[1].toString();
      // }
      //
      // if(element.dateDebut[2].toString().length <= 1){
      //   element.dateDebut[2] = '0'+element.dateDebut[2].toString();
      // }
      //
      // if(element.dateFin[1].toString().length <= 1){
      //   element.dateFin[1] = '0'+element.dateFin[1].toString();
      // }
      //
      // if(element.dateFin[2].toString().length <= 1){
      //   element.dateFin[2] = '0'+element.dateFin[2].toString();
      // }
      //
      // DFin = element.dateFin[0]+'-'+element.dateFin[1]+'-'+element.dateFin[2];
      //
      // DDebut = element.dateDebut[0]+'-'+element.dateDebut[1]+'-'+element.dateDebut[2];



      this.EvenementForm.controls.annee.setValue(element.annee.id);
      this.EvenementForm.controls.dateDebut.setValue(element.dateDebut);
      this.EvenementForm.controls.dateFin.setValue(element.dateFin);
      this.EvenementForm.controls.cursus.setValue(element.cursus);
      this.EvenementForm.controls.type.setValue(element.type);


      $('#EvenementFormModal').modal('show');
      $('#EvenementFormModal').appendTo('body');
    }

    submitStructureSelect(StructureSelectForm){
      this.structureID = StructureSelectForm.value.selectStruc;
      this.StructureSelected = true;
      // this.GetListEvenement();
    }


    checkingAnnee(anneeScolaire, dateDebut, dateFin) {
      let toDay = new Date();
      let dd = String(toDay.getDate()).padStart(2, '0');
      let mm = String(toDay.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = toDay.getFullYear();
      const today = yyyy + '-' + mm + '-' + dd;



      anneeScolaire = anneeScolaire.toString().replace(/\s/g, "");
      const anneeS_D = anneeScolaire.substr(0,4);
      const anneeS_F = anneeScolaire.substr(5,anneeScolaire.length);
      const date_D_Ans = new Date(dateDebut).getFullYear();
      const date_F_Ans = new Date(dateFin).getFullYear();
      if ((anneeS_D <= date_D_Ans && date_D_Ans <= anneeS_F) && (date_F_Ans <= anneeS_F)){
        if (dateDebut >= today && dateFin >= today) {
          return true;
        } else {
          Util_fonction.AlertMessage("warning","Veuillez vérifier les dates entrée par rapport à la date d'aujourd'hui; Elles doivent être supérieur ou égale à aujourd'hui");
        return false;
        }
      } else {
        Util_fonction.AlertMessage(404,"un  evenement courant ne peut être crée à ces dates: '"+dateDebut+"' à '"+dateFin+"'");
      return false;
      }
    }

    /**
     * Mise à jour
     */
    update_Evenement() {

      this.body.annee_id = this.EvenementForm.controls.annee.value;
      this.body.type = this.EvenementForm.controls.type.value;
      this.body.cursus = this.EvenementForm.controls.cursus.value;
      this.body.dateDebut = this.EvenementForm.controls.dateDebut.value;
      this.body.dateFin = this.EvenementForm.controls.dateFin.value;

      this.evenementService.updateEvenement(this.IDEven, this.body).subscribe(res=>{
        this.GetListEvenement();
        $('#EvenementFormModal').modal('hide');
        this.showForm = false;
        Util_fonction.SuccessMessage(res);
      }, errorSpecialite => {
       Util_fonction.AlertMessage(errorSpecialite.error.status, errorSpecialite.error.message);
      });
    }
    //
    //
    Delete_Evenement(element){
      Swal.fire({
        title: '',
        text: "Etes-vous sûre de vouloir supprimer evènement '"+element.type+"'",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Annuler!',
        confirmButtonText: 'Oui, Supprimé!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.evenementService.deleteEvenement(element.id).subscribe(delRes=>{
            Util_fonction.SuccessMessage(delRes);
            this.GetListEvenement();
          }, error =>{
            Util_fonction.AlertMessage(error.error.status,error.error.message);
          });
        }
      })

    }

      /***
   * Initialisation du formulaire
   */
  initForm() {
      this.EvenementForm = this.formBuilder.group({
        annee1: new FormControl (null),

        annee: new FormControl (null, Validators.required),
        cursus: new FormControl (null, Validators.required),
        dateDebut: new FormControl (null, Validators.required),
        dateFin: new FormControl (null, Validators.required),
        type: new FormControl (null, Validators.required)

      });
  }

  initStrucForm (){
    this.StructureSelectForm = this.formBuilder.group({
      selectStruc: new FormControl ('', Validators.required),
    })
  }

  initFilterForm(){
    this.FilterForm = this.formBuilder.group({
      annee: new FormControl (null),
      type: new FormControl (null),
      cursus: new FormControl (null)
    })
  }

}
