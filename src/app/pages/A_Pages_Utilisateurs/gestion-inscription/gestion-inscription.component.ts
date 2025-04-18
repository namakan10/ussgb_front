import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CandidatureService } from '../../../services/candidature.service';
import { PreInscriptionServiceService } from '../../../services/pre-inscription-service.service';
import { StructureService } from '../../../services/structure.service';
import jspdf from 'jspdf';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {fromArray} from "rxjs-compat/observable/fromArray";
import {Util_fonction} from "../../models/util_fonction";
import {_HTTP, PAG_MIDLE_SIZE, PAG_SMALL_SIZE, UNIV_NAME, UNIV_SIGLE} from "../../../CONSTANTES";
import {ThemePalette} from "@angular/material/core";
import {FraisService} from "../../../services/GestionFrais/frais.service";
import * as Util from "util";
import {environment} from "../../../../environments/environment";
import {PersonnelAdminService} from "../../../services/GestionPersonnelAdmin/personnel-admin.service";
import * as XLSX from 'xlsx';
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-gestion-inscription',
  templateUrl: './gestion-inscription.component.html',
  styleUrls: ['./gestion-inscription.component.scss']
})
export class GestionInscriptionComponent implements AfterViewInit  {
  univ_sigle = UNIV_SIGLE;
  univ_name = UNIV_NAME;
  _http = _HTTP;
  _asset_image = environment._ASSET_IMAGE;
  Env = environment.env;
  somme;
  user = JSON.parse(sessionStorage.getItem('user'));
  list: any = [];
  select: any = {};
  error: any;
  message;

  numQuittancier; numQuittance;
  _RECTORAT: boolean =  this.user.structure.type === 'RECTORAT';


  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['numDossier', 'prenom', 'date_de_naissance', 'telephone', 'typeCandidat', 'statut', 'fraisTraitementDossier', 'action'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // tslint:disable-next-line:max-line-length
  displayedColumns2: string[] = ['numDossier', 'numMatricule', 'prenom', 'nom', 'date_de_naissance', 'telephone', 'nationalite', 'codeOption', 'groupe', 'scolarite', 'action'];
  dataSource2;
  @ViewChild(MatPaginator, {static: true}) paginator2: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort2: MatSort;
  telephone;
  prenom;
  nom;
  anneeStructure: any;
  listComptable: any = [];
  spinner1 = true;
  spinner = false;
  id_personnel: any;
  annee_scolaire;
  niveau;
  etat_paiement;
  admis;
  approbation;
  type = false;
  param = '';
  date_debut: any;
  date_fin: any;
  hasRole = false;
  diff = '';
  date = new Date();
  datePreInscription;
  pageSize = PAG_MIDLE_SIZE;
  pageSizeOptions = [PAG_MIDLE_SIZE];
  length = 100;

  PaiementSendData = {
    "anneeScolaire": null,
    "candidat_id": null,
    "datePaiement": null,
    "details": null,
    "etudiant_id": null,
    "modePaiement": null,
    "montantPaye": null,
    "motif": null,
    "num": null,
    "numPaiement": null,
    "source": null
  }
  ModePayementForm: FormGroup;
  SelectCandidat: any;
  motifSelect: any;
  showForm: boolean = false;
  motifManul: boolean = false;
  encaissement_spinner: boolean = false;
  scolarite : boolean = false;
  showAttestPay : boolean = false;
  echelonPay : boolean = false;
  fraisMessage = "";
  Pay: number;
  RestToPay: number;

  CurrentAnnee: any;
  inscriptCas = "";

  annee_scolaire2: any;

  silde_color: ThemePalette = 'accent';
  silde_checked: boolean = false;
  silde_disabled: boolean = false;
  showTpay: boolean = false;
  constructor(private structureService: StructureService,
              private preinscription: PreInscriptionServiceService,
              private fraisService: FraisService,
              private utilisateurService: PersonnelAdminService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute, public datepipe: DatePipe,
              private candidatureService: CandidatureService) {

    if(this.user) {
      // if (this._RECTORAT){
      //   this.GetAllStructures();
      // }else {
        this.structureId = +this.user.structure.id;
        this.initAnneeScolaire();
      // }
    }

    this.initForm();
    this.route
      .queryParams
      .subscribe(params => {
        this.dataSource = null;
        // Defaults to 0 if no query param provided.
        this.param = params['param'];
        this.diff = params['type'];
        if (this.param === 'oui') {
          this.etat_paiement = true;
          this.approbation = null;
          this.admis = null;
        } else if (this.param === 'non') {
          this.etat_paiement = false;
          this.approbation = null;
          this.admis = null;
        }

        if (this.diff === 'Frais de traitement de dossiers') {
          this.type = true;
          this.motifManul = false;
          this.motifSelect = 'FRAIS_TRAITEMENT_DOSSIER';
        } else {
          this.type = false;
          if (this.diff === "Frais d'inscription"){
            this.motifManul = false;
            this.motifSelect = 'FRAIS_INSCRIPTION';
          } else {
            this.seletMotifManuel();
          }
        }
      });

    this.getComtables();

    if (this.user.users.personnel) {
      this.id_personnel = this.user.users.personnel.id;
    }
  }

  ngAfterViewInit() {
  }

  Structures;
  structureId;
  GetAllStructures(){
    this.structureService.getStuctures().subscribe(
      (res) => {
        this.Structures = res.filter(s => s.type !== "RECTORAT");
      });
  }
  StructureSelected;
  StructureChange(event){
    this.structureId = +event.target.value;
    this.listComptable = [];
    this.dataSource = new MatTableDataSource([]);
    this.StructureSelected = this.Structures.find(s => s.id.toString() === event.target.value.toString());
    this.initAnneeScolaire();
    this.getComtables();
  }

  getComtables(){
    this.structureService.getComptableList(this.user.structure.id).subscribe(
      (res) => {
        this.listComptable = res;
        this.spinner1 = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }

  exportexcel() {
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'frais-paiement.xlsx');
 }


  seletMotifManuel(){
    this.motifManul = true
    this.ModePayementForm.controls.motif.setValidators([Validators.required]);
    this.ModePayementForm.controls.motif.updateValueAndValidity();
  }

  CheckIfNotNull(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }


  TotalPay = 0;
  afficher(pagination?: any) {
    this.annee_scolaire2 = this.annee_scolaire;
    this.somme = undefined;
    this.spinner = true;
    this.scolarite = false;
    if (this.diff === 'Frais de traitement de dossiers') {
      const data: any = {
        id_structure: +this.structureId,
        annee: this.annee_scolaire,
        niveau: this.niveau,
        prenom: this.prenom,
        nom: this.nom,
        etat_paiement: this.etat_paiement,
        datePreInscription: this.datepipe.transform(this.datePreInscription, 'yyyy-MM-dd'),
        page: pagination ? pagination.pageIndex : 0,
        size: pagination ? pagination.pageSize : 50,
        telephone: this.telephone,
      };
      if (this.admis !== 'null' && this.admis !== null) {
        data.admis = this.admis;
      }
      if (this.approbation !== 'null' && this.approbation !== null) {
        data.approbation = this.approbation;
      }
      let path = '';
      if (this.param === 'non') {
        path = '/comptable';
      } else {
        path = '/secretaire';
      }
      this.candidatureService.listCandidature(path, data).subscribe(
        (res) => {
          // if (Util_fonction.checkIfNoTEmpty(res) && Object.keys(res).length > 0){
          this.dataSource = new MatTableDataSource(res.content);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_MIDLE_SIZE, this.dataSource.data);
          // } else {
          //   Util_fonction.AlertMessage("warning", "Veuillez définir les frais pour le cursus Sélection")
          // }

          this.spinner = false;
        },
        (error) => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        });
    } else if (this.diff === 'Les encaissements') {
      if (!this.CheckIfNotNull(this.date_debut) || !this.CheckIfNotNull(this.date_debut) || !this.CheckIfNotNull(this.id_personnel)){
        Util_fonction.AlertMessage("warning", "Veuiller renseigner les champs obligatoires");
        this.spinner = false;
        return;
      }
      this.list = [];
      this.dataSource = [];
      const data = {
        id_personnel: this.id_personnel,
        id_structure: +this.structureId,
        dateDebut: this.datepipe.transform(this.date_debut, 'yyyy-MM-dd'),
        dateFin: this.datepipe.transform(this.date_fin, 'yyyy-MM-dd'),
      };

      this.preinscription.mesEncaissementSum(data).subscribe(
        (res) => {
          this.somme = res;
          this.spinner = false;
        },
        (error) => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        });


      this.preinscription.mesEncaissementList(data).subscribe(
        (res) => {
          this.dataSource = new MatTableDataSource([]);
          res.content.forEach(element => {
            this.list.push({
              numPreInscription: element.numPaiement,
              niveau: element.niveau,
              prenom: Util_fonction.checkIfNoTEmpty(element.candidat) ? element.candidat.prenom : element.etudiant.prenom,
              nom: Util_fonction.checkIfNoTEmpty(element.candidat) ? element.candidat.nom : element.etudiant.nom,
              telephone: Util_fonction.checkIfNoTEmpty(element.candidat) ? element.candidat.telephone : element.etudiant.telephone,
              nationalite: Util_fonction.checkIfNoTEmpty(element.candidat) ? element.candidat.nationalite : element.etudiant.nationalite,
              fraisInscription: element.montantPaye,
              typeCandidat: Util_fonction.checkIfNoTEmpty(element.candidat) ?  element.candidat.typeCandidat : element.etudiant.typeCandidat,
              codeOption: element.heurePaiement.toString().replace(',', 'h'),
            });
          });
          if (Object.keys(res.content).length > 0){
            this.dataSource = new MatTableDataSource(this.list);
            this.dataSource.paginator = this.paginator;
          }else {
            this.dataSource = [];
            this.dataSource.paginator = this.paginator;
          }
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_MIDLE_SIZE, this.dataSource.data);
          // paginatSequence2(PAG_SMALL_SIZE, res.totalElements);

          this.spinner = false;
        },
        (error) => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        });
    } else if (this.diff === 'scolarite'){
      this.scolarite = true;
      const data = {
        id_structure: +this.structureId,
        // id_structure: +this.structureId,
        annee: this.annee_scolaire,
        niveau: this.niveau,
        page: pagination ? pagination.pageIndex : 0,
        size: pagination ? pagination.pageSize : 50,
        telephone: this.telephone,
        prenom: this.prenom,
        nom: this.nom,
      };
      this.preinscription.listInscrits(data).subscribe(
        (res) => {
          this.length = res.totalElements;
          this.dataSource2 = new MatTableDataSource(res.content);
          this.dataSource2.paginator = this.paginator2;
          this.dataSource2.sort = this.sort2;
          this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_MIDLE_SIZE, this.dataSource2.data);
          this.spinner = false;
        } ,error => {
          Util_fonction.AlertMessage(error.error.status, error.error.message);
          this.spinner = false;
        });

    }
    else {
      let ans_resp = null;


      // if (this.user.structure.sigle === "FSEG"){
      //   ans_resp = "other";
      // } else {
      //   ans_resp = "usttb";
      // }


      const data = {
        id_structure: +this.structureId,
        // id_structure: +this.structureId,
        annee: this.annee_scolaire,
        niveau: this.niveau,
        etat_paiement: this.etat_paiement,
        datePreInscription: this.datepipe.transform(this.datePreInscription, 'yyyy-MM-dd'),
        page: pagination ? pagination.pageIndex : 0,
        size: pagination ? pagination.pageSize : 50,
        telephone: this.telephone,
        prenom: this.prenom,
        nom: this.nom,
        ans_resp: ans_resp,
      };
      this.preinscription.preInscriptions(data).subscribe(
        (res) => {
          if (Util_fonction.checkIfNoTEmpty(res) && Object.keys(res).length > 0){
            this.length = res.totalElements;
            this.dataSource = new MatTableDataSource(res.content);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_MIDLE_SIZE, this.dataSource.data);
            this.spinner = false;
          } else {
            Util_fonction.AlertMessage("warning", "Veuillez définir les frais pour le cursus Sélection");
            this.spinner = false;
          }

        },
        (error) => {
          Util_fonction.AlertMessage(error.error.status, error.error.message);
          this.spinner = false;
        });
    }

    if (this._RECTORAT){
      this.dataSource.forEach(d => {
        this.TotalPay += +d.fraisInscription;

      });

      this.showTpay = true;
    }

  }

  /**
   * Verification
   * @param element
   */
  checkFrais(element){
    if (element.hasOwnProperty("fraisTraitementDossier")){
      if (Util_fonction.checkIfNoTEmpty(element.fraisTraitementDossier)){
        return true;
      } else {
        this.fraisMessage = "frais de dossier non définie";
        return false;
      }
    }

    if (element.hasOwnProperty("fraisInscription")) {
      if (Util_fonction.checkIfNoTEmpty(element.fraisInscription)){
        return true;
      } else {
        this.fraisMessage = "frais d'inscription non définie";
        return false;
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  modeChange(){
    let change = this.ModePayementForm.controls.mode.value;

    if (change === 'CHEQUE' || change === 'VIREMENT'){
      this.ModePayementForm.controls.source.setValidators([Validators.required]);
      this.ModePayementForm.controls.source.updateValueAndValidity();
    } else {
      // this.ModePayementForm.controls.source.reset();
      this.ModePayementForm.controls.source.clearValidators();
      this.ModePayementForm.controls.source.updateValueAndValidity();
    }
  }

  // Get
  releveFrais: any = undefined;
  modePayModal(element){
    this.releveFrais = undefined;
    this.silde_checked = false;
    this.initForm();

    // Desactivation echelonement
    this.ModePayementForm.controls.echelonPayMontant.reset();
    this.ModePayementForm.controls.echelonPayMontant.clearValidators();
    this.ModePayementForm.controls.echelonPayMontant.updateValueAndValidity();
    this.echelonPay = false;

    if (environment.env === "ussgb" && element.hasOwnProperty("statut")){

      if (Util_fonction.checkIfNoTEmpty(element.statut)){
        this.inscriptCas = "reInscriptions/paiement";
      } else {
        this.inscriptCas = "paiements";
      }
    } else {
      this.inscriptCas = "paiements";
    }


    if (element.hasOwnProperty("element")){
      this.SelectCandidat = element.etudiant.user;
    } else {
      this.SelectCandidat = element;
    }

    // this.releveMontant =

    let fraisBody = {
      id_structure: +this.structureId,
      type_frais: 'FRAIS_RELEVE_NOTE',
      id_filiere: null,
      type_candidat: Util_fonction.checkIfNoTEmpty(element.typeCandidat) ? element.typeCandidat.toString() : null,
    }

    //
    if (!Util_fonction.checkIfNoTEmpty(fraisBody.type_candidat)){
      Util_fonction.AlertMessage('warning', '<strong class="text-danger">Attention! </strong> <br>ce candidat n\'a pas de type de profil. Veuillez le signaler à l\'administrateur');
    } else {

      this.fraisService.get_Frais_filter(fraisBody).subscribe(
        res => {
          if (Object.keys(res).length <= 0){
            Util_fonction.AlertMessage('warning', 'Veuillez demander à l\'administrateur de définir les frais de <strong>Rélevé de note</strong> pour le type de profil <strong>'+fraisBody.type_candidat+'</strong>');
          } else {
            this.releveFrais = res;
            // Affichage du modal
            this.showForm = true;
            $('#modePayFormModal').modal({
              backdrop: 'static',
              keyboard: false
            });
            $('#modePayFormModal').appendTo('body');
          }

        },error => {
          Util_fonction.AlertMessage(error.error.status, error.message);
        });

    }



  }

  modePayEchelone(element){
    this.initForm();

    // Activation echelonement
    this.ModePayementForm.controls.echelonPayMontant.setValidators([Validators.required, Validators.pattern('[0-9]*')]);
    this.ModePayementForm.controls.echelonPayMontant.updateValueAndValidity();
    this.echelonPay = true;

    if (element.hasOwnProperty("element")){
      this.SelectCandidat = element.etudiant.user;
    } else {
      this.SelectCandidat = element;
    }

    this.showForm = true;
    $('#modePayFormModal').modal('show');
    $('#modePayFormModal').appendTo('body');
  }

  /**
   *
   * @constructor
   */
  SavePayement(){
    this.paiementInscription(this.SelectCandidat);
  }


  paiementInscription(donnee) {
    // this.spinner = true;
    this.message = null;
    this.error = null;
    Swal.fire({
      icon: 'info',
      title: 'Voulez-vous confirmer l\'encaissement?',
      showCancelButton: true,
      confirmButtonText: `Oui, je confirme`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.encaissement_spinner = true;

        let data = {
            montantPaye : this.type === true ? donnee.fraisTraitementDossier : donnee.fraisInscription,
            modePaiement : this.ModePayementForm.controls.mode.value,
            motif : (this.motifManul ? this.ModePayementForm.controls.motif.value : this.motifSelect),
            num : this.type === true ? donnee.numDossier : donnee.numPreInscription,
            numPaiement: null,
            source: this.ModePayementForm.controls.source.value,
            num_quittancier:this.numQuittancier,
            num_quittance: this.numQuittance,

            // numQuittancier: this.numQuittancier,
            // numQuittance: this.numQuittance,

            anneeScolaire: this.annee_scolaire,
            candidat_id: donnee.idCandidat,
            datePaiement: null,
            details: "payement",
            etudiant_id: donnee.idEtudiant,
            niveau: this.ModePayementForm.controls.niveau.value,
            semestre: Util_fonction.checkIfNoTEmpty(this.ModePayementForm.controls.semestre.value) ? +this.ModePayementForm.controls.semestre.value : null,

          };

        this.SavePay(data, donnee);

        // } else {
        //   // let montDUE = this.type === true ? donnee.fraisTraitementDossier : donnee.fraisInscription;
        //   data = {
        //     montantPaye : this.type === true ? donnee.fraisTraitementDossier : donnee.fraisInscription,
        //     modePaiement : this.ModePayementForm.controls.mode.value,
        //     motif : this.motifManul ? this.ModePayementForm.controls.motif.value : this.motifSelect,
        //     source: this.ModePayementForm.controls.source.value,
        //     anneeScolaire: this.annee_scolaire,
        //     datePaiement: null,
        //     details: "payement",
        //     etudiant_id: donnee.idEtudiant,
        //   }
          // if (data.montantPaye <=  montDUE){
          //   this.Pay = data.montantPaye;
          //   this.RestToPay = montDUE - data.montantPaye;
          //   this.SavePay(data, donnee);
          // } else {
          //   this.encaissement_spinner = false;
          //   Util_fonction.AlertMessage("warning", "Le montant entré (<strong class='text-danger'> "+data.montantPaye+" </strong>) est supérieur au montant à payer (<strong class='text-info'>"+montDUE+"</strong>)!")
          // }

      //   }

      //
      } else {
        this.spinner = false;
      }
    });
  }

  releveQuestion(event){
    this.silde_checked = event.checked;
    if (this.silde_checked){
      this.ModePayementForm.controls.niveau.setValidators([Validators.required]);
      this.ModePayementForm.controls.niveau.updateValueAndValidity();

      this.ModePayementForm.controls.semestre.setValidators([Validators.required]);
      this.ModePayementForm.controls.semestre.updateValueAndValidity();
    } else {
      this.ModePayementForm.controls.niveau.reset();
      this.ModePayementForm.controls.niveau.clearValidators();
      this.ModePayementForm.controls.niveau.updateValueAndValidity();

      this.ModePayementForm.controls.semestre.reset();
      this.ModePayementForm.controls.semestre.clearValidators();
      this.ModePayementForm.controls.semestre.updateValueAndValidity();
    }
  }

  checkeIfIsEmpty(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

  afterPayData;
  SavePay(data, donnee){
    this.afterPayData = null;

    if (this.silde_checked){
      data.montantPaye = this.releveFrais[0].frais; //5000 ;//this.releveFrais;
      // data.motif = this.releveFrais[0].typeFrais; // 'FRAIS_RELEVE_NOTE';
      data.details = "paiement des frais d'inscription et de la fiche de notes du semestre "+data.semestre+", niveau "+data.niveau; // 'FRAIS_RELEVE_NOTE';


      this.preinscription.paiementFrais(data,this.inscriptCas).subscribe(
        (res) => {
          this.afterPayData = res;
          this.numQuittancier= null;
          this.numQuittance = null;

          $('#modePayFormModal').modal('hide');
          this.encaissement_spinner = false;
          this.convetToPDF(donnee);
          this.afficher();
        },
        (error) => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
          this.encaissement_spinner = false;
        });

    } else{

      // this.convetToPDF(donnee);
      this.preinscription.paiementFrais(data,this.inscriptCas).subscribe(
        (resp) => {
          this.afterPayData = resp;
          $('#modePayFormModal').modal('hide');
          this.encaissement_spinner = false;
          this.convetToPDF(donnee);
          this.afficher();
        },
        (error1) => {
            Util_fonction.AlertMessage(error1.error.status,error1.error.message);
          this.spinner = false;
          this.encaissement_spinner = false;
        });

    }
  }
  logo(logo) {
    return logo.split('/')[5];
  }

  parseImage(img: string): string {
    if(!img) return;
    return img.includes("public.") ? "https://" + img : "http://" + img ;
  }

  
  hasRoleChefComptable() {
    this.hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_CHEF_COMPTABLE' || item['nom'] === 'ROLE_ADMIN') {
          this.hasRole = true;

        }
      });
      return this.hasRole;
    }
  }

  supprimerInscription(element) {
    this.spinner = true;
    this.message = null;
    this.error = null;
    Swal.fire({
      icon: 'info',
      title: 'Voulez-vous confirmer l\'annulation du paiement?',
      showCancelButton: true,
      confirmButtonText: `Oui, annuler`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.preinscription.supprimerInscription(element.paiement.id).subscribe(
          (res) => {
            Util_fonction.SuccessMessage(res);
            this.spinner = false;
            this.afficher();
          },
          (error) => {
            Util_fonction.AlertMessage(error.error.status,error.error.message);
            this.spinner = false;
          });
      } else {
        this.spinner = false;
      }
    });
  }

  public convetToPDF(select) {
    this.select = {};
    this.select = select;
    this.showAttestPay = true;

    $('#exampleModalP1').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#exampleModalP1').appendTo('body');
  }

  imprimer() {
    this.spinner = true;
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/jpeg');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 15;
      pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
      pdf.save('attestation.pdf'); // Generated PDF
      this.spinner = false;
      // this.showAttestPay = false;
    });
  }

  initForm(){
    this.ModePayementForm = this.formBuilder.group({
      mode: new FormControl(null, [Validators.required]),
      motif: new FormControl(null),
      source: new FormControl(null),
      niveau: new FormControl(null),
      semestre: new FormControl(null),

      echelonPayMontant: new FormControl(null)
    });

    this.date_fin = null;
    this.date_debut = null;
    this.id_personnel = null;
  }


  initAnneeScolaire(){
    this.structureService.getStuctureAnnees(this.structureId).subscribe(
      (res) => {

        for (let ans of res) {
          if (ans.statut = "EN_COURS") {
            this.CurrentAnnee = ans.anneeScolaire;
          }
        }

        this.anneeStructure = res;
        this.spinner1 = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
  }

  checkUndefined(element){
    return Util_fonction.checkIfNoTEmpty(element)
  }

}
