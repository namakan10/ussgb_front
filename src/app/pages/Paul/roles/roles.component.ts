import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Util_fonction} from "../../models/util_fonction";
import {RolesService} from "../../../services/roles.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {PAG_SMALL_SIZE} from "../../../CONSTANTES";
declare var $: any;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  dataSource;//= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'nom',
    'description',
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;


  user = JSON.parse(sessionStorage.getItem("user"));
  RoleForm: FormGroup;
  action: string = "";
  showForm: boolean = false;

  body = {
    id: null,
    nom: null,
    description: null
  }
  idRole : any;
  constructor(private roleService: RolesService, private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
    this.Get_ListRole();
  }
  Get_ListRole(){
    this.roleService.GetRoles().subscribe( res =>{
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }

  /**
   * Lancement Creation
   */
  newRole(){
    this.initForm();
    this.action = "creat";
    this.showForm = true;
    $('#RoleFormModal').modal('show');
    $('#RoleFormModal').appendTo('body');
  }

  /**
   * Creation
   */
  Add_Role(){
    this.body.nom = this.RoleForm.controls.nom.value;
    this.body.description = this.RoleForm.controls.description.value;

    this.roleService.AddRole(this.body).subscribe(res=>{
      this.Get_ListRole();
      $('#RoleFormModal').modal('hide');
      this.showForm = false;
      Util_fonction.SuccessMessage(res);
    }, errorSpecialite => {
      Util_fonction.AlertMessage(errorSpecialite.error.status, errorSpecialite.error.message);
    });
  }

  /**
   * Lacement Mise à jour
   */
  modifRole(element: any){
    this.initForm();
    this.idRole = element.id;
    this.action = "update";
    this.showForm = true;

    this.RoleForm.controls.nom.setValue(element.nom);
    this.RoleForm.controls.description.setValue(element.description);

    $('#RoleFormModal').modal('show');
    $('#RoleFormModal').appendTo('body');
  }

  /**
   * Mise à jour
   */
  Update_Role(){
    this.body.nom = this.RoleForm.controls.nom.value;
    this.body.id = this.idRole;
    this.body.description = this.RoleForm.controls.description.value;

    this.roleService.UpdateRole(this.idRole, this.body).subscribe(res=>{
      this.Get_ListRole();
      $('#RoleFormModal').modal('hide');
      this.showForm = false;
      Util_fonction.SuccessMessage(res);
    }, errorSpecialite => {
      Util_fonction.AlertMessage(errorSpecialite.error.status, errorSpecialite.error.message);
    });
  }

  /**
   * Suppression
   */
  Delete_Role(element: any){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer ce rôle ? '"+element.nom+"'",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.roleService.DeleteRole(element.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
          this.Get_ListRole();
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
    this.RoleForm = this.fb.group({
      nom: new FormControl (null, Validators.required),
      description: new FormControl (null, Validators.required),
    });
  }


}
