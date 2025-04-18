import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MessageService, SelectItem} from "primeng/api";
import {Courrier, CourrierImpute} from "../../Courrier/courrier.model";
import {Files} from "../../files/files.model";
import {CourrierService} from "../../Courrier/courrier.service";
import {FilesService} from "../../files/files.service";
import {SpinnerService} from "../../spinner.service";
import {DialogImputationCourrierComponent} from "../../Courrier/courriers/dialog-imputation-courrier/dialog-imputation-courrier.component";
@Component({
  selector: 'app-conge-permission',
  templateUrl: './conge-permission..component.html',
  styleUrls: ['./conge-permission..component.css']
})
export class CongePermissionComponent implements OnInit {


  form: FormGroup;

  user:any;
  structure:any;
  statutCourriers=['ORDINAIRE','CONFIDENTIEL'];
  courriers: Courrier[];
  structureId:number;
  courrier: Courrier;

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

  displayedColumns: string[] = ['id', 'depart', 'arrivee', 'status','expediteur','object','destinateur','etat','fichier','action'];
  dataSource: MatTableDataSource<any>;


  paginator: MatPaginator;
  sort: MatSort;

  services:any;
  courrierImpute:CourrierImpute;



  constructor(
    public service: CourrierService,
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
    this.structure = JSON.parse(sessionStorage.getItem('user')).structure;
    console.log('id_structure', this.structureId);
    console.log('structure', this.structure);
    console.log('current user', this.user);
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



  initData(id: number) {
    this.selectedButton = 'all';
    this.loading = true;
    this.findAll(id);
    this.initService(id);
  }



  findAll(id:number) {
    this.formPanel = false;
    this.spinnerService.show();
    this.service.findAll(id).subscribe((response:any) => {
      this.spinnerService.hide();
      console.log("### findAll paginate ===>", response);
      this.courriers = response.content;
      this.totalRecords = this.courriers.length;
      this.dataSource = new MatTableDataSource(this.courriers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.spinnerService.hide();
      console.log("### findAll paginate ===>", error);
    });
  }

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log("### search value ===>>>",value);
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // return this.httpClient.get(`${baseUrl}?etat=ATTENTE&id_structure=${id}&page=${page}&size=${size}&typeCourrier=DEPART`);



  findCourriersBy(etat:string,typeCourrier:string,selectedButton?:string,page?, row?) {
    console.log("### findCourriersBy ###");
    console.log("### etat ===>>>",etat);
    console.log("### type ===>>>",typeCourrier);

    this.selectedButton = selectedButton === undefined ? "all":selectedButton;
    this.formPanel = false;
    row = row === undefined ? this.row : row;
    page = page === undefined ? this.page : page;

    this.spinnerService.show();

    this.service.findAllPage(this.structureId,etat,typeCourrier,page,row).subscribe((response:any) => {
      console.log("### DATA findCourriersBy ===>", response);
      this.spinnerService.hide();
      this.courriers = response.content;
      this.totalRecords = this.courriers.length;
      this.dataSource = new MatTableDataSource(this.courriers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.spinnerService.hide();
      console.log("### ERROR findCourriersBy ===>", error);
    });
  }



  selectCourrier(value: Courrier) {
    value.dateCorrespondance = new Date(value.dateCorrespondance[0], value.dateCorrespondance[1], value.dateCorrespondance[2]);
    value.dateArrivee = new Date(value.dateArrivee[0], value.dateArrivee[1], value.dateArrivee[2]);
    value.statut = value.statut.toUpperCase();
    this.courrier = value;
    console.log('this.courrier',this.courrier)
    this.initFormEntrant();
    this.formPanel=true;
  }

  imputerCourrier(courrier: Courrier) {
    const dialogRef = this.dialog.open(DialogImputationCourrierComponent, {
      width: '40%',
      data: {
        courrier,
        structureId:this.structureId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`result: ${result}`);
      this.initData(this.structureId);
    });

  }

  repondre(id:number) {
    console.log("id ====>>>", id);
    const structure = {id:this.structureId}
    this.service.repondreCourriersImputation(id,structure)
      .subscribe(
        (response:any)=> {
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.showSuccess('Courrier imputé',response)
        },error => {
          this.showError('Courrier imputé',error.error)
          console.log("edite error", error)
        }
      )
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
    this.service.saveCourriers(value,type)
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
          this.showError('Courrier '+ type==="arrivee" ? 'entrant':'sortant',"Ajout du courrier " + type==="arrivee" ? "entrant éffectué":"sortant éffectué")
        },error => {
          this.spinnerService.hide();
          this.showError('Courrier '+ type==="arrivee" ? 'entrant':'sortant',"Erreur d'enregistrement du courier " + type==="arrivee" ? "entrant":"sortant")
          this.showError('Courrier entrant',error.error)
          console.log("create error", error)
        }
      )
  }

  edite(id:number, value,type:string) {
    console.log("id ====>>>", id);
    console.log("edite ====>>>", value);
    value.id = id;
    value.structure_id = this.structureId;
    this.service.updateCourriers(id,value,type)
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
          this.showError('Courrier entrant',error.error)
          console.log("edite error", error)
        }
      )
  }

  uploadAdd(type:string) {


    this.courrier.etat = "ATTENTE";

    if(type==="arrivee"){
      this.courrier.destinateur = this.structure.name;
      this.courrier.type = "ARRIVE";
      this.courrier.dateDepart = this.courrier.dateArrivee;
    }

    if(type==="sortant"){
      // this.courrier.type = "DEPART";
      this.courrier.type = "ARRIVE";
    }

    console.log("ADD COURIER SORTANT",this.courrier)

    this.spinnerService.show();

    if(!this.selectedFiles || this.selectedFiles.length==0) {
      this.save(this.courrier,type);
    }else {
      this.filesService.uploadPromises(this.selectedFiles)
        .then(
          response => {
            // this.showError('Courrier '+ type==="arrivee" ? 'entrant':'sortant',"Erreur d'enregistrement du courier " + type==="arrivee" ? "entrant":"sortant")
            console.log('uploadAdd upload event', response);
            this.spinnerService.hide();
          }, (errors:Files[]) => {
            console.log('uploadAdd upload error', errors);

            if(errors && errors.length>0){
              this.courrier.fichiers_id = errors.map(file => file.id);
            }

            this.save(this.courrier,type);
          }
        );
    }

  }

  uploadUpdate(type:string) {

    this.courrier.etat = "ATTENTE";

    if(type==="arrivee"){
      this.courrier.destinateur = this.structure.name;
      this.courrier.type = "ARRIVE";
      this.courrier.dateDepart = this.courrier.dateArrivee;
    }

    if(type==="sortant"){
      // this.courrier.type = "DEPART";
      this.courrier.type = "ARRIVE";
    }
    console.log("UPDATE COURIER SORTANT",this.courrier)

    this.spinnerService.show();

    if(!this.selectedFiles || this.selectedFiles.length==0) {
      this.edite(this.courrier.id,this.courrier,type);
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
              this.courrier.fichiers_id = errors.map((file)=>file.id);
            }

            console.log('uploadUpdate upload courrier', this.courrier);
            this.edite(this.courrier.id,this.courrier,type);
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
    this.selectedFiles.push(...event.target.files)
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
    this.courrier.statut = this.courrier.statut.toUpperCase();
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
  }


  setService(value: any) {
    console.log('setService',value)
  }



  initService(id:number) {
    this.service.getServiceByStructureId(id)
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
    console.log('this.save',value);
    this.spinnerService.show();
    this.service.saveImputations(value)
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

  showForm(value:Courrier,formPanel:boolean,typePanel:string) {

    this.formPanel = formPanel;
    this.typePanel = typePanel;
    this.courrier = value;

    console.log("formPanel ===>>>", formPanel);
    console.log("typePanel ===>>>", typePanel);
    console.log("courrier ===>>>", this.courrier);

    if(typePanel==='imputation') {
      this.initFormImputation();
    }

    if(typePanel==='entrant') {
      this.initFormEntrant();
    }

    if(typePanel==='sortant') {
      this.initFormEntrant();
    }

  }

}



