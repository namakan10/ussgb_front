import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {PAG_SMALL_SIZE} from "../../../CONSTANTES";
import {EvenementService} from "../../../services/evenement.service";
import {StructureService} from "../../../services/structure.service";
import {Util_fonction} from "../../models/util_fonction";
import Swal from "sweetalert2";
import {OuvragesService} from "../../../services/ouvrages.service";
declare var $: any;

@Component({
  selector: 'app-emprunt',
  templateUrl: './emprunt.component.html',
  styleUrls: ['./emprunt.component.css']
})
export class EmpruntComponent implements OnInit {

  showForm :boolean = false;
  creatForm :boolean = false;
  StructureSelected: boolean = false;
  Ouvrages: any;
  keyword = 'nom';
  checkResult;
  anneeScolaireChecking = null;
  structureID;
  structureEvenements;
  EmpruntForm: FormGroup;
  FilterForm: FormGroup;
  dateEnCours = JSON.parse(sessionStorage.getItem("dateEnCours"))
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
              private anneeServe: StructureService,
              private ouvragesService: OuvragesService,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.structureID = this.user.structure.id;
    this.initForm();
    this.initFilterForm();
    this.initStrucForm();
    // this.GetListEvenement();
    this.GetStuctureAnnees();
    this.GetEmprunts();
  }

  GetStuctureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id)
      .subscribe(res => {
        this.StructureAnnees = res;
      })
  }

  statusEmprumt:string = "EMPRUNTE";
  GetEmprunts(){
    const body = {
      id: this.user.structure.id,
      statut: this.statusEmprumt
    }
    this.ouvragesService.GetAllStructureEmprunt(body).subscribe( res =>{
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
    });
  }


  CursusSelection(){
    this.seleviteCursus = this.EmpruntForm.controls.cursus.value !== 'LICENCE';
  }

  ouvragesSelectEvent(event){
    console.log("ouvrages event ::=> ", event);

  }

  submitForm(){
    const body =
    {
      annee: this.dateEnCours.anneeScolaire,
      dateEmprunt: "2023-09-03",
      dateRetour: "2023-09-07",
      ouvrages: {"id": 3},
      statut:"EMPRUNTE",
      structure	: {"id": 2},
      user: {"id": 2}
    }
  }

  newEmprunt(){
    this.initForm();
    this.action = "creat";
    this.showForm = true;
    $('#EmpruntFormModal').modal('show');
    $('#EmpruntFormModal').appendTo('body');
  }

  /***
   * CREATION
   */
  creatEmprunt(){
    this.body.annee_id = +this.EmpruntForm.controls.annee.value;
    this.body.type = this.EmpruntForm.controls.type.value;
    this.body.cursus = this.EmpruntForm.controls.cursus.value;
    this.body.dateDebut = this.EmpruntForm.controls.dateDebut.value;
    this.body.dateFin = this.EmpruntForm.controls.dateFin.value;


    this.evenementService.addEvenement(this.body).subscribe(res=>{
      // this.GetListEvenement();
      $('#EmpruntFormModal').modal('hide');
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

    // $('#EmpruntFormModal').modal('show');
    // $('#EmpruntFormModal').appendTo('body');
  }

  fullEditForm(element){
    this.IDEven = element.id;
    console.log(element);

    this.EmpruntForm.controls.annee.setValue(element.annee.id);
    this.EmpruntForm.controls.dateDebut.setValue(element.dateDebut);
    this.EmpruntForm.controls.dateFin.setValue(element.dateFin);
    this.EmpruntForm.controls.cursus.setValue(element.cursus);
    this.EmpruntForm.controls.type.setValue(element.type);


    $('#EmpruntFormModal').modal('show');
    $('#EmpruntFormModal').appendTo('body');
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

    this.body.annee_id = this.EmpruntForm.controls.annee.value;
    this.body.type = this.EmpruntForm.controls.type.value;
    this.body.cursus = this.EmpruntForm.controls.cursus.value;
    this.body.dateDebut = this.EmpruntForm.controls.dateDebut.value;
    this.body.dateFin = this.EmpruntForm.controls.dateFin.value;

    console.log(this.body);

    this.evenementService.updateEvenement(this.IDEven, this.body).subscribe(res=>{
      // this.GetListEvenement();
      $('#EmpruntFormModal').modal('hide');
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
          // this.GetListEvenement();
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
    this.EmpruntForm = this.formBuilder.group({
      dateRetour: new FormControl (null, Validators.required),
      ouvrages: new FormControl (null, Validators.required),

    // {
    //   "annee": "2022 - 2023",
    //   "dateEmprunt": "2023-09-03",
    //   "dateRetour": "2023-09-07",
    //   "ouvrages": {"id": 3},
    //   "statut":"EMPRUNTE",
    //   "structure"	: {"id": 2},
    //   "user": {"id": 2}
    // }
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
