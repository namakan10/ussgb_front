import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {StructureService} from '../../../services/structure.service';
// import {UtilsService} from "../../../services/utils.service";
import {DepartementService} from '../../../services/departement.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PersonnelAdminService} from '../../../services/GestionPersonnelAdmin/personnel-admin.service';
import {SpecialiteFonctionService} from '../../../services/specialite-fonction.service';
import {PAYS_MONDE} from '../../PAYS_MODE';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {Util_fonction} from "../../models/util_fonction";
import {PAG_MIDLE_SIZE} from "../../../CONSTANTES";
declare var $: any;
// import {RolesService} from '../../../services/Roles/roles.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-gestion-personnel-admin',
  templateUrl: './gestion-personnel-admin.component.html',
  styleUrls: ['./gestion-personnel-admin.component.scss']
})
export class GestionPersonnelAdminComponent implements OnInit {

  PersonnelAdminForm: FormGroup;
  Pays = PAYS_MONDE;
  showForm = false;
  ListEnseignant = false;
  ListEnseignantVacataire = false;

  creatForm = true;
  AccessContaine = false;

  PersonnelAdmins;
  persoRoleArray;
  roles;

  CreatPersonnelData = {
    departement: {
      id : '',
    },
    dateEmbauche : '',
    fonction: {
      id : '',
    },
    user : {
      typeUtilisateur : '',
      ville : '',
      rue : '',
      numMatricule : '',
      photo : '',
      telephone : '',
      lieuDeNaissance : '',
      nom : '',
      dateDeNaissance : '',
      quartier : '',
      genre : '',
      porte : '',
      prenom : '',
      email : '',
      pays : '', }
  };

  searchKey: string;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'nom',
    'prenom',
    'username',
    'fonction',
    'actions'
  ];
  @ViewChild(MatSort,{static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageSize = PAG_MIDLE_SIZE;
  pageSizeOptions = [PAG_MIDLE_SIZE];
  length = 100;




  structure_ID;
  editID;
  StructureName;
  StructureType;
  Fonctions;
  PersonnelRoles = [];
  persoAccessRe;

  rolesArray = [{id: 0, nom: '', description: '', statut: ''}];
  sendRoleArray = [{}];
  UserID;
  CurrentUser;
  SelectID;
  CurrentPersoAccessSelect : any
  ListAdmin = false;
  ListPerso = true;

  GetBody = {
   id_structure: null,
    role: "ROLE_DECANAT"
  }

  constructor(private formBuilder: FormBuilder,
              private route: Router,
              private routeActive: ActivatedRoute,
              private structureService: StructureService,
              private fonctionSpecialService: SpecialiteFonctionService,
              private departemenentService: DepartementService,
              private personnelAdminService: PersonnelAdminService ,
  ) { }

  ngOnInit() {
    this.CurrentUser = JSON.parse(sessionStorage.getItem('user'));
    this.GetBody.id_structure = this.CurrentUser.structure.id;
    this.structure_ID = this.CurrentUser.structure.id;
    this.getStructureByID();
    this.getStructurePersonnelAdmin();
    this.getAllFoctions();
    // this.getFonctionSpecialitByFonction();
  }



  getAllFoctions() {
    this.fonctionSpecialService.getAllFoctionSpecialite().subscribe(fonctRes => {
      this.Fonctions = fonctRes;
    });
  }


  getStructureByID(){
    this.structureService.getStucture(this.CurrentUser.structure.id).subscribe(StructRes => {
      this.StructureName = StructRes.nom;
      this.StructureType = StructRes.type;
    });

  }
  getStructurePersonnelAdmin() {
    this.ListPerso = true;
    this.droit_spinner = true;
    this.ListEnseignant = false;
    this.ListEnseignantVacataire = false;
    this.ListAdmin = false;
    this.AccessContaine = false;
    this.GetBody.role = "ROLE_DECANAT";
    this.personnelAdminService.getStructurePersonnel(this.GetBody).subscribe(persoListRes => {
      this.droit_spinner = false;
      this.dataSource = new MatTableDataSource(persoListRes.content)
      this.dataSource.paginator = this.paginator;
      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_MIDLE_SIZE, this.dataSource.data);
      
      for (const persoRole of persoListRes.user.roles){
        this.persoRoleArray.push(persoRole);
      }
    }, depError => {
      this.droit_spinner = false;
      // this.utilService.showToast('info', 'Note', depError['error']);
    });
  }

  getEnseignantListe() {
    this.ListEnseignant = true;
    this.ListAdmin = false;
    this.droit_spinner = true;
    this.ListPerso = false;
    this.ListEnseignantVacataire = false;
    this.AccessContaine = false;
    this.GetBody.role = "ROLE_ENSEIGNANT";
    this.personnelAdminService.getStructurePersonnel(this.GetBody).subscribe(EnseignantListRes => {
      this.droit_spinner = false;
      this.dataSource = new MatTableDataSource(EnseignantListRes.content)
      this.dataSource.paginator = this.paginator;
      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_MIDLE_SIZE, this.dataSource.data);
      
      for (const EnseignantRole of EnseignantListRes.user.roles){
        this.persoRoleArray.push(EnseignantRole);
      }
    }, EnsError => {
      this.droit_spinner = false;
      // this.utilService.showToast('info', 'Note', depError['error']);
    });
  }

  getEnseignantVacataireListe() {
    this.ListEnseignantVacataire = true;
    this.ListEnseignant = false;
    this.ListAdmin = false;
    this.ListPerso = false;
    this.droit_spinner = true;
    this.AccessContaine = false;
    this.GetBody.role = "ROLE_VACATAIRE";
    this.personnelAdminService.getStructurePersonnel(this.GetBody).subscribe(EnseignantVacataireListRes => {
      this.droit_spinner = false;
      this.dataSource = new MatTableDataSource(EnseignantVacataireListRes.content)
      this.dataSource.paginator = this.paginator;
      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_MIDLE_SIZE, this.dataSource.data);
      
      for (const EnseignantVacataireRole of EnseignantVacataireListRes.user.roles){
        this.persoRoleArray.push(EnseignantVacataireRole);
      }
    }, EnsError => {
      this.droit_spinner = false;
      // this.utilService.showToast('info', 'Note', depError['error']);
    });
  }

  getAdminList() {
    this.ListAdmin = true;
    this.ListPerso = false;
    this.ListEnseignant = false;
    this.ListEnseignantVacataire = false;
    this.AccessContaine = false;
    this.droit_spinner = true;
    this.GetBody.role = "ROLE_ADMIN";
    this.personnelAdminService.getStructurePersonnel(this.GetBody).subscribe(AdminListRes => {
      this.droit_spinner = false;
      this.dataSource = new MatTableDataSource(AdminListRes.content)
      this.dataSource.paginator = this.paginator;
      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_MIDLE_SIZE, this.dataSource.data);
      
      for (const AdmindRole of AdminListRes.user.roles){
        this.persoRoleArray.push(AdmindRole);
      }
    }, AdminError => {
      this.droit_spinner = false;
      // this.utilService.showToast('info', 'Note', depError['error']);
    });
  }


  personnelAccess(idPerso, username, nom, prenom, element) {
    this.PersonnelRoles = [];
    this.SelectID = idPerso;
    this.roles = null;
    this.CurrentPersoAccessSelect = nom + ' ' + prenom + ' - username : ' + username;
    if (this.ListEnseignant || this.ListEnseignantVacataire) {
      // this.personnelAdminService.getEnseignantParID(idPerso).subscribe(persoAccessRes => {
        this.UserID = element.user.id;
        this.personnelAdminService.getUserByID(this.UserID).subscribe(resGet => {
          for (const rolePerso of resGet.roles ) {
            this.PersonnelRoles.push(rolePerso['nom']);
          }
          this.getAllRole();
        });

      // });
    } else {
      // this.personnelAdminService.getPersonnelByID(idPerso).subscribe(persoAccessRes => {
        this.UserID = element.user.id;
        for (const rolePerso of element.user.roles ) {

          this.PersonnelRoles.push(rolePerso['nom']);
        }
        this.getAllRole();
      // });
    }

    $('#AccesFormModal').modal('show');
    $('#AccesFormModal').appendTo('body');

  }

  getAllRole()
  {
    this.roles = [];
    this.sendRoleArray = [{}];
    this.rolesArray = [{id: 0, nom: '', description: '', statut: ''}];
    this.personnelAdminService.getAllRoles().subscribe(RoleRes => { // ---- ?????? change to RoleSEervice
      for (const roles of RoleRes) {

        if (this.PersonnelRoles.includes(roles.nom)){
          this.rolesArray.push({id: roles.id, nom: roles.nom, description: roles.description, statut: 'ok'});
          this.sendRoleArray.push({id: roles.id});
        } else {
          if(roles.nom === this.GetBody.role){
            this.personnelAdminService.updatePersonnelAccess(this.UserID, [{id: roles.id}]).subscribe(AccessRes => {});
          }
          this.rolesArray.push({id: roles.id, nom: roles.nom, description: roles.description, statut: 'no'});
        }
      }
      this.rolesArray.splice(0, 1);
      this.sendRoleArray.splice(0, 1);

      this.AccessContaine = true;
      const rectoraStructure = JSON.parse(sessionStorage.getItem("retoratStructure"));

      if(this.CurrentUser.structure.type !== "RECTORAT"){
        this.roles = this.rolesArray.filter(item => !["ROLE_ETUDIANT","ROLE_RECTEUR" ,"ROLE_VRECTEUR"].includes(item.nom));
      }else{
        // && this.CurrentUser.structure.type !== "RECTORAT"
        if(!!rectoraStructure && rectoraStructure.type !== "RECTORAT"){ //-> Facultés en tant que Rectorat
          this.roles = this.rolesArray.filter(item => !["ROLE_ETUDIANT","ROLE_RECTEUR" ,"ROLE_VRECTEUR"].includes(item.nom));
        }else{
          this.roles = this.rolesArray.filter(item => item.nom !== "ROLE_ETUDIANT");

        }
      }      
    });
  }

  handelRoleChecking(id, event){
    if (event.target.checked){
      // add
      this.sendRoleArray.push({id: id});
    } else {
      // delete
      for (let i = 0; i < this.sendRoleArray.length; i++ ) {
        if (this.sendRoleArray[i]['id'] === id ) {
          this.sendRoleArray.splice(i, 1);
          i--;
        }
      }
    }
  }


  /***
   * Mise à jours des access d'un personnel
   * @constructor
   */

  droit_spinner: Boolean = false;
  UpdatAccess() {
    this.droit_spinner = true;
    this.personnelAdminService.updatePersonnelAccess(this.UserID, this.sendRoleArray).subscribe(AccessRes => {
      this.AccessContaine = false;
      if (this.ListPerso){
        this.getStructurePersonnelAdmin();
      } else if(this.ListEnseignant){
        this.getEnseignantListe();
      }else if(this.ListEnseignantVacataire){
        this.getEnseignantVacataireListe();
      } else if(this.ListAdmin){
        this.getAdminList();
      }
      this.droit_spinner = false;
      Util_fonction.SuccessMessage(AccessRes);

      $('#AccesFormModal').modal('hide');
    }, error => {
      this.droit_spinner = false;
      this.AccessContaine = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    });
  }

}
