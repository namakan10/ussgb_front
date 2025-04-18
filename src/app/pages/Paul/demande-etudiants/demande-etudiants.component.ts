import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UNIV_FILIERE} from "../../../CONSTANTES";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {Util_fonction} from "../../models/util_fonction";
import {DemandeEtudiantService} from "../../../services/demande-etudiant.service";
import {StructureService} from "../../../services/structure.service";
import Swal from "sweetalert2";
declare var $: any;

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}


@Component({
  selector: 'app-demande-etudiants',
  templateUrl: './demande-etudiants.component.html',
  styleUrls: ['./demande-etudiants.component.css']
})
export class DemandeEtudiantsComponent implements OnInit {
  displayedColumns: string[] = ['date', 'type', 'etat', 'anneeScolaire', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  filiereListBody = {
    id_structure: null,
    id_departement: null,
    id_specialiteCandidat: null,
    cursus: null
  }
  etudiant = JSON.parse(sessionStorage.getItem('user'));
  Options : any;
  action : any;
  opt_transf : boolean = false;
  univ_fil = UNIV_FILIERE;

  DemandeForm : FormGroup;

  sendData = {
    date: null,
    etudiant_id: null,
    option_id: null,
    statut: null,
    type: null
  }

  _spinner : boolean = false;
  user = JSON.parse(sessionStorage.getItem('user'));
  constructor(private optionService: OptionsService,
              private structureService: StructureService,
              private formBuilder: FormBuilder,
              private  demandeService: DemandeEtudiantService) { }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.get_StructureOptions();
    this.GetMesDemandes();
    this.GetStructureAnnees();
  }
  anneeStructure:any
  GetStructureAnnees(){
    this.structureService.getStuctureAnnees(this.etudiant.structure.id).subscribe((res) => {
      this.anneeStructure = res;
    });
  }

  get_StructureOptions() {

    this.optionService.getStructureOptions(this.etudiant.structure.id).subscribe(optRes => {
      this.Options = optRes;
    });
  }

  newTransfert(){
    this.action = 'new';
  }
  checkIfIsEmpty(item){
    return Util_fonction.checkIfNoTEmpty(item);
  }
  annee_scolaire: any;
  GetMesDemandes() {
    let body = {
      annee_scolaire: this.annee_scolaire, //this.etudiant.users.etudiant.anneeScolaire,
      id_structure: this.etudiant.structure.id,
      num_etudiant: null,//this.etudiant.users.etudiant.numEtudiant,
      niveau: null,
      code_option: null,
    }
    // this.etudiant.users.etudiant.id
    this.demandeService.GetDemandes(body, 'envoyer').subscribe(res =>{
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  plusDemande(){
    this.initForm();
    this.action = "new";

    $('#demandeModal').modal('show');
    $('#demandeModal').appendTo('body');
  }


  addDemande() {
    this._spinner = true;
    let date = Util_fonction.convertDate(new Date());
    this.sendData.date = date;
    this.sendData.etudiant_id = +this.etudiant.users.etudiant.id;

    if (Util_fonction.checkIfNoTEmpty(this.DemandeForm.controls.option.value)){
      this.sendData.option_id = +this.DemandeForm.controls.option.value;
    }

    this.sendData.type = this.DemandeForm.controls.type.value;
    this.sendData.statut = "EN_ATTENTE";

    this.demandeService.saveDemande(this.sendData).subscribe(res =>{
      this._spinner = false;
      Util_fonction.SuccessMessage(res);
      $('#demandeModal').modal('hide');

      this.GetMesDemandes();
    }, error => {
      this._spinner = false;
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    })

  }
  editID:any;
  modifDemande(element){
    this.action = 'modif';
    this.editID = element.id;

    console.log(element);

    this.DemandeForm.controls.type.setValue(element.type);

    if (element.hasOwnProperty('option')){
      if (Util_fonction.checkIfNoTEmpty(element.option)){
        this.DemandeForm.controls.option.setValue(element.option);
      }
    }

    this.TypeChange();


    $('#demandeModal').modal('show');
    $('#demandeModal').appendTo('body');
  }

  updateDemande(){

    this._spinner = true;
    let date = Util_fonction.convertDate(new Date());
    this.sendData.date = date;
    this.sendData.etudiant_id = +this.etudiant.users.etudiant.id;

    if (Util_fonction.checkIfNoTEmpty(this.DemandeForm.controls.option.value)){
      this.sendData.option_id = +this.DemandeForm.controls.option.value;
    }

    this.sendData.type = this.DemandeForm.controls.type.value;
    this.sendData.statut = "EN_ATTENTE";

    this.demandeService.updateDemande(this.editID, this.sendData).subscribe(res =>{
      this._spinner = false;
      Util_fonction.SuccessMessage(res);
      $('#demandeModal').modal('hide');

      this.GetMesDemandes();
    }, error => {
      this._spinner = false;
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    })

  }


  TypeChange() {
    let type = this.DemandeForm.controls.type.value;
    if (type === "TRANSFERT") {
      this.opt_transf = true;
      this.DemandeForm.controls.option.setValidators([Validators.required]);
      this.DemandeForm.controls.option.updateValueAndValidity();
    } else {
      this.opt_transf = false;
      this.DemandeForm.controls.option.reset();
      this.DemandeForm.controls.option.clearValidators();
      this.DemandeForm.controls.option.updateValueAndValidity();
    }
  }



  Supprimer(element){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer cette demande '"+element.type+"' du "+Util_fonction.DateConvert2(element.date),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.demandeService.deleteDemande(element.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
          this.GetMesDemandes();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })

  }

  initForm(){
    this.DemandeForm = this.formBuilder.group({
      option: new FormControl(null),
      type: new FormControl(null, [Validators.required])
    });
  }
}

