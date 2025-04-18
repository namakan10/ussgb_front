import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CandidatureService } from '../../../services/candidature.service';
import { PreInscriptionServiceService } from '../../../services/pre-inscription-service.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
declare var $: any;
import * as XLSX from 'xlsx';
import { StructureService } from '../../../services/structure.service';
import { DatePipe } from '@angular/common';
import {Util_fonction} from "../../models/util_fonction";
import {_HTTP, _HTTP_PHOTO, UNIV_FILIERE, UNIV_MINISTERE, UNIV_NAME, UNIV_OPTION} from "../../../CONSTANTES";
import {environment} from "../../../../environments/environment";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-liste-des-admis',
  templateUrl: './liste-des-admis.component.html',
  styleUrls: ['./liste-des-admis.component.css']
})
export class ListeDesAdmisComponent implements OnInit {
  univ_Minist = UNIV_MINISTERE;
  univ_name = UNIV_NAME;
  univ_fil = UNIV_FILIERE;
  univ_opt = UNIV_OPTION;
  https_photo = _HTTP_PHOTO;
  _http = _HTTP;
  _asset_image = environment._ASSET_IMAGE;
  user = JSON.parse(sessionStorage.getItem('user'));
  env = environment.env;
  currentStructure = JSON.parse(sessionStorage.getItem('user')).structure.sigle;
  spinner1 = true;
  select: any;
  select2: any;
  spinner = false;
  spinner2 = false;
  annee_scolaire;
  approbation;
  admis;
  id_structure;
  error: any;
  message = null;
  data: any = [];
  telephone;
  prenom;
  nom;
  dateInscription;
  list: any = [];
  dateEnCours: any;
  date = new Date();
  base64 = '';
  niveau;
  pageSize = 50;
  pageSizeOptions = [5, 10, 25, 100, 200, 300, 400, 500, 700, 1000, 2000];
  length = 100;

  UrlPhoto: any;
  CurrentAnnee: any;
  anneeStructure: any;
  FileArray : any[] = [];
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['numDossier', 'prenom','email' , 'telephone', 'genre', 'dateDeNaissance', 'nationalite', 'modeAdmission', 'typeCandidat', 'dateCandidature', 'codeOption', 'action'];
  dataSource;
  // imp: string = 'no';
  // impCart: string = 'no';
  annee_scolaire2: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private route: ActivatedRoute, private candidatureService: CandidatureService, public datepipe: DatePipe
    , private preinscription: PreInscriptionServiceService, private structureService: StructureService) {

    this.dateEnCours = JSON.parse(sessionStorage.getItem('dateEnCours'));
    this.route.params.subscribe(param => {
      this.spinner1 = true;
      // tslint:disable-next-line:radix
      this.id_structure = parseInt(param['id_structure']);
      // this.annee_scolaire = param['annee_scolaire'];
      this.admis = param['admis'];
      this.spinner1 = false;
    });


    this.structureService.getStuctureAnnees(this.user.structure.id).subscribe(
      (res) => {
        for (let ans of res){
          if (ans.statut = "EN_COURS"){
            this.CurrentAnnee = ans.anneeScolaire;
          }
        }
        console.log(res);
        this.anneeStructure = res;
        this.spinner1 = false;
      },
      (error) => {
        // this.error = error;
        // this.spinner = false;
      });
  }

  ngOnInit() {
  }

  async adminList(pagination?: any) {
    this.annee_scolaire2 = this.annee_scolaire;
    this.spinner2 = true;
    let ans_resp = null;
    if (this.CurrentAnnee === this.annee_scolaire){
      ans_resp = "current";
    } else {
      ans_resp = "passe";
    }
    const data = {
      annee_scolaire: this.annee_scolaire,
      niveau: this.niveau,
      id_structure: this.id_structure,
      dateInscription: this.datepipe.transform(this.dateInscription, 'yyyy-MM-dd'),
      page: pagination ? pagination.pageIndex : 0,
      size: pagination ? pagination.pageSize : 50,
      telephone: this.telephone,
      prenom: this.prenom,
      nom: this.nom,
      ans_resp: ans_resp,
    };
    this.preinscription.preInscriptionsSecretaire(data).subscribe(
      (res) => {
        this.list = [];
        this.length = res.totalElements;
        res.content.forEach(element => {
          this.list.push({
            id: element.idPreInscription,
            numPreInscription: element.numPreInscription,
            prenom: element.prenom,
            nom: element.nom,
            telephone: element.telephone,
            email: element.email,
            genre: element.genre,
            dateDeNaissance: Util_fonction.DateConvert2(element.dateDeNaissance),
            nationalite: element.nationalite,
            modeAdmission: element.modeAdmission,
            // specialite: element.specialite,
            datePreInscription: element.datePreInscription,
            codeOption: element.option.codeOption,
            nomOption: element.option.nom,
            typeCandidat: element.typeCandidat,
            fichiers: element.fichiers,
            idCandidat:  element.idCandidat,
            idEtudiant:  element.idEtudiant
          })
        });
        this.dataSource = new MatTableDataSource(this.list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner2 = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
        this.spinner2 = false;
      });
  }

  Document(data) {
    this.data = null;
    this.FileArray = [];
    this.data = data;
    console.log(data);
    let i =0;
    for (i = 0; i < Object.keys(data.fichiers).length; i++){
      if (Object.keys(data.fichiers)[i] === "PHOTO D'IDENTITE") {
        this.UrlPhoto = Object.values(data.fichiers)[i];
        if (this.UrlPhoto.toLowerCase().includes('public')) {
          this._http = 'https://';
        }
        else {
          this._http = 'http://';
        }
      }
      this.FileArray.push({nom: Object.keys(data.fichiers)[i], url: Object.values(data.fichiers)[i]});
    }

    $('#staticBackdropP4').modal('show');
    $('#staticBackdropP4').appendTo('body');
  }

  // Document2(data) {
  //   this.select = [];
  //   this.select = data;
  //   console.log(this.select);
  //   $('#exampleModalP3').modal('show');
  //   $('#exampleModalP3').appendTo('body');
  //
  //   // $('#staticBackdropP4').modal('show');
  //   // $('#staticBackdropP4').appendTo('body');
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  validateInscription(donnee) {
    console.log(donnee);
    $('#staticBackdropP4').modal('hide');
    this.error = null;
    this.message = null;
    this.spinner = true;

    let ans_resp = null;
    if (environment.env === 'ussgb' && Util_fonction.checkIfNoTEmpty(donnee.idEtudiant)){
      ans_resp = "reInscription";
    } else {
      ans_resp = "preInscription";
    }

    const data = {
      id: donnee.id,
      ans_resp: ans_resp
    };
    this.select2 = donnee;
    console.log(this.select2);
    this.preinscription.validateInscription(data).subscribe(
      (res) => {
        Util_fonction.SuccessMessage("Validé avec succès ! Veuillez imprimer la carte et l'attestation");
        this.adminList();
        this.convetToPDF(res);
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
        this.spinner = false;
      });
  }

  hours;
  public convetToPDF(select) {
    // this.imp = 'no';
    // this.impCart = 'no';
    this.select = [];
    this.select = select;
    const now = new Date();
    this.hours = now.getHours() + ':' + now.getMinutes();
    console.log(this.select);

    this.BindCrosImage('photo_etudiant', select.photo);
    this.BindCrosImage('structLogo', this.user.structure.logo);


    $('#exampleModalP3').modal('show');
    $('#exampleModalP3').appendTo('body');
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
      // this.imp = 'yes';
    });
  }

  photo(photo) {
    return photo != null ? photo.split('/')[5] : '';
  }

  logo(logo) {
    return logo.split('/')[5];
  }

  imprimerCarte(prenom, nom) {
    this.spinner = true;
    Util_fonction.PrintCarteEtudiant();
    this.spinner = false;
    // this.impCart = 'yes';
  }

  exportexcel() {
    /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'liste_des_admis.xlsx');
  }

  exportpdf() {
    const data = document.getElementById('excel-table');
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
      pdf.save('liste_des_admis.pdf'); // Generated PDF
      this.spinner = false;
    });
  }

  toDataURL(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  Delete_PreInscription(element){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer la préinscription Numéro : '"+element.numPreInscription+"' , de "+element.prenom+" "+ element.nom,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.preinscription.supprimerPré_Inscription(element.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
          // this.GetListEvenement();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })

  }

}
