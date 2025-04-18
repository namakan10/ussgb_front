import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PAYS_MONDE} from "../../../../PAYS_MODE";
import {DepartementService} from "../../../../../services/departement.service";
import {PersonnelAdminService} from "../../personnel-admin/personnel-admin.service";
import {SpecialiteFonctionService} from "../../../../../services/specialite-fonction.service";
import {Util_fonction} from "../../../../models/util_fonction";
import {PersonnelsDonnees} from "../../../../models/DonnePersonnels";
import {SpinnerService} from "../../../spinner.service";
import {FilesService} from "../../../../../services/files.service";
import {_HTTP} from '../../../../../CONSTANTES';

@Component({
  selector: 'app-enseignant-form',
  templateUrl: './enseignant-form.component.html',
  styleUrls: ['./enseignan-form.component.css']
})

export class EnseignantFormComponent implements OnInit {
  departements: any;
  user = JSON.parse(sessionStorage.getItem('user'));

  _RECTORAT: boolean = this.user.structure.type === 'RECTORAT';
  structureId = this.user.structure.id;

  Pays = PAYS_MONDE;

  UpoloadFile: any;
  photoEns: any;
  photochangeEvent: boolean = false;

  EnseignantInitModelData = {
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
    numInps: null,
    numNina: null,
    etatService: null,
    statut: null,
    discipline: null,
    grade: null,
    departement: null,
    division: null,
    service: null,
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
      email: null
    }
  }

  paysDuMonde: any;
  keyword = "nom";
  typeListe = "enseignants";
  AddEnseignantForm: FormGroup;


  id: null;
  id_departement: any;
  id_personnel: any;

  model: any = {
    user: {},
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

  etatServiceCtrl = new FormControl()

  maxDate = new Date();
  id_structure;
  _http = _HTTP;
  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private router: ActivatedRoute,
    private routeActive: ActivatedRoute,
    private spinner: SpinnerService,
    private departementService: DepartementService,
    // private personnelService: PersonnelAdminService,
    private service: PersonnelAdminService,
    private fonctionSpecialService: SpecialiteFonctionService,
    private departemenentService: DepartementService,
    private fileService: FilesService,
    private routerActive: ActivatedRoute,
    private changeDetect: ChangeDetectorRef,
    private spevialiteFonctionService: SpecialiteFonctionService,
  ) {
  }

  ngOnInit(): void {

    this.router.paramMap
      .subscribe(param => {
        if (param["params"]["type"] !== this.typeListe) this.typeListe = param["params"]["type"];
      });

    this.id_structure = this.router.snapshot.paramMap.get("id");
    this.id_personnel = this.router.snapshot.paramMap.get("personnelId");
    this.subcribeFom();
    this.getDepartements();
    this.getAllServices();
    this.getEnseignantSpecialites();
    this.getUtils();






    if (this.id_personnel) this.getPersonnelByID(+this.id_personnel);




    // this.initForm();
    // this.routerActive.paramMap
    //   .subscribe(param => {
    //     console.log(param);
    //     if (param["params"]["type"] !== 'enseignant') {
    //       this.typeListe = param["params"]["type"];
    //       this.RequiredOrNotField('vacatairesFields'); // vACATAIRE
    //     } else {
    //       this.RequiredOrNotField('enseignantsFields');
    //     }
    //   });


  }

  // RequiredOrNotField(action) {
  //   // this.AddEnseignantForm.reset();
  //   // this.AddEnseignantForm.clearValidators();
  //   // this.AddEnseignantForm.setValidators(null);
  //   // this.AddEnseignantForm.updateValueAndValidity();
  //   if (action === 'vacatairesFields') {
  //     this.AddEnseignantForm.controls.categorie.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.nationalite.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.etatService.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.statut.setValidators(null);
  //     this.AddEnseignantForm.controls.niveau_etude.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.situation_matrimoniale.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.nbreEnfant.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.departement.setValidators(Validators.required);
  //
  //     this.AddEnseignantForm.controls.nom.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.prenom.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.genre.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.dateDeNaissance.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.lieuDeNaissance.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.email.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.telephone.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.ville.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.quartier.setValidators(Validators.required);
  //     this.AddEnseignantForm.controls.typeUtilisateur.setValidators(null);
  //     this.AddEnseignantForm.controls.dateEmbauche.setValidators(Validators.required);
  //     // this.AddPersonnelData.statut = this.typeListe === 'vacataire' && "VACATAIRE";
  //     this.AddEnseignantForm.updateValueAndValidity();
  //   } else {
  //     this.initRequiredForm();
  //   }
  // }

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
  depChange_Spinner: boolean = false;

  DepSelect(id) {
      this.depChange_Spinner = true;
      // this.carriereFormGroup.controls.departement_id.setValue(id);
      // this.model.departement_id = id;
    console.log("=> ", id, this.model.departement_id);
      this.GetDepartementServices(id);
    }

    GetDepartementServices(id){
      this.departemenentService.getDepartementServices(id).subscribe(resService => {
        this.Struc_Services = [];
        this.Struc_Services = resService;
        this.depChange_Spinner = false;
        if (resService.length > 0  && !!this.model.service){
          this.carriereFormGroup.controls.service.setValue(this.model.service.id);
        }
        this.changeDetect.detectChanges();
      }, error => {
        Util_fonction.AlertMessage(error.error.status, 'Veuillez vérifier votre connection. ' + error.error.message);
      })
    }


  sevChange_Spinner: boolean = false;
  Divisions;

  // seviceSelectEvent(item) {
  //   console.log("item Service : :", item);
  //     this.sevChange_Spinner = true;
  //     this.departemenentService.getDivisionByService(item.id).subscribe(divRes=>{
  //       // this.Divisions = [];
  //       this.Divisions = divRes;
  //       this.sevChange_Spinner = false;
  //       this.changeDetect.detectChanges();
  //     }, divError => {
  //       this.sevChange_Spinner = false;
  //       Util_fonction.AlertMessage(divError.error.status, 'Veuillez vérifier votre connection. '+divError.error.message);
  //     })
  //   }

  ServiceChange(id) {
    this.sevChange_Spinner = true;
    this.departemenentService.getDivisionByService(id).subscribe(divRes => {
      this.Divisions = divRes;
      this.sevChange_Spinner = false;
      this.changeDetect.detectChanges();
    }, divError => {
      this.sevChange_Spinner = false;
      Util_fonction.AlertMessage(divError.error.status, 'Veuillez vérifier votre connection. ' + divError.error.message);
    })

  }



  corpPersonnels = [];
  etatServicePersonnels = [];
  PersonnelDonnees = PersonnelsDonnees;

  getUtils() {
    console.log(JSON.stringify(this.model));
    this.corpPersonnels = PersonnelsDonnees.corpsEnseignant;
    this.etatServicePersonnels = PersonnelsDonnees.etatsService;
    this.changeDetect.detectChanges();
  }

  specialSpinner: boolean = false;
  Specialites: any;

  getEnseignantSpecialites() {
    this.specialSpinner = true;
    this.fonctionSpecialService.getSpecialiteFoctionByType('specialite').subscribe(
      (res) => {
        this.Specialites = res;
        this.specialSpinner = false;
        this.changeDetect.detectChanges();
      });
  }
  Fonctions;
  getAllFoctions() {
    this.fonctionSpecialService.getAllFoctionSpecialite().subscribe(fonctRes => {
      this.Fonctions = fonctRes;
      // this.refChange.detectChanges();
    });
  }

  getAllServices() {
    this.departemenentService.getStructureServices(this.id_structure).subscribe(
      servRes => {
        this.Struc_Services = servRes;
        this.changeDetect.detectChanges();
      });
  }

  /**
   * PHOTO PART
   * ==============
   */
  onselectFile(e) {
    if (e.target.files) {
      this.photoEns = null;
      var reader = new FileReader();
      this.UpoloadFile = e.target.files[0];
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.photoEns = event.target.result;
        if (Util_fonction.checkIfNoTEmpty(this.photoEns)) {
          this.photochangeEvent = true;
        }

      }
    }
  }


  /**
   * SAUVEGARDE
   * ==============
   */

  _spinner: boolean = false;


  // SaveModif() {
  //   this.AddPersonnelData.categorie = this.AddEnseignantForm.controls.categorie.value;
  //   this.AddPersonnelData.nationalite = this.AddEnseignantForm.controls.nationalite.value;
  //   this.AddPersonnelData.classe = this.AddEnseignantForm.controls.classe.value;
  //   this.AddPersonnelData.indice = this.AddEnseignantForm.controls.indice.value;
  //   this.AddPersonnelData.nbreEnfant = this.AddEnseignantForm.controls.nbreEnfant.value;
  //   this.AddPersonnelData.discipline = this.AddEnseignantForm.controls.discipline.value;
  //
  //   // this.AddPersonnelData.etatService = this.AddEnseignantForm.controls.etatService.value;
  //
  //   this.AddPersonnelData.numAmo = this.AddEnseignantForm.controls.numAmo.value;
  //   this.AddPersonnelData.numNina = this.AddEnseignantForm.controls.numNina.value;
  //   this.AddPersonnelData.numInps = this.AddEnseignantForm.controls.numInps.value;
  //   this.AddPersonnelData.corps = this.AddEnseignantForm.controls.corps.value;
  //   this.AddPersonnelData.niveau_etude = this.AddEnseignantForm.controls.niveau_etude.value;
  //   this.AddPersonnelData.grade = this.AddEnseignantForm.controls.grade.value;
  //   this.AddPersonnelData.regime_mariage = this.AddEnseignantForm.controls.regime_mariage.value;
  //   this.AddPersonnelData.dateDernierAvancement = this.AddEnseignantForm.controls.dateDernierAvancement.value;
  //   this.AddPersonnelData.echelon = this.AddEnseignantForm.controls.echelon.value;
  //   this.AddPersonnelData.statut = this.typeListe === 'vacataire' ? "VACATAIRE" : this.AddEnseignantForm.controls.statut.value;
  //   this.AddPersonnelData.situation_matrimoniale = this.AddEnseignantForm.controls.situation_matrimoniale.value;
  //   // departement
  //   this.AddPersonnelData.departement_id = this.AddEnseignantForm.controls.departement.value;
  //   this.AddPersonnelData.dateEmbauche = this.AddEnseignantForm.controls.dateEmbauche.value;
  //
  //   if (Util_fonction.checkIfNoTEmpty(this.AddEnseignantForm.controls.service.value)) {
  //     this.AddPersonnelData.service_id = +this.AddEnseignantForm.controls.service.value.id;
  //   }
  //
  //   if (Util_fonction.checkIfNoTEmpty(this.AddEnseignantForm.controls.division.value)) {
  //     this.AddPersonnelData.division_id = +this.AddEnseignantForm.controls.division.value;
  //   }
  //
  //   // Spécialité
  //   if (Util_fonction.checkIfNoTEmpty(this.AddEnseignantForm.controls.specialite.value)) {
  //     this.AddPersonnelData.specialite_fonction_id = +this.AddEnseignantForm.controls.specialite.value.id;
  //   }
  //
  //   //user
  //   // this.AddPersonnelData.user.id = this.modifElement.user.id;
  //   this.AddPersonnelData.user.typeUtilisateur = this.typeListe === 'vacataire' ? "VACATAIRE" : "ENSEIGNANT"; //this.AddEnseignantForm.controls.typeUtilisateur.value;
  //   this.AddPersonnelData.user.ville = this.AddEnseignantForm.controls.ville.value;
  //   this.AddPersonnelData.user.rue = this.AddEnseignantForm.controls.rue.value;
  //   this.AddPersonnelData.user.numMatricule = this.AddEnseignantForm.controls.numMatricule.value;
  //   // this.AddEnseignantForm.controls.photo.value;
  //   this.AddPersonnelData.user.telephone = this.AddEnseignantForm.controls.telephone.value;
  //   this.AddPersonnelData.user.lieuDeNaissance = this.AddEnseignantForm.controls.lieuDeNaissance.value;
  //   this.AddPersonnelData.user.nom = this.AddEnseignantForm.controls.nom.value;
  //   this.AddPersonnelData.user.dateDeNaissance = this.AddEnseignantForm.controls.dateDeNaissance.value;
  //   this.AddPersonnelData.user.quartier = this.AddEnseignantForm.controls.quartier.value;
  //   this.AddPersonnelData.user.genre = this.AddEnseignantForm.controls.genre.value;
  //   this.AddPersonnelData.user.porte = this.AddEnseignantForm.controls.porte.value;
  //   this.AddPersonnelData.user.prenom = this.AddEnseignantForm.controls.prenom.value;
  //   this.AddPersonnelData.user.email = this.AddEnseignantForm.controls.email.value;
  //
  //   // console.log(this.AddPersonnelData);
  //   // this.personnelService.addPersonnel(this.AddPersonnelData).subscribe(
  //   //   response => {
  //   //     this.photochangeEvent = false;
  //   //     this._spinner = false;
  //   //     Util_fonction.SuccessMessage(response);
  //   //     this.router.navigate(['structure/Enseignant/'+this.typeListe]);
  //   //   },error =>{
  //   //     this._spinner = false;
  //   //     Util_fonction.AlertMessage(error.error.status,error.error.message);
  //   //   },
  //   // )
  // }

  close() {
    this.route.navigate(['structure/' + this.user.structure.id + '/' + this.typeListe]);
  }


  /**
   * INIT PART
   * ==============
   */
  // initForm() {
  //   this.AddEnseignantForm = this.formBuilder.group({
  //     categorie: new FormControl(null),
  //     nationalite: new FormControl(null),
  //     classe: new FormControl(null),
  //     indice: new FormControl(null),
  //     etatService: new FormControl(null),
  //     nbreEnfant: new FormControl(null),
  //     grade: new FormControl(null),
  //     discipline: new FormControl(null),
  //     numAmo: new FormControl(null),
  //     numNina: new FormControl(null),
  //     numInps: new FormControl(null),
  //     corps: new FormControl(null),
  //     niveau_etude: new FormControl(null),
  //     regime_mariage: new FormControl(null),
  //     dateDernierAvancement: new FormControl(null),
  //     echelon: new FormControl(null),
  //     statut: new FormControl(null),
  //     situation_matrimoniale: new FormControl(null),
  //     //departement
  //     departement: new FormControl(null),
  //
  //     service: new FormControl(null),
  //     division: new FormControl(null),
  //
  //     dateEmbauche: new FormControl(null),
  //
  //     // fonction
  //     specialite: new FormControl(null), // id
  //
  //     // User
  //     typeUtilisateur: new FormControl(this.typeListe === 'enseignant' ? "ENSEIGNANT" : 'VACATAIRE'),
  //     ville: new FormControl(null),
  //     rue: new FormControl(null),
  //     numMatricule: new FormControl(null),
  //     photo: new FormControl(null),
  //     telephone: new FormControl(null),
  //     lieuDeNaissance: new FormControl(null),
  //     nom: new FormControl(null),
  //     dateDeNaissance: new FormControl(null),
  //     quartier: new FormControl(null),
  //     genre: new FormControl(null),
  //     porte: new FormControl(null),
  //     prenom: new FormControl(null),
  //     email: new FormControl(null),
  //
  //   });
  //
  // }

  // initRequiredForm() {
  //   this.AddEnseignantForm = this.formBuilder.group({
  //     categorie: new FormControl(null, [Validators.required]),
  //     nationalite: new FormControl(null, [Validators.required]),
  //     classe: new FormControl(null, [Validators.required]),
  //     indice: new FormControl(null, [Validators.required]),
  //     etatService: new FormControl(null, [Validators.required]),
  //     nbreEnfant: new FormControl(null, [Validators.required]),
  //     grade: new FormControl(null, [Validators.required]),
  //     discipline: new FormControl(null, [Validators.required]),
  //     numAmo: new FormControl(null),
  //     numNina: new FormControl(null),
  //     numInps: new FormControl(null),
  //     corps: new FormControl(null, [Validators.required]),
  //     niveau_etude: new FormControl(null, [Validators.required]),
  //     regime_mariage: new FormControl(null, [Validators.required]),
  //     dateDernierAvancement: new FormControl(null, [Validators.required]),
  //     echelon: new FormControl(null, [Validators.required]),
  //     statut: new FormControl(null, [Validators.required]),
  //     situation_matrimoniale: new FormControl(null, [Validators.required]),
  //     //departement
  //     departement: new FormControl(null, [Validators.required]),
  //
  //     service: new FormControl(null),
  //     division: new FormControl(null),
  //
  //     dateEmbauche: new FormControl(null, [Validators.required]),
  //
  //     // fonction
  //     specialite: new FormControl(null, [Validators.required]), // id
  //
  //     // User
  //     typeUtilisateur: new FormControl(this.typeListe === 'enseignant' ? "ENSEIGNANT" : 'VACATAIRE'),
  //     ville: new FormControl(null, [Validators.required]),
  //     rue: new FormControl(null),
  //     numMatricule: new FormControl(null, [Validators.required]),
  //     photo: new FormControl(null),
  //     telephone: new FormControl(null, [Validators.required]),
  //     lieuDeNaissance: new FormControl(null, [Validators.required]),
  //     nom: new FormControl(null, [Validators.required]),
  //     dateDeNaissance: new FormControl(null, [Validators.required]),
  //     quartier: new FormControl(null, [Validators.required]),
  //     genre: new FormControl(null, [Validators.required]),
  //     porte: new FormControl(null),
  //     prenom: new FormControl(null, [Validators.required]),
  //     email: new FormControl(null, [Validators.required]),
  //
  //   });
  //
  // }

  sepcialiteSelectEvent(item) {
    this.AddEnseignantForm.controls.specialite.setValue(item);
  }

  cancel(): void {
    this.route.navigate(['structure/' + this.user.structure.id + '/' + this.typeListe]);
  }

  newSpe: string = '';

  onSepcialiteChangeSearch(event) {
    this.newSpe = event
  }

  special_spinner: boolean = false;

  AddNewSpecialiteFontion(type) {
    this.special_spinner = true;
    const body = {
      nom: this.newSpe,
      type: type
    }
    this.spevialiteFonctionService.addSpecialiteFoction(body).subscribe((responseSpe) => {
      console.log("spécial ==> ", responseSpe);
      this.Specialites = [];
      this.special_spinner = false;
      this.getEnseignantSpecialites();
    }, error => {
      this.special_spinner = false;
      this.Specialites = [];
    })
  }


  // etatServiceSelectEvent(item) {
  //   // let itm = item;
  //   this.AddEnseignantForm.controls.etatService.setValue(item.nom.toString());
  //   this.AddPersonnelData.etatService = item.nom.toString();
  // }


  initForm(): void {

    console.log('this.typeListe => ', this.typeListe);
    
    this.infoFormGroup = this.formBuilder.group({
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
      situation_matrimoniale: [this.model.situation_matrimoniale, Validators.required],
      regime_mariage: [this.model.regime_mariage, Validators.required],
      nbreEnfant: [this.model.nbreEnfant, Validators.required],// -!!!

      dateEmbauche: [this.model.dateEmbauche, Validators.required],
      departement: [this.model.departement, Validators.required],
      etatService: [this.model.etatService,  Validators.required],
      niveau_etude: [this.model.niveau_etude, Validators.required],


      dateDernierAvancement: [this.model.dateDernierAvancement],
      grade: [this.model.grade],
      indice: [this.model.indice],

      corps: [this.model.corps],//-->
      specialiteFonction: [this.model.specialiteFonction],//--> // this.typeListe !== 'vacataires' ? Validators.required : null
      echelon: [this.model.echelon], //-->
      classe: [this.model.classe],//-->
      discipline: [this.model.discipline],//-->



      //Afficher
      numMatricule: [this.model.user.numMatricule], 
      service: [this.model.service],
      division: [this.model.division],// id
      categorie: [this.model.categorie],
      numNina: [this.model.numNina],
      numAmo: [this.model.numAmo],
      numInps: [this.model.numInps],

      nbreJourConge: [this.model.nbreJourConge],
      nbreJourPermission: [this.model.nbreJourPermission],
      anneeDeRetraite: [this.model.anneeDeRetraite],



      //departement




    });

  }


  subcribeFom(): void {
    if (!this.id_personnel) this.model = {...this.EnseignantInitModelData};

    this.initForm();
    // this.infoFormGroup.valueChanges.subscribe(values => this.model = <any>{...this.model, user: {...values}});
    // this.carriereFormGroup.valueChanges.subscribe(values => this.model = <any>{...this.model, ...values});

  }


  apply(): void {


    if (this.infoFormGroup.invalid || this.carriereFormGroup.invalid) return;


    this.model.user.typeUtilisateur = this.typeListe === "enseignants" ? "ENSEIGNANT" : "VACATAIRE";
    console.log({
      model: this.model
    });


    this.spinner.show();
    this.uploadLogo();

  }


  getPersonnelByID(id: number) {
    this.spinner.show();
    this.service.getPersonnelByID(id).subscribe((data) => {
      console.log("data.departement ", data.departement);
      this.DepSelect(data.departement.id);
      if(this.model.service) this.ServiceChange(data.service.id);

      this.model = {...this.fillEditForm(data)}

      this.initForm();
      this.spinner.hide();

      // this.model = data;
      // this.spinner.hide();
      //
      // this.model.dateDernierAvancement = new Date(data.dateDernierAvancement);
      // this.model.dateEmbauche = new Date(data.dateEmbauche);
      // this.model.departement_id = this.model.departement.id;
      // this.model.specialite = this.model.specialiteFonction.id;

      // this.fichierUrl = this.model.photo
      // console.log({getPersonnelByID: this.model});
      // this.subcribeFom();
      // this.GetDepartementServices(this.model.departement.id);
      // this.getUtils();

      // this.carriereFormGroup.controls.statut.setValue(this.model.statut);
      // this.carriereFormGroup.controls.nationalite.setValue(this.model.nationalite);
      // // this.carriereFormGroup.controls.corps.setValue(this.model.corps);
      // this.carriereFormGroup.controls.numMatricule.setValue(this.model.user.numMatricule);
      // this.carriereFormGroup.controls.specialite.setValue(this.model.specialiteFonction.id);
      // this.carriereFormGroup.controls.etatService.setValue(this.model.etatService);

    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message);
      console.log({error});
      this.spinner.hide();
    })
  }

  fillEditForm(data){
    this.fichierUrl = data.user.photo;
    console.log("=> ",this.fichierUrl );
    console.log("=>data: ",data );
    console.log("=>data.statut: ",data.statut );

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
      statut: data.statut.toString(),
      discipline: data.discipline, //- no
      grade: data.grade, //- no
      departement: data.departement.id,
      service: Util_fonction.checkIfNoTEmpty(data.service) ? data.service.id : null,
      division: Util_fonction.checkIfNoTEmpty(data.division) ? data.division.id : null,
      specialiteFonction: Util_fonction.checkIfNoTEmpty(data.specialiteFonction) ? data.specialiteFonction.id : null,
      user: {
        // typeUtilisateur: data.user.typeUtilisateur,
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
    const body = this.buildSendBody();
    console.log("body ::: => ", body);
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
        typeUtilisateur: this.typeListe === "enseignants" ? "ENSEIGNANT" : "VACATAIRE",
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


  compareWithId(f1, f2): boolean {
    return f1 && f2 && f1.id === f2.id;
  }


}
