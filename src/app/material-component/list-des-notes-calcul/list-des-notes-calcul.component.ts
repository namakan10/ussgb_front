import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { PAG_MIDLE_SIZE, UNIV_MINISTERE, UNIV_NAME } from '../../CONSTANTES';
import { Util_fonction } from '../../pages/models/util_fonction';
import { FilesService } from '../../services/files.service';
import { CandidatureService } from '../../services/GestionEtudiants/candidature.service';
import { EtudiantService } from '../../services/GestionEtudiants/etudiant.service';
import { FiliereService } from '../../services/GestionFilieres/filiere.service';
import { OptionsService } from '../../services/GestionFilieres/Options/options.service';
import { PreInscriptionServiceService } from '../../services/pre-inscription-service.service';
import { StructureService } from '../../services/structure.service';
import { UesServiceService } from '../../services/ues.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import {NotesService} from '../../services/GestionEtudiants/notes.service';
declare var $: any;

@Component({
  selector: 'app-list-des-notes-calcul',
  templateUrl: './list-des-notes-calcul.component.html',
  styleUrls: ['./list-des-notes-calcul.component.css']
})
export class ListDesNotesCalculComponent implements OnInit {

  user: any;
  list: any = [];
  select: any;
  error: any;
  dateEnCours: any;
  photoProfil: any;
  changPhotoEvent: boolean = false;
  message;
  typeRetour: 'tout';
  test=[];
  send=[]
  // tslint:disable-next-line:max-line-length

  displayedColumns: string[] = ['check', 'numEtudiant', 'prenom', 'nom', 'niveau', 'session', 'coeffDev', 'coeffTP', 'coeffEx', 'noteDevoir', 'noteTP', 'noteExamen',  'noteFinal' , 'status'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  anneeStructure: any;
  spinner1 = true;
  spinner = false;
  annee_scolaire;
  session;
  telephone;
  prenom;
  nom;
  etat_paiement;
  admis;
  approbation;
  type = false;
  hasRole = false;
  param = '';
  diff = '';
  date = new Date();
  PhotoChangeForm: FormGroup;
  ChangeDataForm: FormGroup;
  UpoloadFile: any;
  userId: any;
  FiliereID: any;
  checkNum_spinner: boolean = false;
  allUe:any;

  pageSize = PAG_MIDLE_SIZE;
  pageSizeOptions = [PAG_MIDLE_SIZE];
  length = 100;



  SendData = {
    idOption: null,
    nationalite: null,
    telephoneTuteur: null,
    user:{
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
      ville: null
    }
  }
  etudiantID: any;
  Structure_Filieres: any;
  FiliereSelectOptions: any;
  Opt_spinner: boolean = false;
  Opt_changeIfoSpinner: boolean = false;
  infochangeAccess: boolean = false;

  file: any;
  localUrl: any;
  RoleCartePrint: boolean;
  univName = UNIV_NAME;
  univ_Minist = UNIV_MINISTERE;
  annee_scolaire2: any;
  Uekeyword = 'nomUE';
  idUE;
  num_etudiant;
  constructor(private structureService: StructureService, private formBuilder: FormBuilder,
              private filiereService: FiliereService,
              private optionService: OptionsService,
              private preinscription: PreInscriptionServiceService,
              private route: ActivatedRoute,
              private noteService: NotesService,
  private uesService: UesServiceService,) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.dateEnCours = JSON.parse(sessionStorage.getItem('dateEnCours'));
    this.structureService.getStuctureAnnees(this.user.structure.id).subscribe(
      (res) => {
        this.anneeStructure = res;
        this.spinner1 = false;
      },
      (error) => {
        // this.error = error;
        // this.spinner = false;
      });
  }
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    const id =  this.user.structure.id;
    this.initPhoto();
    this.initChangeDataForm();
    this.GetStructionFilieres();
    this.GetStructionOptions();


if(this.user.users.roles.some((a) => a.nom === 'ROLE_ADMIN' ||  a.nom === 'ROLE_DOYEN')) {
  this.uesService.getUesByStructure(id).subscribe((data:any)=>{
    this.allUe=data.content;
    this.allUe.map(ue => {ue.nomUE = ue.nomUE+' '+ ue.codeUE});
  });
} else {
  this.uesService.getUeByTeacher(this.user.users.personnel.id).subscribe((data:any)=>{
    this.allUe=data;
    this.allUe.map(ue => {ue.nomUE = ue.nomUE+' '+ ue.codeUE});
  });
}

    for (let rol of this.user.users.roles){
      if (rol.nom !== "ROLE_SP" || rol.nom !== "ROLE_ADMIN"){
        this.infochangeAccess = true;
      }
    }

  }

  keyword = 'nom';
    selectEvent(item) {
    // do something with selected item
  //  this.addbox();
    const formdata= {
      id: item.id,
   };
   if(this.test.find(x => x.id ===item.id)){
   }else{
    this.send.push(formdata);
    this.test.push(item);
    this.test=this.test

   }
   //this.sum=1;
  }


  onChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something
  }

remove(index,id){
//  this.removedata(index);
  this.test.splice(index,1);
  this.send.splice(index);
}

exportexcel() {
  const element = document.getElementById('excel-table');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'list-notes-calcules.xlsx');
}

onchange(){
//   this.sum=0;
//   this.total=0;
//   const formdata= {
//     qte_achat: this.form.controls.qte_achat.value,
//  };
//   this.test.forEach((o,i) =>{
//    const qt=formdata.qte_achat[i].qte ? formdata.qte_achat[i].qte : 1;
//      this.sum= this.sum+parseInt(this.test[i].prix) *parseInt(qt);
//     this.total=parseInt(this.total)+parseInt(qt)
//     });
}
UeSelectEvent(event){
  this.idUE = event.id;
}

  AsRoleCartePrint(){
    let rl = ["ROLE_ADMIN", "ROLE_SP"];
    this.RoleCartePrint = Util_fonction.checkIfAsRole(this.user,rl);
  }


  GetStructionFilieres(){
    this.filiereService.getStructureFilieres(this.user.structure.id).subscribe(filierestRes => {

      this.Structure_Filieres = filierestRes;
    })
  }

  GetStructionOptions(){
    this.optionService.getStructure_Options(this.user.structure.id).subscribe(OptionsRes => {

      this.FiliereSelectOptions = OptionsRes;
    })
  }

  /***
   * CHARGE LES OPTIONS DE LA FILIERE SELECTIONNEE
   * @param event
   */
  selectOptions(event) {
    this.Opt_spinner = true;
    // this.SelectFiliere = event.target.options[event.target.options.selectedIndex].text;
    const filID = this.ChangeDataForm.controls.filiere.value;
    this.optionService.getOptionsByFiliereID(filID).subscribe(getFilOptionRes => {
      this.FiliereSelectOptions = getFilOptionRes;
      this.Opt_spinner = false;
    });
  }

  checkIfIsnull(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

  async afficher(pagination?: any) {
    this.annee_scolaire2 = this.annee_scolaire;
    this.spinner = true;
    const data = {
      annee_scolaire: this.annee_scolaire,
      id_ue: this.idUE,
      page: pagination ? pagination.pageIndex : 0,
      size: pagination ? pagination.pageSize : 50,
      session: this.session,
      valid: this.typeRetour,
      num_etudiant: this.num_etudiant,
    };
    this.uesService.listNoteCalcule(data).subscribe(
      (res) => {
        this.list = [];
        this.length = res.totalElements;
        // tslint:disable-next-line:max-line-length
        if (this.typeRetour.includes('PAS_NOTE')) {
          this.displayedColumns = ['check', 'numEtudiant', 'prenom', 'nom', 'niveau', 'status'];
        } else {
          // tslint:disable-next-line:max-line-length
          this.displayedColumns = ['check', 'numEtudiant', 'prenom', 'nom', 'niveau', 'session', 'coeffDev', 'coeffTP', 'coeffEx', 'noteDevoir', 'noteTP', 'noteExamen',  'noteFinal' , 'status'];
        }
        res.content.forEach(element => {
          this.list.push({
            id: element.id,
            numEtudiant: this.typeRetour.includes('PAS_NOTE') ? element.numEtudiant : element.etudiant.numEtudiant,
            prenom: this.typeRetour.includes('PAS_NOTE') ? element.prenom : element.etudiant.prenom,
            nom: this.typeRetour.includes('PAS_NOTE') ? element.nom : element.etudiant.nom,
            niveau: this.typeRetour.includes('PAS_NOTE') ? element.niveau : element.etudiant.niveau,
            session: this.typeRetour.includes('PAS_NOTE') ? '' : element.session,
            coeffDev: this.typeRetour.includes('PAS_NOTE') ? '' : element.coeffDev,
            coeffEx: this.typeRetour.includes('PAS_NOTE') ? '' : element.coeffEx,
            coeffTP: this.typeRetour.includes('PAS_NOTE') ? '' : element.coeffTP,
            noteFinal: this.typeRetour.includes('PAS_NOTE') ? '' : element.noteFinal,
            noteTP: this.typeRetour.includes('PAS_NOTE') ? '' : element.noteTP,
            noteDevoir: this.typeRetour.includes('PAS_NOTE') ? '' : element.noteDevoir,
            noteExamen: this.typeRetour.includes('PAS_NOTE') ? '' : element.noteExamen,
            statut: element.statut,
            // telephone: element.etudiant.telephone,
            // nationalite: element.etudiant.nationalite,
            // userId: element.etudiant.id,
            // // libelle: element.etudiant.groupe.libelle,
            // scolarite: element.etudiant.scolarite,
            // photo: element.etudiant.photo,
            // dateDeNaissance: element.etudiant.hasOwnProperty("user") ? Util_fonction.DateConvert2(element.etudiant.user.dateDeNaissance) : "",
            // lieuDeNaissance: element.etudiant.lieuDeNaissance,
            // quartier: element.etudiant.quartier,
            // dateInscription: element.dateInscription,
            // password: element.password,
            // username: element.etudiant.username,
            // idEtudiant: element.etudiant.id,
            // ueCode: element.ue.codeUE,
            // telephoneTuteur: element.etudiant.telephoneTuteur,
            // genre: element.etudiant.genre,
            // email: element.etudiant.email,
            // numMatricule: element.etudiant.numMatricule,
            // porte: element.etudiant.porte,
            // rue: element.etudiant.rue,
            // ville: element.etudiant.ville
          });
        });

        this.dataSource = new MatTableDataSource(this.list);
        this.pageSizeOptions =  Util_fonction.paginatSequence2(PAG_MIDLE_SIZE, res.totalElements);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
        this.spinner = false;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


0



  initPhoto(){
    this.PhotoChangeForm = this.formBuilder.group({
      profilPhoto: new FormControl(null, [Validators.required])
    });
  }


  isCheckedOrNot(event){
    if (event.target.name === 'allSelector'){
      this.CheckALl(event.target.checked);
    }else {
      this.CheckSing(event);
    }
  }

  SendNoteToDelete: any[] = [];
  selectedState: boolean = false;
  CheckALl(status){
    // let element = document.getElementsByClassName('ck');
    let element = $('.ck');
    if (status){
      this.SendNoteToDelete = [];
      for (let i = 0; i < element.length; i++) {
        this.SendNoteToDelete.push({
          id: element[i].value,
        });
        element[i].checked = status;
      }
    } else {
      for (let j = 0; j < element.length; j++) {
        element[j].checked = status;
        this.SendNoteToDelete = this.SendNoteToDelete.filter(d => d.id !== element[j].value);
      }
    }

    this.selectedState = Object.keys(this.SendNoteToDelete).length >= 1;

  }

  CheckSing(event){
    if (event.target.checked){
      // this.data.etudiant_id = event.target.value;
      this.SendNoteToDelete.push({
        id: +event.target.value
      });
    }else {
      this.SendNoteToDelete = this.SendNoteToDelete.filter(data => +data.id !== +event.target.value);
    }
    this.selectedState = Object.keys(this.SendNoteToDelete).length >= 1;
  }

  ConfirmeSingleDelete(element){
    Swal.fire({
      title: '',
      text: "Etes-vous sûr de vouloir supprimer la note de  "+element.numEtudiant,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.noteService.DeleteSingleNoteGenerale(element.id).subscribe(delRes1=>{
          Util_fonction.SuccessMessage(delRes1);
          this.afficher();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })
  }

  ConfirmeDelete(){
    Swal.fire({
      title: '',
      text: "Etes-vous sûr de vouloir supprimer la/les ligne(s) cochée(s) ? ",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.noteService.DeleteNote_several(this.SendNoteToDelete).subscribe(delRes1=>{
          Util_fonction.SuccessMessage(delRes1);
          this.SendNoteToDelete = [];
          this.afficher();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })
  }

  initChangeDataForm(){
    this.ChangeDataForm = this.formBuilder.group({
      nationalite: new FormControl(null,[Validators.required]),
      telephoneTuteur: new FormControl(null),

      session: new FormControl(null,[Validators.required]),
      email: new FormControl(null,[Validators.required]),
      genre: new FormControl(null,[Validators.required]),
      lieuDeNaissance: new FormControl(null,[Validators.required]),
      nom: new FormControl(null,[Validators.required]),
      numMatricule: new FormControl(null,[Validators.required]),
      photo: new FormControl(null,[Validators.required]),
      porte: new FormControl(null),
      prenom: new FormControl(null,[Validators.required]),
      quartier: new FormControl(null,[Validators.required]),
      rue: new FormControl(null),
      telephone: new FormControl(null),
      ville: new FormControl(null,[Validators.required]),

      filiere: new FormControl(null),
      option: new FormControl(null)
    });
  }

  hasRoleAdmin() {
    this.hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_ADMIN') {
          this.hasRole = true;

        }
      });
      return this.hasRole;
    }
  }

}
