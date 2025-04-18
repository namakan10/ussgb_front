import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService, SelectItem} from "primeng/api";
import {CourrierService} from "../courrier.service";
import {Courrier, CourrierImpute} from "../courrier.model";
import {DialogImputationCourrierComponent} from "./dialog-imputation-courrier/dialog-imputation-courrier.component";
import {FilesService} from "../../files/files.service";
import {Files} from "../../files/files.model";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {SpinnerService} from "../../spinner.service";
import {ViewEncapsulation} from "@angular/cli/lib/config/schema";
import {REST_URL} from "../../../REST_URL";

@Component({
  selector: 'app-courrier-entrant',
  templateUrl: './courriers.component.html',
  styleUrls: ['./courriers.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CourriersComponent implements OnInit,OnDestroy {


  form: FormGroup;

  user:any;
  service:any;
  structure:any;
  statutCourriers=['ORDINAIRE','CONFIDENTIEL'];
  courriers: Courrier[];
  structureId:number;
  courrier: any;
  roles: string[]=[];

  selectedButton = 'all'

  sortOptions: SelectItem[];

  sortKey: string;

  sortField: string;
  selectedFiles: File[] = [];

  courrierfiles: Files[] = [];

  sortOrder: number;
  formPanel = false;
  typePanel: string;
  loading = false;

  totalRecords: number;
  pageSize: number;

  row = 20;
  page = 0;
  searchControl = new FormControl();
  etat:string;
  typeCourrier:string;

  displayedColumns: string[] = ['id', 'depart', 'arrivee','numeroCourrier', 'status','expediteur','object','destinateur','etat','fichier','action'];
  dataSource: MatTableDataSource<any>;


 paginator: MatPaginator;
 sort: MatSort;

  services:any;
  courrierImpute:any;



  constructor(
    public courrierService: CourrierService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private filesService: FilesService,
    private spinnerService: SpinnerService,
    ) {

    this.structureId = +this.route.snapshot.paramMap.get("id");
    this.user = JSON.parse(sessionStorage.getItem('user')).users;
    if(this.user) {
      this.roles = this.user.roles.map(x => x.nom);
    }
    this.service = this.user.personnel && this.user.personnel.service ? this.user.personnel.service:null;

    this.structure = JSON.parse(sessionStorage.getItem('user')).structure;

    console.log('id_structure', this.structureId);
    console.log('structure', this.structure);
    console.log('current user', this.user);
    console.log('current user roles', this.roles);
    console.log('current service', this.service);
    this.initData(this.structureId);
  }

  ngOnInit() {
    this.sortOptions = [
      {label: 'Numero courrier', value: 'numeroCourrier'},
      {label: 'Etat', value: 'etat'},
      {label: 'Objet', value: 'objet'},
      {label: 'Statut', value: 'statut'},
      {label: 'Expediteur', value: 'expediteur'},
    ];

    this.fb = new FormBuilder();
    this.initModel();
    this.initFormEntrant();
    this.initFormSortant();
    this.initFormImputation();
  }

  ngOnDestroy(): void {
    this.spinnerService.hide();
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }


  private initModel() {
    this.courrier=new Courrier();
    this.courrierImpute = new CourrierImpute();
  }


  initFormEntrant(){
    this.buildFormEntrant();
    this.subscribeFormEntrant();
  }

  protected buildFormEntrant() {
    this.form = this.fb.group({
      numeroCourrier: [this.courrier.numeroCourrier, Validators.required],
      dateArrivee: [this.courrier.dateArrivee, Validators.required],
      // dateCorrespondance: [this.courrier.dateCorrespondance, Validators.required],
      statut: [this.courrier.statut, Validators.required],
      object: [this.courrier.object, Validators.required],
      expediteur: [this.courrier.expediteur, Validators.required],
      //structure: [this.courrier.structure, Validators.required],

    });
  }

  protected subscribeFormEntrant() {
    if (!this.form) {
      this.buildFormEntrant();
    }
    this.form.get('numeroCourrier').valueChanges.subscribe(value => this.courrier.numeroCourrier = value);
    this.form.get('dateArrivee').valueChanges.subscribe(value => this.courrier.dateArrivee = value);
    // this.form.get('dateCorrespondance').valueChanges.subscribe(value => this.courrier.dateCorrespondance = value);
    this.form.get('statut').valueChanges.subscribe(value => this.courrier.statut = value);
    this.form.get('object').valueChanges.subscribe(value => this.courrier.object = value);
    this.form.get('expediteur').valueChanges.subscribe(value => this.courrier.expediteur = value);
   }

  initFormSortant(){
    this.buildFormSortant();
    this.subscribeFormSortant();
  }

  protected buildFormSortant() {
    this.form = this.fb.group({
      numeroCourrier: [this.courrier.numeroCourrier, Validators.required],
      dateDepart: [this.courrier.dateDepart, Validators.required],
      expediteur: [this.courrier.expediteur, Validators.required],
      object: [this.courrier.object, Validators.required],
      statut: [this.courrier.statut, Validators.required],
      destinateur: [this.courrier.destinateur, Validators.required],
      //structure: [this.courrier.structure, Validators.required],
    });
  }

  protected subscribeFormSortant() {
    if (!this.form) {
      this.buildFormSortant();
    }
    this.form.get('numeroCourrier').valueChanges.subscribe(value => this.courrier.numeroCourrier = value);
    this.form.get('dateDepart').valueChanges.subscribe(value => this.courrier.dateDepart = value);
    this.form.get('expediteur').valueChanges.subscribe(value => this.courrier.expediteur = value);
    this.form.get('object').valueChanges.subscribe(value => this.courrier.object = value);
    this.form.get('statut').valueChanges.subscribe(value => this.courrier.statut = value);
    this.form.get('destinateur').valueChanges.subscribe(value => this.courrier.destinateur = value);
  }




  initFormRepondre(){
    this.buildFormRepondre();
    this.subscribeFormRepondre();
  }

  protected buildFormRepondre() {
    this.form = this.fb.group({
      numeroCourrier: [this.courrier.numeroCourrier, Validators.required],
      dateDepart: [this.courrier.dateDepart, Validators.required],
      dateArrivee: [this.courrier.dateArrivee, Validators.required],
      expediteur: [this.courrier.expediteur, Validators.required],
      object: [this.courrier.object, Validators.required],
/*
      courrierARepondre: [this.courrier.courrierARepondre, Validators.required],
*/
      statut: [this.courrier.statut, Validators.required],
      destinateur: [this.courrier.destinateur, Validators.required],
    });
  }

  protected subscribeFormRepondre() {
    if (!this.form) {
      this.buildFormSortant();
    }
    this.form.get('numeroCourrier').valueChanges.subscribe(value => this.courrier.numeroCourrier = value);
    this.form.get('dateDepart').valueChanges.subscribe(value => this.courrier.dateDepart = value);
    this.form.get('dateArrivee').valueChanges.subscribe(value => this.courrier.dateArrivee = value);
    this.form.get('expediteur').valueChanges.subscribe(value => this.courrier.expediteur = value);
    this.form.get('object').valueChanges.subscribe(value => this.courrier.object = value);
    this.form.get('statut').valueChanges.subscribe(value => this.courrier.statut = value);
    this.form.get('destinateur').valueChanges.subscribe(value => this.courrier.destinateur = value);
/*
    this.form.get('courrierARepondre').valueChanges.subscribe(value => this.courrier.courrierARepondre = value);
*/
  }



   initData(id: number) {
    this.selectedButton = 'all';
    this.loading = true;
    this.findAll(id);
    this.initService(id);
  }



  findAll(id:number) {
    this.formPanel = false;
    this.spinnerService.show();
    this.courrierService.findAll(id).subscribe((response:any) => {
      this.spinnerService.hide();
      //this.courriers = response.content;
      const values = response.content;

      this.courriers = values.filter((value => ((!value.imputation || !this.service ) || (value.imputation.services && this.asImputer(value.imputation.services)))));

      console.log("### this.courriers ===>", this.courriers);
      this.totalRecords = this.courriers.length;
      this.dataSource = new MatTableDataSource(this.courriers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.spinnerService.hide();
      console.log("### findAll paginate ===>", error);
    });
  }

  search(filterValue:string) {
    console.log("### search value ===>>>",filterValue);
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  findCourriersBy(etat:string,typeCourrier:string,selectedButton?:string,page?, row?) {
    console.log("### findCourriersBy ###");
    console.log("### etat ===>>>",etat);
    console.log("### type ===>>>",typeCourrier);

    this.selectedButton = selectedButton === undefined ? "all":selectedButton;
    this.formPanel = false;
    row = row === undefined ? this.row : row;
    page = page === undefined ? this.page : page;

    this.spinnerService.show();

    this.courrierService.findAllPage(this.structureId,etat,typeCourrier,page,row).subscribe((response:any) => {
      this.spinnerService.hide();
      const values = response.content;
      this.courriers = values.filter((value => ((!value.imputation || !this.service ) || (value.imputation.services && this.asImputer(value.imputation.services)))));
      //this.courriers = values.filter((value => value.etat===etat));
     // this.courriers = values.filter((value => typeCourrier !=="DEPART" ? value.etat===etat:value.etat==="TRAITE"));
      console.log("### this.courriers ===>", this.courriers);
     // this.courriers = response.content;

      this.totalRecords = this.courriers.length;
      this.dataSource = new MatTableDataSource(this.courriers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.spinnerService.hide();
      console.log("### ERROR findCourriersBy ===>", error);
    });
  }

  asImputer(services: any[]): boolean {
    return services.map((s)=> s.id).includes(this.service.id);
  }


  selectCourrier(value: Courrier) {
    value.dateCorrespondance = new Date(value.dateCorrespondance[0], value.dateCorrespondance[1], value.dateCorrespondance[2]);
    value.dateArrivee = new Date(value.dateArrivee[0], value.dateArrivee[1], value.dateArrivee[2]);
    value.statut = value.statut.toUpperCase();
    this.courrier = value;
     console.log('this.courrier',this.courrier)
     this.initFormRepondre();
     this.formPanel=true;
  }

  imputerOrTraiteCourrier(courrier: Courrier) {
      const dialogRef = this.dialog.open(DialogImputationCourrierComponent, {
        width: '40%',
        data: {
          courrier,
          structureId:this.structureId
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`imputerCourrier result: ${result}`);
        if(result){
          if(result.type=='Imputer'){
            this.saveImputation(result.data);
          }

          if(result.type=='Traiter'){
            courrier.statut="TRAITE"
            this.editeReponse(courrier.id,courrier);
          }
        }
        this.initData(this.structureId);
      });

  }


  repondre(value:any) {
    console.log("reponse ====>>>", value);
    const structure = {id:this.structureId}
    this.courrier=value;

    this.courrier.dateCorrespondance = new Date(value.dateCorrespondance);
    this.courrier.dateDepart = new Date(value.dateDepart);
    this.courrier.dateArrivee = new Date(value.dateArrivee);
    this.courrier.statut = value.statut.toUpperCase();

    this.typePanel="reponse";
    this.formPanel=true;
    this.initFormRepondre();
    this.formPanel=true;
  }


  showSuccess(title:string,msg: string) {
    this.messageService.add({severity:'success', summary: title, detail:msg});
  }

  showInfo(title:string,msg: string) {
    this.messageService.add({severity:'info',summary: title, detail:msg});
  }

  showWarn(title:string,msg: string) {
    this.messageService.add({severity:'warn', summary: title, detail:msg});
  }

  showError(title:string,msg: string) {
    this.messageService.add({severity:'error', summary: title, detail:msg});
  }

  loadData($event: any) {
  }

  newEntrantCourrier() {
    this.initModel();
    this.initFormEntrant();
    this.typePanel = "entrant";
    this.formPanel = true;
  }

  newSortantCourrier() {
    this.initModel();
    this.initFormSortant();
    this.typePanel = "sortant";
    this.formPanel = true;
  }

  compareById(ob1, ob2) {
    return ob1.id === ob2.id;
  }



  applyAnnuler() {
    this.initModel();
    this.formPanel = false;
    this.typePanel = null;
    this.selectedFiles = null;
    this.initData(this.structureId);
  }


  save(value,type:string) {
    value.structure_id = this.structureId;
    console.log("add ====>>>", value);
    this.courrierService.saveCourriers(value,type)
      .subscribe(
        (response:any)=> {
          this.spinnerService.hide();
          console.log('Courrier entrant',response)
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.typePanel = null;
          this.selectedFiles = null;
          this.showSuccess('Courrier '+ type==="arrivee" ? 'entrant':'sortant',"Ajout du courrier " + type==="arrivee" ? "entrant éffectué":"sortant éffectué")
        },error => {
          this.spinnerService.hide();
          this.showError('Courrier '+ type==="arrivee" ? 'entrant':'sortant',"Erreur d'enregistrement du courier " + type==="arrivee" ? "entrant":"sortant")
          console.log("create error", error)
        }
      )
  }

  saveReponse(id:number,value:any) {
    value.structure_id = this.structureId;
    value.repondre = true;
    value.type="ARRIVE";
    value.etat="ATTENTE";

    console.log("saveReponse ====>>>", value);
    this.courrierService.repondreCourriers(id,value)
      .subscribe(
        (response:any)=> {
          this.spinnerService.hide();
          console.log('Courrier reponse',response)
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.typePanel = null;
          this.selectedFiles = null;
          this.showSuccess("Courrier","Courrier repondu avec éffectué");
        },error => {
          this.spinnerService.hide();
          this.showError("Courrier",error.error && error.error.message ? error.error.message : "Impossible de repondre cet Ccourrier");
          console.log("reponse error", error)
        }
      )
  }

  editeReponse(id:number,value:Courrier) {
    value.structure_id = this.structureId;
    console.log("add ====>>>", value);
    this.courrierService.repondreCourriers(id,value)
      .subscribe(
        (response:any)=> {
          this.spinnerService.hide();
          console.log('Courrier reponse',response)
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.typePanel = null;
          this.selectedFiles = null;
          this.showSuccess("Courrier","Courrier repondu avec éffectué");
        },error => {
          this.spinnerService.hide();
          this.showError("Courrier","Impossible de repondre cet courrier");
          console.log("reponse error", error)
        }
      )
  }


  delete(value:Courrier) {
    value.structure_id = this.structureId;
    console.log("delete ====>>>", value);
    this.courrierService.delete(value.id)
      .subscribe(
        (response:any)=> {
          this.spinnerService.hide();
          console.log('Courrier supprime',response)
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.typePanel = null;
          this.selectedFiles = null;
          this.showSuccess("Courrier","Courrier supprimer avec éffectué");
        },error => {
          this.spinnerService.hide();
          this.showError("Courrier","Impossible de supprimer cet Courrier");
          console.log("reponse error", error)
        }
      )
  }

  edite(id:number, value,type:string) {
    console.log("id ====>>>", id);
    console.log("edite ====>>>", value);
    value.id = id;
    value.structure_id = this.structureId;
    this.courrierService.updateCourriers(id,value,type)
      .subscribe(
        (response:any)=> {
          this.spinnerService.hide();
          console.log("edite ue", response)
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.typePanel = null;
          this.selectedFiles = null;
          this.showSuccess('Courrier '+ type==="arrivee" ? 'entrant':'sortant',"Modification du courier " + type==="arrivee" ? "entrant éffectué":"sortant éffectué")
        },error => {
          this.showError('Courrier '+ type==="arrivee" ? 'entrant':'sortant',"Erreur de modification du courier " + type==="arrivee" ? "entrant":"sortant")
          this.spinnerService.hide();
          console.log("edite error", error)
        }
      )
  }

  uploadAdd(type:string,data) {

    data.etat = "ATTENTE";

    if(type==="arrivee"){
      data.destinateur = this.structure.name;
      data.type = "ARRIVE";
      data.dateDepart = this.courrier.dateArrivee;
    }

    if(type==="sortant"){
      data.type = "ARRIVE";
    }

    console.log("ADD COURIER SORTANT",this.courrier)

    this.spinnerService.show();

    if(!this.selectedFiles || this.selectedFiles.length==0) {
      this.typePanel==="reponse" ? this.saveReponse(this.courrier.id,data):this.save(data,type);
    }else {
      this.filesService.uploadPromises(this.selectedFiles)
        .then(
          response => {
            console.log('uploadAdd upload event', response);
            this.spinnerService.hide();
          }, (errors:Files[]) => {
            console.log('uploadAdd upload error', errors);

            if(errors && errors.length>0){
              data.fichiers_id = errors.map(file => file.id);
            }
            this.typePanel==="reponse" ? this.saveReponse(this.courrier.id,data):this.save(data,type);
          }
        );
    }

  }

  uploadUpdate(type:string,data) {

    data.etat = "ATTENTE";

    if(type==="arrivee"){
      data.destinateur = this.structure.name;
      data.type = "ARRIVE";
      data.dateDepart = this.courrier.dateArrivee;
    }

    if(type==="sortant"){
      data.type = "ARRIVE";
    }
    console.log("UPDATE COURIER SORTANT",data)

    this.spinnerService.show();

    if(!this.selectedFiles || this.selectedFiles.length==0) {

      this.typePanel==="reponse" ? this.editeReponse(this.courrier.id,data):this.edite(this.courrier.id,this.courrier,type);

    }else {
      this.filesService.uploadPromises(this.selectedFiles)
        .then(
          response => {
            // this.showError('Courrier '+ type==="arrivee" ? 'entrant':'sortant',"Erreur de modification du courier " + type==="arrivee" ? "entrant":"sortant")
            this.spinnerService.hide();
            console.log('uploadUpdate upload event', response);
          }, (errors:Files[]) => {
            console.log('uploadUpdate upload error', errors);

            if(errors && errors.length>0){
              data.fichiers_id = errors.map((file)=>file.id);
            }

            console.log('uploadUpdate upload courrier', data);
            this.typePanel==="reponse" ? this.editeReponse(this.courrier.id,data):this.edite(this.courrier.id,this.courrier,type);
          }
        );
    }

  }


  uploadFile(file:File){
    console.log("FILE", file);
    this.filesService.onUpload(file)
      .subscribe(
        response=> {
          console.log("SUCCES UPLOAD FILE", response);
        },error => {
          console.log("ERROR UPLOAD FILE", file);
        }
      )
  }


  onFileChanged(event) {
    this.selectedFiles = [];
    this.selectedFiles.push(...event.target.files);
    console.log('upload event', event);
    console.log('upload this.selectedFiles', this.selectedFiles);
  }


  hasRoleCourrier() {
    let hasRole = false;

    console.log('this.user[users]', this.user)
    if (this.user) {
      this.user.roles.forEach(item => {
        if (item.nom === 'ROLE_COURRIER') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }



  /// IPUTATION

  initFormImputation(){
    this.buildFormImputation();
    this.subscribeFormImputation();
  }

  protected buildFormImputation() {
    this.courrier.statut = this.courrier.statut;
    this.form = this.fb.group({
      services_id: [this.courrierImpute.services_id,Validators.required],
      detail: [this.courrierImpute.detail],
      rapport: [this.courrierImpute.rapport],
      reprendre: [this.courrierImpute.reprendre],
      suiteDonnee: [this.courrierImpute.suiteDonnee],
      exploitation: [this.courrierImpute.exploitation],
      instance: [this.courrierImpute.instance],
      projetDeResponse: [this.courrierImpute.projetDeResponse],
      information: [this.courrierImpute.information],
      etudeAvis: [this.courrierImpute.etudeAvis],
      suivre: [this.courrierImpute.suivre],
      disposition: [this.courrierImpute.disposition],
      remise: [this.courrierImpute.remise],
      parler: [this.courrierImpute.parler],
      urgent: [this.courrierImpute.urgent],
      photoCopier: [this.courrierImpute.photoCopier],
      classe: [this.courrierImpute.classe],
      attribution: [this.courrierImpute.attribution],
      diffusion: [this.courrierImpute.diffusion],
      observation: [this.courrierImpute.observation],
    });
  }

  protected subscribeFormImputation() {
    if (!this.form) {
      this.buildFormImputation();
    }
    this.form.get('detail').valueChanges.subscribe(value => this.courrierImpute.detail = value);;
    this.form.get('diffusion').valueChanges.subscribe(value => this.courrierImpute.diffusion = value);;
    this.form.get('classe').valueChanges.subscribe(value => this.courrierImpute.classe = value);;
    this.form.get('attribution').valueChanges.subscribe(value => this.courrierImpute.attribution = value);;
    this.form.get('photoCopier').valueChanges.subscribe(value => this.courrierImpute.photoCopier = value);;
    this.form.get('urgent').valueChanges.subscribe(value => this.courrierImpute.urgent = value);;
    this.form.get('remise').valueChanges.subscribe(value => this.courrierImpute.remise = value);;
    this.form.get('parler').valueChanges.subscribe(value => this.courrierImpute.parler = value);;
    this.form.get('disposition').valueChanges.subscribe(value => this.courrierImpute.disposition = value);;
    this.form.get('suivre').valueChanges.subscribe(value => this.courrierImpute.suivre = value);;
    this.form.get('etudeAvis').valueChanges.subscribe(value => this.courrierImpute.etudeAvis = value);;
    this.form.get('services_id').valueChanges.subscribe(value => this.courrierImpute.services_id = value);;
    this.form.get('reprendre').valueChanges.subscribe(value => this.courrierImpute.reprendre = value);;
    this.form.get('projetDeResponse').valueChanges.subscribe(value => this.courrierImpute.projetDeResponse = value);;
    this.form.get('information').valueChanges.subscribe(value => this.courrierImpute.information = value);;
    this.form.get('instance').valueChanges.subscribe(value => this.courrierImpute.instance = value);;
    this.form.get('suiteDonnee').valueChanges.subscribe(value => this.courrierImpute.suiteDonnee = value);;
    this.form.get('exploitation').valueChanges.subscribe(value => this.courrierImpute.exploitation = value);;
    this.form.get('rapport').valueChanges.subscribe(value => this.courrierImpute.rapport = value);;
    this.form.get('observation').valueChanges.subscribe(value => this.courrierImpute.observation = value);;
  }


  initService(id:number) {
    this.courrierService.getServiceByStructureId(id)
      .subscribe(
        (response:[any])=>{
          this.services = response;
          console.log('this.services',this.services)
        },error => {
          console.log('this.services error',error)
          this.showError('Courrier par structure',error.error);
        }
      )
  }

  saveImputation(value) {
    value.courrier_id = this.courrier.id;
    value.date = new Date;
    console.log('this.save',value);
    this.spinnerService.show();
    this.courrierService.saveImputations(value)
      .subscribe(
        (response:any)=>{
          this.showSuccess('Imputation courrier', response);
          this.initModel();
          this.spinnerService.hide();
          this.initData(this.structureId);
        },error => {
          this.spinnerService.hide();
          console.log('Imputation courrier error',error)
          this.showError('Imputation courrier', error.error.errors ? error.error.errors:error.error  );
        }
      )
  }


  saveTraite() {
    this.courrier.etat = "TRAITE";
    const type = this.courrier.type=="ARRIVE" ? "arrivee":"sortant"
    console.log('traite',this.courrier);

    const value={
      numCourrierRepondre: this.courrier.numeroCourrier,
      numeroCourrier: this.courrier.numeroCourrier,
      dateArrivee: this.courrier.dateArrivee,
      dateDepart: this.courrier.dateDepart,
      destinateur: this.courrier.destinateur,
      etat: "TRAITE",
      expediteur: this.courrier.expediteur,
      fichiers_id:this.courrier.fichiers_id,
      object: this.courrier.object,
      statut: this.courrier.statut,
      structure_id: this.structureId,
      type: this.courrier.type,
      id: this.courrier.id
    }

    console.log('value',value);

   // console.log('URL',`${REST_URL+'/courriers'}/${this.courrier.id}/repondre`);

    this.spinnerService.show();
    this.courrierService.updateCourier(this.courrier.id,type,value)
   // this.courrierService.updateCourier(this.courrier.id,value)
      .subscribe(
        (response:any)=>{
          console.log("response",response)
          this.showSuccess('Courrier Traite', "Courrier traité avec succès");
          this.initModel();
          this.spinnerService.hide();
          this.initData(this.structureId);
        },error => {
          this.spinnerService.hide();
          console.log('Traite courrier error',error)
          this.showError('Traitement courrier', error.error.message ? error.error.message:error.error  );
        }
      )
  }

  showForm(value:any,formPanel:boolean,typePanel:string) {

    this.formPanel = formPanel;
    this.typePanel = typePanel;
    this.courrier = value;
    this.courrier.dateDepart = new Date(value.dateDepart);
    this.courrier.dateArrivee = new Date(value.dateArrivee);
    this.courrier.dateCorrespondance = new Date(value.dateCorrespondance);

    if(typePanel==='imputation') {
      if(value.imputation) {
        this.courrierImpute = value.imputation;
        this.courrierImpute.services_id = value.imputation.services.map(s=>s.id);
      }
      this.initFormImputation();
    }



    if(typePanel==='entrant') {
      this.initFormEntrant();
    }

    if(typePanel==='sortant') {
      this.initFormEntrant();
    }

  }


  compareFn(t1: any, t2: any): boolean {
    return t1 && t2 ? t1.id === t2.id : t1 === t2;
  }


  hasRoleEnregistrerCourriersEntrants() {
    return this.hasRole(["ROLE_COURIER_ENTRANT","ROLE_ADMIN"]);
  }

  hasRoleListeCourriersEntrants() {
    return this.hasRole(["ROLE_COURIER_ENTRANT","ROLE_ADMIN"]);
  }

  hasRoleEnregistrerCourriersSortants() {
    return this.hasRole(["ROLE_COURIER_SORTANT","ROLE_SECRETAIRE_SEGAL","ROLE_ADMIN"]);
  }

  hasRoleListeCourriersSortants() {
    return this.hasRole(["ROLE_COURIER_SORTANT","ROLE_SECRETAIRE_SEGAL","ROLE_ADMIN"]);
  }

  hasRoleListeTousCourriers() {
    return this.hasRole(["ROLE_SEGAL","ROLE_SP","ROLE_ADMIN"]);
  }

  hasRoleCourriersImputes() {
    return this.hasRole(["ROLE_SEGAL","ROLE_SP","ROLE_ADMIN"]);
  }

  hasRoleCourriersTraites() {
    return this.hasRole(["ROLE_TRAITEMENT_COURRIER","ROLE_GRH","ROLE_SEGAL","ROLE_SP","ROLE_ADMIN"]);
  }

  hasRoleCourriersRepondus() {
    return this.hasRole(["ROLE_COURRIER","ROLE_COURIER_SORTANT","ROLE_SEGAL","ROLE_SECRETAIRE_SEGAL","ROLE_ADMIN"])
  }

  hasRole(roles:string[]): boolean {
    return roles.some(r => this.roles.includes(r));
  }


}



