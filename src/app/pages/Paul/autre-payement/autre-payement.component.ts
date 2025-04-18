import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StructureService} from "../../../services/structure.service";
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";
import {FiliereService} from "../../../services/GestionFilieres/filiere.service";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {FilesService} from "../../../services/files.service";
import {DatePipe} from "@angular/common";
import {NgxImageCompressService} from "ngx-image-compress";
import {PreInscriptionServiceService} from "../../../services/pre-inscription-service.service";
import {ActivatedRoute} from "@angular/router";
import {CandidatureService} from "../../../services/candidature.service";
import {MatTableDataSource} from "@angular/material/table";
import {Util_fonction} from "../../models/util_fonction";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import {EvenementService} from "../../../services/evenement.service";
import Swal from "sweetalert2";
import {PaiementService} from "../../../services/GestionFrais/paiement.service";
import {FraisService} from "../../../services/GestionFrais/frais.service";
import * as Util from "util";
import {PAG_SMALL_SIZE, UNIV_MINISTERE, UNIV_NAME} from "../../../CONSTANTES";

declare var $: any;

@Component({
  selector: 'app-autre-payement',
  templateUrl: './autre-payement.component.html',
  styleUrls: ['./autre-payement.component.css']
})
export class AutrePayementComponent implements OnInit {
  univ_Minist = UNIV_MINISTERE;
  univ_name = UNIV_NAME;
  user = JSON.parse(sessionStorage.getItem('user'));
  list: any = [];
  select: any;
  error: any;
  dateEnCours: any;
  photoProfil: any;
  changPhotoEvent: boolean = false;
  message;
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['numEtudiant', 'prenom', 'date_lieu_de_naissance', 'codeOption', 'action'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  toDay = new Date();
  anneeStructure: any;
  spinner1 = true;
  spinner = false;
  annee_scolaire;
  dateInscription;
  telephone;
  prenom;
  nom;
  niveau;
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
  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
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
  encaissement_spinner: boolean = false;

  file: any;
  localUrl: any;
  L_cursus = ["L1", "L2", "L3"];
  M_cursus = ["M1", "M2"];
  D_cursus = ["D1", "D2", "D3"];
  bol: boolean = false;
  eventCkeckBody = {
    cursus: null,
    id_structure: null,
    type_evenement: null,
  }
  id_Etudiant: any;
  PayementRecu: any;
  montanFrais: any;
  ModePayementForm: FormGroup;

  imprimespinner: boolean = false;
  showRecu: boolean = false;

  constructor(private structureService: StructureService, private formBuilder: FormBuilder,
              private etudiantService: EtudiantService,
              private filiereService: FiliereService,
              private optionService: OptionsService,
              private fileService: FilesService, public datepipe: DatePipe,
              private imageCompress: NgxImageCompressService,
              private preinscription: PreInscriptionServiceService,
              private evenementService: EvenementService,
              private paiementService: PaiementService,
              private fraisService: FraisService,
              private route: ActivatedRoute,
              private candidatureService: CandidatureService) {
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
    this.initPhoto();
    this.initPayForm();
    this.GetStructionFilieres();
    this.GetStructionOptions();

    for (let rol of this.user.users.roles){
      if (rol.nom !== "ROLE_SP" || rol.nom !== "ROLE_ADMIN"){
        this.infochangeAccess = true;
      }
    }

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

  async afficher(pagination?: any) {
    this.spinner = true;
    const data = {
      id_structure: this.user.structure.id,
      // id_structure: this.user.structure.id,
      anneeScolaire: this.annee_scolaire,
      niveau: this.niveau,
      page: pagination ? pagination.pageIndex : 0,
      size: pagination ? pagination.pageSize : 50,
    };
    this.paiementService.GetEtudiant_suivie(data).subscribe(
      (res) => {

        this.length = res.totalElements;
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
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

  exportexcel() {
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Autres-paiements.xlsx');
 }

  exportpdf() {
    const data = document.getElementById('excel-table');
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
      pdf.save('Les_inscrits.pdf'); // Generated PDF
      this.spinner = false;
    });
  }

  cartUserID = null;
  public PayementModal(select) {
      this.cartUserID = select.userId;


      this.select = [];
      this.select = select;
      $('#modePayFormModal').modal({
        backdrop: 'static',
        keyboard: false
      });
      $('#modePayFormModal').appendTo('body');
  }

  relevePay: boolean = false;
  action: any;
  detailsPay: any = null;
  SelectCandidat: any = undefined;
  ActionClick(element, action){
    this.SelectCandidat = undefined;
    this.PayementRecu = null;

    this.id_Etudiant = element.idEtudiant;
    this.SelectCandidat = element;

    this.ModePayementForm.controls.niveau.reset();
    this.ModePayementForm.controls.niveau.clearValidators();
    this.ModePayementForm.controls.niveau.updateValueAndValidity();
    this.ModePayementForm.controls.semestre.reset();
    this.ModePayementForm.controls.semestre.clearValidators();
    this.ModePayementForm.controls.semestre.updateValueAndValidity();

    if (action ==='newCarte'){

      this.action = 'FRAIS_CARTE_SCOLAIRE';
      this.detailsPay = "payement des frais de carte étudiant";

    } else if (action === 'FRAIS_RELEVE_NOTE') {

      this.action = 'FRAIS_RELEVE_NOTE';
      this.detailsPay = "payement des frais de relevé de note";

      this.ModePayementForm.controls.niveau.setValidators([Validators.required]);
      this.ModePayementForm.controls.niveau.updateValueAndValidity();
      this.ModePayementForm.controls.semestre.setValidators([Validators.required]);
      this.ModePayementForm.controls.semestre.updateValueAndValidity();
    }
    this.getActionFrais(element,action);


  }

  getActionFrais(element,action){
    let data = {
      id_structure: this.user.structure.id,
      type_frais: this.action,
      id_filiere: null,
      type_candidat: null,
    }
    this.fraisService.get_Frais_filter(data).subscribe(
      res =>{
        this.montanFrais = res[0].frais;

        if (action ==='FRAIS_CARTE_SCOLAIRE'){
          this.CheckIfInscriptionEventIsPass(element);
        } else if (action === 'FRAIS_RELEVE_NOTE') {
          this.relevePay = true;
          this.PayementModal(element);
        }
      }
    )
  }

  checkeIfIsNotEmpty(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }



  SavePayement(){
    Swal.fire({
      icon: 'info',
      title: 'Voulez-vous confirmer l\'encaissement?',
      showCancelButton: true,
      confirmButtonText: `Oui, je confirme`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.encaissement_spinner = true;
        this.showRecu = true;
        let data = {
          montantPaye : this.montanFrais,
          modePaiement : 'ESPECE',
          motif : this.action,
          num : null,
          numPaiement: null,
          source: this.ModePayementForm.controls.source.value,
          niveau: this.ModePayementForm.controls.niveau.value,
          semestre: Util_fonction.checkIfNoTEmpty(this.ModePayementForm.controls.semestre.value) ? +this.ModePayementForm.controls.semestre.value : null,

          anneeScolaire: this.annee_scolaire,
          candidat_id: null,
          datePaiement: null,
          details: this.detailsPay,
          etudiant_id: this.id_Etudiant

        };



        this.preinscription.paiementFrais(data, 'paiements').subscribe(
          res => {
            $('#modePayFormModal').modal('hide');
            this.encaissement_spinner = false;

            // @ts-ignore
            Swal.fire({
              title: '',
              html: res,
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                $('#ressumModal').modal({
                  backdrop: 'static',
                  keyboard: false
                });
                $('#ressumModal').appendTo('body');
              }
            })

          },
          (error) => {
            Util_fonction.AlertMessage(error.error.status,error.error.message);
            this.spinner = false;
            this.encaissement_spinner = false;
          });
      }
    });
  }

  photo(photo) {
    return photo != null ? photo.split('/')[5] : '';
  }

  logo(logo) {
    return logo.split('/')[5];
  }

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

  imprimerCarte(prenom, nom) {
    this.spinner = true;
    const data = document.getElementById('face');
    const dos = document.getElementById('dos');
    const pdf = new jspdf('l', 'mm', [86, 54]);
    html2canvas(data).then(canvas => {
      const imgWidth = 86;
      const pageHeight = 210;
      const imgHeight = 54;
      const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/jpeg');
      const position = 0;
      pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
      // pdf.save('test.pdf');
      pdf.addPage();
      html2canvas(dos).then(canvas2 => {
        const imgWidth2 = 86;
        const pageHeight2 = 210;
        const imgHeight2 = 54;
        const heightLeft2 = imgHeight2;
        const contentDataURL2 = canvas2.toDataURL('image/jpeg');
        const position2 = 0;
        pdf.addImage(contentDataURL2, 'JPEG', 0, position2, imgWidth2, imgHeight2);
        pdf.save('Carte.pdf');
        this.spinner = false;
        this.AddCarteToCookie();
      });
    });
  }

  AddCarteToCookie(){
    let sess: any;
    if (sessionStorage.getItem("CarteDone")){
      sess = JSON.parse(sessionStorage.getItem("CarteDone"));
      sess.push(this.cartUserID.toString());
      let strSess = JSON.stringify(sess);
      sessionStorage.setItem("CarteDone",strSess);
    } else {
      let arr = [];
      arr.push(this.cartUserID);
      let strArr = JSON.stringify(arr);
      sessionStorage.setItem("CarteDone",strArr);
    }
  }

  CheckIfInscriptionEventIsPass(element){ // important
    let todyDate = new Date();
    if (this.L_cursus.includes(this.niveau)){
      this.eventCkeckBody.cursus = "LICENCE";
    } else if (this.M_cursus.includes(this.niveau)){
      this.eventCkeckBody.cursus = "MASTER";
    } else {
      this.eventCkeckBody.cursus = "DOCTORAT";
    }
    this.eventCkeckBody.id_structure = this.user.structure.id;

    this.eventCkeckBody.type_evenement = "INSCRIPTION";

    this.evenementService.getStucturesEvenementVerif(this.eventCkeckBody).subscribe(
      res =>{
        Util_fonction.AlertMessage("error", "Veuillez, attendre la fin des inscriptions pour pouvoir procéder à une réimpression de carte étudiant!")
      }, error =>{

        if (error.error.status === 403 || error.error.status === 'La période INSCRIPTION est dépassée'){
          this.PayementRecu = element;
          this.PayementModal(element);
        } else {
          Util_fonction.AlertMessage(error.error.status, error.error.message);
        }
      }
    );

  }

  /**
   *
   * @param element
   * @constructor
   */

  LaungPhotoChange(element) {
    this.initPhoto();
    this.userId = element.userId;
    this.photoProfil = element.photo;
    $('#PhotoModal').modal('show');
    $('#PhotoModal').appendTo('body');
  }

  /**
   * NEW WITH COMPRESS
   */
  onselectFile(event: any) {


    let  fileName : any;
    let util = new Util_fonction(this.imageCompress);
    this.file = event.target.files[0];
    this.UpoloadFile = event.target.files[0];
    fileName = this.file['name'];
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = async (event: any) => {
        this.localUrl = event.target.result;
        this.changPhotoEvent = true;
        this.photoProfil=event.target.result;
        // COMPRESSION
        //this.UpoloadFile = await util.compressFile(this.localUrl, fileName);

      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  ChangeMyProfile() {
    this.checkNum_spinner = true;

    let fd = new FormData();
    fd.append('file', this.UpoloadFile);
    fd.append('id_user', this.userId);

    this.fileService.UpdatePhotoUSER(fd, this.userId).subscribe( Changeres => {
      this.checkNum_spinner = false;
      this.changPhotoEvent = false;
      this.afficher();
      $('#PhotoModal').modal('hide');
      Util_fonction.SuccessMessage(Changeres);


    }, ChangeError => {
      this.checkNum_spinner = false;
      Util_fonction.AlertMessage(ChangeError.error.status, ChangeError.error.message);
    })
  }



  initPhoto(){
    this.PhotoChangeForm = this.formBuilder.group({
      profilPhoto: new FormControl(null, [Validators.required])
    });
  }

  initPayForm(){
    this.ModePayementForm = this.formBuilder.group({
      mode: new FormControl(null),
      motif: new FormControl(null),
      source: new FormControl(null),
      niveau: new FormControl(null),
      semestre: new FormControl(null),

      echelonPayMontant: new FormControl(null)
    })
  }

  initChangeDataForm(){
    this.ChangeDataForm = this.formBuilder.group({
      nationalite: new FormControl(null,[Validators.required]),
      telephoneTuteur: new FormControl(null),

      dateDeNaissance: new FormControl(null,[Validators.required]),
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

      filiere: new FormControl(null,[Validators.required]),
      option: new FormControl(null,[Validators.required])
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
