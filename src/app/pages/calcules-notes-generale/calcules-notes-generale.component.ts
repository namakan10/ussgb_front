import { error } from 'util';
import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { UesServiceService } from '../../services/ues.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import {Util_fonction} from "../models/util_fonction";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { StructureService } from '../../services/structure.service';
import {NotesService} from "../../services/GestionEtudiants/notes.service";
declare var $: any;


//let id_structure
@Component({
  selector: 'app-calcules-notes-generale',
  templateUrl: './calcules-notes-generale.component.html',
  styleUrls: ['./calcules-notes-generale.component.css']
})

export class CalculesNotesGeneraleComponent implements OnInit {

  UEs: any;
  idSt:any
  calculeUes:FormGroup
  users:any
  spinner=false
  invalidform : boolean= false;
  tpfield=false;
  devoirfield=false;
  examfield=false
  checkEcSelect=false;
  uebool=false
  allEc:any
  idEc: any;

  anneeLis :any
  //note calculer
  listNoteCalcule: any = [];
  pageSize = 50;
  pageSizeOptions = [5, 10, 25, 100, 200, 300, 400, 500, 700, 1000, 2000];
  length = 100;

  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['numEtudiant', 'prenom', 'nom', 'date_de_naissance', 'niveau','genre', 'noteDevoir', 'noteTP', 'noteExamen',  'noteFinal' , 'status'];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private uesService: UesServiceService,
              private noteService: NotesService,
              private structureService:StructureService) { }

  ngOnInit() {

    let user= JSON.parse(sessionStorage.getItem('user'));
    let AnneScolaire= JSON.parse(sessionStorage.getItem('dateEnCours'));
    this.idSt=user.structure.id
    this.getAnneeByStructure(this.idSt)
    console.log(this.idSt)
    this.getUesByTeacher(user.users.personnel.id)
    this.initForm(AnneScolaire)
  }

  initForm(annee){

    this.calculeUes = this.formBuilder.group({
      UeId: ['', Validators.required],
      coefExam: ['', Validators.required],
      session: ['', Validators.required],
      type:['', Validators.required],
      coefTp:['',],
      coefTD:['', ],
      ec:['', ],
      anneeScol:[annee, Validators.required],

    });
  }
  getAnneeByStructure(id){
    this.structureService.getStuctureAnnees(id).subscribe((data) => {
      this.anneeLis = data;
      //print()
    })
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

    console.log("All : ",this.SendNoteToDelete);
  }

  CheckSing(event){
    console.log("event.target.value : ", event.target.value);
    if (event.target.checked){
      // this.data.etudiant_id = event.target.value;
      this.SendNoteToDelete.push({
        id: +event.target.value
      });
    }else {
      this.SendNoteToDelete = this.SendNoteToDelete.filter(data => +data.id !== +event.target.value);
    }

    console.log("SendNoteToDelete : ", this.SendNoteToDelete);

    this.selectedState = Object.keys(this.SendNoteToDelete).length >= 1;
  }

  exportexcel() {
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'note-generale.xlsx');
 }

  ConfirmeDelete(){
    console.log("this.SendNoteToDelete ::: ",this.SendNoteToDelete);
    Swal.fire({
      title: '',
      text: "Etes-vous sûr de vouloir supprimer la/les note(s) cochée(s) ? ",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.noteService.Delete_general_note_s(this.SendNoteToDelete).subscribe(notedel=>{
          Util_fonction.SuccessMessage(notedel);
          this.afficher();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })
  }

  /* changeValue(event){
    if(event=="A"){
      this.checkEcSelect=true
      this.uebool=true;
    }

    else{
      this.checkEcSelect=false
      this.idEc=null
    }
  } */

  getUesByTeacher(id) {
    this.uesService.getUesByEnseignant(id).subscribe((data) => {
      this.UEs = data;
      //print()
    })
  }

  CalculesNotesGenerale() {

    this.spinner = true;
    let AnneScolaire= JSON.parse(sessionStorage.getItem('dateEnCours'));
    const idue =this.calculeUes.controls.UeId.value.id
    //const ec =this.calculeUes.controls.UeId.value.elementConstitutifs;
    const semestre=this.calculeUes.controls.session.value
    const coeffTP=this.calculeUes.controls.coefTp.value
    const coeffDev=this.calculeUes.controls.coefTD.value
    const coeffEx=this.calculeUes.controls.coefExam.value
    const type=this.calculeUes.controls.type.value
    const annee=this.calculeUes.controls.anneeScol.value.anneeScolaire

    this.uesService.CalculeNotesGenerale(idue,coeffTP,coeffDev,coeffEx,annee,semestre,type).subscribe(

      (data) => {
        this.spinner = false;
        Util_fonction.SuccessMessage(data);
        this.afficher()

      },
      (error3) => {
        console.log(error3.error);
        console.log(JSON.parse(error3.error));
        this.spinner = false;
        this.invalidform=true;
        // get the status as error.status
        Util_fonction.AlertMessage2(JSON.parse(error3.error).status,JSON.parse(error3.error).message);
      });



    /* this.uesService.CalculeNoteseltcons(this.idEc.id,coeffTP,coeffDev,coeffEx,annee,semestre,type).subscribe(

      (data) => {
        this.spinner = false;
        Util_fonction.SuccessMessage(data);

      },
      (error) => {
        console.log(error.error)
        this.spinner = false;
        this.invalidform=true;
         console.log(error);
         // get the status as error.status
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      }) */




  }

  /**
   * Modifier le formulaire
   */

  changForms(event){
    const type=this.calculeUes.controls.type.value
    if(event=="1" && type != "RATTRAPAGE"){
      this.devoirfield=true;
      this.tpfield=true
      this.examfield=true
    }else if (event=="2" && type != "RATTRAPAGE"){
      this.devoirfield=false;
      this.tpfield=true
      this.examfield=true

    }else if(event=="RATTRAPAGE"){
      this.examfield=true
      this.devoirfield=false;
      this.tpfield=false
    }else if(this.allEc.length > 0){
      this.examfield=false
      this.devoirfield=false;
      this.tpfield=false
      //invalid=false
    }

  }


  /**
   * Afficher la lister des note calcule
   *
   * */

  async afficher(pagination?: any) {
    //this.annee_scolaire2 = this.annee_scolaire;
    //this.spinner = true;
    const data = {
      annee_scolaire: this.calculeUes.controls.anneeScol.value.anneeScolaire,
      // id_structure: this.user.structure.id,
      id_ue: this.calculeUes.controls.UeId.value.id,
      page: pagination ? pagination.pageIndex : 0,
      size: pagination ? pagination.pageSize : 50,
      session: this.calculeUes.controls.session.value,
    };
    this.uesService.listNoteCalcule(data).subscribe(
      (res) => {
        this.listNoteCalcule = [];
        this.length = res.totalElements;
        res.content.forEach(element => {
          this.listNoteCalcule.push({
            id: element.id,
            numEtudiant: element.etudiant.numEtudiant,
            niveau: element.niveau,
            prenom: element.etudiant.prenom,
            nom: element.etudiant.nom,
            telephone: element.etudiant.telephone,
            nationalite: element.etudiant.nationalite,
            userId: element.etudiant.id,
            // libelle: element.etudiant.groupe.libelle,
            scolarite: element.etudiant.scolarite,
            photo: element.etudiant.photo,
            dateDeNaissance: element.etudiant.hasOwnProperty("user") ? Util_fonction.DateConvert2(element.etudiant.user.dateDeNaissance) : "",
            lieuDeNaissance: element.etudiant.lieuDeNaissance,
            quartier: element.etudiant.quartier,
            dateInscription: element.dateInscription,
            noteFinal:element.noteFinal,
            noteTP:element.noteTP,
            noteDevoir:element.noteDevoir,
            noteExamen:element.noteExamen,
            statut: element.statut,
            password: element.password,
            username: element.etudiant.username,
            idEtudiant: element.etudiant.id,
            ueCode: element.ue.codeUE,
            telephoneTuteur: element.etudiant.telephoneTuteur,
            genre: element.etudiant.genre,
            email: element.etudiant.email,
            numMatricule: element.etudiant.numMatricule,
            porte: element.etudiant.porte,
            rue: element.etudiant.rue,
            ville: element.etudiant.ville
          });
        });
        this.dataSource = new MatTableDataSource(this.listNoteCalcule);
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

}
