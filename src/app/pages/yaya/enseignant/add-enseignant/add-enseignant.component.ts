import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {PAYS_MONDE} from '../../../PAYS_MODE';
import { EnseignantsService } from '../../../../services/enseignants.service';
import { SpecialiteFonctionService } from '../../../../services/specialite-fonction.service';
import { StructureService } from '../../../../services/structure.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DepartementService } from '../../../../services/departement.service';
import {PersonnelAdminService} from "../../../../services/GestionPersonnelAdmin/personnel-admin.service";
import {FilesService} from "../../../../services/files.service";
import {Util_fonction} from "../../../models/util_fonction";
import * as Util from "util";
import {PersonnelsDonnees} from "../../../models/DonnePersonnels";

@Component({
  selector: 'app-add-enseignant',
  templateUrl: './add-enseignant.component.html',
  styleUrls: ['./add-enseignant.component.css']
})

export class AddEnseignantComponent implements OnInit {
  departements:any;
  user = JSON.parse(sessionStorage.getItem('user'));
  _RECTORAT: boolean =  this.user.structure.type === 'RECTORAT';
  structureId = this.user.structure.id;

  Pays = PAYS_MONDE;

  UpoloadFile: any;
  photoEns: any;
  photochangeEvent: boolean = false;

  AddPersonnelData = {
    categorie: null,
    classe: null,
    corps: null,
    dateDernierAvancement: null,
    dateEmbauche: null,
    departement_id: null,
    discipline: null,
    division_id: null,
    echelon: null,
    etatService: null,
    grade: null,
    indice: null,
    nationalite: null,
    nbreEnfant: null,
    niveau_etude: null,
    numAmo: null,
    numInps: null,
    numNina: null,
    regime_mariage: null,
    service_id: null,
    situation_matrimoniale: null,
    specialite_fonction_id: null,
    statut: null,
    user: {
      dateDeNaissance: null,
      email: null,
      genre: null,
      lieuDeNaissance: null,
      nom: null,
      numMatricule: null,
      photo: null,
      porte: null,
      prenom: null,
      quartier: null,
      rue: null,
      telephone: null,
      typeUtilisateur: null,
      ville: null
    }
  }

  paysDuMonde: any;
  keyword = "nom";
  typeListe = "enseignant";
  AddEnseignantForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private departementService: DepartementService,
    private personnelService: PersonnelAdminService,
    private fonctionSpecialService: SpecialiteFonctionService,
    private departemenentService: DepartementService,
    private fileService: FilesService,
    private routerActive: ActivatedRoute,
    private changeDetect: ChangeDetectorRef,
    private router: Router,
    private spevialiteFonctionService : SpecialiteFonctionService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.routerActive.paramMap
      .subscribe(param => {
        console.log(param);
        if(param["params"]["type"] !== 'enseignant'){
          this.typeListe = param["params"]["type"];
          this.RequiredOrNotField('vacatairesFields'); // vACATAIRE
        }else {
          this.RequiredOrNotField('enseignantsFields');
        }
      });

    this.getDepartements();
    // this.getUtils();
    this.getEnseignantSpecialites();
  }

  RequiredOrNotField(action){
    // this.AddEnseignantForm.reset();
    // this.AddEnseignantForm.clearValidators();
    // this.AddEnseignantForm.setValidators(null);
    // this.AddEnseignantForm.updateValueAndValidity();
    if (action === 'vacatairesFields'){
      this.AddEnseignantForm.controls.categorie.setValidators(Validators.required);
      this.AddEnseignantForm.controls.nationalite.setValidators(Validators.required);
      this.AddEnseignantForm.controls.etatService.setValidators(Validators.required);
      this.AddEnseignantForm.controls.statut.setValidators(null);
      this.AddEnseignantForm.controls.niveau_etude.setValidators(Validators.required);
      this.AddEnseignantForm.controls.situation_matrimoniale.setValidators(Validators.required);
      this.AddEnseignantForm.controls.nbreEnfant.setValidators(Validators.required);
      this.AddEnseignantForm.controls.departement.setValidators(Validators.required);

      this.AddEnseignantForm.controls.nom.setValidators(Validators.required);
      this.AddEnseignantForm.controls.prenom.setValidators(Validators.required);
      this.AddEnseignantForm.controls.genre.setValidators(Validators.required);
      this.AddEnseignantForm.controls.dateDeNaissance.setValidators(Validators.required);
      this.AddEnseignantForm.controls.lieuDeNaissance.setValidators(Validators.required);
      this.AddEnseignantForm.controls.email.setValidators(Validators.required);
      this.AddEnseignantForm.controls.telephone.setValidators(Validators.required);
      this.AddEnseignantForm.controls.ville.setValidators(Validators.required);
      this.AddEnseignantForm.controls.quartier.setValidators(Validators.required);
      this.AddEnseignantForm.controls.typeUtilisateur.setValidators(null);
      this.AddEnseignantForm.controls.dateEmbauche.setValidators(Validators.required);
      this.AddPersonnelData.statut = this.typeListe === 'vacataire' && "VACATAIRE";
      this.AddEnseignantForm.updateValueAndValidity();
    } else {
      this.initRequiredForm();
    }
}

  /**
   * BINDING PART
   * ==============
   */
  getDepartements() {
    this.departementService.getStructureDepartements(this.user.structure.id).subscribe(
      res => {
        this.departements = res;
        this.changeDetect.detectChanges();
      });
  }

  Struc_Services
  depChange_Spinner:boolean = false;
  DepSelect() {
    if (Util_fonction.checkIfNoTEmpty(this.AddEnseignantForm.controls.departement.value)){
      this.depChange_Spinner = true;
      let IdDep = this.AddEnseignantForm.controls.departement.value;
      this.departemenentService.getDepartementServices(IdDep).subscribe(resService => {
        this.Struc_Services = [];
        this.Struc_Services = resService;
        this.depChange_Spinner = false;
        // this.refChange.detectChanges();
      },error => {
        Util_fonction.AlertMessage(error.error.status, 'Veuillez vérifier votre connection. '+error.error.message);
      })
    }
  }

  sevChange_Spinner:boolean =false;
  Divisions;
  seviceSelectEvent(item){
    console.log("item Service : :", item);
    this.AddEnseignantForm.controls.service.setValue(item);

    // if (Util_fonction.checkIfNoTEmpty(this.AddEnseignantForm.controls.service.value)){
    //   this.sevChange_Spinner = true;
    //   let IdSev = this.AddEnseignantForm.controls.service.value.id;
    //   this.departemenentService.getDivisionByService(IdSev).subscribe(divRes=>{
    //     this.Divisions = [];
    //     // this.Divisions = divRes;
    //     this.sevChange_Spinner = false;
    //     // this.refChange.detectChanges();
    //   }, divError => {
    //     this.sevChange_Spinner = false;
    //     Util_fonction.AlertMessage(divError.error.status, 'Veuillez vérifier votre connection. '+divError.error.message);
    //   })
    // }
  }



  etatServicePersonnels = [];
  PersonnelDonnees = PersonnelsDonnees;
  getUtils() {
    console.log(JSON.stringify(this.AddEnseignantForm.value));
    this.etatServicePersonnels = [];
    this.etatServicePersonnels = PersonnelsDonnees.etatsService;
    this.changeDetect.detectChanges();
  }

  specialSpinner: boolean = false;
  Specialites: any;
  getEnseignantSpecialites(){
    this.specialSpinner = true;
    this.fonctionSpecialService.getSpecialiteFoctionByType('specialite').subscribe(
      (res) => {
        this.Specialites = res;
        this.specialSpinner = false;
        this.changeDetect.detectChanges();
      });
  }

  /**
   * PHOTO PART
   * ==============
   */
  onselectFile(e){
    if(e.target.files){
      this.photoEns = null;
      var reader = new FileReader();
      this.UpoloadFile = e.target.files[0];
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.photoEns=event.target.result;
        if (Util_fonction.checkIfNoTEmpty(this.photoEns)){
          this.photochangeEvent = true;
        }

      }
    }
  }

  uploadLogo(){
    let fd = new FormData();
    fd.append('file', this.UpoloadFile);
    fd.append('fileType', "ID_PHOTO");
    this.fileService.uploadPhotoLogo(fd).subscribe(async res => {
      this.AddPersonnelData.user.photo = res.toString();
      setTimeout(()=>this.SaveModif(), 1000);
    });
  }

  /**
   * SAUVEGARDE
   * ==============
   */

  _spinner: boolean = false;
  SaveEnseignant() {
    this._spinner = true;
    this.uploadLogo();
  }

  SaveModif(){
    this.AddPersonnelData.categorie = this.AddEnseignantForm.controls.categorie.value;
    this.AddPersonnelData.nationalite = this.AddEnseignantForm.controls.nationalite.value;
    this.AddPersonnelData.classe = this.AddEnseignantForm.controls.classe.value;
    this.AddPersonnelData.indice = this.AddEnseignantForm.controls.indice.value;
    this.AddPersonnelData.nbreEnfant = this.AddEnseignantForm.controls.nbreEnfant.value;
    this.AddPersonnelData.discipline = this.AddEnseignantForm.controls.discipline.value;

    // this.AddPersonnelData.etatService = this.AddEnseignantForm.controls.etatService.value;

    this.AddPersonnelData.numAmo = this.AddEnseignantForm.controls.numAmo.value;
    this.AddPersonnelData.numNina = this.AddEnseignantForm.controls.numNina.value;
    this.AddPersonnelData.numInps = this.AddEnseignantForm.controls.numInps.value;
    this.AddPersonnelData.corps = this.AddEnseignantForm.controls.corps.value;
    this.AddPersonnelData.niveau_etude = this.AddEnseignantForm.controls.niveau_etude.value;
    this.AddPersonnelData.grade = this.AddEnseignantForm.controls.grade.value;
    this.AddPersonnelData.regime_mariage = this.AddEnseignantForm.controls.regime_mariage.value;
    this.AddPersonnelData.dateDernierAvancement = this.AddEnseignantForm.controls.dateDernierAvancement.value;
    this.AddPersonnelData.echelon = this.AddEnseignantForm.controls.echelon.value;
    this.AddPersonnelData.statut = this.typeListe === 'vacataire' ? "VACATAIRE" : this.AddEnseignantForm.controls.statut.value;
    this.AddPersonnelData.situation_matrimoniale = this.AddEnseignantForm.controls.situation_matrimoniale.value;
    // departement
    this.AddPersonnelData.departement_id = this.AddEnseignantForm.controls.departement.value;
    this.AddPersonnelData.dateEmbauche = this.AddEnseignantForm.controls.dateEmbauche.value;

    if (Util_fonction.checkIfNoTEmpty(this.AddEnseignantForm.controls.service.value)){
      this.AddPersonnelData.service_id = +this.AddEnseignantForm.controls.service.value.id;
    }

    if (Util_fonction.checkIfNoTEmpty(this.AddEnseignantForm.controls.division.value)){
      this.AddPersonnelData.division_id = +this.AddEnseignantForm.controls.division.value;
    }

    // Spécialité
    if (Util_fonction.checkIfNoTEmpty(this.AddEnseignantForm.controls.specialite.value)) {
      this.AddPersonnelData.specialite_fonction_id = +this.AddEnseignantForm.controls.specialite.value.id;
    }

    //user
    // this.AddPersonnelData.user.id = this.modifElement.user.id;
    this.AddPersonnelData.user.typeUtilisateur = this.typeListe === 'vacataire' ? "VACATAIRE" : "ENSEIGNANT"; //this.AddEnseignantForm.controls.typeUtilisateur.value;
    this.AddPersonnelData.user.ville = this.AddEnseignantForm.controls.ville.value;
    this.AddPersonnelData.user.rue = this.AddEnseignantForm.controls.rue.value;
    this.AddPersonnelData.user.numMatricule = this.AddEnseignantForm.controls.numMatricule.value;
    // this.AddEnseignantForm.controls.photo.value;
    this.AddPersonnelData.user.telephone = this.AddEnseignantForm.controls.telephone.value;
    this.AddPersonnelData.user.lieuDeNaissance = this.AddEnseignantForm.controls.lieuDeNaissance.value;
    this.AddPersonnelData.user.nom = this.AddEnseignantForm.controls.nom.value;
    this.AddPersonnelData.user.dateDeNaissance = this.AddEnseignantForm.controls.dateDeNaissance.value;
    this.AddPersonnelData.user.quartier = this.AddEnseignantForm.controls.quartier.value;
    this.AddPersonnelData.user.genre = this.AddEnseignantForm.controls.genre.value;
    this.AddPersonnelData.user.porte = this.AddEnseignantForm.controls.porte.value;
    this.AddPersonnelData.user.prenom = this.AddEnseignantForm.controls.prenom.value;
    this.AddPersonnelData.user.email = this.AddEnseignantForm.controls.email.value;

    // console.log(this.AddPersonnelData);
    this.personnelService.addPersonnel(this.AddPersonnelData).subscribe(
      response => {
        this.photochangeEvent = false;
        this._spinner = false;
        Util_fonction.SuccessMessage(response);
        this.router.navigate(['structure/Enseignant/'+this.typeListe]);
      },error =>{
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      },
    )
  }

  close(){
    this.router.navigate(['structure/Enseignant/'+this.typeListe]);
  }


  /**
   * INIT PART
   * ==============
   */
  initForm() {
    this.AddEnseignantForm = this.formBuilder.group({
      categorie:new FormControl(null),
      nationalite : new FormControl(null),
      classe : new FormControl(null),
      indice : new FormControl(null),
      etatService : new FormControl(null),
      nbreEnfant : new FormControl(null),
      grade : new FormControl(null),
      discipline:new FormControl(null),
      numAmo: new FormControl(null),
      numNina : new FormControl(null),
      numInps : new FormControl(null),
      corps : new FormControl(null),
      niveau_etude : new FormControl(null),
      regime_mariage : new FormControl(null),
      dateDernierAvancement : new FormControl(null),
      echelon : new FormControl(null),
      statut : new FormControl( null),
      situation_matrimoniale : new FormControl(null),
      //departement
      departement: new FormControl(null),

      service: new FormControl(null),
      division: new FormControl(null),

      dateEmbauche: new FormControl(null),

      // fonction
      specialite: new FormControl(null), // id

      // User
      typeUtilisateur: new FormControl(this.typeListe === 'enseignant' ? "ENSEIGNANT" : 'VACATAIRE'),
      ville: new FormControl(null),
      rue: new FormControl(null),
      numMatricule: new FormControl(null),
      photo: new FormControl(null),
      telephone: new FormControl(null),
      lieuDeNaissance: new FormControl(null),
      nom: new FormControl(null),
      dateDeNaissance: new FormControl(null),
      quartier: new FormControl(null),
      genre: new FormControl(null),
      porte: new FormControl(null),
      prenom: new FormControl(null),
      email: new FormControl(null),

    });

  }

  initRequiredForm() {
    this.AddEnseignantForm = this.formBuilder.group({
      categorie:new FormControl(null, [Validators.required]),
      nationalite : new FormControl(null, [Validators.required]),
      classe : new FormControl(null, [Validators.required]),
      indice : new FormControl(null, [Validators.required]),
      etatService : new FormControl(null, [Validators.required]),
      nbreEnfant : new FormControl(null, [Validators.required]),
      grade : new FormControl(null, [Validators.required]),
      discipline:new FormControl(null, [Validators.required]),
      numAmo: new FormControl(null),
      numNina : new FormControl(null),
      numInps : new FormControl(null),
      corps : new FormControl(null, [Validators.required]),
      niveau_etude : new FormControl(null, [Validators.required]),
      regime_mariage : new FormControl(null, [Validators.required]),
      dateDernierAvancement : new FormControl(null, [Validators.required]),
      echelon : new FormControl(null, [Validators.required]),
      statut : new FormControl(null, [Validators.required]),
      situation_matrimoniale : new FormControl(null, [Validators.required]),
      //departement
      departement: new FormControl(null, [Validators.required]),

      service: new FormControl(null),
      division: new FormControl(null),

      dateEmbauche: new FormControl(null, [Validators.required]),

      // fonction
      specialite: new FormControl(null, [Validators.required]), // id

      // User
      typeUtilisateur: new FormControl(this.typeListe === 'enseignant' ? "ENSEIGNANT" : 'VACATAIRE'),
      ville: new FormControl(null, [Validators.required]),
      rue: new FormControl(null),
      numMatricule: new FormControl(null, [Validators.required]),
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

    });

  }

  sepcialiteSelectEvent(item){
    this.AddEnseignantForm.controls.specialite.setValue(item);
  }


  newSpe: string = '';
  onSepcialiteChangeSearch(event){
    this.newSpe = event
  }
  special_spinner: boolean = false;
  AddNewSpecialiteFontion(type){
    this.special_spinner = true;
    const body = {
      nom: this.newSpe,
      type: type
    }
     this.spevialiteFonctionService.addSpecialiteFoction(body).subscribe( (responseSpe) =>{
      console.log("spécial ==> ", responseSpe);
       this.Specialites = [];
       this.special_spinner = false;
       this.getEnseignantSpecialites();
    }, error => {
       this.special_spinner = false;
       this.Specialites = [];
       this.getEnseignantSpecialites();
     })
  }


  etatServiceSelectEvent(item){
    // let itm = item;
    this.AddEnseignantForm.controls.etatService.setValue(item.nom.toString());
    this.AddPersonnelData.etatService = item.nom.toString();
  }




}
