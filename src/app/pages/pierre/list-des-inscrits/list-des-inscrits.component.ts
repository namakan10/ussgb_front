import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute} from '@angular/router';
import {CandidatureService} from '../../../services/candidature.service';
import {PreInscriptionServiceService} from '../../../services/pre-inscription-service.service';
import {StructureService} from '../../../services/structure.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FilesService} from "../../../services/files.service";
import {DatePipe} from '@angular/common';
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";
import {Util_fonction} from "../../models/util_fonction";
import {FiliereService} from "../../../services/GestionFilieres/filiere.service";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {NgxImageCompressService} from "ngx-image-compress";
import {
  _HTTP,
  _HTTP_PHOTO,
  PAG_MIDLE_SIZE, PAG_SMALL_SIZE,
  UNIV_FILIERE,
  UNIV_MINISTERE,
  UNIV_NAME,
  UNIV_OPTION
} from "../../../CONSTANTES";
import {environment} from "../../../../environments/environment";
import * as Util from "util";
import { MatDialog } from '@angular/material';
import { CropComponent, ResulteFileCrop } from '../../A_Pages_Utilisateurs/crop/crop.component';


declare var $: any;


export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Nombre d\'elements par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'app-list-des-inscrits',
  templateUrl: './list-des-inscrits.component.html',
  styleUrls: ['./list-des-inscrits.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListDesInscritsComponent implements OnInit {

  univ_fil = UNIV_FILIERE;
  univ_opt = UNIV_OPTION;
  https_photo = _HTTP_PHOTO;
  _http = _HTTP;
  _asset_image = environment._ASSET_IMAGE;
  user = JSON.parse(sessionStorage.getItem('user'));
  env = environment.env;
  _RECTORAT: boolean =  this.user.structure.type === 'RECTORAT';

  // JSON.parse(sessionStorage.getItem('user')).structure.sigle;
  list: any = [];
  select: any;
  error: any;
  dateEnCours: any;
  photoProfil: any;
  changPhotoEvent: boolean = false;
  message;
  // tslint:disable-next-line:max-line-length

  displayedColumns: string[] = ['numDossier', 'numMatricule', 'prenom', 'nom', 'email', 'date_de_naissance', 'lieu', 'genre', 'telephone', 'nationalite', 'codeOption', 'codeFiliere', 'groupe', 'typeCandidat', 'modeAdmission', 'statut', 'scolarite', 'action'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  idPhoto: File;
  acteDeNaissance: File;
  imageChangedEvent: any;
  attestationBac: File;
  releveBac: File;
  autre: File;
  anneeStructure: any;
  fichiersEtudiant: any = {};
  troisFormGroup: FormGroup;
  /* FILES VARIABLES ******* */
  FileNAME: any;
  FileTYPE: any;
  fileAlertMessage: any;
  spinner1 = true;
  spinner = false;
  annee_scolaire;
  dateInscription;
  telephone;
  prenom;
  nom;
  niveau;
  statut;
  etat_paiement;
  admis;
  approbation;
  type = false;
  data: any = [];
  FileArray : any[] = [];
  UrlPhoto: any;
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

  pageSize = 24;
  pageSizeOptions = [24];
  length = 24;

  idPhotoAlert = false; //     Alert
  acteDeNaissanceAlert = false;
  attestationBacAlert = false;
  releveBacAlert = false;
  autreAlert = false;

  idPhotoOk = false; //     chevron de conformité
  acteDeNaissanceOk = false;
  attestationBacOk = false;
  releveBacOk = false;
  autreOk = false;

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
  FileBody = {
    id_photo: null,
    acteNaissance: null,
    certificatNationnalite: null,
    diplome: null,
    releve: null,
  }
  file: any;
  localUrl: any;
  RoleCartePrint: boolean;
  univName = UNIV_NAME;
  univ_Minist = UNIV_MINISTERE;
  annee_scolaire2: any;

  constructor(private structureService: StructureService, private formBuilder: FormBuilder,
              private etudiantService: EtudiantService,
              private filiereService: FiliereService,
              private optionService: OptionsService,
              private fileService: FilesService, public datepipe: DatePipe,
              private imageCompress: NgxImageCompressService,
              private preinscription: PreInscriptionServiceService,
              private route: ActivatedRoute,
              public dialog: MatDialog,
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
    this.initChangeDataForm();
    this.GetStructionFilieres();
    this.GetStructionOptions();

    for (let rol of this.user.users.roles){
      if (rol.nom === "ROLE_SP" || rol.nom === "ROLE_ADMIN"){
        this.infochangeAccess = true;
      }
    }

  }

  parseImage(img: string): string {    
    if(!img) return;
    return img.includes("public.") ? "https://" + img : "http://" + img ; //photo.split('/')[5]
  }
  AsRoleCartePrint(){
    let rl = ["ROLE_ADMIN", "ROLE_SP"];
    this.RoleCartePrint = Util_fonction.checkIfAsRole(this.user,rl);
  }

   /** ====================================================================================================
   *  GESTION DE LA PARTIE DES FICHIER A ENVOYER
   *  ***************************************************
   */
    FileSelect(event, type) {
      const fichier: File = event.target.files[0];
      if (fichier !== undefined && fichier !== null) {
        this.FileNAME = fichier.name;
        this.FileTYPE = type;
        this.controlFile(event, type);
      } else {
        this.showAlertText(type);
      }
    }

    /**
     * VERIFIE SI LE FICHIER RESPECT LES NORMES
     * @param event
     * @param type
     */
    async controlFile(event, type) {
      let fileName: any;
      let fichier: File;
      fileName = event.target.files[0]['name'];
      // COMPRESS L'IMAGE SI PHOTO DE PROFILE
      if (type === 'idPhoto') {
        let reader = new FileReader();
        reader.onload = async (event: any) => {
          this.localUrl = event.target.result;
          let util = new Util_fonction(this.imageCompress);
          // this.CompressReult = await util.compressFile(this.localUrl, fileName);
          fichier = await util.compressFile(this.localUrl, fileName);
          await this.delay(1000);
        }
        reader.readAsDataURL(event.target.files[0]);
        await this.delay(855);
      } else {
        fichier = event.target.files[0]; // this.CropConvertFile;
      }
      const ext = fichier.name.substr(fichier.name.lastIndexOf('.') + 1);
      const extension1 = ['jpeg', 'jpg', 'png', 'pdf', 'JPEG', 'JPG', 'PNG', 'PDF']; // cas eventuel Pdf
      const extension2 = ['jpeg', 'jpg', 'png', 'JPEG', 'JPG', 'PNG'];
      const limitSize = 2097152;
      let selectExtensionArray = null;
      if (type === 'idPhoto') {
        selectExtensionArray = extension2;
      } else {
        selectExtensionArray = extension1;
      }
      if (selectExtensionArray.includes(ext)) {
        if (fichier['size'] <= limitSize) {
          // lancer le crop
          this.FileTYPE = type;
          if (extension2.includes(ext)) {
            this.imageChangedEvent = event;
            this.LaunchCrop();
          } else {
            this.RenameFile(fichier, this.FileTYPE);
          }
        } else {
          // show Alert Modal
          this.fileAlertMessage = 'Ce fichier est trop volumineux que ce qui est demandé';
          this.showAlertText(type);
          this.fileAlert('Ce fichier est trop volumineux que ce qui est demandé');
        }
      } else {
        // show Alert Modal
        this.fileAlertMessage = 'Ce fichier ne répond pas aux format attendus!';
        this.showAlertText(type);
        this.fileAlert('Ce fichier ne répond pas aux format attendus!');
        // this.LaunchCrop();
      }
    }
    delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }
     /***
   * Ouvert le modal Crop
   * @constructor
   */
  LaunchCrop(): void {
    const dialogRef = this.dialog.open(CropComponent, {
      disableClose: true,
      width: '950px',
      data: {imageChangedEvent: this.imageChangedEvent, returnFile: ''}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.RenameFile(ResulteFileCrop, this.FileTYPE);
    });
  }

  /***
   * RENOMME LE FICHIER SELECTIONNER
   * @param FILES
   * @param type
   * @constructor
   */
   RenameFile(FILES, type) {
    const fichier: File = FILES; // event.target.files[0];
    const ext = fichier.type.substr(fichier.type.lastIndexOf('/') + 1);
    const newFile: File = new File([fichier], Math.floor(Date.now() / 1000) + '.' + ext, {type: fichier.type});

    this.fullFileData(newFile, type);
  }


  ValiderPreinscriptionUpdate(dataEtudiant) {
    this.spinner = true;
    if(this.FileBody.id_photo !== null){
      const fd = new FormData();
      const path = `?annee_scolaire=${this.annee_scolaire}&file_type=ID_PHOTO`;
      fd.append('file', this.FileBody.id_photo);
      this.uploadFile(fd, path, dataEtudiant);
    }
    if(this.FileBody.diplome !== null){
      const fd = new FormData();
      fd.append("file",this.FileBody.diplome);
      const path = `?annee_scolaire=${this.annee_scolaire}&file_type=DIPLOME`;
      this.uploadFile(fd, path, dataEtudiant);
    }
    if(this.FileBody.acteNaissance !== null){
      const fd = new FormData();
      fd.append("file",this.FileBody.acteNaissance);
      const path = `?annee_scolaire=${this.annee_scolaire}&file_type=ACTE_DE_NAISSANCE`;
      this.uploadFile(fd, path, dataEtudiant);
    }
    if(this.FileBody.releve !== null){
      const fd = new FormData();
      fd.append("file",this.FileBody.releve);
      const path = `?annee_scolaire=${this.annee_scolaire}&file_type=RELEVE_NOTE`;
      this.uploadFile(fd, path, dataEtudiant);
    }
    if(this.FileBody.certificatNationnalite !== null){
      const fd = new FormData();
      fd.append("file",this.FileBody.certificatNationnalite);
      const path = `?annee_scolaire=${this.annee_scolaire}&file_type=CERTIFICAT_NATIONALITE`;
      this.uploadFile(fd, path, dataEtudiant);
    }

  }


  uploadFile(file: FormData, path: string, dataEtudiant) {
    this.fileService.uploadFile(file, path).subscribe(
      (res) => {
        this.spinner = false;
        if(res['typeFichier'] === 'ID_PHOTO') {
          // tslint:disable-next-line:max-line-length
          this.preinscriptionUpdate(dataEtudiant.id, {'option': this.fichiersEtudiant.option, 'niveau': dataEtudiant.niveau, 'idPhoto': res['fileUrl']});
        }
        if(res['typeFichier'] === 'DIPLOME') {
          // tslint:disable-next-line:max-line-length
          this.preinscriptionUpdate(dataEtudiant.id, {'option': this.fichiersEtudiant.option, 'niveau': dataEtudiant.niveau, 'diplome': res['fileUrl']});
        }
        if(res['typeFichier'] === 'ACTE_DE_NAISSANCE') {
          // tslint:disable-next-line:max-line-length
          this.preinscriptionUpdate(dataEtudiant.id, {'option': this.fichiersEtudiant.option, 'niveau': dataEtudiant.niveau, 'acteNaissance': res['fileUrl']});
        }
        if(res['typeFichier'] === 'RELEVE_NOTE') {
          // tslint:disable-next-line:max-line-length
          this.preinscriptionUpdate(dataEtudiant.id, {'option': this.fichiersEtudiant.option, 'niveau': dataEtudiant.niveau, 'releveNote': res['fileUrl']});
        }
        if(res['typeFichier'] === 'CERTIFICAT_NATIONALITE') {
          // tslint:disable-next-line:max-line-length
          this.preinscriptionUpdate(dataEtudiant.id, {'option': this.fichiersEtudiant.option, 'niveau': dataEtudiant.niveau, 'certificatNationalite': res['fileUrl']});
        }
      },
      (error) => {
        this.spinner = false;
        this.error = error;
      });
  }

  preinscriptionUpdate(id, body) {
    this.preinscription.preinscriptionUpdateFile(id, body).subscribe(
      (res) => {
        this.message = res;
        $('#staticBackdropP4').modal('hide');
      },
      (error) => {
        this.spinner = false;
        this.error = error;
      });
  }

  fullFileData(newFile: File, type: string) {
    // const fd = new FormData();
    // fd.append('file', newFile);
    if (type === 'idPhoto') {
      this.idPhoto = newFile;
      this.FileBody.id_photo = newFile;
    } else if (type === 'attestationBac') {
      this.attestationBac = newFile;
      this.FileBody.diplome = newFile;
    } else if (type === 'acteDeNaissance') {
      this.acteDeNaissance = newFile;
      this.FileBody.acteNaissance = newFile;
    } else if (type === 'releveBac') {
      this.releveBac = newFile;
      this.FileBody.releve = newFile;
    } else if (type === 'autre') {
      this.autre = newFile;
      this.FileBody.certificatNationnalite = newFile;
    }
    this.hideAlertText(type);
  }


  /**
   * CACHE LE MESSAGE DE NOM CONFORMITE
   * @param type
   */
   hideAlertText(type) {
    switch (type) {
      case 'idPhoto':
        this.idPhotoAlert = false;
        this.idPhotoOk = true;
        break;
      case 'acteDeNaissance':
        this.acteDeNaissanceAlert = false;
        this.acteDeNaissanceOk = true;
        break;
      case 'attestationBac':
        this.attestationBacAlert = false;
        this.attestationBacOk = true;
        break;
      case 'releveBac':
        this.releveBacAlert = false;
        this.releveBacOk = true;
        break;
      case 'autre':
        this.autreAlert = false;
        this.autreOk = true;
        break;
    }
  }

      /**
   * MONTRE LE MESSAGE DE NOM CONFORMITE
   * @param type
   */
  showAlertText(type) {
    switch (type) {
      case 'idPhoto':
        this.idPhotoAlert = true;
        this.idPhotoOk = false;
        break;
      case 'acteDeNaissance':
        this.acteDeNaissanceAlert = true;
        this.acteDeNaissanceOk = false;
        break;
      case 'attestationBac':
        this.attestationBacAlert = true;
        this.attestationBacOk = false;
        break;
      case 'releveBac':
        this.releveBacAlert = true;
        this.releveBacOk = false;
        break;
      case 'autre':
        this.autreAlert = true;
        this.autreOk = false;
        break;

    }
  }
  fileAlert(message) {
    Util_fonction.AlertMessage(404, message);
  }

  Abandon(data) {
    Swal.fire({
      title: 'Confirmez-vous l\'annulation de l\'inscription de cet etudiant ?',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.spinner = true;
        this.etudiantService.getEtudiantByID(data.idEtudiant).subscribe(resultat => {
          resultat.statut = 'ABANDON';
            this.etudiantService.UpdateEtudiantInfo(data.idEtudiant, resultat).subscribe(res => {
              this.afficher();
              this.spinner = false;
                Swal.fire('Inscription annulée avec succès!', '', 'success');
              });
        },
        error => {
          this.error = error;
          this.spinner = false;
        });
      }
    });
  }
  Document(data) {
    this.data = null;
    this.fichiersEtudiant = {};
    this.data = data;
    this.preinscription.getByIdEtudiant(data.idEtudiant, this.annee_scolaire).subscribe(result => {
      this.fichiersEtudiant = result
      $('#staticBackdropP4').modal('show');
      $('#staticBackdropP4').appendTo('body');
    })
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
  entete:boolean = true;
  ExcelEntete: boolean = true;
  Psize;
  async afficher(pagination?: any) {
    this.Psize = pagination ? pagination.pageSize : 24;
    this.getFileName2();
    this.annee_scolaire2 = this.annee_scolaire;
    this.spinner = true;
    const data = {
      id_structure: this.user.structure.id,
      // id_structure: this.user.structure.id,
      annee: this.annee_scolaire,
      niveau: this.niveau,
      // statut: this.statut,
      dateInscription: this.datepipe.transform(this.dateInscription, 'yyyy-MM-dd'),
      page: pagination ? pagination.pageIndex : 0,
      size: pagination ? pagination.pageSize : 24,
      telephone: this.telephone,
      prenom: this.prenom,
      nom: this.nom,
    };
    if(this.statut !== 'all'){
      data['statut'] = this.statut;
    }
    this.preinscription.listInscrits(data).subscribe(
      (res) => {
        console.log(res);
        
        this.list = [];
        this.length = res.totalElements;
        res.content.forEach(element => {
          this.list.push({
            numEtudiant: element.etudiant.numEtudiant,
            niveau: element.niveau,
            prenom: element.etudiant.user.prenom,
            nom: element.etudiant.user.nom,
            telephone: element.etudiant.user.telephone,
            nationalite: element.etudiant.nationalite,
            codeOption: element.option.codeOption,
            nomOption: element.option.nom,
            userId: element.etudiant.user.id,
            // libelle: element.etudiant.groupe.libelle,
            modeAdmission: element.etudiant.modeAdmission,
            scolarite: element.etudiant.scolarite,
            anneeScolaire: element.anneeScolaire,
            typeCandidat: element.etudiant.typeCandidat.replace('_',' '),
            statut: element.etudiant.statut,
            photo: element.etudiant.user.photo,
            dateDeNaissance: Util_fonction.DateConvert2(element.etudiant.user.dateDeNaissance),
            lieuDeNaissance: element.etudiant.user.lieuDeNaissance,
            quartier: element.etudiant.user.quartier,
            dateInscription: element.dateInscription,
            password: element.password,
            username: element.etudiant.user.username,
            idEtudiant: element.etudiant.id,
            option: element.option,
            filiere: element.etudiant.filiere,
            codeFiliere: element.etudiant.filiere.codeFiliere,
            groupe: element.etudiant.groupe.libelle,
            telephoneTuteur: element.etudiant.telephoneTuteur,
            genre: element.etudiant.user.genre,
            email: element.etudiant.user.email,
            numMatricule: element.etudiant.user.numMatricule,
            porte: element.etudiant.user.porte,
            rue: element.etudiant.user.rue,
            ville: element.etudiant.user.ville
          });
        });

        this.dataSource = new MatTableDataSource(this.list);
        this.pageSizeOptions =  Util_fonction.paginatSequence2(24, res.totalElements);
        console.log(this.pageSizeOptions);
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
  exportexcel() {
    this.ExcelEntete = false;
    /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const filename = this.getFileName();
    /* save to file */
    XLSX.writeFile(wb, filename+'.xlsx');
    this.ExcelEntete = true;
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
   const position = 0;
   const filename = this.getFileName();
   pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
   pdf.save(filename+'.pdf'); // Generated PDF
   this.spinner = false;
   });
 }

 cartUserID = null;
  hours;
 public async convetToPDF(select) {
   this.cartUserID = select.userId;
   const now = new Date();
   this.hours = now.getHours() + ':' + now.getMinutes();
   this.select = [];
   this.photoProfil = select.photo;
   this.select = select;
   console.log("select", select);

   // this.BindCrosImage('photo_etudiant', select.photo);
   // this.BindCrosImage('structLogo', this.user.structure.logo);

   $('#exampleModalP2').modal('show');
   $('#exampleModalP2').appendTo('body');

 }

 getFileName(){
   let text = "";
   text += this.user.structure.sigle+"-"+this.statut+"_"+this.annee_scolaire+"_niveau"+this.niveau+" nbr_"+this.Psize;
   return text;
 }

 titre;
 getFileName2(){
   this.titre= this.user.structure.sigle+" "+this.statut+" "+this.annee_scolaire+" /niveau "+this.niveau;
 }


 BindCrosImage(iD, image){
   // this.fileService.fetchPhotoUrl(image).subscribe(resPhotoUrl =>{
   //
   // })

   // console.log("headers ========================================");
   // let headers = new Headers();
   // headers.append('Access-Control-Allow-Origin', '*');
   // headers.append('X-Requested-With', 'XMLHttpRequest');
   // headers.append('X-Custom-Header', 'application/json');
   // console.log(headers);
   //   fetch(_HTTP_PHOTO+image,
   //     {headers: headers})
   //     .then(function(data){
   //       return data.blob();
   //     })
   //     .then(function(img){
   //       let dd = URL.createObjectURL(img);
   //
   //       if (iD !== 'photo_etudiant'){
   //         $('.'+iD).attr('src', dd).attr('crossorigin', 'anonymous');
   //       }else {
   //         $('#'+iD).attr('src', dd).attr('crossorigin', 'anonymous');
   //       }
   //     })
 }



  photo(photo) {
    console.log(photo);
    return photo != null ? photo.split('/')[5] : '';
  }


   // async getBase64Image(url) {
   //   // let canvas = document.createElement("canvas");
   //   // canvas.width = img.width;
   //   // canvas.height = img.height;
   //   // let ctx = canvas.getContext("2d");
   //   // ctx.drawImage(img, 0, 0);
   //   // let dataURL = canvas.toDataURL("image/png");
   //   // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
   //
   //   console.log("Downloading image...");
   //   let res = await fetch(url);
   //   let blob = await res.blob();
   //
   //   const result = await new Promise((resolve, reject) => {
   //     let reader = new FileReader();
   //     reader.addEventListener("load", function () {
   //       resolve(reader.result);
   //     }, false);
   //
   //     reader.onerror = () => {
   //       return reject(this);
   //     };
   //     reader.readAsDataURL(blob);
   //   })
   //
   //   return result
   // }

  imprimer() {
    this.spinner = true;
    const data = document.getElementById('contentToConvert');
    html2canvas(data, { logging: true,  allowTaint: false, useCORS: true}).then(canvas => {
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
    });
  }

  imprimerCarte(prenom, nom) {
    this.spinner = true;
    const data = document.getElementById('face');
    const dos = document.getElementById('dos');
    const pdf = new jspdf('l', 'mm', [86, 54]);
    html2canvas(data,{ logging: true,  allowTaint: false, useCORS: true}).then(canvas => {
      const imgWidth = 86;
      const pageHeight = 210;
      const imgHeight = 54;
      const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/jpeg');
      const position = 0;
      pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
      // pdf.save('test.pdf');
      pdf.addPage();
      html2canvas(dos, { logging: true,  allowTaint: false, useCORS: true}).then(canvas2 => {
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

  CheckCarteNotExist(id){
   let result: boolean;
   let sess : any;
    if (sessionStorage.getItem("CarteDone")){
      sess = JSON.parse(sessionStorage.getItem("CarteDone"));
      result = !!sess.includes(id);
    } else {
      result = true;
    }
    return result;
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
    console.log(event);
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
        console.log(this.UpoloadFile);
      }
      reader.readAsDataURL(event.target.files[0]);
    }

  }

  ChangeMyProfile() {
    this.checkNum_spinner = true;

    console.log("compress return value = ");
    console.log(this.UpoloadFile);
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

  LaungModif(element) {
    console.log(element);
    this.initChangeDataForm();
    this.etudiantID = element.idEtudiant;
    this.SendData.nationalite = element.nationalite;
    this.SendData.telephoneTuteur = element.telephoneTuteur;

    this.SendData.user.telephone = element.telephone;
    this.SendData.user.dateDeNaissance = element.dateDeNaissance;
    this.SendData.user.email = element.email;
    this.SendData.user.genre = element.genre;
    this.SendData.user.lieuDeNaissance = element.lieuDeNaissance;
    this.SendData.user.lieuDeNaissance = element.lieuDeNaissance;
    this.SendData.user.nom = element.nom;
    this.SendData.user.prenom = element.prenom;
    this.SendData.user.numMatricule = element.numMatricule;
    this.SendData.user.photo = element.photo;
    this.SendData.user.quartier = element.quartier;
    this.SendData.user.ville = element.ville;
    this.SendData.user.porte = element.porte;
    this.SendData.user.rue = element.rue;

    this.SendData.idOption = element.option.id;
    this.ChangeDataForm.controls.filiere.setValue(element.filiere.id);
    this.ChangeDataForm.controls.option.setValue(element.option.id);


    this.fullForm();
  }

  fullForm(){

    // let util = new Util_fonction();
    this.ChangeDataForm.controls.nationalite.setValue(this.SendData.nationalite);
    this.ChangeDataForm.controls.telephoneTuteur.setValue(this.SendData.telephoneTuteur);
    console.log("this.SendData.user.dateDeNaissance", this.SendData.user.dateDeNaissance);

    this.ChangeDataForm.controls.dateDeNaissance.setValue(Util_fonction.DateConvert2(this.SendData.user.dateDeNaissance));
    this.ChangeDataForm.controls.email.setValue(this.SendData.user.email);
    this.ChangeDataForm.controls.genre.setValue(this.SendData.user.genre);
    this.ChangeDataForm.controls.lieuDeNaissance.setValue(this.SendData.user.lieuDeNaissance);
    this.ChangeDataForm.controls.nom.setValue(this.SendData.user.nom);
    this.ChangeDataForm.controls.numMatricule.setValue(this.SendData.user.numMatricule);
    this.ChangeDataForm.controls.photo.setValue(this.SendData.user.photo);
    this.ChangeDataForm.controls.prenom.setValue(this.SendData.user.prenom);
    this.ChangeDataForm.controls.porte.setValue(this.SendData.user.porte);
    this.ChangeDataForm.controls.quartier.setValue(this.SendData.user.quartier);
    this.ChangeDataForm.controls.rue.setValue(this.SendData.user.rue);
    this.ChangeDataForm.controls.telephone.setValue(this.SendData.user.telephone);
    this.ChangeDataForm.controls.ville.setValue(this.SendData.user.ville);
// -- In TS import par

    $('#etutiandInfoChangeModal').modal('show');
    $('#etutiandInfoChangeModal').appendTo('body');

  }

  SaveEtudiantData() {
    this.Opt_changeIfoSpinner = true;
    this.SendData.nationalite = this.ChangeDataForm.controls.nationalite.value;
    this.SendData.telephoneTuteur = this.ChangeDataForm.controls.telephoneTuteur.value;
    this.SendData.user.dateDeNaissance = this.ChangeDataForm.controls.dateDeNaissance.value;
    this.SendData.user.email = this.ChangeDataForm.controls.email.value;
    this.SendData.user.genre = this.ChangeDataForm.controls.genre.value;
    this.SendData.user.lieuDeNaissance = this.ChangeDataForm.controls.lieuDeNaissance.value;
    this.SendData.user.nom = this.ChangeDataForm.controls.nom.value;
    this.SendData.user.numMatricule = this.ChangeDataForm.controls.numMatricule.value;
    this.SendData.user.photo = this.ChangeDataForm.controls.photo.value;
    this.SendData.user.prenom = this.ChangeDataForm.controls.prenom.value;
    if (this.ChangeDataForm.controls.porte.value !== null &&
      this.ChangeDataForm.controls.porte.value !== "" &&
      this.ChangeDataForm.controls.porte.value !== undefined){
      this.SendData.user.porte = +this.ChangeDataForm.controls.porte.value;
    }
    this.SendData.user.quartier = this.ChangeDataForm.controls.quartier.value;
    if (this.ChangeDataForm.controls.rue.value !== null &&
      this.ChangeDataForm.controls.rue.value !== "" &&
      this.ChangeDataForm.controls.rue.value !== undefined) {
      this.SendData.user.rue = this.ChangeDataForm.controls.rue.value;
    }
    this.SendData.user.telephone = this.ChangeDataForm.controls.telephone.value;
    this.SendData.user.ville = this.ChangeDataForm.controls.ville.value;
    // tslint:disable-next-line:radix
    // this.SendData.idOption = parseInt(this.ChangeDataForm.controls.option.value);

    this.etudiantService.UpdateEtudiantInfo(this.etudiantID, this.SendData).subscribe(Updateresponse =>{
      this.afficher();
      $('#etutiandInfoChangeModal').modal('hide');
      this.Opt_changeIfoSpinner = false;
      Util_fonction.SuccessMessage(Updateresponse);

    }, updateError => {

      this.Opt_changeIfoSpinner = false;
      Util_fonction.AlertMessage(updateError.error.status, updateError.error.message);
    })
  }


  initPhoto(){
    this.PhotoChangeForm = this.formBuilder.group({
      profilPhoto: new FormControl(null, [Validators.required])
    });
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

      filiere: new FormControl(null),
      option: new FormControl(null)
    });

    this.troisFormGroup = this.formBuilder.group({
      idPhoto: new FormControl(null), // 1131123
      acteDeNaissance: new FormControl(null), // jpeg", "jpg", "png", "pdf"  3131123
      attestationBac: new FormControl(null),
      releveBac: new FormControl(null), // ["jpeg", "jpg", "png"]  3131123
      autre: new FormControl(null),
    });
  }

  hasRoleAdmin() {
    this.hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_ADMIN' || item['nom'] === 'ROLE_SP' || item['nom'] === 'ROLE_INSCRIPTION'){
          this.hasRole = true;
        }
      });
      return this.hasRole;
    }
  }

}
