import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
// import {UtilsService} from "../../../services/utils.service";
import {DepartementService} from '../../../../../services/departement.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SpecialiteFonctionService} from '../../../../../services/specialite-fonction.service';
import {PAYS_MONDE} from '../../../../PAYS_MODE';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {Util_fonction} from "../../../../models/util_fonction";
import {SubscriptionHandle} from "../../../../models/SubscriptionHandle";
import {_HTTP, PAG_SMALL_SIZE} from "../../../../../CONSTANTES";
import {SelectionModel} from "@angular/cdk/collections";
import {SpinnerService} from "../../../spinner.service";
import jspdf from "jspdf";
import html2canvas from "html2canvas";
import {environment} from "../../../../../../environments/environment";
import {MatDialog} from "@angular/material/dialog";
declare var $: any;
import {PersonnelAdminService} from "../../personnel-admin/personnel-admin.service";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-personnel-admin-list',
  templateUrl: './personnel-admin-list.component.html',
  styleUrls: ['./personnel-admin-list.component.css']
})
export class PersonnelAdminListComponent implements OnInit {

  Pays = PAYS_MONDE;

  showForm = false;
  ListEnseignant = false;
  showForm1 = false;
  creatForm = true;
  AccessContaine = false;

  PersonnelAdmins;
  roles;

  CreatPersonnelData = {

    dateEmbauche: '',
    corps: '',
    categorie: '',
    classe: '',
    echelon: '',
    dateDernierAvancement: '',
    nationalite: '',
    niveau_etude: '',
    situation_matrimoniale: '',
    regime_mariage: '',
    nbreEnfant: '',
    anneeDeRetraite: '',
    nbreJourConge: '',
    nbreJourPermission: '',
    indice: '',
    numAmo: '',
    numNina: '',
    numInps: '',
    etatService: '',
    statut: '',

    user: {
      typeUtilisateur: '',
      ville: '',
      rue: '',
      numMatricule: '',
      photo: '',
      telephone: '',
      lieuDeNaissance: '',
      nom: '',
      dateDeNaissance: '',
      quartier: '',
      genre: '',
      porte: '',
      prenom: '',
      email: '',
      pays: '',
    },


    service: {
      id: '',
    },
    departement: {
      id: '',
    },
    fonction: {
      id: '',
    },

  };

  panelOpenState=false;

  searchKey: string;
  departements: any[] = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'selection', // aicha add
    'photo',
    'fonction',
    'statut',
    'username',
    'etat',
    'actions',
  ];
  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;
  role="ADMINISTRATIF";

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  structure_ID;
  editID;
  Service;
  Fonctions;
  persoAccessRe;
  Specialite;
  sendRoleArray = [{}];
  user;
  id: any;
  id_departement: any;
  id_structure: string;

  GetBody = {
    id_structure: null,
    role: null
  }
  toDay = new Date();
  sub = new SubscriptionHandle();

  typeListe = 'personnel';
  typeDroit = 'ROLE_DECANAT';
  _http = _HTTP;
  _asset_image = environment._ASSET_IMAGE;
  univ_name = environment.UNIV_NAME;
  // aicha begin
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

    this.selection.select(...(this.dataSource.data.map(x => x.id)));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'Deselectionner' : 'Selectionner'} Tous`;
    }
    return `${this.selection.isSelected(row.id) ? 'Deselectionner' : 'Selectionner'} Ligne ${row.position + 1}`;
  }

  // aicha end


  param = {
    id_structure: null,
    id_departement: null,
    user_type: "PERSONNEL_ADMINISTRATIF",
    nom: null,
    prenom: null,
    size: 20,
    page: 0,
  }

  types = [
    {name: "Personnel administratif", value: "PERSONNEL_ADMINISTRATIF"},
    {name: "Personnel technique", value: "PERSONNEL_TECHNIQUE"}
  ];

  constructor(private formBuilder: FormBuilder,
              private route: Router,
              private router: ActivatedRoute,
              private routeActive: ActivatedRoute,
              private fonctionSpecialService: SpecialiteFonctionService,
              private departemenentService: DepartementService,
              private personnelService: PersonnelAdminService,
              private refChange: ChangeDetectorRef,
              private spinner: SpinnerService,
              private departementService: DepartementService,
              private personnelAdminService: PersonnelAdminService,
              public dialog: MatDialog,
  ) {


  }

  ngOnInit() {
    this.initData();
  }


  initData() {
    this.user = JSON.parse(sessionStorage.getItem('user'));

    this.id = this.router.snapshot.paramMap.get("id");
    this.id_structure = this.user.structure.id;
    this.param.id_structure = this.user.structure.id;

    this.GetBody.id_structure = this.user.structure.id;

    this.structure_ID = this.id_structure;
    this.getStructurePersonnelAdmin();

    this.getAllFoctions();
    this.getAllServices();
    this.getDepartements();

  }

  ngOnDestroy() {
    this.sub.dispose();
  }


  getAllFoctions() {
    this.sub.addToSubcription = this.fonctionSpecialService.getAllFoctionSpecialite().subscribe(fonctRes => {
      this.Fonctions = fonctRes;
    });
  }

  getAllServices() {
    this.sub.addToSubcription = this.departemenentService.getAllService().subscribe(
      servRes => {
        this.Service = servRes;
      });
  }

  refresh(): void {
    this.param.nom = null;
    this.param.prenom = null;
    this.param.id_departement = null;
    this.spinner.show();
    this.getStructurePersonnelAdmin();
  }

  onTypeChange(d:string): void {
    this.param.user_type = d;
    this.spinner.show();
    this.getStructurePersonnelAdmin();
  }

  onDepartementChange(departementId:number): void {
    this.param.id_departement = departementId;
    this.spinner.show();
    this.getStructurePersonnelAdmin();
  }

  onPaginateChange(event): void {
    this.param.page = event.pageIndex;
    this.param.size = event.pageSize;
    this.getStructurePersonnelAdmin();
  }
  getStructurePersonnelAdmin() {
    this.spinner.show();
    this.personnelService.getPersonnels(this.param).subscribe(
      (res) => {
        this.length = res.totalElements;
        this.pageSize = res.pageSize;
        this.spinner.hide();
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.sort = this.sort;
        this.refChange.detectChanges();

      },error => {
        this.dataSource = new MatTableDataSource([]);
        this.spinner.hide();
      });

  }

  supprimerPersonnel(element) {

    Swal.fire({
      title: 'Voulez vous supprimer ce Personnel',
      html: '<strong>' + element.user.nom + ' ' + element.user.prenom + '</strong> ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',

    }).then((result) => {
      if (result.isConfirmed) {
        this.sub.addToSubcription = this.personnelService.deletePersonnel(element.id).subscribe(
          response => {
            Util_fonction.SuccessMessage(response);
            this.getStructurePersonnelAdmin();
          }, error => {
            Util_fonction.AlertMessage(error.error.status, error.error.message);
          });
      }
    })
  }


  resetToDefaultPassword(ids: number[]): void {
    this.spinner.show();
    this.personnelService.resetToDefaultPassword(ids)
      .subscribe(value => {
        this.spinner.hide();
        Util_fonction.SuccessMessage(value);

        this.initData();
      }, error => {
        this.spinner.hide();
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })
  }

  bloqueDebloquer(idUser, status): void {
    this.spinner.show();
    this.personnelService.bloqueDebloquer(idUser, {statut: status})
      .subscribe(value => {
        this.spinner.hide();
        Util_fonction.SuccessMessage(value);
        this.initData();
      }, error => {
        this.spinner.hide();
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })
  }

  checkUndefined(element) {
    return Util_fonction.checkIfNoTEmpty(element)
  }

  //--

  select: any;

  ShowPersonnelCarte(element) {
    this.select = element;

    $('#cartePersonnelModal').modal('show');
    $('#cartePersonnelModal').appendTo('body');
  }


  PersonnelRoles = [];
  SelectID;
  CurrentPersoAccessSelect: any
  ListEnseignantVacataire = false;
  UserID;

  personnelAccess(idPerso, username, nom, prenom, element) {
    this.PersonnelRoles = [];
    this.SelectID = idPerso;
    this.roles = null;
    this.CurrentPersoAccessSelect = nom + ' ' + prenom + ' - username : ' + username;
    if (this.ListEnseignant || this.ListEnseignantVacataire) {
      // this.personnelAdminService.getEnseignantParID(idPerso).subscribe(persoAccessRes => {
      this.UserID = element.user.id;
      this.personnelAdminService.getUserByID(this.UserID).subscribe(resGet => {
        for (const rolePerso of resGet.roles) {
          this.PersonnelRoles.push(rolePerso['nom']);
        }
        this.getAllRole();
      });

      // });
    } else {
      // this.personnelAdminService.getPersonnelByID(idPerso).subscribe(persoAccessRes => {
      this.UserID = element.user.id;
      for (const rolePerso of element.user.roles) {

        this.PersonnelRoles.push(rolePerso['nom']);
      }
      this.getAllRole();
      // });
    }

    $('#AccesFormModal').modal('show');
    $('#AccesFormModal').appendTo('body');

  }

  rolesArray = [{id: 0, nom: '', description: '', statut: ''}];

  getAllRole() {
    this.roles = [];
    this.sendRoleArray = [{}];
    this.rolesArray = [{id: 0, nom: '', description: '', statut: ''}];
    this.personnelAdminService.getAllRoles().subscribe(RoleRes => { // ---- ?????? change to RoleSEervice
      for (const roles of RoleRes) {

        if (this.PersonnelRoles.includes(roles.nom)) {
          this.rolesArray.push({id: roles.id, nom: roles.nom, description: roles.description, statut: 'ok'});
          this.sendRoleArray.push({id: roles.id});
        } else {
          if(roles.nom === this.typeDroit){
            this.personnelAdminService.updatePersonnelAccess(this.UserID, [{id: roles.id}]).subscribe(AccessRes => {});
          }
          this.rolesArray.push({id: roles.id, nom: roles.nom, description: roles.description, statut: 'no'});
        }
      }
      this.rolesArray.splice(0, 1);
      this.sendRoleArray.splice(0, 1);

      this.AccessContaine = true;

      this.roles = this.rolesArray;
    });
  }


  carteSpinner: boolean = false;

  imprimerCarte() {
    this.carteSpinner = true;
    const data = document.getElementById('face');
    const dos = document.getElementById('dos');
    const pdf = new jspdf('l', 'mm', [86, 54]);

    html2canvas(data, {allowTaint: true, useCORS: true}).then(canvas => {
      const imgWidth = 86;
      const pageHeight = 210;
      const imgHeight = 54;
      const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.addPage();

      html2canvas(dos, {allowTaint: true, useCORS: true}).then(canvas2 => {
        const imgWidth2 = 86;
        const pageHeight2 = 210;
        const imgHeight2 = 54;
        const heightLeft2 = imgHeight2;
        const contentDataURL2 = canvas2.toDataURL('image/png')
        const position2 = 0;
        pdf.addImage(contentDataURL2, 'PNG', 0, position2, imgWidth2, imgHeight2);
        pdf.save(this.toDay.toISOString() + '_carte_enseignant.pdf');
      });
      this.carteSpinner = false;
    });

    this.carteSpinner = false;
  }

  handelRoleChecking(id, event) {
    if (event.target.checked) {
      // add
      this.sendRoleArray.push({id: id});
    } else {
      // delete
      for (let i = 0; i < this.sendRoleArray.length; i++) {
        if (this.sendRoleArray[i]['id'] === id) {
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
      this.getStructurePersonnelAdmin();
      this.droit_spinner = false;
      Util_fonction.SuccessMessage(AccessRes);

      $('#AccesFormModal').modal('hide');
    }, error => {
      this.droit_spinner = false;
      this.AccessContaine = false;
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }


  qrCodeParse(data): string {
    return 'N° Matricule : ' + data.user.numMatricule
      + '\nPrénom et nom : ' + data.prenom + ' ' + data.nom
      + '\nTéléphone : ' + data.user.telephone
      + '\nProfession : ' + data.corps
      + '\nStructure : ' + this.user.structure.nom + ' ( ' + this.user.structure.sigle + ' )'
      + '\nDepartement : ' + data.departement.nom;
  }


  goToAddPersonnel(): void {
    this.route.navigateByUrl('structure/' + this.user.structure.id + '/personnels/nouveau');
  }

  goToEditPersonnel(id: number): void {
    this.route.navigateByUrl('structure/' + this.user.structure.id + '/personnels/modifier/' + id);
  }

  goToDetailPersonnel(id: number): void {
    this.route.navigateByUrl('structure/' + this.user.structure.id + '/personnels/detail/' + id);
  }


  parseImage(img: string): string {
    if(!img) return;
    return img.includes("public.") ? "https://" + img : "http://" + img ;
  }


  getDepartements() {
    this.departementService.getStructureDepartements(this.user.structure.id).subscribe(
      (res: any) => {
        this.departements = res;
      });
  }

  checkIfIsnull(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

  Psize;
  ExcelEntete: boolean = true;
  spinner2: boolean = false;

  exportexcel() {
    this.ExcelEntete = false;
    /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const filename = "Liste des "+this.typeListe+"s";//this.getFileName();
    /* save to file */
    XLSX.writeFile(wb, filename+'.xlsx');
    this.ExcelEntete = true;
  }

  exportpdf() {
    const data = document.getElementById('excel-table');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/jpeg');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      const filename = "Liste des "+this.typeListe+"s";//this.getFileName();
      pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
      pdf.save(filename+'.pdf'); // Generated PDF
      this.spinner2 = false;
    });
  }
}
