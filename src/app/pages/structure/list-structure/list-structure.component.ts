
import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import Swal from "sweetalert2";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Util_fonction} from "../../models/util_fonction";
import {FilesService} from "../../../services/files.service";
import {StructureService} from "../../../services/structure.service";




declare var $: any;
@Component({
  selector: 'ngx-list-structure',
  templateUrl: './list-structure.component.html',
  styleUrls: ['./list-structure.component.scss']
})
export class ListStructureComponent implements OnInit, AfterViewInit {

  StructureForm: FormGroup;
  structureEditBody = {
    id: '',
    nom: '',
    type: '',
    sigle: '',
    adresse: '',
    logo: '',
    description: '',
    email: '',
    telephone: ''
  };

  structureAddBody = {
    nom: '',
    type: '',
    sigle: '',
    adresse: '',
    logo: '',
    description: '',
    email: '',
    telephone: ''
  };



  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'logo',
    'sigle',
    'nom',
    'type',
    'action',
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  creat_Ation: boolean = false;
  _initSpinner: boolean = false;
  _initSpinnerBtn: boolean = false;
  LogoChange: boolean= false;


  url: any;
  EditID: any;
  LogoStr: any;
  EditData: any;
  structures: any;

  prewiewImg: string;
  searchKey: string;
  UpoloadFile: File;
  _HTTP = "http://";



  constructor(private structureService: StructureService,
              private router: Router,
              private route:ActivatedRoute,
              private formBuilder: FormBuilder,
              private fileService: FilesService,
              private changeDetectorRef: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.getStructures();
    this.initForm();
  }

  ngOnDestroy(){
  }


  getStructures() {
    this._initSpinner = true;
     this.structureService.getStuctures().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this._initSpinner = false;
        this.changeDetectorRef.detectChanges();
      }, error => {
        this._initSpinner = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }


  CreatStructure(){
    this.initForm();
    this.creat_Ation = true;
    this.LogoChange = false;
    this.url = null;

    this.StructureForm.controls.logo.setValidators([Validators.required]);
    this.StructureForm.controls.logo.updateValueAndValidity();

    $('#StructureFormModal').modal('show');
    $('#StructureFormModal').appendTo('body');
  }


  AddNewStructure(){
    this._initSpinnerBtn = true;
    let fd = new FormData();
    fd.append('file', this.UpoloadFile);
    fd.append('fileType', "LOGO");
     this.fileService.uploadStructureLogo(fd).subscribe(fileres => {
      this.LogoStr = fileres.toString();
      this.structureAddBody.nom = this.StructureForm.controls.nom.value;
      this.structureAddBody.type = this.StructureForm.controls.type.value;
      this.structureAddBody.sigle = this.StructureForm.controls.sigle.value;
      this.structureAddBody.adresse = this.StructureForm.controls.adresse.value;
      this.structureAddBody.description = this.StructureForm.controls.description.value;
      this.structureAddBody.email = this.StructureForm.controls.email.value;
      this.structureAddBody.telephone = this.StructureForm.controls.telephone.value;
      this.structureAddBody.logo = this.LogoStr;
      console.log(this.structureAddBody);
       this.structureService.addStructure(this.structureAddBody).subscribe( addResponse =>{
        this.LogoChange = false;
        $('#StructureFormModal').modal('hide');
        this.getStructures();
        Util_fonction.SuccessMessage(addResponse);
        this._initSpinnerBtn = false;
      }, error => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this._initSpinnerBtn = false;
      });
    }, errorRes => {
       if (Util_fonction.checkIfNoTEmpty(errorRes)){


         this.LogoStr = errorRes.toString();
         this.structureAddBody.nom = this.StructureForm.controls.nom.value;
         this.structureAddBody.type = this.StructureForm.controls.type.value;
         this.structureAddBody.sigle = this.StructureForm.controls.sigle.value;
         this.structureAddBody.adresse = this.StructureForm.controls.adresse.value;
         this.structureAddBody.description = this.StructureForm.controls.description.value;
         this.structureAddBody.email = this.StructureForm.controls.email.value;
         this.structureAddBody.telephone = this.StructureForm.controls.telephone.value;
         this.structureAddBody.logo = this.LogoStr;
         console.log(this.structureAddBody);
         this.structureService.addStructure(this.structureAddBody).subscribe( addResponse =>{
           this.LogoChange = false;
           $('#StructureFormModal').modal('hide');
           this.getStructures();
           Util_fonction.SuccessMessage(addResponse);
           this._initSpinnerBtn = false;
         }, error => {
           Util_fonction.AlertMessage(error.error.status,error.error.message);
           this._initSpinnerBtn = false;
         });


       }else {
         Util_fonction.AlertMessage(errorRes.error.status,errorRes.error.message);
         this._initSpinnerBtn = false;
       }

    });
  }

  modifStructure(element){
    console.log(element);
    this.creat_Ation = false;
    this.LogoChange = false;

    this.StructureForm.controls.logo.reset();
    this.StructureForm.controls.logo.clearValidators();
    this.StructureForm.controls.logo.updateValueAndValidity();

    this.EditID = element.id;
    this.EditData = element;
    this.LogoStr = element.logo;
    this.url = this._HTTP+''+element.logo;

    // Full Form
    this.StructureForm.controls.nom.setValue(element.nom);
    this.StructureForm.controls.sigle.setValue(element.sigle);
    this.StructureForm.controls.type.setValue(element.type);
    this.StructureForm.controls.adresse.setValue(element.adresse);
    this.StructureForm.controls.description.setValue(element.description);
    this.StructureForm.controls.email.setValue(element.email);
    this.StructureForm.controls.telephone.setValue(element.telephone);

    $('#StructureFormModal').modal('show');
    $('#StructureFormModal').appendTo('body');
  }

  EditeStructure(){
    this._initSpinnerBtn = true;
    if (this.LogoChange) {
      // CAS DE MISE A JOURS AVEC IMAGE
      let fd = new FormData();
      fd.append('file', this.UpoloadFile);
      fd.append('fileType', "LOGO");
        this.fileService.uploadStructureLogo(fd).subscribe(res => {
        this.LogoStr = res.toString();

        this.structureEditBody.id = this.EditID;
        this.structureEditBody.nom = this.StructureForm.controls.nom.value;
        this.structureEditBody.type = this.StructureForm.controls.type.value;
        this.structureEditBody.sigle = this.StructureForm.controls.sigle.value;
        this.structureEditBody.adresse = this.StructureForm.controls.adresse.value;
        this.structureEditBody.description = this.StructureForm.controls.description.value;
        this.structureEditBody.email = this.StructureForm.controls.email.value;
        this.structureEditBody.telephone = this.StructureForm.controls.telephone.value;
        this.structureEditBody.logo = this.LogoStr;

        console.log(this.structureEditBody);
         this.structureService.updateStructure(this.structureEditBody).subscribe( updateResponse =>{
          $('#StructureFormModal').modal('hide');
          this.LogoChange = false;
          this._initSpinnerBtn = false;
          Util_fonction.SuccessMessage(updateResponse);
          this.getStructures();
        }, error => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this._initSpinnerBtn = false;
        });

      }, error => { // cas erreur d'upload
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this._initSpinnerBtn = false;
      });
      // !!! END CAS DE MISE A JOURS AVEC IMAGE !!!
    } else {
      // ==
      this.structureEditBody.id = this.EditID;
      this.structureEditBody.nom = this.StructureForm.controls.nom.value;
      this.structureEditBody.type = this.StructureForm.controls.type.value;
      this.structureEditBody.sigle = this.StructureForm.controls.sigle.value;
      this.structureEditBody.adresse = this.StructureForm.controls.adresse.value;
      this.structureEditBody.description = this.StructureForm.controls.description.value;
      this.structureEditBody.email = this.StructureForm.controls.email.value;
      this.structureEditBody.telephone = this.StructureForm.controls.telephone.value;
      this.structureEditBody.logo = this.LogoStr;

      console.log(this.structureEditBody);
       this.structureService.updateStructure(this.structureEditBody).subscribe( updateResponse =>{
        this.LogoChange = false;
        this._initSpinnerBtn = false;
        $('#StructureFormModal').modal('hide');
        this.getStructures();
        Util_fonction.SuccessMessage(updateResponse);
      }, error => {
        this._initSpinnerBtn = false;
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });

      // ==
    }


  }

  uploadLogo(){
    let fd = new FormData();
    fd.append('file', this.UpoloadFile);
    fd.append('fileType', "LOGO");
     this.fileService.uploadStructureLogo(fd).subscribe(res => {
      this.LogoStr = res.toString();
    }, error => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    });
  }

  DeleteStructure(element){
    Swal.fire({
      title: '',
      html: "Etes-vous sûre de vouloir supprimer la structure <strong>"+element.nom+" ("+element.sigle+")</strong>",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
         this.structureService.deleteStructure(element.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
          this.getStructures();
        }, error => {

           if (Util_fonction.checkIfNoTEmpty(error)){
             Util_fonction.SuccessMessage(error);
             this.getStructures();
           }else {
             Util_fonction.AlertMessage(error.error.status,error.error.message);
           }

        });
      }
    })
  }

  onselectFile(e){
    if(e.target.files){
      var reader = new FileReader();
      console.log(e.target.files[0]);
      this.UpoloadFile = e.target.files[0];
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.url=event.target.result;
      }
    }
    this.prewiewImg = 'display:block';
    this.LogoChange = true;
    this.changeDetectorRef.detectChanges();
  }

  ShowStructure(id_structure){
    console.log("*********************");
    console.log(id_structure);
    this.router.navigate(['/structure/'+id_structure+'/departements']);
  }

  ngAfterViewInit(): void {
  }

  initForm(){
    this.StructureForm = this.formBuilder.group({
      nom: new FormControl('',[Validators.required]),
      type: new FormControl('',[Validators.required]),
      sigle: new FormControl('',[Validators.required]),
      adresse: new FormControl('',[Validators.required]),
      logo: new FormControl(''),
      description: new FormControl('',[Validators.required]),
      email: new FormControl(''),
      telephone: new FormControl('')
    });
  }



  /****************** ***************************************************/

}
