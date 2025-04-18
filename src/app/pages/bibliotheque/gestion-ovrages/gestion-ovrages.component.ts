import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {OuvragesService} from "../../../services/ouvrages.service";
import Swal from "sweetalert2";
import {Util_fonction} from "../../models/util_fonction";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Router} from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-gestion-ovrages',
  templateUrl: './gestion-ovrages.component.html',
  styleUrls: ['./gestion-ovrages.component.css']
})
export class GestionOvragesComponent implements OnInit {
  panelOpenState = false;
  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'nom',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  /////

  GestionForm: FormGroup;

  AuteurBody = {
    biographie: null,
    // id: null,
    nom: null
  }

  EditeurBody = {
    description: null,
    // id: null,
    nom: null
  }
  action: any;
  type: string = 'AUTEUR';
  _Spinner: boolean = false;

  listGenre = false;
  listEditeur = false;
  listAuteur = false;

  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50, 100, 200, 500, 700, 900, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
  length = 100;



  constructor(private formbuilder : FormBuilder,
              private router: Router,
              private ouvragesService: OuvragesService) { }

  ngOnInit() {
    this.intForm();
    this.GetList();
  }
  backBookPage(){
    this.router.navigate(['/Biliotheque/Ovrages']);
  }
  selector(seleted){
    console.log(seleted);
    this.action = seleted;
    this.intForm();
  }

  typeGestion(typ){
    this.type = typ;
  }

  GetList(){
    if (this.type === 'AUTEUR'){
      this.ouvragesService.list_auteurs().subscribe(list => {
        this.dataSource = new MatTableDataSource(list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }

    if (this.type === 'EDITEUR') {
      this.ouvragesService.list_Editeur().subscribe(list => {
        this.dataSource = new MatTableDataSource(list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }

    if (this.type === 'GENRE'){
      this.ouvragesService.list_Genre().subscribe(list => {
        this.dataSource = new MatTableDataSource(list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  showModal() {
    this.action = 'add';
    this.intForm();
    if (this.type === 'EDITEUR') {
      this.GestionForm.controls.description.setValidators([Validators.required]);
      this.GestionForm.controls.description.updateValueAndValidity();
    }

    if (this.type === 'AUTEUR') {
      this.GestionForm.controls.biographie.setValidators([Validators.required]);
      this.GestionForm.controls.biographie.updateValueAndValidity();
    }

    $('#showModal').modal('show');
    $('#showModal').appendTo('body');
  }

  data: any;
  Bio(row) {
    this.action = 'bio';
    this.data = row;
    $('#showBioModal').modal('show');
    $('#showBioModal').appendTo('body');
  }

  editID: any;
  Edit(element){
    this.intForm();
    this.action = 'edit';
    this.editID = element.id;
    this.GestionForm.controls.nom.setValue(element.nom);

    if (this.type === 'AUTEUR'){
      this.GestionForm.controls.biographie.setValue(element.biographie);

      this.GestionForm.controls.biographie.setValidators([Validators.required]);
      this.GestionForm.controls.biographie.updateValueAndValidity();
    }

    if (this.type === 'EDITEUR'){
      this.GestionForm.controls.description.setValue(element.description);

      this.GestionForm.controls.description.setValidators([Validators.required]);
      this.GestionForm.controls.description.updateValueAndValidity();
    }

    $('#showModal').modal('show');
    $('#showModal').appendTo('body');
  }

  SumitForm(){
    if (this.type === 'AUTEUR'){
      this.AddAuteur();
    }

    if (this.type === 'EDITEUR') {
      this.AddEditeur();
    }

    if (this.type === 'GENRE'){
      this.AddGenre();
    }
  }


  EditForm(){
    if (this.type === 'AUTEUR'){
      this.EditAuteur();
    }
    if (this.type === 'EDITEUR') {
      this.EditEditeur();
    }
    if (this.type === 'GENRE'){
      this.EditGenre();
    }
  }

  /***
   * AJOUT D'UN AUTEUR
   * @constructor
   */
  AddAuteur(){
    this._Spinner = true;
    this.AuteurBody.biographie = this.GestionForm.controls.biographie.value;
    this.AuteurBody.nom = this.GestionForm.controls.nom.value;
    this.ouvragesService.add_Auteur(this.AuteurBody).subscribe(addAuteurResponse => {
      this._Spinner = false;
      $('#showModal').modal('hide');
      Util_fonction.SuccessMessage(addAuteurResponse);
      this.GetList();
    }, addError => {
      this._Spinner = false;
      Util_fonction.AlertMessage(addError.error.status, addError.error.message);
    })
  }
  /***
   * EDITION D'UN AUTEUR
   * @constructor
   */
  EditAuteur(){
    this._Spinner = true;
    this.AuteurBody.biographie = this.GestionForm.controls.biographie.value;
    this.AuteurBody.nom = this.GestionForm.controls.nom.value;
    this.ouvragesService.UpdateAuteur(this.editID, this.AuteurBody).subscribe(res => {
      this._Spinner = false;
      $('#showModal').modal('hide');
      Util_fonction.SuccessMessage(res);
      this.GetList();
    }, error => {
      this._Spinner = false;
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    })
  }


  /***
   * AJOUT D'UN Editeur
   * @constructor
   */
  AddEditeur(){
    this._Spinner = true;
    this.EditeurBody.description = this.GestionForm.controls.description.value;
    this.EditeurBody.nom = this.GestionForm.controls.nom.value;
    this.ouvragesService.add_Editeur(this.EditeurBody).subscribe(addEditeurResponse => {
      this._Spinner = false;
      $('#showModal').modal('hide');
      this.GetList();
      Util_fonction.SuccessMessage(addEditeurResponse);
    }, addError => {
      this._Spinner = false;
      Util_fonction.AlertMessage(addError.error.status,addError.error.message);
    })
  }

  /***
   * EDITION D'UN Editeur
   * @constructor
   */
  EditEditeur(){
    this._Spinner = true;
    this.EditeurBody.description = this.GestionForm.controls.description.value;
    this.EditeurBody.nom = this.GestionForm.controls.nom.value;
    this.ouvragesService.Update_Editeur(this.editID,this.EditeurBody).subscribe(res => {
      this._Spinner = false;
      $('#showModal').modal('hide');
      this.GetList();
      Util_fonction.SuccessMessage(res);
    }, error => {
      this._Spinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }


  /***
   * AJOUT D'UN Genre
   * @constructor
   */
  AddGenre(){
    this._Spinner = true;
    let boby = {nom: this.GestionForm.controls.nom.value};
    this.ouvragesService.add_Genre(boby).subscribe(addEditeurResponse => {
      this._Spinner = false;
      $('#showModal').modal('hide');
      this.GetList();
      Util_fonction.SuccessMessage(addEditeurResponse);
    }, addError => {
      this._Spinner = false;
      Util_fonction.AlertMessage(addError.error.status,addError.error.message);
    })
  }


  /***
   * EDITION D'UN Genre
   * @constructor
   */
  EditGenre(){
    this._Spinner = true;
    let boby = {nom: this.GestionForm.controls.nom.value};
    this.ouvragesService.Update_Genre(this.editID, boby).subscribe(res => {
      this._Spinner = false;
      $('#showModal').modal('hide');
      this.GetList();
      Util_fonction.SuccessMessage(res);
    }, error => {
      this._Spinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }


  supprimerAuteur(element){

    Swal.fire({
      title: '',
      html: 'Voulez vous supprimer cet auteur <br><strong>'+element.nom+'</strong>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',

    }).then((result) => {
      if (result.isConfirmed) {
        this.ouvragesService.delete(element.id, this.type).subscribe(
          response => {
            this.GetList();
            Util_fonction.SuccessMessage(response);
          },error =>{
            Util_fonction.AlertMessage(error.error.status,error.error.message);
          },
        );
      }
    })
  }


  intForm(){
    this.GestionForm = this.formbuilder.group({
      nom : new FormControl(null, [Validators.required]),
      biographie: new FormControl(null),
      description: new FormControl(null)
    });
  }
}
