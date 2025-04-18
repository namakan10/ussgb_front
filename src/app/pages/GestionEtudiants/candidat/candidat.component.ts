import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CandidatService} from "../../../services/GestionEtudiants/candidat.service";
import * as XLSX from 'xlsx';
import {Router} from "@angular/router";
import Swal from 'sweetalert2';
import { AfterViewInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PAYS_MONDE} from "../../PAYS_MODE";
import {Util_fonction} from "../../models/util_fonction";
declare var $: any;
export interface CandidatData {
  nom : string,
  dateDeNaissance:string;
  lieuDeNaissance: string;
  modeAdmission: string;
  serie: string;
  annee: string;
  actions: string;
}


@Component({
  selector: 'ngx-candidat',
  templateUrl: './candidat.component.html',
  styleUrls: ['./candidat.component.scss']
})

export class CandidatComponent implements OnInit {

  @ViewChild(MatSort, {static:true}) sort: MatSort;
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;

  displayedColumns: string[] = [
    'nom',
    'dateDeNaissance',
    'lieuDeNaissance',
    'modeAdmission',
    'serie',
    // 'annee',
    'actions'
  ];

  dataSource: MatTableDataSource<any[]>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //use for upload
  data: [][];
  Error_Charge_Candidat: any = [];
  chargeError = false;
  Show_Charge_Error = false;
  chargeSpinner = false;

  Candidats: any = [];
  Pages: any = [];
  pageTotal: any;
  CandidatsData: any;
  candidatINFO: any;
  showcand: boolean = false;
  adminRole: boolean = false;

  PaginateForm: FormGroup;


  ParamBody = {
    nom: null,
    prenom: null,
    dateDeNaissance: null,
    numPlaceBac: null,
    annee: null,
    page: 0,
    size: 500,
  }
  user:any;
  Annees:any;

  pageSize = 100;
  pageSizeOptions = [5, 10, 25, 100, 200, 300, 400, 500];
  length = 500;

    ModifForm: FormGroup;

    ModifSendData = {
      dateDeNaissance: null,
      email: null,
      id: null,
      lieuDeNaissance: null,
      nationalite: null,
      nom: null,
      paysDeNaissance: null,
      porte: null,
      prenom: null,
      quartier: null,
      rue: null,
      telephone: null,
      telephoneTuteur: null,
      ville: null,
    }

  CandidatSaveForm: FormGroup;
  candidatBody = {
    academie: null,
    annee: null,
    dateDeNaissance: null,
    genre: null,
    lieuDeNaissance: null,
    modeAdmission: null,
    nom: null,
    numMatricule: null,
    numPlaceBac: null,
    prenom: null,
    sessionBac: null,
    specialite: null
  }
  Academies: any;
  Specialites: any;

  Pays = PAYS_MONDE;
  idCand:any;
    constructor(private candidatService: CandidatService,
              private formBuilder: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    for (let rol of this.user.users.roles){
      if (rol.nom === "ROLE_ADMIN"){
        this.adminRole = true;
      }
    }
    this.initForm();
    this.initModifForm();
    this.initSaveForm();

    this.genereAnneeList();
    // this.getCandidats();
    this.getAcademie();
    this.getAllSepcialites();

    // this.dataSource.paginator = this.paginator;

  }

  genereAnneeList() {
    
    const Annees = [];
    let endAnnee: number = new Date().getFullYear();
    const limit = endAnnee - 10;
    const start = endAnnee - 1;
    for (let i = start; i >= limit ; i--) {
      let an = i-1+" - "+i;
      Annees.push(an);
    }
    this.Annees = Annees;
    this.candidatService.getCandidatsAnnee().subscribe(
      res => {
        this.Annees = res;
        this.Annees.reverse();
      });
  }

  getCandidats() {
    this.chargeSpinner = true;

    this.ParamBody.nom = this.PaginateForm.controls.nom.value;
    this.ParamBody.prenom = this.PaginateForm.controls.prenom.value;
    this.ParamBody.dateDeNaissance = this.PaginateForm.controls.dateDeNaissance.value;
    this.ParamBody.numPlaceBac = +this.PaginateForm.controls.numPlace.value;
    this.ParamBody.annee = this.PaginateForm.controls.annee.value;

    this.candidatService.getCandidat(this.ParamBody).subscribe(
      res => {
        this.CandidatsData = res;
          this.chargeSpinner = false;
          this.sequencePage(res.totalPages);
          this.dataSource = new MatTableDataSource(res.content);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, err => {
        this.chargeSpinner = false;
      })
  }

  chargeList(){
    $('#ChargementListModal').modal('show');
    $('#ChargementListModal').appendTo('body');
  }

  sequencePage(totalPages){
    this.pageTotal = totalPages;
    for (let i =0; i<=totalPages; i++){
      this.Pages.push(i);
    }
  }

  paginateEvent(page) {
    let value = page.value;
    if (value >=0 && value <= this.pageTotal) {
      this.chargeSpinner = true;

      this.ParamBody.nom = this.PaginateForm.controls.nom.value;
      this.ParamBody.prenom = this.PaginateForm.controls.prenom.value;
      this.ParamBody.dateDeNaissance = this.PaginateForm.controls.dateDeNaissance.value;
      this.ParamBody.numPlaceBac = +this.PaginateForm.controls.numPlace.value;
      this.ParamBody.annee = this.PaginateForm.controls.annee.value;


      this.ParamBody.page = value;
      this.candidatService.getCandidat(this.ParamBody).subscribe(
        res => {
          // this.PaginateForm.controls.paginateSelect.setValue(value);
          this.dataSource = new MatTableDataSource(res.content);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.chargeSpinner = false;
        })
    }
  }

  searchCandidat() {
    this.chargeSpinner = true;
    this.ParamBody.nom = this.PaginateForm.controls.nom.value;
    this.ParamBody.prenom = this.PaginateForm.controls.prenom.value;
    this.ParamBody.dateDeNaissance = this.PaginateForm.controls.dateDeNaissance.value;
    this.ParamBody.numPlaceBac = +this.PaginateForm.controls.numPlace.value;
    this.ParamBody.annee = this.PaginateForm.controls.annee.value;

    this.candidatService.getCandidat(this.ParamBody).subscribe(
      res => {
        // this.PaginateForm.controls.paginateSelect.setValue(value);
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.chargeSpinner = false;
      }, err => {
        this.chargeSpinner = false;
      })
  }


  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }


  getAcademie(){
    this.candidatService.getAcademies().subscribe(res => {
      this.Academies = res;
    });
  }

  getAllSepcialites(){
    this.candidatService.getSepcialites().subscribe(specialRes => {
      this.Specialites = specialRes;
    });
  }

  /**
   * Upload excel file
   * @param event
   */
  async onUpload(event: any) {
    if (window.confirm("Voulez vous uploader ce fichier ? ")) {
      this.chargeSpinner = true;
      const target: DataTransfer = <DataTransfer>(event.target);

      //if(target.files.length !==1 ) alert("Veuillez séléctionner un seul fichier"); return false;

      const reader: FileReader = new FileReader();

      reader.onload = async (e: any) => {
        const bstr: string = e.target.result;

        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

        const wsane: string = wb.SheetNames[0];

        const ws: XLSX.WorkSheet = wb.Sheets[wsane];


        this.data = (XLSX.utils.sheet_to_json(ws, {header: 1, raw: false}));

        /*<tr *ngFor="let row of data" >
          <td *ngFor="let cell of row">
        * */

        for (let row of this.data) {
          let candidat = [];
          let index = 0;
          for (let cell of row) {
            candidat[index] = cell;
            index++;
          }
          let json_data = {
            nom: candidat[0],
            prenom: candidat[1],
            dateDeNaissance: candidat[2],
            lieuDeNaissance: candidat[3],
            genre: candidat[4],
            modeAdmission: candidat[5],
            sessionBac: candidat[6],
            academie: candidat[7],
            specialite: candidat[8],
            numPlaceBac: +candidat[9],
            numMatricule: candidat[10],
            annee: candidat[11],
          };
          this.candidatService.createCandidat(json_data).subscribe(
            error => {
              this.Error_Charge_Candidat.push(row);
              this.chargeError = true;
            }
          );

          await this.delay(700);
        }

        if (this.chargeError) {
          let timerInterval;

          Swal.fire({
            title: 'Attention',
            icon: 'warning',
            text: 'Des ligne vide ou existante on été détecté. lors du chargement',
            timer: 6000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              timerInterval = setInterval(() => {
                const content = Swal.getContent();
                if (content) {
                  const b = content.querySelector('b');
                  if (b) {
                    b.textContent = Swal.getTimerLeft().toString();
                  }
                }
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          }).then((result) => {
            /* Read more about handling dismissals*/
            if (result.dismiss === Swal.DismissReason.timer) {
              // go to home
              this.chargeSpinner = false;
              this.Show_Charge_Error = true;
              // this.router.navigate(['/pages/utilisateur/home']);
            }
          });
        } else {
          this.chargeSpinner = false;
          Util_fonction.SuccessMessage("La liste a été chargé avec succès");

        }
        this.getCandidats();
        $('#ChargementListModal').modal('hide');
        //row length = 12
      };

      reader.readAsBinaryString(target.files[0]);
    }
  }

  showInfo(candidat){
    this.showcand = true;
    this.candidatINFO = candidat;
    $('#ShowDetailModal').modal('show');
    $('#ShowDetailModal').appendTo('body');
    // this.router.navigate(['/voir_candidat/'+candidatID])
  }

  ModifInfo(candidat){
    this.showcand = true;
    this.candidatINFO = candidat;
    this.idCand = candidat.id

    // let util = new Util_fonction();

    this.ModifSendData.email = candidat.email;
    this.ModifSendData.porte = candidat.porte;
    this.ModifSendData.quartier = candidat.quartier;
    this.ModifSendData.rue = candidat.rue;
    this.ModifSendData.telephone = candidat.telephone;
    this.ModifSendData.telephoneTuteur = candidat.telephoneTuteur;
    this.ModifSendData.ville = candidat.ville;

    this.ModifForm.controls.nom.setValue(candidat.nom);
    this.ModifForm.controls.prenom.setValue(candidat.prenom);
    this.ModifForm.controls.dateDeNaissance.setValue(Util_fonction.DateConvert2(candidat.dateDeNaissance));
    this.ModifForm.controls.lieuDeNaissance.setValue(candidat.lieuDeNaissance);
    this.ModifForm.controls.payDeNaissance.setValue(candidat.paysDeNaissance);
    this.ModifForm.controls.Nationnalite.setValue(candidat.nationalite);

    $('#ChargedataModal').modal('show');
    $('#ChargedataModal').appendTo('body');
    // this.router.navigate(['/voir_candidat/'+candidatID])
  }

  SaveChanges(){
    this.ModifSendData.id = this.idCand;
    this.ModifSendData.nom = this.ModifForm.controls.nom.value;
    this.ModifSendData.prenom = this.ModifForm.controls.prenom.value;
    this.ModifSendData.dateDeNaissance = this.ModifForm.controls.dateDeNaissance.value;
    this.ModifSendData.lieuDeNaissance = this.ModifForm.controls.lieuDeNaissance.value;
    this.ModifSendData.paysDeNaissance = this.ModifForm.controls.payDeNaissance.value;
    this.ModifSendData.nationalite = this.ModifForm.controls.Nationnalite.value;

    this.candidatService.updateModif(this.idCand,this.ModifSendData)
      .subscribe(res => {
        Util_fonction.SuccessMessage(res);
      }, error => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }


  /**
   * AJOUT D'UN NOUVEAU CANDIDAT
   */

  plusCadidat(){
    this.initSaveForm();


    $('#newCandidatFormModal').modal('show');
    $('#newCandidatFormModal').appendTo('body');
  }

  SaveCandidat(){
    this.candidatBody.nom = this.CandidatSaveForm.controls.nom.value;
    this.candidatBody.prenom = this.CandidatSaveForm.controls.prenom.value;
    this.candidatBody.academie = this.CandidatSaveForm.controls.academie.value;
    this.candidatBody.sessionBac = this.CandidatSaveForm.controls.sessionBac.value;
    this.candidatBody.annee = this.CandidatSaveForm.controls.annee.value;
    this.candidatBody.dateDeNaissance = this.CandidatSaveForm.controls.dateDeNaissance.value;
    this.candidatBody.lieuDeNaissance = this.CandidatSaveForm.controls.lieuDeNaissance.value;
    this.candidatBody.specialite = this.CandidatSaveForm.controls.specialite.value;
    this.candidatBody.numMatricule = this.CandidatSaveForm.controls.numMatricule.value;
    this.candidatBody.numPlaceBac = this.CandidatSaveForm.controls.numPlaceBac.value;
    this.candidatBody.genre = this.CandidatSaveForm.controls.genre.value;
    this.candidatBody.modeAdmission = this.CandidatSaveForm.controls.modeAdmission.value;

    this.candidatService.saveCandidat(this.candidatBody).subscribe(
      res =>{
        Util_fonction.SuccessMessage("Candidat enregistré avec succès");
      }, error => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })

  }

  initForm(){
    this.PaginateForm = this.formBuilder.group({
      // paginateSelect: new FormControl(null)
      annee: new FormControl(null),
      nom: new FormControl(null),
      prenom: new FormControl(null),
      dateDeNaissance: new FormControl(null),
      numPlace: new FormControl(null)
    })
  }

  initModifForm(){
    this.ModifForm = this.formBuilder.group({
      nom: new FormControl(null, [Validators.required]),
      prenom: new FormControl(null, [Validators.required]),
      dateDeNaissance: new FormControl(null, [Validators.required]),
      lieuDeNaissance: new FormControl(null, [Validators.required]),
      payDeNaissance: new FormControl(null),
      Nationnalite: new FormControl(null)
      // paginateSelect: new FormControl(null)
    })
  }

  initSaveForm(){
    this.CandidatSaveForm = this.formBuilder.group({
      nom: new FormControl(null, [Validators.required]),
      prenom: new FormControl(null, [Validators.required]),
      dateDeNaissance: new FormControl(null, [Validators.required]),
      lieuDeNaissance: new FormControl(null, [Validators.required]),
      academie: new FormControl(null, [Validators.required]),
      annee: new FormControl(null, [Validators.required]),
      genre: new FormControl(null, [Validators.required]),
      modeAdmission: new FormControl(null, [Validators.required]),
      numMatricule: new FormControl(null, [Validators.required]),
      numPlaceBac: new FormControl(null, [Validators.required]),
      sessionBac: new FormControl(null, [Validators.required]),
      specialite: new FormControl(null, [Validators.required]),

    })
  }


}


