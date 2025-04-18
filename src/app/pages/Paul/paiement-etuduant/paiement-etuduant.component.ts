import {Component, OnInit, ViewChild} from '@angular/core';
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Util_fonction} from "../../models/util_fonction";
import {StructureService} from "../../../services/structure.service";
import {PayementService} from "../../../services/Payement/payement.service";
import {PaiementService} from "../../../services/GestionFrais/paiement.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import {_HTTP, _HTTP_PHOTO, PAG_MIDLE_SIZE, UNIV_FILIERE} from "../../../CONSTANTES";
import {FraisInscriptionService} from "../../../services/GestionFrais/frais-inscription.service";
import * as Util from "util";
declare var $: any;
@Component({
  selector: 'app-paiement-etuduant',
  templateUrl: './paiement-etuduant.component.html',
  styleUrls: ['./paiement-etuduant.component.css']
})



export class PaiementEtuduantComponent implements OnInit {
_http = _HTTP;
  displayedColumns: string[] = ['numEtudiant', 'nom','typeCandidat','totalRequis','totalPaye','restant','action'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  pageSize = PAG_MIDLE_SIZE;
  pageSizeOptions = [PAG_MIDLE_SIZE];
  length = 100;



  id_paiement: any;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  dateTime = new Date()

  etudiantGetBody ={
    anneeScolaire: null,
    id_structure: null,
    codeOption: null,
    niveau: null,
    nom: null,
    numEtudiant: null,
    motif: null,
    tout_payer: null,
    type_candidat: null,
    page: 0,
    size: 10000000
  }
  getBody = {
    idEtudiant: null,
    id_structure: null,
  }

  sendBody = {
    anneeScolaire : null,
    datePaiement : null,
    details : null,
    etudiant_id: null,
    modePaiement : null,
    montantPaye: null,
    motif : null,
    source : null
  }
  user = JSON.parse(sessionStorage.getItem("user"));
  anneeStructure:any;

  searchForm: FormGroup;
  ModePayementForm: FormGroup;
  EtudiantSelect: any;

  chargeSpinner: boolean = false;

  Pages = [];
  pageTotal: any;
  showInfoModal: boolean = false;
  showForm: boolean = false;
  encaissement_spinner: boolean = false;
  spinner : boolean = false;
  imprimespinner : boolean = false;
  showRecuPay : boolean = false;

  Pay_historique: any;
  select: any;

  nomEtud: any;
  montEtud: any;
  action: any;
  EtudiantInfo: any;
  _RECTORAT: boolean =  this.user.structure.type === 'RECTORAT';
  _DOYEN: boolean = false;
  _ADMIN: boolean = false;
  univ_fil = UNIV_FILIERE;
  structureId;
  Structures;
  constructor(
    private etudiantService: EtudiantService,
    private paiementService: PaiementService,
    private structureService: StructureService,
    private formBuilder: FormBuilder,
    private statiqueService: FraisInscriptionService
  ) {}

  ngOnInit() {
    this.initForm();
    this.initPayForm();
    this._DOYEN = Util_fonction.checkIfAsRole(this.user,"ROLE_DOYEN");
    this._ADMIN = Util_fonction.checkIfAsRole(this.user,"ROLE_ADMIN");
    // if (this._RECTORAT){
    //   this.GetAllStructures();
    // }else {
      this.structureId = this.user.structure.id;
      this.GetAnneeCurrentS();
    // }
  }

  GetAllStructures(){
    this.structureService.getStuctures().subscribe(
      (res) => {
        this.Structures = res.filter(s => s.type !== "RECTORAT");
      });
  }
  exportexcel() {
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'paiement-echalonne.xlsx');
 }
  StructureSelected;
  StructureChange(event){
    this.structureId = +event.target.value;
    this.StructureSelected = this.Structures.find(s => s.id.toString() === event.target.value.toString());
    this.GetAnneeCurrentS();
  }

  GetAnneeCurrentS(){
    this.structureService.getStuctureAnnees(this.structureId).subscribe(
      (res) => {
        this.anneeStructure = res;
      },(error) => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      });

  }
  searchEtudiantForm(){
    this.PayResult = "";
    this.chargeSpinner = true;
    this.showPayStatResult = false;
    this.etudiantGetBody.id_structure = this.structureId;
    this.etudiantGetBody.nom = this.searchForm.controls.nomS.value;
    this.etudiantGetBody.numEtudiant = this.searchForm.controls.numEtudiantS.value;
    this.etudiantGetBody.niveau = this.searchForm.controls.niveauS.value;
    this.etudiantGetBody.codeOption = this.searchForm.controls.codeOptionS.value;
    this.etudiantGetBody.anneeScolaire = this.searchForm.controls.anneeScolaireS.value;
    this.etudiantGetBody.tout_payer = this.searchForm.controls.etatPayementS.value;
    this.etudiantGetBody.type_candidat = this.searchForm.controls.typeCandidatS.value;
    this.etudiantGetBody.motif = this.searchForm.controls.motifS.value;

    this.paiementService.GetEtudiant_suivie(this.etudiantGetBody).subscribe(
      res => {
        console.log(Object.keys(res.content).length);
        this.dataSource = new MatTableDataSource(res.content);
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_MIDLE_SIZE, this.dataSource.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (!Util_fonction.checkIfNoTEmpty(this.pageTotal)){
          this.sequencePage(res.totalPages);
        }
        let som = 0;
        res.content.forEach(r => {
          som = +som + +r.totalPaye;
        });


        if (this.checkIfIsNotEmpty(this.searchForm.controls.niveauS.value)){
          this.PayResult = "Le montant est de : "+Util_fonction.formatMoneyNumeric(som);
        }else {
          this.PayResult = "Le montant glogal est de : "+Util_fonction.formatMoneyNumeric(som);
        }

        // if (this._RECTORAT){
        //   this.PaiementStat();
        // }

        this.chargeSpinner = false;
        if (this.checkIfIsNotEmpty(this.PayResult)){
          this.showPayStatResult = true;
        }

      }, error => {
        this.chargeSpinner = false;
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })

  }

  PayResult = "";
  showPayStatResult: boolean =false;
  PaiementStat(){
    const sendBody = {
      id_structure: this.structureId,
      annee_scolaire: this.searchForm.controls.anneeScolaireS.value,
      niveau: this.checkIfIsNotEmpty(this.searchForm.controls.niveauS.value),
      cursus: false,
      motif: false
    }
    this.statiqueService.statistiquePaiements(sendBody).subscribe(
      res =>{
        console.log(res);
        if (this.checkIfIsNotEmpty(this.searchForm.controls.niveauS.value)){
          console.log("Niveau Oui -->")
          res.forEach(r => {
            if (r.niveau.toString() ===  this.searchForm.controls.niveauS.value.toString()){
              this.PayResult = "Le montant Pour le niveau "+r.niveau+" est de : "+Util_fonction.formatMoneyNumeric(r.montant);
            }
          })

        }else {
          console.log("Niveau Non -->")
          this.PayResult = "Le montant glogal est de : "+Util_fonction.formatMoneyNumeric(res[0].montant);
          // this.aff_spinner = false;
        }
        if (this.checkIfIsNotEmpty(this.PayResult)){
          this.showPayStatResult = true;
        }
      }
    )
  }

  sequencePage(totalPages){
    this.pageTotal = totalPages;
    for (let i =0; i<=totalPages; i++){
      this.Pages.push(i);
    }
  }

  /**
   * Consulter l'historique de payement d'un étudiant
   * @param element
   */
  getEtudiantSuivie(element){
    console.log(element);
    this.Pay_historique = null;
    this.EtudiantInfo = null;
    this.EtudiantInfo = element;
    this.paiementService.suivieEtutidant_Pay(element.idEtudiant).subscribe(
      res =>{
        console.log(res);
        this.Pay_historique = res;
        $('#PayhistoriqueModal').modal('show');
        $('#PayhistoriqueModal').appendTo('body');
        this.showInfoModal = true;
      }, error => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      });
  }

  modePayModal(element){
    console.log(element);
    this.action = "save";
    this.showForm = true;
    this.sendBody.etudiant_id = element.idEtudiant;
    this.initPayForm();

    this.EtudiantSelect = element;

    $('#modePayFormModal').modal('show');
    $('#modePayFormModal').appendTo('body');
  }

  paginateEvent(page) {
    let value = page.value;
    if (value >=0 && value <= this.pageTotal) {
      this.chargeSpinner = true;
      this.etudiantGetBody.page = value;
      this.searchEtudiantForm()
    }
  }

  SavePayement(){
    this.encaissement_spinner = true;
    this.nomEtud = this.EtudiantSelect.prenom +" "+this.EtudiantSelect.nom;
    this.montEtud = this.ModePayementForm.controls.montantPaye.value;

      this.sendBody.montantPaye = +this.ModePayementForm.controls.montantPaye.value;
      this.sendBody.modePaiement = this.ModePayementForm.controls.modePaiement.value;
      this.sendBody.motif = this.ModePayementForm.controls.motif.value;
      this.sendBody.source = this.ModePayementForm.controls.source.value;

      this.sendBody.anneeScolaire = this.searchForm.controls.anneeScolaireS.value;
      this.sendBody.datePaiement = null;//this.ModePayementForm.controls.datePaiement.value;
      this.sendBody.details = this.ModePayementForm.controls.details.value;
    console.log(this.sendBody);
    if (this.EtudiantSelect.restant >= this.sendBody.montantPaye){
      this.paiementInscription(this.sendBody);
    } else {
      Util_fonction.AlertMessage("warning", "Le montant entré (<strong class='text-danger'> "+this.sendBody.montantPaye+" </strong>) est supérieur au reste due (reste à payer : <strong class='text-info'>"+this.EtudiantSelect.restant+"</strong>)!")
    }
  }

  paiementInscription(donnee) {
    // this.spinner = true;
    Swal.fire({
      icon: 'info',
      title: 'Voulez-vous confirmer l\'encaissement?',
      showCancelButton: true,
      confirmButtonText: `Oui, je confirme`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.paiementService.paiement_Frais(donnee).subscribe(
          (res) => {
            Util_fonction.SuccessMessage(res);
            $('#modePayFormModal').modal('hide');
            this.encaissement_spinner = false;
            this.convetToPDF(donnee);
            this.searchEtudiantForm();
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

  /**
   * AFFICHE LE RECU DE PAYEMENT
   * @param select
   */
  public convetToPDF(select) {
    this.showRecuPay = true
    this.select = [];
    this.select = select;

    // this.BindCrosImage('structLogo', this.user.structure.logo);

    $('#recuPayModal').modal('show');
    $('#recuPayModal').appendTo('body');
  }

  /***
   * IMPRESSION DU RECU DE PAYEMENT
   */
  imprimer() {
    this.imprimespinner = true;
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
      this.imprimespinner = false;
    });
  }

  BindCrosImage(iD, image){
    fetch(_HTTP_PHOTO+image)
      .then(function(data){
        return data.blob();
      })
      .then(function(img){
        let dd = URL.createObjectURL(img);

        if (iD !== 'photo_etudiant'){
          $('.'+iD).attr('src', dd);
        }else {
          $('#'+iD).attr('src', dd);
        }
      })
  }

  logo(logo) {
    return logo.split('/')[5];
  }

  checkIfIsNotEmpty(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

  modeChange(){
    let change = this.ModePayementForm.controls.modePaiement.value;

    if (change === 'CHEQUE' || change === 'VIREMENT'){
      this.ModePayementForm.controls.source.setValidators([Validators.required]);
      this.ModePayementForm.controls.source.updateValueAndValidity();
    } else {
      // this.ModePayementForm.controls.source.reset();
      this.ModePayementForm.controls.source.clearValidators();
      this.ModePayementForm.controls.source.updateValueAndValidity();
    }
  }

  showDescription(source,detail){
    let des = "";
    if (Util_fonction.checkIfNoTEmpty(source)){
      des += "<div><span class='badge badge-light'>Source :</span> <br>" +source+
        "</div>";
    }

    if (Util_fonction.checkIfNoTEmpty(detail)){
      des += "<div><span class='badge badge-light'>Source :</span> <br>" +detail+
        "</div>";
    }

    Util_fonction.AlertMessage("info", des);
}

  modifier(element){
    let conv = new Util_fonction();
    this.EtudiantSelect = null;
    console.log(this.Pay_historique);
    this.showForm = true;
    this.action = "modif";
    this.id_paiement = element.id;
    this.sendBody.etudiant_id = element.etudiant.id;
    this.initPayForm();

    this.EtudiantSelect = {
      nom: element.etudiant.nom,
      prenom: element.etudiant.prenom,
      numEtudiant: element.etudiant.numEtudiant,
      // modePaiement: this.Pay_historique.modePaiement,
      // montantPaye: this.Pay_historique.montantPaye,
      // motif: this.Pay_historique.motif,
      // source: this.Pay_historique.source,
    };
    this.ModePayementForm.controls.modePaiement.setValue(element.modePaiement);
    this.ModePayementForm.controls.montantPaye.setValue(element.montantPaye);
    this.ModePayementForm.controls.motif.setValue(element.motif);
    this.ModePayementForm.controls.source.setValue(element.source);

    this.sendBody.datePaiement = conv.DateConvert(element.datePaiement);

    $('#modePayFormModal').modal('show');
    $('#modePayFormModal').appendTo('body');
  }

  UpdatePaiement() {

    this.encaissement_spinner = true;
    // this.nomEtud = this.EtudiantSelect.prenom +" "+this.EtudiantSelect.nom;
    // this.montEtud = this.ModePayementForm.controls.montantPaye.value;

    this.sendBody.montantPaye = +this.ModePayementForm.controls.montantPaye.value;
    this.sendBody.modePaiement = this.ModePayementForm.controls.modePaiement.value;
    this.sendBody.motif = this.ModePayementForm.controls.motif.value;
    this.sendBody.source = this.ModePayementForm.controls.source.value;

    this.sendBody.anneeScolaire = this.searchForm.controls.anneeScolaireS.value;
    // this.sendBody.datePaiement = this.ModePayementForm.controls.datePaiement.value;
    this.sendBody.details = this.ModePayementForm.controls.details.value;
    console.log(this.sendBody);
    // if (this.EtudiantSelect.restant >= this.sendBody.montantPaye){
    //   this.paiementInscription(this.sendBody);
    // } else {
    //   Util_fonction.AlertMessage("warning", "Le montant entré (<strong class='text-danger'> "+this.sendBody.montantPaye+" </strong>) est supérieur au reste due (reste à payer : <strong class='text-info'>"+this.EtudiantSelect.restant+"</strong>)!")
    // }

    this.paiementService.update_paiement_Frais(this.id_paiement, this.sendBody).subscribe(
      (res) => {
        $('#modePayFormModal').modal('hide');
        this.encaissement_spinner = false;
        Util_fonction.SuccessMessage(res);
        this.searchEtudiantForm();
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      });

  }

  initForm(){
    this.searchForm = this.formBuilder.group({
      // structure.: new FormControl(null, this._RECTORAT ? [Validators.required] : []),
      anneeScolaireS: new FormControl(null, [Validators.required]),
      codeOptionS: new FormControl(null),
      niveauS: new FormControl(null),
      nomS: new FormControl(null),
      numEtudiantS: new FormControl(null),
      typeCandidatS: new FormControl(null),
      etatPayementS: new FormControl(null),
      motifS: new FormControl(null)

    })
  }
  initPayForm(){
    this.ModePayementForm = this.formBuilder.group({
      modePaiement: new FormControl(null, [Validators.required]),
      motif: new FormControl(null, [Validators.required]),
      source: new FormControl(null),
      montantPaye: new FormControl(null,[Validators.required]),
      anneeScolaire: new FormControl(null),
      datePaiement: new FormControl(null),
      details: new FormControl(null),
      num: new FormControl(null),
      numPaiement: new FormControl(null),

    })
  }

}
