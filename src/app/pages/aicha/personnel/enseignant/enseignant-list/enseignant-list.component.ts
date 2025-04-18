import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatPaginator, MatSort} from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import jspdf from 'jspdf';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material/dialog';
import {_HTTP, PAG_SMALL_SIZE, UNIV_NAME} from '../../../../../CONSTANTES';
import {environment} from '../../../../../../environments/environment';
import {SubscriptionHandle} from '../../../../models/SubscriptionHandle';
import {SpecialiteFonctionService} from '../../../../../services/specialite-fonction.service';
import {StructureService} from '../../../../../services/structure.service';
import {DepartementService} from '../../../../../services/departement.service';
import {PersonnelAdminService} from '../../personnel-admin/personnel-admin.service';
import {SpinnerService} from '../../../spinner.service';
import {Util_fonction} from '../../../../models/util_fonction';
import {CarteEnseignantComponent} from '../../../carte-enseignant/carte-enseignant.component';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

declare var $: any;

@Component({
    selector: 'app-enseignant-list',
    templateUrl: './enseignant-list.component.html',
    styleUrls: ['./enseignant-list.component.scss']
})
export class EnseignantListComponent implements OnInit {
    univ_name = UNIV_NAME;
    fallbackImage = 'https://e7.pngegg.com/pngimages/265/858/png-clipart-computer-icons-teacher-professor-education-lecturer-teacher-angle-logo-thumbnail.png';
    _http = _HTTP;
    _asset_image = environment._ASSET_IMAGE;
    CreatPersonnelData1 = {

        categorie: '',
        nationalite: '',
        classe: '',
        indice: '',
        etatService: '',
        nbreEnfant: '',
        discipline: '',
        numAmo: '',
        numNina: '',
        numInps: '',
        corps: '',
        niveau_etude: '',
        grade: '',
        regime_mariage: '',
        dateAffectation: '',
        dateDernierAvancement: '',
        echelon: '',
        statut: '',
        situation_matrimoniale: '',
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
        }
        ,
        departement: {
            id: '',
        },
        specialite: {
            id: '',
        },

    };
    id = null;
    searchKey: string;

    dataSource = new MatTableDataSource<any>();
    departements: any[] = [];
    panelOpenState = false;
    displayedColumns: string[] = [

        'selection',
        'photo',
        'dateAffectation',
        'grade',
        'statut',
        'username',
        'etat',
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
    showForm1 = false;
    modifSelct = false;
    creatSelct = false;
    creatForm = true;
    id_departement: any;
    user = JSON.parse(sessionStorage.getItem('user'));
    departement: any;
    modifElement: any;
    Specialites: any;
    id_structure: string;
    structure: Object;
    dateEnCours: any = JSON.parse(sessionStorage.getItem('dateEnCours'));


    param = {
        id_structure: null,
        id_departement: null,
        user_type: null,
        nom: null,
        prenom: null,
        size: 20,
        page: 0,
    };
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

        this.selection.select(...(this.dataSource.data.map(x => x.user.id)));
    }

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'Deselectionner' : 'Selectionner'} Tous`;
        }

        if (row.user) {
            return `${this.selection.isSelected(row.user.id) ? 'Deselectionner' : 'Selectionner'} Ligne ${row.position + 1}`;
        }

        return '';
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
        private spinner: SpinnerService,
        public dialog: MatDialog,
        private personnelAdminService: PersonnelAdminService,
    ) {
    }

    typeListe = 'enseignants';
    typeDroit = '';

    ngOnInit(): void {
        this.id_structure = this.user.structure.id;
        this.param.id_structure = this.user.structure.id;

        this.route.paramMap
            .subscribe(param => {
                if (param['params']['type'] === 'enseignants') {
                    this.typeDroit = 'ROLE_ENSEIGNANT';
                } else {
                    this.typeDroit = 'ROLE_VACATAIRE';
                }
                if (param['params']['type'] !== this.typeListe) {
                    this.typeListe = param['params']['type'];
                }
                this.getStructuresEnseignants();
            });


        this.getDepartements();


    }

    ngOnDestroy() {
        this.sub.dispose();
    }


    refresh(): void {
        this.param.nom = null;
        this.param.prenom = null;
        this.param.id_departement = null;
        this.getStructuresEnseignants();
    }


    bloqueDebloquer(idUser, status): void {
        this.spinner.show();
        this.personnelService.bloqueDebloquer(idUser, {statut: status})
            .subscribe(value => {
                this.spinner.hide();
                Util_fonction.SuccessMessage(value);
                this.getStructuresEnseignants();
            }, error => {
                this.spinner.hide();
                Util_fonction.AlertMessage(error.error.status, error.error.message);
            });
    }

    onDepartementChange(departementId: number): void {
        this.param.id_departement = departementId;
        this.getStructuresEnseignants();
    }

    onPaginateChange(event): void {
        this.param.page = event.pageIndex;
        this.param.size = event.pageSize;
        this.getStructuresEnseignants();
    }

    getStructuresEnseignants(): void {

        this.spinner.show();
        this.param.user_type = this.typeListe === 'enseignants' ? 'ENSEIGNANT' : 'VACATAIRE';


        this.personnelService.getPersonnels(this.param).subscribe(
            (res) => {
                this.length = res.totalElements;
                this.pageSize = res.pageSize;
                this.spinner.hide();
                this.dataSource = new MatTableDataSource(res.content);
                // this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.refChange.detectChanges();

            }, error => {
                this.dataSource = new MatTableDataSource([]);
                this.spinner.hide();
            });
    }


    supprimerEnseignant(id: number) {

        Swal.fire({
            title: 'Voulez vous supprimer cet ' + (this.typeListe === 'enseignants' ? 'enseignant' : 'vacataire') + ' ?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmer',
            cancelButtonText: 'Annuler',

        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.sub.addToSubcription = this.personnelService.deletePersonnel(id).subscribe(
                    response => {
                        Util_fonction.SuccessMessage(response);
                        this.getStructuresEnseignants();
                    }, error => {
                        this.spinner.hide();
                        Util_fonction.AlertMessage(error.error.status, error.error.message);
                    });
            }
        });
    }


    getDepartements() {
        this.departementService.getStructureDepartements(this.user.structure.id).subscribe(
            (res: any) => {
                this.departements = res;
            });
    }


    select: any;

    ShowEnseignantCarte(element) {
        this.select = element;

        $('#carteEnseignantModal').modal('show');
        $('#carteEnseignantModal').appendTo('body');
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
            console.log(contentDataURL);
            const position = 0;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

            pdf.addPage();

            html2canvas(dos, {allowTaint: true, useCORS: true}).then(canvas2 => {
                const imgWidth2 = 86;
                const pageHeight2 = 210;
                const imgHeight2 = 54;
                const heightLeft2 = imgHeight2;
                const contentDataURL2 = canvas2.toDataURL('image/png');
                const position2 = 0;
                pdf.addImage(contentDataURL2, 'PNG', 0, position2, imgWidth2, imgHeight2);
                pdf.save(this.toDay.toISOString() + '_carte_enseignant.pdf');
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

    resetToDefaultPassword(values: number[]) {
        this.spinner.show();
        this.personnelService.resetToDefaultPassword(values).subscribe(
            (res: any) => {
                this.spinner.hide();
                Util_fonction.SuccessMessage(res);
            }, error => {
                this.spinner.hide();
                Util_fonction.AlertMessage(error.error.status, error.error.message);
            });

    }


    roles;
    rolesArray = [{id: 0, nom: '', description: '', statut: ''}];
    sendRoleArray = [{}];
    AccessContaine = false;

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
                    if (roles.nom === this.typeDroit) {
                        this.personnelAdminService.updatePersonnelAccess(this.UserID, [{id: roles.id}]).subscribe(AccessRes => {
                        });
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


    PersonnelRoles = [];
    SelectID;
    CurrentPersoAccessSelect: any;
    ListEnseignantVacataire = false;
    ListEnseignant = false;
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
            this.ngOnInit();
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


    // AICHA  BEGIN

    enseignantCarteDialog(data): void {
        const dialogRef = this.dialog.open(CarteEnseignantComponent, {
            width: '630px',
            data: {enseignant: data, user: this.user}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                Util_fonction.SuccessMessage('Carte d\'identite imprime');
            }
        });
    }

    // AICHA  END

    goToAddPersonnel(): void {
        this.router.navigateByUrl('structure/' + this.user.structure.id + '/' + this.typeListe + '/nouveau');
    }

    goToEditPersonnel(id: number): void {
        this.router.navigateByUrl('structure/' + this.user.structure.id + '/' + this.typeListe + '/modifier/' + id);
    }

    goToDetailPersonnel(id: number): void {
        this.router.navigateByUrl('structure/' + this.user.structure.id + '/' + this.typeListe + '/detail/' + id);
    }

    parseImage(img: string): string {
        if (!img) {
            return;
        }
        return img.includes('public.') ? 'https://' + img : 'http://' + img;
    }


    checkIfIsnull(element) {
        return Util_fonction.checkIfNoTEmpty(element);
    }

    Psize;
    ExcelEntete: boolean = true;
    spinner2: boolean = false;

    exportexcel() {
        this.ExcelEntete = false;
        /* table id is passed over here */
        const element = document.getElementById('excel-table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF: 'mm/dd/yyyy;@', cellDates: true, raw: true});
        // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const filename = 'Liste des ' + this.typeListe + 's';//this.getFileName();
        /* save to file */
        XLSX.writeFile(wb, filename + '.xlsx');
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
            const filename = 'Liste des ' + this.typeListe + 's';//this.getFileName();
            pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
            pdf.save(filename + '.pdf'); // Generated PDF
            this.spinner2 = false;
        });
    }

    onImageError(event: Event) {
        const target = event.target as HTMLImageElement;
        target.src = this.fallbackImage;
    }

    onImageErrorPrint(event: Event) {
        const target = event.target as HTMLImageElement;
        target.src = '../assets/images/carte/profile.png';
    }


    // getFileName(){
    //   let text = "";
    //   text += this.user.structure.sigle+"-"+this.statut+"_"+this.annee_scolaire+"_niveau"+this.niveau+" nbr_"+this.Psize;
    //   return text;
    // }

}
