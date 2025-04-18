import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder,  Validators } from '@angular/forms';
import { MatSort, MatPaginator } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DepartementService } from '../../../services/departement.service';
import { EnseignantsService } from '../../../services/enseignants.service';
import { SpecialiteFonctionService } from '../../../services/specialite-fonction.service';
import { StructureService } from '../../../services/structure.service';
import {Util_fonction} from "../../models/util_fonction";
import {PersonnelAdminService} from "../../../services/GestionPersonnelAdmin/personnel-admin.service";
import jspdf from "jspdf";
import html2canvas from "html2canvas";
import {SubscriptionHandle} from "../../models/SubscriptionHandle";
import {_HTTP, PAG_SMALL_SIZE, UNIV_NAME} from "../../../CONSTANTES";
import {SelectionModel} from "@angular/cdk/collections";
import {SpinnerService} from "../../aicha/spinner.service";
import {MatDialog} from "@angular/material/dialog";
import {CarteEnseignantComponent} from "../../aicha/carte-enseignant/carte-enseignant.component";
import {environment} from "../../../../environments/environment";
declare var $: any;

@Component({
  selector: 'ngx-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrls: ['./enseignant.component.scss']
})
export class EnseignantComponent implements OnInit {
  univ_name = UNIV_NAME;
  _http = _HTTP;
  _asset_image = environment._ASSET_IMAGE;
  EnseignantForm: FormGroup;
  CreatPersonnelData1 = {

    categorie: '',
    nationalite : '',
    classe : '',
    indice : '',
    etatService : '',
    nbreEnfant : '',
    discipline : '',
    numAmo: '',
    numNina : '',
    numInps : '',
    corps : '',
    niveau_etude : '',
    grade : '',
    regime_mariage : '',
    dateAffectation : '',
    dateDernierAvancement : '',
    echelon : '',
    statut : '',
    situation_matrimoniale : '',
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
    ,
    departement: {
      id : '',
    },
    specialite: {
      id : '',
    },

  };
  id = null;
  searchKey: string;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [

    'selection',
    'nom',
    'prenom',
    'telephone',
    'dateAffectation',
    'grade',
    'statut',
    'action',
  ];

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;


  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  structures: any;
  showForm1= false;
  modifSelct= false;
  creatSelct= false;
  creatForm = true;
  id_departement:any;
  user = JSON.parse(sessionStorage.getItem('user'));
  departement: any;
  modifElement: any;
  Specialites: any;
  id_structure: string;
  structure: Object;
  dateEnCours : any = JSON.parse(sessionStorage.getItem('dateEnCours'));


  GetBody = {
    id_structure: null,
    role: null
  }
  toDay = new Date();
  sub = new SubscriptionHandle();

  selection = new SelectionModel<number>(true, []);
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...(this.dataSource.data.map(x=>x.user.id)));
    console.log("this.selection ", this.selection);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'Deselectionner' : 'Selectionner'} Tous`;
    }

    if(row.user){
      return `${this.selection.isSelected(row.user.id) ? 'Deselectionner' : 'Selectionner'} Ligne ${row.position + 1}`;
    }

    return "";
  }


  constructor(
    private router: Router,
    private fonctionSpecialService: SpecialiteFonctionService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private anneeService: StructureService,
    private departementService: DepartementService,
    private personnelService: PersonnelAdminService,
    private refChange: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    public dialog: MatDialog,
    private personnelAdminService: PersonnelAdminService ,
  ) {
  }
  typeListe = 'enseignant';
  ngOnInit(): void {
    this.id_structure = this.user.structure.id;
    this.GetBody.id_structure = this.user.structure.id;


    this.route.paramMap
      .subscribe(param => {
        console.log(param);
        if(param["params"]["type"] !== this.typeListe){
          this.typeListe = param["params"]["type"];
        }
        this.getStructuresEnseignants();
      });




  }

  ngOnDestroy(){
    this.sub.dispose();
  }


  getStructuresEnseignants() {
    // this.GetBody.role = "";
    console.log(this.typeListe);
    if (this.typeListe === 'enseignant'){
      this.GetBody.role = "ROLE_ENSEIGNANT";
    } else {
      this.GetBody.role = "ROLE_VACATAIRE";
    }
    this.sub.addToSubcription = this.personnelService.getStructurePersonnel(this.GetBody).subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
        this.refChange.detectChanges();
      });
  }


  AjouterEnseignant(){
    this.router.navigate(['structure/ajouter_enseignant/'+this.typeListe]);
  }
  modifierEnseignant(id_enseignant){
    console.log(id_enseignant);
    this.router.navigate(['structure/modifier_enseingnant/'+id_enseignant+'/'+this.typeListe]);
  }

  supprimerEnseignant(id:number){

    Swal.fire({
      title: 'Voulez vous supprimer cet enseignant?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',

    }).then((result) => {
      if (result.isConfirmed) {
        this.sub.addToSubcription = this.personnelService.deletePersonnel(id).subscribe(
          response => {
            Util_fonction.SuccessMessage(response);
            this.getStructuresEnseignants();
          },error =>{
            Util_fonction.AlertMessage(error.error.status,error.error.message);
          });
      }
    })
  }


  parseImage(img: string): string {
    if(!img) return;
    return img.includes("public.") ? "https://" + img : "http://" + img ;
  }


  select: any;
  ShowEnseignantCarte(element){
    this.select = element;
    console.log(element);

    $('#carteEnseignantModal').modal('show');
    $('#carteEnseignantModal').appendTo('body');
  }

  carteSpinner: boolean = false;

  imprimerCarte() {
    this.carteSpinner = true;
    const data = document.getElementById('face');
    const dos = document.getElementById('dos');
    const pdf = new jspdf('l', 'mm', [86, 54]);

    html2canvas(data,{allowTaint: true, useCORS: true} ).then(canvas => {
      const imgWidth = 86;
      const pageHeight = 210;
      const imgHeight = 54;
      const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.addPage();

      html2canvas(dos,{allowTaint: true, useCORS: true} ).then(canvas2 => {
        const imgWidth2 = 86;
        const pageHeight2 = 210;
        const imgHeight2 = 54;
        const heightLeft2 = imgHeight2;
        const contentDataURL2 = canvas2.toDataURL('image/png')
        const position2 = 0;
        pdf.addImage(contentDataURL2, 'PNG', 0, position2, imgWidth2, imgHeight2);
        pdf.save(this.toDay.toISOString()+'_carte_enseignant.pdf');
      });
      this.carteSpinner = false;
    });

    this.carteSpinner = false;
  }


  photo(photo) {
    return photo != null ? photo.split('/')[5] : '';
  }

  logo(logo) {
    return logo.split('/')[5];
  }

  resetToDefaultPassword(values:number[]){
    this.spinnerService.show();
    this.personnelService.resetToDefaultPassword(values).subscribe(
      (res:any) =>{
        console.log('resetToDefaultPassword',res)
        this.spinnerService.hide();
        Util_fonction.SuccessMessage(res);
      }, error =>{
        console.log('resetToDefaultPassword error', error)
        this.spinnerService.hide();
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })

  }


  roles;
  rolesArray = [{id: 0, nom: '', description: '', statut: ''}];
  sendRoleArray = [{}];
  AccessContaine = false;
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
          this.rolesArray.push({id: roles.id, nom: roles.nom, description: roles.description, statut: 'no'});
        }
      }
      this.rolesArray.splice(0, 1);
      this.sendRoleArray.splice(0, 1);

      this.AccessContaine = true;
      this.roles = this.rolesArray;
    });
  }


  PersonnelRoles = [];
  SelectID;
  CurrentPersoAccessSelect : any
  ListEnseignantVacataire = false;
  ListEnseignant = false;
  UserID;
  personnelAccess(idPerso, username, nom, prenom, element) {
    console.log(element);
    this.PersonnelRoles = [];
    this.SelectID = idPerso;
    this.roles = null;
    this.CurrentPersoAccessSelect = nom + ' ' + prenom + ' - username : ' + username;
    if (this.ListEnseignant || this.ListEnseignantVacataire) {
      // this.personnelAdminService.getEnseignantParID(idPerso).subscribe(persoAccessRes => {
      this.UserID = element.user.id;
      this.personnelAdminService.getUserByID(this.UserID).subscribe(resGet => {
        console.log(resGet);
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

  droit_spinner: Boolean = false;
  UpdatAccess() {
    this.droit_spinner = true;
    this.personnelAdminService.updatePersonnelAccess(this.UserID, this.sendRoleArray).subscribe(AccessRes => {
      this.AccessContaine = false;
      this.ngOnInit();
      this.droit_spinner = false;
      Util_fonction.SuccessMessage(AccessRes);

      $('#AccesFormModal').modal('hide');
    }, error => {
      this.droit_spinner = false;
      this.AccessContaine = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    });
  }



  qrCodeParse(data): string {
    return 'N° Matricule : ' + data.user.numMatricule
      + '\nPrénom et nom : ' + data.prenom + ' ' + data.nom
      + '\nTéléphone : ' + data.user.telephone
      + '\nProfession : ' + data.corps
      + '\nStructure : ' + this.user.structure.nom +' ( ' + this.user.structure.sigle + ' )'
      + '\nDepartement : ' + data.departement.nom;
  }


  // AICHA  BEGIN

  enseignantCarteDialog(data): void {
    const dialogRef = this.dialog.open(CarteEnseignantComponent, {
      width: '630px',
      data:{enseignant:data, user:this.user}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        Util_fonction.SuccessMessage("Carte d'identite imprime");
      }
    });
  }

  // AICHA  END


}
