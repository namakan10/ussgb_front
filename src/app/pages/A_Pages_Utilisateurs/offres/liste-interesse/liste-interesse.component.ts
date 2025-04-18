import {Component, Input, OnInit} from '@angular/core';
import {OffresService} from "../../../../services/offres.service";
import Swal from "sweetalert2";
import {CvService} from "../../../../services/cv.service";
import {EtudiantService} from "../../../../services/GestionEtudiants/etudiant.service";
import {Util_fonction} from "../../../models/util_fonction";
import {_HTTP} from "../../../../CONSTANTES";
declare var $: any;

@Component({
  selector: 'app-liste-interesse',
  templateUrl: './liste-interesse.component.html',
  styleUrls: ['./liste-interesse.component.css']
})
export class ListeInteresseComponent implements OnInit {
  ListEtudiantsInteresse:any;
  etudiant:any;
  _http = _HTTP;
  CV_DATA:any;
  cvIsCreated = false;

spinner1 = false;
spinner2: boolean = false;
  @Input() Offre : any;
  constructor(private offreService: OffresService,
              private etudiantService: EtudiantService,
              private cvService:CvService, ) { }

  ngOnInit() {
    this.GetInteresseList();
  }
  parseImage(img: string): string {
    if(!img) return;
    return img.includes("public.") ? "https://" + img : "http://" + img ;
  }
  GetInteresseList() {
    this.spinner1 = true;
    this.offreService.GetListInteresseByOffre(this.Offre.id).subscribe(res => {
      this.ListEtudiantsInteresse = res;
      this.spinner1 = false;
    });
  }

  ShowCV(){
    $('#CVModal').modal('show');
    $('#CVModal').appendTo('body');
    this.spinner2 = false;
  }

  GetEtudiant(element){
    this.spinner2 = true;

    this.cvService.getEtudiantCV(element.id).subscribe(CvRes => {
      // this.spinner1 = false;
      this.CV_DATA = CvRes;
      this.cvIsCreated = true;
      this.ShowCV();

    }, creatError =>{
      this.spinner2 = false;
      Util_fonction.AlertMessage(creatError.error.status,creatError.error.message);
    });

  }

  getCvOfEtudiant(){

  }

}
