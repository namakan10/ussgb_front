import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {DepartementService} from '../../../../../services/departement.service';
import {SpecialiteFonctionService} from '../../../../../services/specialite-fonction.service';
import {PAYS_MONDE} from '../../../../PAYS_MODE';
import {FilesService} from "../../../../../services/files.service";
import {Util_fonction} from "../../../../models/util_fonction";
import {SubscriptionHandle} from "../../../../models/SubscriptionHandle";
import {PersonnelsDonnees} from "../../../../models/DonnePersonnels";
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {PersonnelAdminService} from "../personnel-admin.service";
import {SpinnerService} from "../../../spinner.service";
import {MessageService} from "primeng/api";
import Swal from "sweetalert2";
import {Location} from "@angular/common";


@Component({
  selector: 'app-personnel-admin-view',
  templateUrl: './personnel-admin-view.component.html',
  styleUrls: ['./personnel-admin-view.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class PersonnelAdminViewComponent implements OnInit {


  AddPersonnelAdminForm: FormGroup;
  Pays = PAYS_MONDE;

  showForm = false;
  ListEnseignant = false;
  showForm1 = false;
  creatForm = true;
  AccessContaine = false;

  persoRoleArray;
  roles;

  CreatPersonnelData = {

    dateEmbauche: null,
    corps: null,
    categorie: null,
    classe: null,
    echelon: null,
    dateDernierAvancement: null,
    nationalite: null,
    niveau_etude: null,
    situation_matrimoniale: null,
    regime_mariage: null,
    nbreEnfant: null,

    indice: null,
    numAmo: null,
    numNina: null,
    numInps: null,
    etatService: null,
    statut: null,
    discipline: null, //- no
    grade: null, //- no
    user: {
      typeUtilisateur: null,
      ville: null,
      rue: null,
      numMatricule: null,
      photo: null,
      telephone: null,
      lieuDeNaissance: null,
      nom: null,
      dateDeNaissance: null,
      quartier: null,
      genre: null,
      porte: null,
      prenom: null,
      email: null,
    },

    service_id: null,

    division_id: null,

    departement_id: null,

    // specialite_fonction_id : null
    specialite_fonction_id: null,// a voir

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
  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  editID;
  StructureName;
  Service;
  StructureType;
  Fonctions;
  Departements;
  PersonnelRoles = [];
  persoAccessRe;
  Specialite;
  sendRoleArray = [{}];
  user;
  id: null;
  id_departement: any;
  id_personnel: any;
  CurrentPersoAccessSelect: any;
  PersonnelDonnees = PersonnelsDonnees;
  _spinner = false;
  depChange_Spinner = false;
  sevChange_Spinner = false;
  Struc_Services: any;
  StructDepartements: any;
  photoEns: any;
  UpoloadFile: any = null;
  Divisions: any;

  categorieFiel: boolean = false;
  echelonFiel: boolean = false;
  indiceFiel: boolean = false;
  numMatriculeFiel: boolean = false;
  _photoSpinner: boolean = false;
  photochangeEvent: boolean = false;

  GetBody = {
    id_structure: null,
    role: null
  }

  sub = new SubscriptionHandle();

  model: any = {
    user: {},
  };

  fichiers: any[] = [];
  docData: any;
  typeFichier: any;

  typeFichiers = [
    {name: "Acte de naissance", value: "ACTE_DE_NAISSANCE"},
    {name: "Diplome", value: "DIPLOME"},
    {name: "Certificat de nationalite", value: "CERTIFICAT_NATIONALITE"}
  ];

  typeWording(data): string {
    if (!data) return "Inconnu";

    return this.typeFichiers.find(x => x.value === data).name
  }

  fichierFile: File;

  maxDate = new Date();


  constructor(private formBuilder: FormBuilder,
              private route: Router,
              private router: ActivatedRoute,
              private location: Location,
              private routeActive: ActivatedRoute,
              private fonctionSpecialService: SpecialiteFonctionService,
              private departemenentService: DepartementService,
              private service: PersonnelAdminService,
              private fileService: FilesService,
              private spinner: SpinnerService,
              private messageService: MessageService,
              private refChange: ChangeDetectorRef,
              private spevialiteFonctionService: SpecialiteFonctionService
  ) {

  }

  ngOnInit() {

    this.user = JSON.parse(sessionStorage.getItem('user'));

    this.id_departement = this.router.snapshot.paramMap.get("id");
    this.id_personnel = this.router.snapshot.paramMap.get("personnelId");

    this.GetBody.id_structure = this.routeActive.snapshot.params.id;



    if (this.id_personnel) this.getPersonnelByID(+this.id_personnel);


    this.getAllFoctions();
    this.getAllServices();

    this.GetDepartements();

    this.getUtils();

  }


  DepSelect(id) {
    this.depChange_Spinner = true;
    this.departemenentService.getDepartementServices(id).subscribe(resService => {
      this.Struc_Services = resService;
      this.depChange_Spinner = false;
      this.refChange.detectChanges();
    }, error => {
      Util_fonction.AlertMessage(error.error.status, 'Veuillez vérifier votre connection. ' + error.error.message);
    })

  }

  ServiceChange(id) {
    this.sevChange_Spinner = true;
    this.departemenentService.getDivisionByService(id).subscribe(divRes => {
      this.Divisions = divRes;
      this.sevChange_Spinner = false;
      this.refChange.detectChanges();
    }, divError => {
      this.sevChange_Spinner = false;
      Util_fonction.AlertMessage(divError.error.status, 'Veuillez vérifier votre connection. ' + divError.error.message);
    })

  }

  corpPersonnels = [];
  etatServicePersonnels = [];

  getUtils() {
    this.corpPersonnels = PersonnelsDonnees.corpsPersonnelAdministratif;
    this.etatServicePersonnels = PersonnelsDonnees.etatsService;
    this.refChange.detectChanges();
  }

  fonctionnaoireControl(response) {
    if (response === 'oui') {
      this.categorieFiel = true;
      this.echelonFiel = true;
      this.indiceFiel = true;
      this.numMatriculeFiel = true;
      //  this.ActiveFonctionnaireFields();
    }

    if (response === 'non') {
      this.categorieFiel = false;
      this.echelonFiel = false;
      this.numMatriculeFiel = false;
      // this.DesactiveFonctionnaireFields();
    }
  }


  GetDepartements() {
    this.departemenentService.getStructureDepartements(this.user.structure.id).subscribe(depRes => {
      this.StructDepartements = depRes;
      this.refChange.detectChanges();
    })
  }

  getAllFoctions() {
    this.fonctionSpecialService.getAllFoctionSpecialite().subscribe(fonctRes => {
      this.Fonctions = fonctRes;
      this.refChange.detectChanges();
    });
  }

  getAllServices() {
    this.departemenentService.getStructureServices(this.GetBody.id_structure).subscribe(
      servRes => {
        this.Service = servRes;
        this.refChange.detectChanges();
      });
  }

  getStructurePersonnelAdmin() {
    this.ListEnseignant = false;
    this.AccessContaine = false;
    this.GetBody.role = "ROLE_DECANAT";
    this.service.getStructurePersonnel(this.GetBody).subscribe(persoListRes => {
      this.dataSource = persoListRes;

      for (const persoRole of persoListRes.user.roles) {
        this.persoRoleArray.push(persoRole);
      }
    }, depError => {
      Util_fonction.AlertMessage(depError.error.status, depError.error.message);

      // this.utilService.showToast('info', 'Note', depError['error']);
    });
  }

  onselectFile(e) {
    this._photoSpinner = true;
    this.photoEns = null;
    if (e.target.files) {
      let reader = new FileReader();

      this.UpoloadFile = e.target.files[0];
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.photoEns = event.target.result;
        if (Util_fonction.checkIfNoTEmpty(this.photoEns)) {
          this.photochangeEvent = true;
        }
        this._photoSpinner = false;
      }
    }
    this.refChange.detectChanges();
    this._photoSpinner = false;
  }


  keyword = "nom";


  seviceSelectEvent(item) {
    this.AddPersonnelAdminForm.controls.service.setValue(item);
    // this.ServiceChange(item);
  }


  etatServiceSelectEvent(item) {
    this.AddPersonnelAdminForm.controls.etatService.setValue(item.nom);
  }


  cancel() {
    this.location.back()
    // this.route.navigate(['structure/' + this.user.structure.id + '/personnels']);
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }


  uploadLogo(): void {

    if (!this.model || !this.fichierFile) {
      this.spinner.hide();
      Util_fonction.AlertMessage("Erreur", "Photo invalide");
      return;
    }

    let fd = new FormData();
    fd.append('file', this.fichierFile);
    fd.append('fileType', "ID_PHOTO");
    this.fileService.uploadPhotoLogo(fd).subscribe((res: any) => {
      this.model.user.photo = res.toString();
      console.log({uploadLogo: res})
      this.editPersonnel()
      this.fichierFile = null;
    }, error => {
      this.spinner.hide();
      Util_fonction.AlertMessage(error.error.status, error.error.message);
      console.log({error})
    });
  }


  editPersonnel(): void {
    this.model.departement_id = this.model.departement.id;
    console.log({editPersonnel: this.model});
    this.service.updatePersonnel(this.model.id, this.model).subscribe((res: any) => {
      Util_fonction.SuccessMessage(res);
      this.getPersonnelByID(+this.id_personnel);
      this.spinner.hide();
    }, error => {
      console.log({error})
      this.spinner.hide();
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }


  removePersonnelFile(fileModel) {

    Swal.fire({
      title: 'Voulez vous supprimer ce document',
      html: '<strong> Cette action est irreversible </strong>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',

    }).then((result) => {
      if (result && result.isConfirmed) this._removePersonnelFile(fileModel);

    })
  }


  _removePersonnelFile(fileModel): void {
    console.log({fileModel})
    if (!this.model) return;


    this.spinner.show();

    this.service.removeFile(this.model.id, fileModel).subscribe((data) => {
      this.spinner.hide();
      console.log({data});
      Util_fonction.SuccessMessage("Le document a ete supprime");
      this.getPersonnelByID(this.model.id);
      console.log({model: this.model});
    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message);
      this.spinner.hide();
      console.log({error});
    })
  }

  addPersonnelFiles(fileModels) {
    console.log({fileModels})

    this.spinner.show();

    this.service.addFile(this.model.id, fileModels).subscribe((data) => {
      this.spinner.hide();
      this.showSuccess("Ajout fichier", "Un fichier ajoute avec succes")
      this.getPersonnelByID(this.model.id);
      console.log({model: this.model});
    }, error => {
      this.showError("Ajout fichier", "Erreur d'ajout d'un fichier")
      this.spinner.hide();
      console.log({error});
    })
  }


  addFile() {

    if (!this.model || !this.docData || !this.typeFichier) {
      Util_fonction.AlertMessage("Erreur", "Document ou type invalide");
      return;
    }

    this.spinner.show();

    this.service.onUpload(this.docData).subscribe((x: any) => {
      console.log({addFile: x})
      // this.model.fichiers.push(<any>{nom: x.nom, typeFichier: x.typeFichier, fileUrl: x.fileUrl});
      const fichiers = [<any>{nom: x.nom, typeFichier: x.typeFichier, fileUrl: x.fileUrl}];
      this.docData = null;
      this.typeFichier = null;
      this.addPersonnelFiles(fichiers);
      //this.editPersonnel();
    }, error => {
      console.log({error});
      Util_fonction.AlertMessage(error.error.status, error.error.message);
      this.spinner.hide();
    });

  }


  getPersonnelByID(id: number) {
    this.spinner.show();
    this.service.getPersonnelByID(id).subscribe((data) => {
      this.model = data;
      this.model.dateDernierAvancement = new Date(data.dateDernierAvancement);
      this.model.dateEmbauche = new Date(data.dateEmbauche);
      this.model.departement_id = this.model.departement.id;
      console.log({getPersonnelByID: this.model});
      this.spinner.hide();
    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message);
      console.log({error});
      this.spinner.hide();
    })
  }


  onFileSelected(event) {

    const file: File = event.target.files[0];

    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.model.user.photo = e.target.result.toString();
        this.fichierFile = file;
        this.spinner.show();
        this.uploadLogo()
      };
    }
  }


  onDocSelected(event): void {

    const file: File = event.target.files[0];

    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        let docUrl = e.target.result;
        const type = file.type;

        if (type === "application/pdf") docUrl = "https://www.pngitem.com/pimgs/m/27-278380_png-vector-pdf-adobe-acrobat-logo-png-transparent.png";
        if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") docUrl = "https://logos-world.net/wp-content/uploads/2020/03/Microsoft-Word-Symbol.png";
        if (type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") docUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/640px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png";

        this.docData = {file, type: this.typeFichier, docUrl};
      };
    }
  }

  removeDoc(key): void {
    const index = this.docData.indexOf(key, 0);
    if (index !== -1) {
      this.docData.splice(index, 1);
    }
  }


  clearFile(): void {
    this.typeFichier = null;
    this.docData = null;
  }


  showSuccess(title: string, msg: string) {
    this.messageService.add({severity: 'success', summary: title, detail: msg});
  }

  showInfo(title: string, msg: string) {
    this.messageService.add({severity: 'info', summary: title, detail: msg});
  }

  showWarn(title: string, msg: string) {
    this.messageService.add({severity: 'warn', summary: title, detail: msg});
  }

  showError(title: string, msg: string) {
    this.messageService.add({severity: 'error', summary: title, detail: msg});
  }


  compareWithId(f1, f2): boolean {
    return f1 && f2 && f1.id === f2.id;
  }

  get_url_extension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }


  parseImage(img: string): string {

    var extension = this.get_url_extension(img);

    if (extension.includes("pdf")) img = "https://www.pngitem.com/pimgs/m/27-278380_png-vector-pdf-adobe-acrobat-logo-png-transparent.png";
    if (extension.includes("doc")) img = "https://logos-world.net/wp-content/uploads/2020/03/Microsoft-Word-Symbol.png";
    if (extension.includes("xls")) img = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/640px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png";


    return img.includes("167.86.127.248") ? "http://" + img : img.includes("public.ussgb.online") ? "https://" + img : img
  }

  downloadfiles(): void {
    if (!this.model.fichiers) return;

    const urls: string[] = this.model.fichiers.map(x => x.fileUrl)
    urls.forEach(x => this.downloadfile(x))
  }

  downloadfile(url: string) {
    const _url = url.includes("167.86.127.248") ? "http://" + url : url.includes("public.ussgb.online") ? "https://" + url : url
    window.open(_url);
  }

}
