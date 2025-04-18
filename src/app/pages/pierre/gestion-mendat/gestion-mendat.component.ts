import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StructureService} from "../../../services/structure.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {EvenementService} from "../../../services/evenement.service";
import Swal from 'sweetalert2';
import {Util_fonction} from "../../models/util_fonction";
import {PAG_MIDLE_SIZE, PAG_SMALL_SIZE, UNIV_FILIERE} from "../../../CONSTANTES";
import { MandatService } from '../../../services/mandat.service';
import { PersonnelAdminService } from '../../../services/GestionPersonnelAdmin/personnel-admin.service';
declare var $: any;

@Component({
  selector: 'app-gestion-mendat',
  templateUrl: './gestion-mendat.component.html',
  styleUrls: ['./gestion-mendat.component.css']
})
export class GestionMendatComponent implements OnInit {
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
    'prenom',
    'nom',
    'structure',
    'type',
    'Date',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

// tslint:disable-next-line:member-ordering
body: any = {};

  persoRoleArray;
  user: any;
  action: any;
  StructureAnnees: any;
  IDEven: any;
  seleviteCursus: boolean = false;
ListAdmin = false;
  ListPerso = true;
  listBody = {
    cursus: null,
    id_annee: null,
    id_structure: null,
    type_evenement: null,
  }
  GetBody = {
   id_structure: null,
    role: null
  }
  AccessContaine = false;
  ListEnseignant = false;
  ListEnseignantVacataire = false;
  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;
  listPersonnel = [];

  constructor(private formBuilder: FormBuilder,
              private evenementService: EvenementService,
              private mandatService: MandatService,
              private structureService: StructureService,
              private anneeServe: StructureService,
              private personnelAdminService: PersonnelAdminService,
              ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.structureID = this.user.structure.id;
    this.initForm();
    this.initFilterForm();
    this.initStrucForm();
    this.GetListMendat();
    this.getStructurePersonnelAdmin();
  }

  GetStuctureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id)
      .subscribe(res => {
        this.StructureAnnees = res;
      })
  }

  GetListMendat() {
    console.log(this.FilterForm.controls);
    let search = '&search=';

    if (Util_fonction.checkIfNoTEmpty(this.FilterForm.controls.dateDebut.value)) {
      search = search + 'dateDebut=' + this.FilterForm.controls.dateDebut.value + ',';
      }
    if (Util_fonction.checkIfNoTEmpty(this.FilterForm.controls.dateFin.value)) {
      search = search + 'dateFin=' + this.FilterForm.controls.dateFin.value + ',';
      }
    if (Util_fonction.checkIfNoTEmpty(this.FilterForm.controls.type.value)) {
      search = search + 'type=' + this.FilterForm.controls.type.value + ',';
      }

      if (search !== '&search=') {
        search = search.substring(0, search.length - 1);
      }else {
        search = '';
      }
    this.mandatService.getListMendat(search).subscribe( res =>{
      this.dataSource = new MatTableDataSource(res.content);
      this.dataSource.paginator = this.paginator;
      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
    });
  }

  getStructurePersonnelAdmin() {
    this.ListPerso = true;
    this.ListEnseignant = false;
    this.ListEnseignantVacataire = false;
    this.ListAdmin = false;
    this.AccessContaine = false;
    this.GetBody.role = "ROLE_DECANAT";
    this.personnelAdminService.getStructurePersonnel(this.GetBody).subscribe(persoListRes => {
      this.listPersonnel = persoListRes.content;
      
    }, depError => {
      // this.utilService.showToast('info', 'Note', depError['error']);
    });
  }

  getEnseignantListe() {
    this.ListEnseignant = true;
    this.ListAdmin = false;
    this.ListPerso = false;
    this.ListEnseignantVacataire = false;
    this.AccessContaine = false;
    this.GetBody.role = "ROLE_ENSEIGNANT";
    this.personnelAdminService.getStructurePersonnel(this.GetBody).subscribe(EnseignantListRes => {
      this.listPersonnel = EnseignantListRes.content;
    }, EnsError => {
      // this.utilService.showToast('info', 'Note', depError['error']);
    });
  }

  getEnseignantVacataireListe() {
    this.ListEnseignantVacataire = true;
    this.ListEnseignant = false;
    this.ListAdmin = false;
    this.ListPerso = false;
    this.AccessContaine = false;
    this.GetBody.role = "ROLE_VACATAIRE";
    this.personnelAdminService.getStructurePersonnel(this.GetBody).subscribe(EnseignantVacataireListRes => {
      this.listPersonnel = EnseignantVacataireListRes.content;
    }, EnsError => {
      // this.utilService.showToast('info', 'Note', depError['error']);
    });
  }

  getAdminList() {
    this.ListAdmin = true;
    this.ListPerso = false;
    this.ListEnseignant = false;
    this.ListEnseignantVacataire = false;
    this.AccessContaine = false;
    this.GetBody.role = "ROLE_ADMIN";
    this.personnelAdminService.getStructurePersonnel(this.GetBody).subscribe(AdminListRes => {
      this.listPersonnel = AdminListRes.content;
    }, AdminError => {
      // this.utilService.showToast('info', 'Note', depError['error']);
    });
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
  creatMandat() {
    this.body.personnel = {id: this.EvenementForm.controls.personnelId.value};
    this.body.type = this.EvenementForm.controls.type.value;
    this.body.dateDebut = this.EvenementForm.controls.dateDebut.value;
    this.body.dateFin = this.EvenementForm.controls.dateFin.value;


    this.mandatService.addMandat(this.body).subscribe(res => {
      this.GetListMendat();
      $('#EvenementFormModal').modal('hide');
      this.showForm = false;
      Util_fonction.SuccessMessage('Ajouit effectué avec succès');
      this.initForm();
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
      this.EvenementForm.controls.personnelId.setValue(element.personnel.id);
      this.EvenementForm.controls.dateDebut.setValue(element.dateDebut);
      this.EvenementForm.controls.dateFin.setValue(element.dateFin);
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
    updateMandat() {

      this.body.personnel = {id: this.EvenementForm.controls.personnelId.value};
      this.body.type = this.EvenementForm.controls.type.value;
      this.body.dateDebut = this.EvenementForm.controls.dateDebut.value;
      this.body.dateFin = this.EvenementForm.controls.dateFin.value;
      this.body.id = this.IDEven;

      this.mandatService.updateMandat(this.body).subscribe(res=>{
        this.GetListMendat();
        $('#EvenementFormModal').modal('hide');
        this.showForm = false;
        Util_fonction.SuccessMessage('Modification effectuée avec succès');
        this.initForm();
      }, errorSpecialite => {
       Util_fonction.AlertMessage(errorSpecialite.error.status, errorSpecialite.error.message);
      });
    }
    //
    //
    DeleteMandat(element){
      Swal.fire({
        title: '',
        // tslint:disable-next-line:max-line-length
        text: 'Etes-vous sûre de vouloir supprimer le mandat ' + element.type + ' de ' + element.personnel.prenom + ' ' + element.personnel.nom,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Annuler!',
        confirmButtonText: 'Oui, Supprimé!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.mandatService.deleteMandat(element.id).subscribe(delRes=>{
            Util_fonction.SuccessMessage('Mandat supprimé avec succès');
            this.GetListMendat();
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
        personnelId: new FormControl (null, Validators.required),
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
      dateDebut: new FormControl (null),
      type: new FormControl (null),
      dateFin: new FormControl (null)
    })
  }

}
