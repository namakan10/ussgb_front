import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
import {_HTTP} from '../../../../../CONSTANTES';


@Component({
  selector: 'app-personnel-admin-form',
  templateUrl: './personnel-admin-form.component.html',
  styleUrls: ['./personnel-admin-form.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class PersonnelAdminFormComponent implements OnInit {


  AddPersonnelAdminForm: FormGroup;
  Pays = PAYS_MONDE;
_http = _HTTP;
  showForm = false;
  ListEnseignant = false;
  showForm1 = false;
  creatForm = true;
  AccessContaine = false;

  persoRoleArray;
  roles;

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
  id: null;
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
  PersonnelInitModelData = {
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
    departement: null,
    service: null,
    division: null,
    specialiteFonction: null,
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
    }
  };
  model: any = {
    ...this.PersonnelInitModelData
  };

  docData: any[] = [];
  fichiers: any[] = [];
  typeFichier: any;

  fypeFichiers = [
    {name: "Acte de naissance", value: "ACTE_DE_NAISSANCE"},
    {name: "Diplome", value: "DIPLOME"},
    {name: "Certificat de nationalite", value: "CERTIFICAT_NATIONALITE"}
  ];

  typeWording(data): string {
    return this.fypeFichiers.find(x => x.value === data).name
  }

  fichierFile: File;
  fichierUrl: string;

  infoFormGroup: FormGroup;
  carriereFormGroup: FormGroup;

  maxDate = new Date();
  user = JSON.parse(sessionStorage.getItem('user'));

  constructor(private formBuilder: FormBuilder,
              private route: Router,
              private router: ActivatedRoute,
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
    this.id_personnel = this.router.snapshot.paramMap.get("personnelId");
    this.GetBody.id_structure = this.routeActive.snapshot.params.id;
    this.subcribeFom();

    this.GetDepartements();
    this.getAllFoctions();
    this.getAllServices();
    this.getUtils();

    if (this.id_personnel) this.getPersonnelByID(+this.id_personnel);
  }


  initFom(): void {
    this.infoFormGroup = this.formBuilder.group({
      typeUtilisateur: [this.model.user.typeUtilisateur, Validators.required],
      ville: [this.model.user.ville, Validators.required],
      rue: [this.model.user.rue],
      telephone: [this.model.user.telephone, Validators.required],
      lieuDeNaissance: [this.model.user.lieuDeNaissance, Validators.required],
      nom: [this.model.user.nom, Validators.required],
      dateDeNaissance: [this.model.user.dateDeNaissance, Validators.required],
      quartier: [this.model.user.quartier, Validators.required],
      genre: [this.model.user.genre, Validators.required],
      porte: [this.model.user.porte],
      prenom: [this.model.user.prenom, Validators.required],
      email: [this.model.user.email, Validators.required],
    });

    this.carriereFormGroup = this.formBuilder.group({
      nationalite: [this.model.nationalite, Validators.required],
      statut: [this.model.statut, Validators.required],

      numMatricule: [this.model.user.numMatricule],
      categorie: [this.model.categorie],
      classe: [this.model.classe],
      indice: [this.model.indice],
      etatService: [this.model.etatService, Validators.required],
      nbreEnfant: [this.model.nbreEnfant, Validators.required],// -!!!
      nbreJourConge: [this.model.nbreJourConge],
      nbreJourPermission: [this.model.nbreJourPermission],
      anneeDeRetraite: [this.model.anneeDeRetraite],
      numAmo: [this.model.numAmo],
      numNina: [this.model.numNina],
      numInps: [this.model.numInps],
      corps: [this.model.corps],
      niveau_etude: [this.model.niveau_etude, Validators.required],
      dateDernierAvancement: [this.model.dateDernierAvancement, Validators.required],
      echelon: [this.model.echelon],

      situation_matrimoniale: [this.model.situation_matrimoniale, Validators.required],
      regime_mariage: [this.model.regime_mariage, Validators.required],
      discipline: [this.model.discipline],
      grade: [this.model.grade],
      dateEmbauche: [this.model.dateEmbauche, Validators.required],

      //departement
      departement: [this.model.departement, Validators.required],

      service: [this.model.service],// id

      division: [this.model.division],// id

      // fonction
      specialiteFonction: [this.model.specialiteFonction, Validators.required], // id

    });

  }


  initModel(){

  }
  subcribeFom(): void {
    if (!this.id_personnel) this.model = {...this.PersonnelInitModelData};
    this.initFom();

    // this.infoFormGroup.valueChanges.subscribe(values => this.model = <any>{...this.model, user: {...values}});
    // this.carriereFormGroup.valueChanges.subscribe(values => this.model = <any>{...this.model, ...values});
  }


  DepSelect(event) {
    const depId = this.carriereFormGroup.controls.departement.value;
    console.log("$event => ", depId);
    if (!depId) return;
    this.departemenentService.getDepartementServices(depId).subscribe(resService => {
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
        this.Struc_Services = servRes;
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


  cancel():void {
    this.route.navigate(['structure/' + this.user.structure.id + '/personnels']);
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  apply(): void {

    console.log({
      model: this.model
    });


    if (this.infoFormGroup.invalid || this.carriereFormGroup.invalid) return;

    this.spinner.show();
    this.uploadLogo();

  }

  uploadLogo(): void {

    if (!this.fichierFile) {
      this.addFiles();
      return;
    }

    let fd = new FormData();
    fd.append('file', this.fichierFile);
    fd.append('fileType', "ID_PHOTO");
    this.fileService.uploadPhotoLogo(fd).subscribe((res: any) => {
      this.model.user.photo = res.toString();

      this.addFiles();

    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message);
      console.log({error})
    });
  }

  addFiles() {

    if (!this.docData || this.docData.length <= 0) {
      this.id_personnel ? this.editPersonnel() : this.addPersonnel();
      return;
    }

    const files = this.docData.map(x => <any>{file: x.file, type: x.type})

    this.spinner.show();
    this.service.onUploadPromises(files).then((datas: any[]) => {
      console.log({addFiles: datas});

      const fileModels = datas.map((x: any) => <any>{
        nom: x.nom,
        typeFichier: x.typeFichier,
        fileUrl: x.fileUrl
      });

      if (this.id_personnel) {
        this.model.fichiers = [...this.model.fichiers, ...fileModels];
        this.editPersonnel()
      } else {
        this.model.fichiers = [...fileModels];
        this.addPersonnel();
      }

      this.spinner.hide();
    }, error => {
      console.log({error});
      Util_fonction.AlertMessage(error.error.status, error.error.message);
      this.spinner.hide();
    });

  }


  addPersonnel() {
    console.log({model: this.model});
    const body = this.buildSendBody();
    console.log("Body == > ", body);
    this.service.addPersonnel(body).subscribe((res: any) => {
      this.spinner.hide();
      console.log({addPersonnel: res});
      this.clearFile();
      Util_fonction.SuccessMessage(res);
      this.cancel();
    }, error => {
      console.log({error})
      this.spinner.hide();
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }

  editPersonnel() {
    console.log({model: this.model});
    const body = this.buildSendBody();
    console.log("Body edit== > ", body);
    this.service.updatePersonnel(this.id_personnel, body).subscribe(res => {
      console.log({editPersonnel: res});

      this.spinner.hide();

      Util_fonction.SuccessMessage(res);
      this.cancel();

    }, error => {
      console.log({error})
      this.spinner.hide();
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }

  buildSendBody(){
    return {
      dateEmbauche: this.carriereFormGroup.controls.dateEmbauche.value,//data.dateEmbauche,
      corps: this.carriereFormGroup.controls.corps.value,
      categorie: this.carriereFormGroup.controls.categorie.value,
      classe: this.carriereFormGroup.controls.classe.value,
      echelon: this.carriereFormGroup.controls.echelon.value,
      dateDernierAvancement: new Date(this.carriereFormGroup.controls.dateDernierAvancement.value),//data.dateDernierAvancement,
      nationalite: this.carriereFormGroup.controls.nationalite.value,
      niveau_etude: this.carriereFormGroup.controls.niveau_etude.value,
      situation_matrimoniale: this.carriereFormGroup.controls.situation_matrimoniale.value,
      regime_mariage: this.carriereFormGroup.controls.regime_mariage.value,
      nbreEnfant: this.carriereFormGroup.controls.nbreEnfant.value,
      indice: this.carriereFormGroup.controls.indice.value,
      numAmo: this.carriereFormGroup.controls.numAmo.value,
      numNina: this.carriereFormGroup.controls.numNina.value,
      numInps: this.carriereFormGroup.controls.numInps.value,
      etatService: this.carriereFormGroup.controls.etatService.value,
      statut: this.carriereFormGroup.controls.statut.value,
      discipline: this.carriereFormGroup.controls.discipline.value, //- no
      grade: this.carriereFormGroup.controls.grade.value, //- no
      departement_id: this.carriereFormGroup.controls.departement.value,
      service_id: this.carriereFormGroup.controls.service.value,
      division_id: this.carriereFormGroup.controls.division.value,
      specialite_fonction_id: this.carriereFormGroup.controls.specialiteFonction.value,
      user: {
        typeUtilisateur: this.infoFormGroup.controls.typeUtilisateur.value,
        ville: this.infoFormGroup.controls.ville.value,
        rue: this.infoFormGroup.controls.rue.value,
        numMatricule: this.carriereFormGroup.controls.numMatricule.value,
        photo: this.model.user.photo,
        telephone: this.infoFormGroup.controls.telephone.value,
        lieuDeNaissance: this.infoFormGroup.controls.lieuDeNaissance.value,
        nom: this.infoFormGroup.controls.nom.value,
        dateDeNaissance: this.infoFormGroup.controls.dateDeNaissance.value,
        quartier: this.infoFormGroup.controls.quartier.value,
        genre: this.infoFormGroup.controls.genre.value,
        porte: this.infoFormGroup.controls.porte.value,
        prenom: this.infoFormGroup.controls.prenom.value,
        email: this.infoFormGroup.controls.email.value,
      }
    }
  }

  getPersonnelByID(id: number) {
    this.spinner.show();
    this.service.getPersonnelByID(id).subscribe((data) => {
      console.log("data.departement ", data.departement);
      this.DepSelect(data.departement.id);
      if(this.model.service) this.ServiceChange(data.service.id);


      this.model = this.fillEditForm(data);

      this.initFom();
      this.spinner.hide();
    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message);
      console.log({error});
      this.spinner.hide();
    })
  }

  fillEditForm(data){
    this.fichierUrl = data.user.photo;
    console.log("=> ",this.fichierUrl );

    this.carriereFormGroup.controls.departement.setValue(data.departement.id);
    if(data.service) this.carriereFormGroup.controls.service.setValue(data.service.id);
    if(data.division) this.carriereFormGroup.controls.division.setValue(data.division.id);
    if (data.specialiteFonction) this.carriereFormGroup.controls.specialiteFonction.setValue(data.specialiteFonction.id);

    return  {
      dateEmbauche: new Date(data.dateEmbauche),//data.dateEmbauche,
      corps: data.corps,
      categorie: data.categorie,
      classe: data.classe,
      echelon: data.echelon,
      dateDernierAvancement: new Date(data.dateDernierAvancement),//data.dateDernierAvancement,
      nationalite: data.nationalite,
      niveau_etude: data.niveau_etude,
      situation_matrimoniale: data.situation_matrimoniale,
      regime_mariage: data.regime_mariage,
      nbreEnfant: data.nbreEnfant,
      indice: data.indice,
      numAmo: data.numAmo,
      numNina: data.numNina,
      numInps: data.numInps,
      etatService: data.etatService,
      statut: data.statut,
      discipline: data.discipline, //- no
      grade: data.grade, //- no
      departement: data.departement.id,
      service: Util_fonction.checkIfNoTEmpty(data.service) ? data.service.id : null,
      division: Util_fonction.checkIfNoTEmpty(data.division) ? data.division.id : null,
      specialiteFonction: Util_fonction.checkIfNoTEmpty(data.specialiteFonction) ? data.specialiteFonction.id : null,
      user: {
        typeUtilisateur: data.user.typeUtilisateur,
        ville: data.user.ville,
        rue: data.user.rue,
        numMatricule: data.user.numMatricule,
        photo: data.user.photo,
        telephone: data.user.telephone,
        lieuDeNaissance: data.user.lieuDeNaissance,
        nom: data.user.nom,
        dateDeNaissance: data.user.dateDeNaissance,
        quartier: data.user.quartier,
        genre: data.user.genre,
        porte: data.user.porte,
        prenom: data.user.prenom,
        email: data.user.email,
      }
    }
  }

  onFileSelected(event) {

    const file: File = event.target.files[0];

    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.fichierUrl = e.target.result;
        this.fichierFile = file;
      };
    }
  }


  onDocSelected(event) {

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

        console.log({type})

        this.docData.push({file, type: this.typeFichier, docUrl});
        this.typeFichier = null;
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
    this.fichierFile = null;
    this.fichierUrl = null;
    this.docData = [];
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

}
