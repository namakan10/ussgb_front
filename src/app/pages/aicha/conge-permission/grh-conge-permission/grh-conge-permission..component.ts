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
import {FilesService} from "../../files/files.service";
import {SpinnerService} from "../../spinner.service";
import {CongePermissionModel} from "../conge-permission.model";
import {CongePermissionService} from "../conge-permission.service";
import {MatSelectChange} from "@angular/material/select";
@Component({
  selector: 'app-grh-conge-permission',
  templateUrl: './grh-conge-permission..component.html',
  styleUrls: ['./grh-conge-permission..component.css']
})
export class GrhCongePermissionComponent implements OnInit {


  form: FormGroup;

  user:any;
  structure:any;

  congePermissions: CongePermissionModel[];
  structureId:number;
  congePermission: CongePermissionModel;

  selectedButton = 'all'

  sortKey: string;

  sortField: string;
  selectedFiles: File[] = [];

  valuefiles: Files[] = [];

  users: any[];
  roles: string[]=[];

  sortOrder: number;
  formPanel = false;

  totalRecords: number;
  pageSize: number;

  row = 20;
  page = 0;
  searchControl = new FormControl();
  etat:string;
  typeCourrier:string;

  displayedColumns: string[] = ['id', 'dateDepart', 'dateRetour', 'statut','motifDemande','motifRejet','type','fichier','action'];
  dataSource: MatTableDataSource<any>;


  paginator: MatPaginator;
  sort: MatSort;


   congePermissionTypes: string[] = ['PERMISSION', 'CONGE_ANNUEL', 'MALADIE_DE_COURTE_DUREE', 'MALADIE_DE_LONGUE_DUREE', 'CONGE_MATERNITE', 'CONGE_EXPECTATIVE', 'CONGE_INTERET_PUBLIC', 'PELERINAGE', 'VEUVAGE', 'BT', 'DUTS', 'MAITRISE', 'DEA_DESS', 'DOCTORAT', 'ACCOMPLISSEMENT_DE_PERFECTION', 'MARIAGE_DU_FONCTIONNAIRE', 'NAISSANCE_ENFANT', 'BAPTEME_ENFANT', 'MARIAGE_EN_FAMILLE', 'DECES_D_UN_CONJOINT', 'DECES_EN_FAMILLE', 'MALADIE_HOSPITALISTION_EVACUATION_D_UN_MEMBRE_DE_LA_FAMILLE', 'MALADIE_NOURRISSON_MOINS_2_ANS'];
   congePermissionStatuts: string[] = ['ACCEPTER', 'REFUSER', 'EN_ATTENTE_DE_TRAITEMENT'];



  constructor(
    public service: CongePermissionService,
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
    this.structure = JSON.parse(sessionStorage.getItem('user')).structure;
    console.log('id_structure', this.structureId);
    console.log('structure', this.structure);
    console.log('current user', this.user);
    this.initData(this.structureId);
  }

  ngOnInit() {
    this.fb = new FormBuilder();
    this.initModel();
    this.initForm();
  }



  private initModel() {
    this.congePermission=new CongePermissionModel();
  }


  initForm(){
    this.buildForm();
    this.subscribeForm();
  }

  protected buildForm() {
    this.form = this.fb.group({
      demandeur_id: [this.congePermission.demandeur_id, Validators.required],
      dateDepart: [this.congePermission.dateDepart, Validators.required],
      dateRetour: [this.congePermission.dateRetour, Validators.required],
      statut: [this.congePermission.statut ? this.congePermission.statut:'EN_ATTENTE_DE_TRAITEMENT', Validators.required],
      type: [this.congePermission.type, Validators.required],
      motifDemande: [this.congePermission.motifDemande],
      motifRejet: [this.congePermission.motifRejet],
    });
  }

  protected subscribeForm() {
    if (!this.form) {
      this.buildForm();
    }
    this.form.get('demandeur_id').valueChanges.subscribe(value => this.congePermission.demandeur_id = value);
    this.form.get('dateDepart').valueChanges.subscribe(value => this.congePermission.dateDepart = value);
    this.form.get('dateRetour').valueChanges.subscribe(value => this.congePermission.dateRetour = value);
    this.form.get('statut').valueChanges.subscribe(value => this.congePermission.statut = value);
    this.form.get('type').valueChanges.subscribe(value => this.congePermission.type = value);
    this.form.get('motifDemande').valueChanges.subscribe(value => this.congePermission.motifDemande = value);
    this.form.get('motifRejet').valueChanges.subscribe(value => this.congePermission.motifRejet = value);
  }



  initData(id: number) {
    this.selectedButton = 'all';
    this.findAll(id);
    this.initUsers(id);
  }




  findAll(id:number) {
    this.formPanel = false;
    this.spinnerService.show();
    this.service.findAll(id).subscribe((response:any) => {
      this.spinnerService.hide();
      console.log("### findAll paginate ===>", response);
      this.congePermissions = response.content;
      this.totalRecords = this.congePermissions.length;
      this.dataSource = new MatTableDataSource(this.congePermissions);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.spinnerService.hide();
      console.log("### findAll paginate ===>", error);
    });
  }

  initUsers(id:number){
    this.service.getPersonnelsd(id)
      .subscribe(
        (data:any)=>{
          console.log("initUsers data", data)
          this.users = data.content;
          // this.users = data.map((u)=>u.user);
          console.log("initUsers", this.users)
        },error => {
          console.log("ERROR TYPE AbsenceS", error);
        }
      );
  }



  search(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log("### search value ===>>>",value);
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }




  findAllBy(type:string,statut:string,page?, row?) {
    console.log("### findCourriersBy ###");
    console.log("### type ===>>>",type);
    console.log("### statut ===>>>",statut);

    // this.selectedButton = selectedButton === undefined ? "all":selectedButton;
    this.formPanel = false;
    row = row === undefined ? this.row : row;
    page = page === undefined ? this.page : page;

    this.spinnerService.show();

    this.service.findAllBy(this.structureId,type,statut,page,row).subscribe((response:any) => {
      console.log("### DATA findCourriersBy ===>", response);
      this.spinnerService.hide();
      this.congePermissions = response.content;
      this.totalRecords = this.congePermissions.length;
      this.dataSource = new MatTableDataSource(this.congePermissions);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.spinnerService.hide();
      console.log("### ERROR findAllBy ===>", error);
    });
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



  newCongePermission() {
    this.initModel();
    this.initForm();
    this.formPanel = true;
  }






  applyAnnuler() {
    this.initModel();
    this.formPanel = false;
    this.selectedFiles = null;
    this.initData(this.structureId);
  }


  save(value) {
    value.structure_id = this.structureId;
    console.log("add ====>>>", value);
    this.service.create(value)
      .subscribe(
        (response:any)=> {
          this.spinnerService.hide();
          console.log('Courrier entrant',response)
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.selectedFiles = null;
          this.showSuccess('Congé permission ',"Ajout du congé permission éffectué")
        },error => {
          this.spinnerService.hide();
          this.showError(error.error.error ? error.error.error:'Congé permission ',error.error.message ? error.error.message:"Erreur d'ajout du congé permission")
          console.log("create error", error)
        }
      )
  }

  edite(id:number, value) {
    console.log("id ====>>>", id);
    console.log("edite ====>>>", value);
    value.id = id;
    value.structure_id = this.structureId;
    this.service.traitementCP(id,value)
      .subscribe(
        (response:any)=> {
          this.spinnerService.hide();
          console.log("edite ue", response)
          this.initModel();
          this.initData(this.structureId);
          this.form.reset();
          this.formPanel = false;
          this.selectedFiles = null;
          this.showSuccess('Congé permission ',"Modification du congé permission éffectué")
        },error => {
          this.spinnerService.hide();
          this.showError(error.error.error ? error.error.error:'Congé permission ',error.error.message ? error.error.message:"Erreur de modification du congé permission")
          console.log("edite error", error)
        }
      )
  }


  uploadAdd() {

    console.log("ADD congePermission",this.congePermission)

    this.spinnerService.show();

    if(!this.selectedFiles || this.selectedFiles.length==0) {
      this.save(this.congePermission);
    }else {
      this.filesService.uploadPromises(this.selectedFiles)
        .then(
          response => {
            console.log('uploadAdd upload event', response);
            this.spinnerService.hide();
          }, (errors:Files[]) => {
            console.log('uploadAdd upload error', errors);

            if(errors && errors.length>0){
              this.congePermission.fichiers_id = errors.map(file => file.id);
            }

            this.save(this.congePermission);
          }
        );
    }

  }

  uploadUpdate() {

    console.log("UPDATE congePermission",this.congePermission)

    this.spinnerService.show();

    if(!this.selectedFiles || this.selectedFiles.length==0) {
      this.edite(this.congePermission.id,this.congePermission);
    }else {
      this.filesService.uploadPromises(this.selectedFiles)
        .then(
          response => {
            this.spinnerService.hide();
            console.log('uploadUpdate upload event', response);
          }, (errors:Files[]) => {
            console.log('uploadUpdate upload error', errors);

            if(errors && errors.length>0){
              this.congePermission.fichiers_id = errors.map((file)=>file.id);
            }

            console.log('uploadUpdate upload congePermission', this.congePermission);
            this.edite(this.congePermission.id,this.congePermission);
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

    this.selectedFiles.push(...event.target.files)
    console.log('upload event', event);
    console.log('upload this.selectedFiles', this.selectedFiles);
  }


  hasRoleCourrier() {
    return this.hasRole(["ROLE_COURRIER","ROLE_ADMIN"])
  }

  hasRole(roles:string[]): boolean {
    return roles.some(r => this.roles.includes(r));
  }



  showForm(value:any) {
    console.log("### showForm ",value);

      this.congePermission=value;
      this.congePermission.demandeur_id=value.demandeur.id;
      this.congePermission.statut=value.statut;
      this.congePermission.dateDepart = new Date(value.dateDepart);
      this.congePermission.dateRetour = new Date(value.dateRetour);
      console.log("### congePermission ",this.congePermission);
      this.initForm();
      this.formPanel = true;

  }

  setCongePermissionType(event) {
    console.log("### setCongePermissionType 1 ",event);
    console.log("### setCongePermissionType 2 ",event.value);
     this.findAllBy(event.value,null);
  }



  compareFn(t1: any, t2: any): boolean {
    return t1 === t2;
  }

}



