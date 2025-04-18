import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { DepartementService } from '../../../../services/departement.service';
import { EnseignantsService } from '../../../../services/enseignants.service';
import { PersonnelAdminService } from '../../../../services/GestionPersonnelAdmin/personnel-admin.service';
import { SpecialiteFonctionService } from '../../../../services/specialite-fonction.service';
import { StructureService } from '../../../../services/structure.service';
import { PAYS_MONDE } from '../../../PAYS_MODE';
import {FilesService} from "../../../../services/files.service";
import {dashCaseToCamelCase} from "@angular/compiler/src/util";
import {Util_fonction} from "../../../models/util_fonction";
import {SubscriptionHandle} from "../../../models/SubscriptionHandle";
import {PersonnelsDonnees} from "../../../models/DonnePersonnels";

@Component({
  selector: 'app-add-personnel',
  templateUrl: './add-personnel.component.html',
  styleUrls: ['./add-personnel.component.css']
})
export class AddPersonnelComponent implements OnInit {


  AddPersonnelAdminForm: FormGroup;
  Pays = PAYS_MONDE;

  showForm = false;
  ListEnseignant = false;
  showForm1= false;
  creatForm = true;
  AccessContaine = false;

  PersonnelAdmins;
  persoRoleArray;
  roles;

  CreatPersonnelData = {

    dateEmbauche : null,
    corps : null,
    categorie: null,
    classe : null,
    echelon : null,
    dateDernierAvancement : null,
    nationalite : null,
    niveau_etude : null,
    situation_matrimoniale : null,
    regime_mariage : null,
    nbreEnfant : null,

    indice : null,
    numAmo: null,
    numNina : null,
    numInps : null,
    etatService : null,
    statut : null,
    discipline: null, //- no
    grade: null, //- no
    user : {
      typeUtilisateur : null,
      ville : null,
      rue : null,
      numMatricule : null,
      photo : null,
      telephone : null,
      lieuDeNaissance : null,
      nom : null,
      dateDeNaissance : null,
      quartier : null,
      genre : null,
      porte : null,
      prenom : null,
      email : null,
    },

    service_id : null,

    division_id : null,

    departement_id : null,

    // specialite_fonction_id : null
    specialite_fonction_id : null,// a voir

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
  id:null;
  id_departement: any;
  CurrentPersoAccessSelect: any;
  PersonnelDonnees = PersonnelsDonnees;
  _spinner = false;
  depChange_Spinner = false;
  sevChange_Spinner = false;
  Struc_Services : any;
  StructDepartements : any;
  photoEns : any;
  UpoloadFile: any = null;
  Divisions: any;

  categorieFiel:boolean = false;
  echelonFiel:boolean = false;
  indiceFiel:boolean = false;
  numMatriculeFiel:boolean = false;
  _photoSpinner:boolean = false;
  photochangeEvent:boolean = false;

  GetBody = {
    id_structure: null,
    role: null
  }

  sub = new SubscriptionHandle();
  constructor(private formBuilder: FormBuilder,
              private route: Router,
              private router:ActivatedRoute,
              private routeActive: ActivatedRoute,
              private fonctionSpecialService: SpecialiteFonctionService,
              private departemenentService: DepartementService,
              private personnelAdminService: PersonnelAdminService,
              private fileService: FilesService,
              private refChange: ChangeDetectorRef,
              private spevialiteFonctionService : SpecialiteFonctionService
  ) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.id_departement = this.router.snapshot.paramMap.get("id");

    this.GetBody.id_structure = this.routeActive.snapshot.params.id;
    this.initForm();
    this.getAllFoctions();
    this.getAllServices();

    this.GetDepartements();

    // this.getUtils();
  }

  DepSelect() {
    if (Util_fonction.checkIfNoTEmpty(this.AddPersonnelAdminForm.controls.departement.value)){
      this.depChange_Spinner = true;
      let IdDep = this.AddPersonnelAdminForm.controls.departement.value;
      this.departemenentService.getDepartementServices(IdDep).subscribe(resService => {
        this.Struc_Services = [];
        this.Struc_Services = resService;
        this.depChange_Spinner = false;
        this.refChange.detectChanges();
      },error => {
        Util_fonction.AlertMessage(error.error.status, 'Veuillez vérifier votre connection. '+error.error.message);
      })
    }
  }

  ServiceChange(){
    if (Util_fonction.checkIfNoTEmpty(this.AddPersonnelAdminForm.controls.service.value)){
      this.sevChange_Spinner = true;
      let IdSev = this.AddPersonnelAdminForm.controls.service.value.id;
      this.departemenentService.getDivisionByService(IdSev).subscribe(divRes=>{
        this.Divisions = [];
        this.Divisions = divRes;
        this.sevChange_Spinner = false;
        this.refChange.detectChanges();
      }, divError => {
        this.sevChange_Spinner = false;
        Util_fonction.AlertMessage(divError.error.status, 'Veuillez vérifier votre connection. '+divError.error.message);
      })
    }
  }

  corpPersonnels = [];
  etatServicePersonnels = [];
  getUtils() {
    this.corpPersonnels = PersonnelsDonnees.corpsPersonnelAdministratif;
    this.etatServicePersonnels = PersonnelsDonnees.etatsService;
    this.refChange.detectChanges();
  }

  fonctionnaoireControl(response){
    if (response === 'oui'){
      this.categorieFiel = true;
      this.echelonFiel = true;
      this.indiceFiel = true;
      this.numMatriculeFiel = true;
      this.ActiveFonctionnaireFields();
    }

    if (response === 'non'){
      this.categorieFiel = false;
      this.echelonFiel = false;
      this.numMatriculeFiel = false;
      this.DesactiveFonctionnaireFields();
    }
  }

  ActiveFonctionnaireFields(){
    this.AddPersonnelAdminForm.controls.categorie.setValidators([Validators.required]);
    this.AddPersonnelAdminForm.controls.categorie.updateValueAndValidity();

    this.AddPersonnelAdminForm.controls.echelon.setValidators([Validators.required]);
    this.AddPersonnelAdminForm.controls.echelon.updateValueAndValidity();


    this.AddPersonnelAdminForm.controls.indice.setValidators([Validators.required]);
    this.AddPersonnelAdminForm.controls.indice.updateValueAndValidity();
  }

  DesactiveFonctionnaireFields(){
    this.AddPersonnelAdminForm.controls.categorie.reset();
    this.AddPersonnelAdminForm.controls.categorie.clearValidators();
    this.AddPersonnelAdminForm.controls.categorie.updateValueAndValidity();

    this.AddPersonnelAdminForm.controls.echelon.reset();
    this.AddPersonnelAdminForm.controls.echelon.clearValidators();
    this.AddPersonnelAdminForm.controls.echelon.updateValueAndValidity();

    this.AddPersonnelAdminForm.controls.indice.reset();
    this.AddPersonnelAdminForm.controls.indice.clearValidators();
    this.AddPersonnelAdminForm.controls.indice.updateValueAndValidity();
  }

  GetDepartements(){
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
    this.personnelAdminService.getStructurePersonnel(this.GetBody).subscribe(persoListRes => {
      this.dataSource = persoListRes;

      for (const persoRole of persoListRes.user.roles){
        this.persoRoleArray.push(persoRole);
      }
    }, depError => {
      Util_fonction.AlertMessage(depError.error.status, depError.error.message);

      // this.utilService.showToast('info', 'Note', depError['error']);
    });
  }

  onselectFile(e){
    this._photoSpinner = true;
    this.photoEns = null;
    if(e.target.files){
      let reader = new FileReader();

      this.UpoloadFile = e.target.files[0];
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.photoEns=event.target.result;
        if (Util_fonction.checkIfNoTEmpty(this.photoEns)){
          this.photochangeEvent = true;
        }
        this._photoSpinner = false;
      }
    }
    this.refChange.detectChanges();
    this._photoSpinner = false;
  }

  uploadLogo(){
    if (this.UpoloadFile !== null && this.UpoloadFile !== undefined && this.UpoloadFile !== "") {
      let fd = new FormData();
      fd.append('file', this.UpoloadFile);
      fd.append('fileType', "ID_PHOTO");
      this.fileService.uploadPhotoLogo(fd).subscribe(res => {
        // this.AddPersonnelAdminForm.controls.photo.setValue(res.toString());
        this.CreatPersonnelData.user.photo = res.toString();

        /** Remplissage**/
        setTimeout(()=>this.fullCreatFormDataSend(),1000);
      });
    } else {
      this.CreatPersonnelData.user.photo = null;
    }
  }


  savePersonnelAdmin(){
    this._spinner = true;
    this.uploadLogo()



    // this.addPersonnelAdmin();
  }


  /***
   * Creation d'un personnel
   */
  addPersonnelAdmin() {
    this.personnelAdminService.addPersonnel(this.CreatPersonnelData).subscribe(res => {
      this.photochangeEvent = false;
      this._spinner = false;
      Util_fonction.SuccessMessage(res);
      this.route.navigate(['structure/'+this.user.structure.id+'/personnel']);
    }, error1 => {
      this._spinner = false;
      Util_fonction.AlertMessage(error1.error.status, error1.error.message);
    });
  }


  fullCreatFormDataSend() {
    if (Util_fonction.checkIfNoTEmpty(this.AddPersonnelAdminForm.controls.categorie.value)){
      this.CreatPersonnelData.categorie = this.AddPersonnelAdminForm.controls.categorie.value;
    }
    this.CreatPersonnelData.nationalite = this.AddPersonnelAdminForm.controls.nationalite.value;
    this.CreatPersonnelData.classe = this.AddPersonnelAdminForm.controls.classe.value;

    if (Util_fonction.checkIfNoTEmpty(this.AddPersonnelAdminForm.controls.indice.value)){
      this.CreatPersonnelData.indice = +this.AddPersonnelAdminForm.controls.indice.value;
    }
    this.CreatPersonnelData.etatService = this.AddPersonnelAdminForm.controls.etatService.value.nom;
    this.CreatPersonnelData.nbreEnfant = +this.AddPersonnelAdminForm.controls.nbreEnfant.value;

    this.CreatPersonnelData.numAmo = this.AddPersonnelAdminForm.controls.numAmo.value;
    this.CreatPersonnelData.numNina = this.AddPersonnelAdminForm.controls.numNina.value;
    this.CreatPersonnelData.numInps = this.AddPersonnelAdminForm.controls.numInps.value;
    this.CreatPersonnelData.corps = this.AddPersonnelAdminForm.controls.corps.value.nom;
    this.CreatPersonnelData.niveau_etude = this.AddPersonnelAdminForm.controls.niveau_etude.value;
    this.CreatPersonnelData.regime_mariage = this.AddPersonnelAdminForm.controls.regime_mariage.value;
    this.CreatPersonnelData.dateEmbauche = this.AddPersonnelAdminForm.controls.dateEmbauche .value;
    this.CreatPersonnelData.dateDernierAvancement = this.AddPersonnelAdminForm.controls.dateDernierAvancement.value;

    if (Util_fonction.checkIfNoTEmpty(this.AddPersonnelAdminForm.controls.echelon.value)){
      this.CreatPersonnelData.echelon = this.AddPersonnelAdminForm.controls.echelon.value;
    }

    this.CreatPersonnelData.statut = this.AddPersonnelAdminForm.controls.statut.value;
    this.CreatPersonnelData.situation_matrimoniale  = this.AddPersonnelAdminForm.controls.situation_matrimoniale.value;


    //user
    this.CreatPersonnelData.user.typeUtilisateur = this.AddPersonnelAdminForm.controls.typeUtilisateur.value;//'';
    this.CreatPersonnelData.user.ville = this.AddPersonnelAdminForm.controls.ville.value;
    this.CreatPersonnelData.user.rue = +this.AddPersonnelAdminForm.controls.rue.value;
    this.CreatPersonnelData.user.numMatricule = this.AddPersonnelAdminForm.controls.numMatricule.value;
    // this.CreatPersonnelData.user.photo = this.AddPersonnelAdminForm.controls.photo.value;
    this.CreatPersonnelData.user.telephone = +this.AddPersonnelAdminForm.controls.telephone.value;
    this.CreatPersonnelData.user.lieuDeNaissance = this.AddPersonnelAdminForm.controls.lieuDeNaissance.value;
    this.CreatPersonnelData.user.nom = this.AddPersonnelAdminForm.controls.nom.value;
    this.CreatPersonnelData.user.dateDeNaissance = this.AddPersonnelAdminForm.controls.dateDeNaissance.value;
    this.CreatPersonnelData.user.quartier = this.AddPersonnelAdminForm.controls.quartier.value;
    this.CreatPersonnelData.user.genre = this.AddPersonnelAdminForm.controls.genre.value;
    this.CreatPersonnelData.user.porte = this.AddPersonnelAdminForm.controls.porte.value;
    this.CreatPersonnelData.user.prenom = this.AddPersonnelAdminForm.controls.prenom.value;
    this.CreatPersonnelData.user.email = this.AddPersonnelAdminForm.controls.email.value;
    // this.CreatPersonnelData.user.pays = this.AddPersonnelAdminForm.controls.pays.value;
    // departement
    this.CreatPersonnelData.departement_id = +this.AddPersonnelAdminForm.controls.departement.value;

    if (Util_fonction.checkIfNoTEmpty(this.AddPersonnelAdminForm.controls.service.value)){
      this.CreatPersonnelData.service_id = +this.AddPersonnelAdminForm.controls.service.value.id;
    }

    if (Util_fonction.checkIfNoTEmpty(this.AddPersonnelAdminForm.controls.division.value)){
      this.CreatPersonnelData.division_id = +this.AddPersonnelAdminForm.controls.division.value.id;
    }


    // fonction
    this.CreatPersonnelData.specialite_fonction_id = +this.AddPersonnelAdminForm.controls.fonction.value.id;

    setTimeout(()=>this.addPersonnelAdmin(),1000);
  }

  /***
   * Initialisation du formulaire
   */
  initForm() {

    /*** INISIATISATION DU FORMULAIRE DE  CREATION */
    this.AddPersonnelAdminForm = this.formBuilder.group({
      categorie: new FormControl(null),
      nationalite: new FormControl(null, [Validators.required]),
      classe: new FormControl(null),
      indice: new FormControl(null),
      etatService: new FormControl(null, [Validators.required]),
      nbreEnfant: new FormControl(0, [Validators.required]),// -!!!
      nbreJourConge: new FormControl(null),
      nbreJourPermission: new FormControl(null),
      anneeDeRetraite: new FormControl(null),
      numAmo: new FormControl(null),
      numNina: new FormControl(null),
      numInps: new FormControl(null),
      corps: new FormControl(null, [Validators.required]),
      niveau_etude: new FormControl(null, [Validators.required]),
      regime_mariage: new FormControl(null, [Validators.required]),
      dateDernierAvancement: new FormControl(null, [Validators.required]), // -facultatif
      echelon: new FormControl(null),
      statut: new FormControl(null, [Validators.required]),
      situation_matrimoniale: new FormControl(null, [Validators.required]),
      //departement
      departement: new FormControl(null, [Validators.required]),

      service: new FormControl(null),// id

      division: new FormControl(null),// id

      dateEmbauche: new FormControl(null, [Validators.required]),

      // fonction
      fonction: new FormControl(null, [Validators.required]), // id

      // User
      typeUtilisateur: new FormControl(null, [Validators.required]),
      ville: new FormControl(null, [Validators.required]),
      rue: new FormControl(null),
      numMatricule: new FormControl(null),
      photo: new FormControl(null),
      telephone: new FormControl(null, [Validators.required]),
      lieuDeNaissance: new FormControl(null, [Validators.required]),
      nom: new FormControl(null, [Validators.required]),
      dateDeNaissance: new FormControl(null, [Validators.required]),
      quartier: new FormControl(null, [Validators.required]),
      genre: new FormControl(null, [Validators.required]),
      porte: new FormControl(null),
      prenom: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      // pays: new FormControl(null, [Validators.required]),
    });
  }

  keyword="nom";
  fonctionSelectEvent(item){
    this.AddPersonnelAdminForm.controls.fonction.setValue(item);
  }

  seviceSelectEvent(item){
    this.AddPersonnelAdminForm.controls.service.setValue(item);
    this.ServiceChange();
  }

  newFonction: string = '';
  onSepcialiteChangeSearch(event){
    this.newFonction = event
  }
  special_spinner: boolean = false;
  AddNewSpecialiteFontion(type){
    this.special_spinner = true;
    const body = {
      nom: this.newFonction,
      type: type
    }
    this.spevialiteFonctionService.addSpecialiteFoction(body).subscribe( (responseSpe) =>{
      console.log("newFonction ==> ", responseSpe);
      this.Fonctions = [];
      this.special_spinner = false;
      this.getAllFoctions();
    }, error => {
      this.special_spinner = false;
      this.Fonctions = [];
      this.getAllFoctions();
    })
  }


  divisionSelectEvent(item){
    this.AddPersonnelAdminForm.controls.division.setValue(item);
  }

  corpsSelectEvent(item){
    this.AddPersonnelAdminForm.controls.corps.setValue(item.nom);
  }

  etatServiceSelectEvent(item){
    this.AddPersonnelAdminForm.controls.etatService.setValue(item.nom);
  }


  cancel(){
    this.route.navigate(['structure/'+this.user.structure.id+'/personnel']);
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

}
