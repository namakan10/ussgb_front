import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
// import {EnseignantsService} from "../../../../services/enseignants.service";
// import {StructureService} from "../../../../services/structure.service";
import {SpecialiteFonctionService} from "../../../../services/specialite-fonction.service";
import {DepartementService} from "../../../../services/departement.service";
import {PersonnelAdminService} from "../../../../services/GestionPersonnelAdmin/personnel-admin.service";
import {PAYS_MONDE} from "../../../PAYS_MODE";
import {Util_fonction} from "../../../models/util_fonction";
import {FilesService} from "../../../../services/files.service";
// import Swal from "sweetalert2";
// import * as Util from "util";
import {_HTTP} from "../../../../CONSTANTES";
import {PersonnelsDonnees} from "../../../models/DonnePersonnels";

@Component({
  selector: 'app-modif-personnel-adm',
  templateUrl: './modif-personnel-adm.component.html',
  styleUrls: ['./modif-personnel-adm.component.css']
})
export class ModifPersonnelAdmComponent implements OnInit {
  Pays = PAYS_MONDE;

  EditPersonnelAdminForm: FormGroup
  ModifPersonnelData = {

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
      id: null,
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

    specialite_fonction_id : null,

  };
  user:any;
  structure_ID:any;
  Struc_Services:any;
  PersonnelDonnees = PersonnelsDonnees;
  departements:any;
  EditData:any;
  IDPerso:any;
  Fonctions:any;
  _spinner: boolean = false;
  depChange_Spinner: boolean = false;
  photochangeEvent: boolean = false;
  photoEns:any;
  UpoloadFile: File;
  sevChange_Spinner = false;
  Divisions: any;
  Phot: any;

  categorieFiel:boolean = false;
  echelonFiel:boolean = false;
  indiceFiel:boolean = false;
  numMatriculeFiel:boolean = false;
  _photoSpinner:boolean = false;

  constructor(private formBuilder: FormBuilder,
              private route: Router,
              private router:ActivatedRoute,
              private routeActive: ActivatedRoute,
              private fonctionSpecialService: SpecialiteFonctionService,
              private departemenentService: DepartementService,
              private fileService: FilesService,
              private refChange: ChangeDetectorRef,
              private personnelAdminService: PersonnelAdminService) {

  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.IDPerso = this.router.snapshot.paramMap.get('idPerso');

    this.structure_ID = this.user.structure.id;
    this.initForm();
    this.getUtils();
    this.getDepartements();
    this.getAllFoctions();

    this.getPersonnelData();
  }
  getAllFoctions() {
    this.fonctionSpecialService.getAllFoctionSpecialite().subscribe(fonctRes => {
      this.Fonctions = fonctRes;
    });
  }
  getPersonnelData(){
    this.personnelAdminService.getPersonnelByID(this.IDPerso).subscribe(
      responseGet => {
        this.EditData = responseGet;
        console.log(this.EditData);
        this.selectDepService(this.EditData.departement.id);

        if (this.EditData.service !== null && this.EditData.service !== undefined &&
          this.EditData.service !== "") {
          this.SelectSevDivision(this.EditData.service.id);
        }
        setTimeout(()=>this.fullForm(),800);
      }
    )
  }

  DepSelect() {
    if (Util_fonction.checkIfNoTEmpty(this.EditPersonnelAdminForm.controls.departement.value)){
      this.depChange_Spinner = true;
      let IdDep = this.EditPersonnelAdminForm.controls.departement.value;
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

  selectDepService(IdDep){
    this.departemenentService.getDepartementServices(IdDep).subscribe(resService => {
      this.Struc_Services = resService;
      this.depChange_Spinner = false;
    },error => {
      Util_fonction.AlertMessage("warning","Veuillez vérifier votre connection. " + error.error.message);
    })
  }

  ServiceCahnge(){
    if (Util_fonction.checkIfNoTEmpty(this.EditPersonnelAdminForm.controls.service.value)){
      this.sevChange_Spinner = true;
      let IdSev = this.EditPersonnelAdminForm.controls.service.value.id;
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

  SelectSevDivision(IdSev){
    this.departemenentService.getDivisionByService(IdSev).subscribe(divRes=>{
      this.Divisions = divRes;
      this.sevChange_Spinner = false;
    }, error => {
      this.sevChange_Spinner = false;
      Util_fonction.AlertMessage("warning","Veuillez vérifier votre connection. " + error.error.message);
    })
  }

  StructDepartements: any;
  getDepartements() {
    this.departemenentService.getStructureDepartements(this.user.structure.id).subscribe(
      res => {
        this.StructDepartements = res;
        // this.departements = res;

      });
  }

  corpPersonnels = [];
  etatServicePersonnels = [];
  getUtils() {
    this.corpPersonnels = PersonnelsDonnees.corpsPersonnelAdministratif;
    this.etatServicePersonnels = PersonnelsDonnees.etatsService;
    this.refChange.detectChanges();
    // this.personnelAdminService.getPersonnelDonnees().subscribe(
    //   DonneeRes => {
    //     this.corpPersonnels = [];
    //     this.etatServicePersonnels = [];
    //
    //     for (let corpPerso of DonneeRes.corpsPersonnelAdministratif){
    //       this.corpPersonnels.push({nom: corpPerso});
    //     }
    //
    //     for (let etatServPerso of DonneeRes.etatsService){
    //       this.etatServicePersonnels.push({nom: etatServPerso});
    //     }
    //
    //     this.PersonnelDonnees = DonneeRes;
    //
    //     console.log("DonneeRes", DonneeRes)
    //     console.log("situationMatrimoniale", this.PersonnelDonnees.situationMatrimoniale)
    //
    //   });
  }

  getAllServices() {
    this.departemenentService.getStructureServices(this.structure_ID).subscribe(
      servRes => {
        this.Struc_Services = servRes;
      });
  }

  /**
   * FULL
   */
  fullForm(){
    let convert = new Util_fonction();

    if (this.EditData.categorie && this.EditData.categorie !== ""){
      this.categorieFiel = true;
      this.EditPersonnelAdminForm.controls.categorie.setValue(this.EditData.categorie);
    }

    this.EditPersonnelAdminForm.controls.nationalite.setValue(this.EditData.nationalite);
    this.EditPersonnelAdminForm.controls.classe.setValue(this.EditData.classe);

    if (this.EditData.indice && this.EditData.indice !== ""){
      this.indiceFiel = true;
      this.EditPersonnelAdminForm.controls.indice.setValue(this.EditData.indice);
    }

    this.EditPersonnelAdminForm.controls.etatService.setValue(this.EditData.etatService);
    this.EditPersonnelAdminForm.controls.nbreEnfant.setValue(this.EditData.nbreEnfant);
    this.EditPersonnelAdminForm.controls.nbreJourConge.setValue(this.EditData.nbreJourConge);
    this.EditPersonnelAdminForm.controls.nbreJourPermission.setValue(this.EditData.nbreJourPermission);
    this.EditPersonnelAdminForm.controls.anneeDeRetraite.setValue(this.EditData.anneeDeRetraite);
    this.EditPersonnelAdminForm.controls.numAmo.setValue(this.EditData.numAmo);
    this.EditPersonnelAdminForm.controls.numNina.setValue(this.EditData.numNina);
    this.EditPersonnelAdminForm.controls.numInps.setValue(this.EditData.numInps);
    this.EditPersonnelAdminForm.controls.corps.setValue(this.EditData.corps);
    this.EditPersonnelAdminForm.controls.niveau_etude.setValue(this.EditData.niveau_etude);
    this.EditPersonnelAdminForm.controls.regime_mariage.setValue(this.EditData.regime_mariage);
    this.EditPersonnelAdminForm.controls.dateDernierAvancement.setValue(Util_fonction.DateConvert2(this.EditData.dateDernierAvancement));
    this.EditPersonnelAdminForm.controls.dateEmbauche.setValue(Util_fonction.DateConvert2(this.EditData.dateEmbauche));

    if (this.EditData.echelon && this.EditData.echelon !== ""){
      this.echelonFiel = true;
      this.EditPersonnelAdminForm.controls.echelon.setValue(this.EditData.echelon);
    }

    this.EditPersonnelAdminForm.controls.statut.setValue(this.EditData.statut);
    this.EditPersonnelAdminForm.controls.situation_matrimoniale.setValue(this.EditData.situation_matrimoniale);

    //user
    this.EditPersonnelAdminForm.controls.typeUtilisateur.setValue(this.EditData.user.typeUtilisateur);
    this.EditPersonnelAdminForm.controls.ville.setValue(this.EditData.user.ville);
    this.EditPersonnelAdminForm.controls.rue.setValue(this.EditData.user.rue);

    if (this.EditData.user.numMatricule){
      this.numMatriculeFiel = true;
      this.EditPersonnelAdminForm.controls.numMatricule.setValue(this.EditData.user.numMatricule);
    }

    // this.photoEns = 'http://'+this.EditData.user.photo;

    if (this.EditData.user.hasOwnProperty("photo")){
      if (Util_fonction.checkIfNoTEmpty(this.EditData.user.photo)){
        // this.photochangeEvent = true;
        this.photoEns = this.parseImage(this.EditData.user.photo);
      }

    }

    this.EditPersonnelAdminForm.controls.telephone.setValue(this.EditData.user.telephone);
    this.EditPersonnelAdminForm.controls.lieuDeNaissance.setValue(this.EditData.user.lieuDeNaissance);
    this.EditPersonnelAdminForm.controls.nom.setValue(this.EditData.user.nom);
    this.EditPersonnelAdminForm.controls.dateDeNaissance.setValue(Util_fonction.DateConvert2(this.EditData.user.dateDeNaissance));
    this.EditPersonnelAdminForm.controls.quartier.setValue(this.EditData.user.quartier);
    this.EditPersonnelAdminForm.controls.genre.setValue(this.EditData.user.genre);
    this.EditPersonnelAdminForm.controls.porte.setValue(this.EditData.user.porte);
    this.EditPersonnelAdminForm.controls.prenom.setValue(this.EditData.user.prenom);
    this.EditPersonnelAdminForm.controls.email.setValue(this.EditData.user.email);

    this.ModifPersonnelData.user.photo = this.EditData.user.photo;
    // this.EditPersonnelAdminForm.controls.pays.setValue(this.EditData.user.pays);

    // departement
    this.EditPersonnelAdminForm.controls.departement.setValue(this.EditData.departement.id);
    if (this.EditData.service && this.EditData.service !== ""){
      this.EditPersonnelAdminForm.controls.service.setValue(this.EditData.service);
    }

    if (this.EditData.division && this.EditData.division !== ""){
      this.EditPersonnelAdminForm.controls.division.setValue(this.EditData.division);
    }
    // fonction
    this.EditPersonnelAdminForm.controls.fonction.setValue(this.EditData.specialiteFonction);
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

  /**
   * UPLOAD
   */
  uploadLogo(){
    if (this.UpoloadFile){
      let fd = new FormData();
      fd.append('file', this.UpoloadFile);
      fd.append('fileType', "ID_PHOTO");
      this.fileService.uploadPhotoLogo(fd).subscribe(async res => {
        this.Phot = res.toString();
        this.ModifPersonnelData.user.photo = res.toString();
        console.log("Photo Uploadé: "+this.ModifPersonnelData.user.photo);
        setTimeout(()=> this.SaveModif(),1000);
      });
    }
    else {
      this.ModifPersonnelData.user.photo = this.EditData.user.photo;
      this.SaveModif();
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  UpdatePersonnelAdmin() {
    this._spinner = true;
    this.uploadLogo();
  }

  SaveModif() {
    this.ModifPersonnelData.categorie = this.EditPersonnelAdminForm.controls.categorie.value;
    this.ModifPersonnelData.nationalite = this.EditPersonnelAdminForm.controls.nationalite.value;
    this.ModifPersonnelData.classe = this.EditPersonnelAdminForm.controls.classe.value;

    if (Util_fonction.checkIfNoTEmpty(this.EditPersonnelAdminForm.controls.indice.value)){
      this.ModifPersonnelData.indice = +this.EditPersonnelAdminForm.controls.indice.value;
    }
    this.ModifPersonnelData.etatService = this.EditPersonnelAdminForm.controls.etatService.value;
    this.ModifPersonnelData.nbreEnfant = +this.EditPersonnelAdminForm.controls.nbreEnfant.value;

    this.ModifPersonnelData.numAmo = this.EditPersonnelAdminForm.controls.numAmo.value;
    this.ModifPersonnelData.numNina = this.EditPersonnelAdminForm.controls.numNina.value;
    this.ModifPersonnelData.numInps = this.EditPersonnelAdminForm.controls.numInps.value;
    this.ModifPersonnelData.corps = this.EditPersonnelAdminForm.controls.corps.value;
    this.ModifPersonnelData.niveau_etude = this.EditPersonnelAdminForm.controls.niveau_etude.value;
    this.ModifPersonnelData.regime_mariage = this.EditPersonnelAdminForm.controls.regime_mariage.value;
    this.ModifPersonnelData.dateEmbauche = this.EditPersonnelAdminForm.controls.dateEmbauche.value;
    this.ModifPersonnelData.dateDernierAvancement = this.EditPersonnelAdminForm.controls.dateDernierAvancement.value;
    this.ModifPersonnelData.echelon = this.EditPersonnelAdminForm.controls.echelon.value;
    this.ModifPersonnelData.statut = this.EditPersonnelAdminForm.controls.statut.value;
    this.ModifPersonnelData.situation_matrimoniale = this.EditPersonnelAdminForm.controls.situation_matrimoniale.value;


    //user
    this.ModifPersonnelData.user.id = +this.EditData.user.id;
    this.ModifPersonnelData.user.typeUtilisateur = this.EditPersonnelAdminForm.controls.typeUtilisateur.value;
    this.ModifPersonnelData.user.ville = this.EditPersonnelAdminForm.controls.ville.value;
    this.ModifPersonnelData.user.rue = this.EditPersonnelAdminForm.controls.rue.value;
    this.ModifPersonnelData.user.numMatricule = this.EditPersonnelAdminForm.controls.numMatricule.value;
    // this.ModifPersonnelData.user.photo = "vps76820.serveur-vps.net/ussgb/assets/uploads/photo/16171424199518.jpg";//this.Phot;
    this.ModifPersonnelData.user.telephone = +this.EditPersonnelAdminForm.controls.telephone.value;
    this.ModifPersonnelData.user.lieuDeNaissance = this.EditPersonnelAdminForm.controls.lieuDeNaissance.value;
    this.ModifPersonnelData.user.nom = this.EditPersonnelAdminForm.controls.nom.value;
    this.ModifPersonnelData.user.dateDeNaissance = this.EditPersonnelAdminForm.controls.dateDeNaissance.value;
    this.ModifPersonnelData.user.quartier = this.EditPersonnelAdminForm.controls.quartier.value;
    this.ModifPersonnelData.user.genre = this.EditPersonnelAdminForm.controls.genre.value;
    this.ModifPersonnelData.user.porte = this.EditPersonnelAdminForm.controls.porte.value;
    this.ModifPersonnelData.user.prenom = this.EditPersonnelAdminForm.controls.prenom.value;
    this.ModifPersonnelData.user.email = this.EditPersonnelAdminForm.controls.email.value;
    // this.ModifPersonnelData.user.pays = this.EditPersonnelAdminForm.controls.pays.value;
    // departement
    this.ModifPersonnelData.departement_id = +this.EditPersonnelAdminForm.controls.departement.value;

    if (Util_fonction.checkIfNoTEmpty(this.EditPersonnelAdminForm.controls.service.value)){
      this.ModifPersonnelData.service_id = +this.EditPersonnelAdminForm.controls.service.value.id;
    }

    if (Util_fonction.checkIfNoTEmpty(this.EditPersonnelAdminForm.controls.division.value)){
      this.ModifPersonnelData.division_id = +this.EditPersonnelAdminForm.controls.division.value.id;
    }

    // fonction
    this.ModifPersonnelData.specialite_fonction_id = +this.EditPersonnelAdminForm.controls.fonction.value.id;

    console.log("ModifPersonnelData ===>>>",this.ModifPersonnelData);
    console.log("IDPerso ===>>>",this.IDPerso);

    this.personnelAdminService.updatePersonnel(this.IDPerso, this.ModifPersonnelData).subscribe(
      response => {
        this.photochangeEvent = false;
        this._spinner = false;
        Util_fonction.SuccessMessage(response);
        this.route.navigate(['structure/'+this.user.structure.id+'/personnel']);
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      },
    )
  }


  /***
   * Initialisation du formulaire
   */
  initForm() {

    /*** INISIATISATION DU FORMULAIRE DE  CREATION */
    this.EditPersonnelAdminForm = this.formBuilder.group({
      categorie: new FormControl(null),
      nationalite : new FormControl(null, [Validators.required]),
      classe : new FormControl(null, [Validators.required]),
      indice : new FormControl(null),
      etatService : new FormControl(null, [Validators.required]),
      nbreEnfant : new FormControl(0, [Validators.required]),// -!!!
      nbreJourConge : new FormControl(null),
      nbreJourPermission : new FormControl(null),
      anneeDeRetraite : new FormControl(null),
      numAmo: new FormControl(null),
      numNina : new FormControl(null),
      numInps : new FormControl(null),
      corps : new FormControl(null, [Validators.required]),
      niveau_etude : new FormControl(null, [Validators.required]),
      regime_mariage : new FormControl(null, [Validators.required]),
      dateDernierAvancement : new FormControl(null, [Validators.required]), // -facultatif
      echelon : new FormControl(null),
      statut : new FormControl(null, [Validators.required]),
      situation_matrimoniale : new FormControl(null, [Validators.required]),
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
    this.EditPersonnelAdminForm.controls.fonction.setValue(item);
  }

  seviceSelectEvent(item){
    this.EditPersonnelAdminForm.controls.service.setValue(item);
    this.ServiceCahnge();
  }

  divisionSelectEvent(item){
    this.EditPersonnelAdminForm.controls.division.setValue(item);
  }

  corpsSelectEvent(item){
    this.EditPersonnelAdminForm.controls.corps.setValue(item.nom);
  }

  etatServiceSelectEvent(item){
    this.EditPersonnelAdminForm.controls.etatService.setValue(item.nom);
  }



  cancel(){
    this.route.navigate(['structure/'+this.user.structure.id+'/personnel']);
  }


}
