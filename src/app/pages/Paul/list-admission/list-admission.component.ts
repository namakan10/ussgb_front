import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UNIV_NAME} from "../../../CONSTANTES";
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
import {Util_fonction} from "../../models/util_fonction";
import {MatTableDataSource} from "@angular/material/table";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
declare var $: any;

@Component({
  selector: 'app-list-admission',
  templateUrl: './list-admission.component.html',
  styleUrls: ['./list-admission.component.css']
})
export class ListAdmissionComponent implements OnInit {


  structureSelected: any;
  list: any = [];
  select: any;
  error: any;
  dateEnCours: any;
  photoProfil: any;
  changPhotoEvent: boolean = false;
  message;
  // tslint:disable-next-line:max-line-length

  displayedColumns: string[] = ['numDossier', 'numMatricule', 'prenom', 'nom', 'date_de_naissance','lieu_de_naissance', 'telephone', 'nationalite', 'codeOption', 'scolarite', 'action'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

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
  pageSize = 50;
  pageSizeOptions = [5, 10, 25, 100, 200, 300, 400, 500, 700, 1000, 2000];
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
  annee_scolaire2: any;
  constructor(private structureService: StructureService, private formBuilder: FormBuilder,
              private etudiantService: EtudiantService,
              private filiereService: FiliereService,
              private optionService: OptionsService,
              private fileService: FilesService, public datepipe: DatePipe,
              private imageCompress: NgxImageCompressService,
              private preinscription: PreInscriptionServiceService,
              private route: ActivatedRoute,
              private candidatureService: CandidatureService) {
    this.structureSelected = JSON.parse(sessionStorage.getItem('structureSelected'));
    this.dateEnCours = JSON.parse(sessionStorage.getItem('dateEnCours'));
    this.structureService.getStuctureAnnees(this.structureSelected.Data.id).subscribe(
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

  }


  GetStructionFilieres(){
    this.filiereService.getStructureFilieres(this.structureSelected.Data.id).subscribe(filierestRes => {

      this.Structure_Filieres = filierestRes;
    })
  }

  GetStructionOptions(){
    this.optionService.getStructure_Options(this.structureSelected.Data.id).subscribe(OptionsRes => {

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
    this.annee_scolaire2 = this.annee_scolaire;
    this.spinner = true;
    const data = {
      id_structure: this.structureSelected.Data.id,
      annee: this.annee_scolaire,
      niveau: this.niveau,
      dateInscription: this.datepipe.transform(this.dateInscription, 'yyyy-MM-dd'),
      page: pagination ? pagination.pageIndex : 0,
      size: pagination ? pagination.pageSize : 50,
      telephone: this.telephone,
      prenom: this.prenom,
      nom: this.nom,
    };
    this.preinscription.listInscrits(data).subscribe(
      (res) => {
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
            scolarite: element.etudiant.scolarite,
            photo: element.etudiant.user.photo,
            dateDeNaissance: element.etudiant.user.dateDeNaissance,
            lieuDeNaissance: element.etudiant.user.lieuDeNaissance,
            quartier: element.etudiant.user.quartier,
            dateInscription: element.dateInscription,
            password: element.password,
            username: element.etudiant.user.username,
            idEtudiant: element.etudiant.id,
            option: element.option,
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
    /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Les_inscrits.xlsx');

  }

  exportpdf() {
    const data = document.getElementById('excel-table');
    console.log("DATA", data);
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
  public convetToPDF(select) {
    // if (this.CheckCarteNotExist(select.userId)){
    this.cartUserID = select.userId;

    console.log(select);
    this.select = [];
    this.select = select;
    $('#exampleModalP2').modal('show');
    $('#exampleModalP2').appendTo('body');
    // } else {
    //   Util_fonction.AlertMessage("error", "Veuillez! Attendre la fin des Inscriptions pour pouvoir reprendre, une nouvelle impression de la carte");
    // }
  }

  photo(photo) {
    return photo != null ? photo.split('/')[5] : '';
  }

  logo(logo) {
    return logo.split('/')[5];
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
    console.log("gfgf");
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
    this.ChangeDataForm.controls.filiere.setValue(element.option.filiere.id);
    this.ChangeDataForm.controls.option.setValue(element.option.id);


    this.fullForm();
  }

  fullForm(){

    let util = new Util_fonction();
    this.ChangeDataForm.controls.nationalite.setValue(this.SendData.nationalite);
    this.ChangeDataForm.controls.telephoneTuteur.setValue(this.SendData.telephoneTuteur);

    this.ChangeDataForm.controls.dateDeNaissance.setValue(util.DateConvert(this.SendData.user.dateDeNaissance));
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
    this.SendData.idOption = this.ChangeDataForm.controls.option.value;

    this.etudiantService.UpdateEtudiantInfo(this.etudiantID,this.SendData).subscribe(Updateresponse =>{
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

      filiere: new FormControl(null,[Validators.required]),
      option: new FormControl(null,[Validators.required])
    });
  }


}
