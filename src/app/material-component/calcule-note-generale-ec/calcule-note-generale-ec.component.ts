import { StructureService } from './../../services/structure.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Util_fonction } from '../../pages/models/util_fonction';
import { UesServiceService } from '../../services/ues.service';
import * as XLSX from 'xlsx';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-calcule-note-generale-ec',
  templateUrl: './calcule-note-generale-ec.component.html',
  styleUrls: ['./calcule-note-generale-ec.component.css']
})
export class CalculeNoteGeneraleEcComponent implements OnInit {

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
  displayedColumns: string[] = ['numEtudiant', 'prenom', 'nom', 'date_de_naissance', 'niveau', 'noteDevoir', 'noteTP', 'noteExamen',  'noteFinal' , 'status'];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private uesService: UesServiceService,
              private structureService:StructureService)
  { }

  ngOnInit() {

    let user= JSON.parse(sessionStorage.getItem('user'));
    this.idSt=user.structure.id
    this.getEcByTeacher(user.users.personnel.id)
    this.getAnneeByStructure(this.idSt)
    this.initForm()
  }

  initForm(){
    this.calculeUes = this.formBuilder.group({
      coefExam: ['', Validators.required],
      session: ['', Validators.required],
      type:['', Validators.required],
      coefTp:['',],
      coefTD:['', ],
      ec:['', ],
      anneeScol:["", Validators.required],

    });
  }
  getAnneeByStructure(id){
    this.structureService.getStuctureAnnees(id).subscribe((data) => {
      this.anneeLis = data;
      //print()
    })
  }
  /*getEcByUE(item){
    // this.teacherService.getTeacherByDer(this.GetBody)
    this.uesService.GetUesElementsConstitufis(item.id)
    .subscribe((data : any) =>{
     this.allEc = data;
    });
    if(this.allEc != null){
      this.devoirfield=false
      this.tpfield=false
    }
  }*/

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

  getEcByTeacher(id) {
    this.uesService.getEcsByEnseignant(id).subscribe((data) => {
      this.allEc = data;
      //print()
    })
  }

  exportexcel() {
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'note-ec.xlsx');
 }
  CalculesNotesGenerale() {

    this.spinner = true;
    let AnneScolaire= JSON.parse(sessionStorage.getItem('dateEnCours'));
    const idec =this.calculeUes.controls.ec.value.id
    //const ec =this.calculeUes.controls.UeId.value.elementConstitutifs;
    const semestre=this.calculeUes.controls.session.value
    const coeffTP=this.calculeUes.controls.coefTp.value
    const coeffDev=this.calculeUes.controls.coefTD.value
    const coeffEx=this.calculeUes.controls.coefExam.value
    const type=this.calculeUes.controls.type.value
    const annee=this.calculeUes.controls.anneeScol.value.anneeScolaire

    this.uesService.CalculeNoteseltcons(idec,coeffTP,coeffDev,coeffEx,annee,semestre,type).subscribe(

      (data) => {
        this.spinner = false;
        Util_fonction.SuccessMessage(data);
        this.afficher();

      },
      (error) => {
        this.spinner = false;
        this.invalidform=true;
        // get the status as error.status
        Util_fonction.AlertMessage(error.error.status,error.error.message,error.error);
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
          id_ue: this.calculeUes.controls.ec.value.ue.id,
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
                dateDeNaissance: element.etudiant.dateDeNaissance,
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
                ecCode: element.elementConstitutif.codeEC,
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
