import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartementService } from '../../../../services/departement.service';
import { StructureService } from '../../../../services/structure.service';
import Swal from "sweetalert2";
import {PAYS_MONDE} from '../../../PAYS_MODE';

import { EnseignantsService } from '../../../../services/enseignants.service';
import { SpecialiteFonctionService } from '../../../../services/specialite-fonction.service';
import {Util_fonction} from "../../../models/util_fonction";
import {PersonnelAdminService} from "../../../../services/GestionPersonnelAdmin/personnel-admin.service";
import {FilesService} from "../../../../services/files.service";
import {_HTTP} from "../../../../CONSTANTES";
import {PersonnelsDonnees} from "../../../models/DonnePersonnels";

@Component({
  selector: 'app-modif-enseignant',
  templateUrl: './modif-enseignant.component.html',
  styleUrls: ['./modif-enseignant.component.css']
})
export class ModifEnseignantComponent implements OnInit {
  console = console;
  Pays = PAYS_MONDE;
  modifEnseignantForm: FormGroup;
  Counter = 0;
  photoEns: any;
  EditPersonnelData = {
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
      id: null,
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
  id :any;
  Specialites:any;
  EnseignantNotFound: string;
  id_departement: string;
  departements:any;
  // PersonnelDonnees: any;
  _spinner: boolean = false;
  photochangeEvent : boolean= false;
  UpoloadFile: File;
  typeListe = "enseignant";
  IdEnsignant: any;
  modifElement: any;
  paysDuMonde: any;
  user = JSON.parse(sessionStorage.getItem('user'));
  keyword = "nom";

  _RECTORAT: boolean =  this.user.structure.type === 'RECTORAT';
  structureId = this.user.structure.id;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private departementService: DepartementService,
              private personnelService: PersonnelAdminService,
              private fonctionSpecialService: SpecialiteFonctionService,
              private fileService: FilesService,
              private routerActive: ActivatedRoute,
              private changeDetect: ChangeDetectorRef,
              private router: Router) { }

  ngOnInit(): void {
    // initiation du formulaire
    this.IdEnsignant = this.routerActive.snapshot.paramMap.get('id');
    this.initForm();
    this.routerActive.paramMap
      .subscribe(param => {
        if(param["params"]["type"] !== 'enseignant'){
          this.typeListe = param["params"]["type"];
          this.RequiredOrNotField('vacatairesFields'); // vACATAIRE
        }else {
          this.RequiredOrNotField('enseignantsFields');
        }
      });
    this.GetSelectEnseignant();
    this.getDepartements();
    this.getUtils();
    this.getEnseignantSpecialites();
    // this.fullFormDataSend();
  }

  GetSelectEnseignant(){
    this.personnelService.getPersonnelByID(this.IdEnsignant).subscribe(
      res => {
        this.modifElement = res;
        console.log("res full value : ", res);
        this.fullFormDataSend();
        this.changeDetect.detectChanges();
      }
    )
  }

  RequiredOrNotField(action){
    // this.modifEnseignantForm.reset();
    // this.modifEnseignantForm.clearValidators();
    // this.modifEnseignantForm.setValidators(null);
    // this.modifEnseignantForm.updateValueAndValidity();

    if (action === 'vacatairesFields'){
      this.modifEnseignantForm.controls.categorie.setValidators(Validators.required);
      this.modifEnseignantForm.controls.nationalite.setValidators(Validators.required);
      this.modifEnseignantForm.controls.etatService.setValidators(Validators.required);
      this.modifEnseignantForm.controls.statut.setValidators(null);
      this.modifEnseignantForm.controls.niveau_etude.setValidators(Validators.required);
      this.modifEnseignantForm.controls.situation_matrimoniale.setValidators(Validators.required);
      this.modifEnseignantForm.controls.nbreEnfant.setValidators(Validators.required);
      this.modifEnseignantForm.controls.departement.setValidators(Validators.required);

      this.modifEnseignantForm.controls.nom.setValidators(Validators.required);
      this.modifEnseignantForm.controls.prenom.setValidators(Validators.required);
      this.modifEnseignantForm.controls.genre.setValidators(Validators.required);
      this.modifEnseignantForm.controls.dateDeNaissance.setValidators(Validators.required);
      this.modifEnseignantForm.controls.lieuDeNaissance.setValidators(Validators.required);
      this.modifEnseignantForm.controls.email.setValidators(Validators.required);
      this.modifEnseignantForm.controls.telephone.setValidators(Validators.required);
      this.modifEnseignantForm.controls.ville.setValidators(Validators.required);
      this.modifEnseignantForm.controls.quartier.setValidators(Validators.required);
      this.modifEnseignantForm.controls.typeUtilisateur.setValidators(null);
      this.modifEnseignantForm.controls.dateEmbauche.setValidators(Validators.required);
      this.EditPersonnelData.statut = this.typeListe === 'vacataire' && "VACATAIRE";
      this.modifEnseignantForm.updateValueAndValidity();
    } else {
      this.initRequiredForm();
    }
  }

  initRequiredForm() {
    this.modifEnseignantForm = this.formBuilder.group({
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
    if (Util_fonction.checkIfNoTEmpty(this.modifEnseignantForm.controls.departement.value)){
      this.depChange_Spinner = true;
      let IdDep = this.modifEnseignantForm.controls.departement.value;
      this.departementService.getDepartementServices(IdDep).subscribe(resService => {
        this.Struc_Services = [];
        this.Struc_Services = resService;
        this.depChange_Spinner = false;
        // this.refChange.detectChanges();
      },error => {
        Util_fonction.AlertMessage(error.error.status, 'Veuillez vérifier votre connection. '+error.error.message);
      })
    }
  }

  seviceSelectEvent(item){
    console.log("item Service : :", item);
    this.modifEnseignantForm.controls.service.setValue(item);

  }


  etatServicePersonnels = [];
  PersonnelDonnees = PersonnelsDonnees;
  getUtils() {

    this.etatServicePersonnels = [];
    this.etatServicePersonnels = PersonnelsDonnees.etatsService;
    this.changeDetect.detectChanges();
    // this.personnelService.getPersonnelDonnees().subscribe(
    //   DonneeRes => {
    //     this.etatServicePersonnels = [];
    //     for (let etatServPerso of DonneeRes.etatsService){
    //       this.etatServicePersonnels.push({nom: etatServPerso});
    //     }
    //     this.PersonnelDonnees = DonneeRes;
    //     this.changeDetect.detectChanges();
    //   });
  }

  specialSpinner: boolean = false;
  getEnseignantSpecialites(){
    this.specialSpinner = true;
    this.fonctionSpecialService.getSpecialiteFoctionByType('specialite').subscribe(
      (res) => {
        this.Specialites = res;
        this.specialSpinner = false;
        this.changeDetect.detectChanges();
      });
  }

  //REMPLISSAGE DU FORMULAIRE
  fullFormDataSend(){
    this.modifEnseignantForm.controls.categorie.setValue(this.modifElement.categorie);
    this.modifEnseignantForm.controls.nationalite.setValue(this.modifElement.nationalite);
    this.modifEnseignantForm.controls.classe.setValue(this.modifElement.classe);
    this.modifEnseignantForm.controls.indice.setValue(this.modifElement.indice);

    this.modifEnseignantForm.controls.etatService.setValue(this.modifElement.etatService);
    this.EditPersonnelData.etatService = this.modifElement.etatService;

    this.modifEnseignantForm.controls.nbreEnfant.setValue(this.modifElement.nbreEnfant);
    this.modifEnseignantForm.controls.discipline.setValue(this.modifElement.discipline);

    this.modifEnseignantForm.controls.numAmo.setValue(this.modifElement.numAmo); // -ok
    this.modifEnseignantForm.controls.numNina.setValue(this.modifElement.numNina); // -ok
    this.modifEnseignantForm.controls.numInps.setValue(this.modifElement.numInps); // -ok
    this.modifEnseignantForm.controls.corps.setValue(this.modifElement.corps);
    this.modifEnseignantForm.controls.niveau_etude.setValue(this.modifElement.niveau_etude);
    this.modifEnseignantForm.controls.grade.setValue(this.modifElement.grade);
    this.modifEnseignantForm.controls.regime_mariage.setValue(this.modifElement.regime_mariage);
    if (Util_fonction.checkIfNoTEmpty(this.modifElement.dateDernierAvancement)){
      this.modifEnseignantForm.controls.dateDernierAvancement.setValue(Util_fonction.DateConvert2(this.modifElement.dateDernierAvancement));
    }
    this.modifEnseignantForm.controls.echelon.setValue(this.modifElement.echelon);
    this.modifEnseignantForm.controls.statut.setValue(this.modifElement.statut);
    this.modifEnseignantForm.controls.situation_matrimoniale.setValue(this.modifElement.situation_matrimoniale);
    // departement
    this.modifEnseignantForm.controls.departement.setValue(this.modifElement.departement.id); // -ok
    this.modifEnseignantForm.controls.dateEmbauche.setValue(Util_fonction.DateConvert2(this.modifElement.dateEmbauche));

    // fonction
    this.modifEnseignantForm.controls.service.setValue(this.modifElement.service);

    // fonction
    this.modifEnseignantForm.controls.specialite.setValue(this.modifElement.specialiteFonction);

    //user
    this.modifEnseignantForm.controls.typeUtilisateur.setValue(this.modifElement.user.typeUtilisateur);
    this.modifEnseignantForm.controls.ville.setValue(this.modifElement.user.ville); // -ok
    this.modifEnseignantForm.controls.rue.setValue(this.modifElement.user.rue);
    this.modifEnseignantForm.controls.numMatricule.setValue(this.modifElement.user.numMatricule);
    // this.modifEnseignantForm.controls.photo.setValue(this.modifElement.user.photo);

    if (this.modifElement.user.hasOwnProperty("photo")){
      if (Util_fonction.checkIfNoTEmpty(this.modifElement.user.photo)){
        this.photochangeEvent = true;
        this.photoEns = this.parseImage(this.modifElement.user.photo)// _HTTP+''+this.modifElement.user.photo;
      }
    }


    this.modifEnseignantForm.controls.telephone.setValue(this.modifElement.user.telephone);
    this.modifEnseignantForm.controls.lieuDeNaissance.setValue(this.modifElement.user.lieuDeNaissance); // -ok
    this.modifEnseignantForm.controls.nom.setValue(this.modifElement.user.nom); // -ok
    this.modifEnseignantForm.controls.dateDeNaissance.setValue(Util_fonction.DateConvert2(this.modifElement.user.dateDeNaissance));
    this.modifEnseignantForm.controls.quartier.setValue(this.modifElement.user.quartier);
    this.modifEnseignantForm.controls.genre.setValue(this.modifElement.user.genre);
    this.modifEnseignantForm.controls.porte.setValue(this.modifElement.user.porte);
    this.modifEnseignantForm.controls.prenom.setValue(this.modifElement.user.prenom); // -ok
    this.modifEnseignantForm.controls.email.setValue(this.modifElement.user.email); // -ok

  }

parseImage(img: string): string {
  if(!img) return;
  return img.includes("public.") ? "https://" + img : "http://" + img ;
}

  onselectFile(e){
    if(e.target.files){
      var reader = new FileReader();
      this.UpoloadFile = e.target.files[0];
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.photoEns=event.target.result;
        this.photochangeEvent = true;
      }
    }
  }

  uploadLogo(){
    if (this.UpoloadFile !== null && this.UpoloadFile !== undefined){
      let fd = new FormData();
      fd.append('file', this.UpoloadFile);
      fd.append('fileType', "ID_PHOTO");
      this.fileService.uploadPhotoLogo(fd).subscribe(async res => {
        this.EditPersonnelData.user.photo = res.toString();
        setTimeout(()=>this.SaveModif(), 1000);
      });
    } else {
      this.EditPersonnelData.user.photo = this.modifElement.user.photo;
      this.SaveModif();
    }
  }

  /***
   * MODIFICATION D'UN ENSEIGNANT
   */
  modifEnseignant() {
    this._spinner = true;
    this.uploadLogo();
  }

  SaveModif(){
    this.EditPersonnelData.categorie = this.modifEnseignantForm.controls.categorie.value;
    this.EditPersonnelData.nationalite = this.modifEnseignantForm.controls.nationalite.value;
    this.EditPersonnelData.classe = this.modifEnseignantForm.controls.classe.value;
    this.EditPersonnelData.indice = this.modifEnseignantForm.controls.indice.value;
    this.EditPersonnelData.nbreEnfant = this.modifEnseignantForm.controls.nbreEnfant.value;
    this.EditPersonnelData.discipline = this.modifEnseignantForm.controls.discipline.value;

    // this.EditPersonnelData.etatService = this.modifEnseignantForm.controls.etatService.value;

    this.EditPersonnelData.numAmo = this.modifEnseignantForm.controls.numAmo.value;
    this.EditPersonnelData.numNina = this.modifEnseignantForm.controls.numNina.value;
    this.EditPersonnelData.numInps = this.modifEnseignantForm.controls.numInps.value;
    this.EditPersonnelData.corps = this.modifEnseignantForm.controls.corps.value;
    this.EditPersonnelData.niveau_etude = this.modifEnseignantForm.controls.niveau_etude.value;
    this.EditPersonnelData.grade = this.modifEnseignantForm.controls.grade.value;
    this.EditPersonnelData.regime_mariage = this.modifEnseignantForm.controls.regime_mariage.value;
    this.EditPersonnelData.dateDernierAvancement = this.modifEnseignantForm.controls.dateDernierAvancement.value;
    this.EditPersonnelData.echelon = this.modifEnseignantForm.controls.echelon.value;
    this.EditPersonnelData.statut = this.typeListe === 'vacataire' ? "VACATAIRE" : this.modifEnseignantForm.controls.statut.value;
    // this.EditPersonnelData.statut = this.modifEnseignantForm.controls.statut.value;
    this.EditPersonnelData.situation_matrimoniale = this.modifEnseignantForm.controls.situation_matrimoniale.value;
    // departement
    this.EditPersonnelData.departement_id = this.modifEnseignantForm.controls.departement.value;
    this.EditPersonnelData.dateEmbauche = this.modifEnseignantForm.controls.dateEmbauche.value;

    if (Util_fonction.checkIfNoTEmpty(this.modifEnseignantForm.controls.service.value)){
      this.EditPersonnelData.service_id = +this.modifEnseignantForm.controls.service.value.id;
    }

    if (Util_fonction.checkIfNoTEmpty(this.modifEnseignantForm.controls.division.value)){
      this.EditPersonnelData.division_id = +this.modifEnseignantForm.controls.division.value;
    }

    // Spécialité
    // this.EditPersonnelData.specialite_fonction_id = +this.modifEnseignantForm.controls.specialite.value.id;
    // Spécialité
    if (Util_fonction.checkIfNoTEmpty(this.modifEnseignantForm.controls.specialite.value)) {
      this.EditPersonnelData.specialite_fonction_id = +this.modifEnseignantForm.controls.specialite.value.id;
    }


    //user
    this.EditPersonnelData.user.id = this.modifElement.user.id;
    this.EditPersonnelData.user.typeUtilisateur = this.typeListe === 'vacataire' ? "VACATAIRE" : "ENSEIGNANT"; //this.modifEnseignantForm.controls.typeUtilisateur.value;
    // this.EditPersonnelData.user.typeUtilisateur = "ENSEIGNANT"; //this.modifEnseignantForm.controls.typeUtilisateur.value;
    this.EditPersonnelData.user.ville = this.modifEnseignantForm.controls.ville.value;
    this.EditPersonnelData.user.rue = this.modifEnseignantForm.controls.rue.value;
    this.EditPersonnelData.user.numMatricule = this.modifEnseignantForm.controls.numMatricule.value;
    // this.modifEnseignantForm.controls.photo.value;
    this.EditPersonnelData.user.telephone = this.modifEnseignantForm.controls.telephone.value;
    this.EditPersonnelData.user.lieuDeNaissance = this.modifEnseignantForm.controls.lieuDeNaissance.value;
    this.EditPersonnelData.user.nom = this.modifEnseignantForm.controls.nom.value;
    this.EditPersonnelData.user.dateDeNaissance = this.modifEnseignantForm.controls.dateDeNaissance.value;
    this.EditPersonnelData.user.quartier = this.modifEnseignantForm.controls.quartier.value;
    this.EditPersonnelData.user.genre = this.modifEnseignantForm.controls.genre.value;
    this.EditPersonnelData.user.porte = this.modifEnseignantForm.controls.porte.value;
    this.EditPersonnelData.user.prenom = this.modifEnseignantForm.controls.prenom.value;
    this.EditPersonnelData.user.email = this.modifEnseignantForm.controls.email.value;

    this.personnelService.updatePersonnel(this.modifElement.id, this.EditPersonnelData).subscribe(
      response => {
        this.photochangeEvent = false;
        this._spinner = false;
        Util_fonction.SuccessMessage(response);
        this.router.navigate(['structure/Enseignant/'+this.typeListe]);
        // this.router.navigate(['structure/Enseignant']);
      },error =>{
        this._spinner = false;

        if(error.error !== null && error.error !== undefined){
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        }
      },
    )
  }

  close(){
    this.router.navigate(['structure/Enseignant/'+this.typeListe]);
    // this.router.navigate(['structure/Enseignant']);
  }


  initForm() {
    this.modifEnseignantForm = this.formBuilder.group({
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
      statut : new FormControl(null),
      situation_matrimoniale : new FormControl(null),
      //departement
      departement: new FormControl(this.id_departement),

      service: new FormControl(null),
      division: new FormControl(null),

      dateEmbauche: new FormControl(null),

      // fonction
      specialite: new FormControl(null), // id

      // User
      typeUtilisateur: new FormControl(this.typeListe === 'enseignant' ? "ENSEIGNANT" : 'VACATAIRE'),
      // typeUtilisateur: new FormControl("ENSEIGNANT"),
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

  sepcialiteSelectEvent(item){
    this.modifEnseignantForm.controls.specialite.setValue(item);
  }
  etatServiceSelectEvent(item){
    // let itm = item;
    this.modifEnseignantForm.controls.etatService.setValue(item.nom.toString());
    this.EditPersonnelData.etatService = item.nom.toString();
  }


}
