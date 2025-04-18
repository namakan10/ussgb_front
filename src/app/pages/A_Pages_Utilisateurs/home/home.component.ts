import { Component, OnInit } from '@angular/core';
import { StructureService } from '../../../services/structure.service';
import {structureSelected} from "../../REST_URL";
import {EvenementService} from "../../../services/evenement.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {Util_fonction} from "../../models/util_fonction";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UNIV_IST, UNIV_NAME, UNIV_SIGLE} from "../../../CONSTANTES";


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  univ = UNIV_SIGLE;
  univ_name = UNIV_NAME;
  univ_inst = UNIV_IST;
  affUssg = true;
  allStructure: any;
  structureSelectedData: any;
  showdetail:boolean = false;
  diseableClick: boolean = false;
  structureSelected: boolean = false;
  PreInscriptionLaunch: boolean = false;
  EndDate: any;
  T: any;
  _TimeDecompte: any;
  Envent: any;
  listBody = {
    cursus: null,
    id_annee: null,
    id_structure: null,
    type_evenement: null,

  }
  FilterForm: FormGroup;

  jsSession :any;
  StructureAnnees :any;
  _Ans = "";
  constructor(private structureService: StructureService,
              private router: Router,
              private formBuilder: FormBuilder,
              private evenementService: EvenementService) {
    setTimeout(() => {
      this.affUssg = false;
    }, 2000);

    this.initFilterForm();
  }


  ngOnInit(): void {
    //
    if (Util_fonction.checkIfNoTEmpty(sessionStorage.getItem('user'))){
      this.diseableClick = true;
      clearInterval();
    } else {
      this.diseableClick = false;
      if (Util_fonction.checkIfNoTEmpty(sessionStorage.getItem('structureSelected'))){
        // let jsSession = JSON.parse(sessionStorage.getItem('structureSelected'));
        this.jsSession = JSON.parse(sessionStorage.getItem('structureSelected'));
        this.GetStuctureAnnees();

      } else {
        this.router.navigate(['/pages/utilisateur/home']);
      }
    }
    this.structureService.getStuctures().subscribe(
      (res) => {
        this.allStructure = res;
      },
      (error) => {
      });
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  changeAns (event) {
    this._Ans = event.target.options[event.target.options.selectedIndex].text;
  }

  GetStuctureAnnees(){
    this.structureService.getStuctureAnnees(this.jsSession.Data.id)
      .subscribe(res => {
        this.StructureAnnees = res;
      });
  }

  filterSearch(){
    this.listBody.id_annee = this.FilterForm.controls.anneeF.value; //this.StructureAnnees.id;
    this.listBody.cursus = this.FilterForm.controls.cursus.value;
    this.CurrentEvent(this.jsSession.Data);
  }

  /**
   * LISTE TOUS LES EVENEMENTS "candidature, inscription, ré-inscription list passage, list admission" EN COURS
   * @param structureData
   * @constructor
   */
  CurrentEvent(structureData){
    // let util = new Util_fonction();
    // util.saveData(structureData);
    this.jsSession ={ Data: structureData};

    this.structureSelected = true;
    structureSelected.etat= true;
    structureSelected.Data= structureData;
    this.structureSelectedData= structureData;
    let event = ["CANDIDATURE", "INSCRIPTION", "RE_INSCRIPTION", "LISTE_DE_PASSAGE", "LISTE_D_ADMISSION"]; //  , "", "LISTE_D_ADMISSION"

    this.listBody.id_structure = structureData.id;
    this.listBody.id_annee = this.FilterForm.controls.anneeF.value; // annee.id;
    // this.listBody.id_annee = this.FilterForm.controls.cursus.value;

    for (let evt of event){
      this.listBody.type_evenement = evt;
      this.GetEvenement(this.listBody);
    }
    // this.structureService.getStructureCurrentAnnee(structureData.id).subscribe(annee => {
    //
    //
    //
    //
    // });

  }

  checkIfIsEmty(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

  /**
   *
   * @constructor
   */
  // listPassageArray = [];
  listPassageArray: any;
  EvenementList : any;
  ListCursus = "";
  ListAnnees = "";
  ListType = "";
  ListeIsEmpty :boolean = false;
  listD :boolean = false;
  listP : boolean = false
  GetEvenement(body){
    this.listPassageArray = [];
    this.EvenementList = [];
    let singleBox = ['LISTE_DE_PASSAGE', 'LISTE_D_ADMISSION'];
    this.listD = false;
    this.listP = false
    this.ListeIsEmpty = false;

    this.evenementService.getStucturesEvenements(body).subscribe(Str_Event => {
      if (Object.keys(Str_Event).length > 0){

        if (this.checkIfIsEmty(this.FilterForm.controls.anneeF.value)){
          this.listPassageArray = Str_Event.filter(ev => {
            // singleBox.includes(ev.type) &&


            if (ev.type === 'LISTE_DE_PASSAGE' && Util_fonction.checkIfEventIsCurrent(ev.dateDebut,ev.dateFin)){
              this.listP = true;
            }
            if (ev.type === 'LISTE_D_ADMISSION' && Util_fonction.checkIfEventIsCurrent(ev.dateDebut,ev.dateFin)){
              this.listD = true;
            }
            // this.ListType += ev.type === 'LISTE_DE_PASSAGE' ? ' LISTE DE PASSAGE ': ev.type === 'LISTE_D_ADMISSION'? 'LISTE D\'ADMISSION' : '';
          });
        }

        // this.ListCursus.push(ev.cursus);
        // this.ListCursus += ' | '+ev.cursus;
        // this.ListAnnees += ' | '+ev.annee.anneeScolaire;


        // if (Object.keys(this.listPassageArray).length >0){
        //   this.ListeIsEmpty = false;
        // }

        for (let ev of Str_Event){
          if (Util_fonction.checkIfEventIsCurrent(ev.dateDebut,ev.dateFin) && !singleBox.includes(ev.type)){
            this.EvenementList.push(ev);
          }
        }

      }
    });
  }

  EventSelected(events){
    sessionStorage.setItem('id_structure', this.jsSession.Data.id);
    sessionStorage.setItem('structureSigle', this.jsSession.Data.sigle);
    sessionStorage.setItem('structureType', this.jsSession.Data.type);
    sessionStorage.setItem('structureLogo', this.jsSession.Data.logo);
    sessionStorage.setItem('structureAnneeScolaire', events.annee.anneeScolaire);
    sessionStorage.setItem('evenementType', events.type);
    sessionStorage.setItem('EvenementData', JSON.stringify(events));
    this.navigateToCheckCandidat();
  }


  /* ===========================================================================================================*/
  /* ===========================================================================================================*/
  /***
   * CHECK IF REQUIRE EVENEMENT EXISTE ALSO SHOW
   * @param structure
   */
  structureIsSelected(structure){
    this.structureSelected = true;
    structureSelected.etat= true;
    structureSelected.Data= structure;
    this.structureSelectedData= structure;
    const toDay = new Date();
    this.listBody.id_structure = this.structureSelectedData.id;
    this.evenementService.getStucturesEvenements(this.listBody).subscribe(Str_Event => {
      if (this.structureSelectedData.type === 'Institut'){
        for(let event of Str_Event){
          if(event.type === 'CANDIDATURE') {
            this.PreInscriptionLaunch = true;
            this.Envent = event.type;
            const d_D = new Date(event.dateDebut);
            const d_F = new Date(event.dateFin);
            if (toDay >= d_D && toDay <= d_F ){
              this.GetTime(d_F);
            } else {
              this._TimeDecompte = '';
            }

          }
        }
      } else {
        for(let event of Str_Event){
          if(event.type === 'INSCRIPTION') {
            this.PreInscriptionLaunch = true;
            this.Envent = event.type;
            const d_D = new Date(event.dateDebut);
            const d_F = new Date(event.dateFin);
            if (toDay >= d_D && toDay <= d_F ){
              this.GetTime(d_F);
            } else {
              this._TimeDecompte = '';
            }

          }
        }
      }
    })
  }

  /**
   * TEMPS RESTANT AVANT LA FERMETURE DES INSCRIPTION
   * @param date
   * @constructor
   */
  GetTime(date){
    this.EndDate = new Date(date).getTime();


    // _TimeDecompte: any;
    this.T = setInterval(()=>{
      let now = new Date().getTime();
      let difference = this.EndDate - now;
      let _day = Math.floor(difference / (60*60*1000*24)) ;// this._hour * 24;
      let _hour = Math.floor(difference % (60*60*24*1000) / (1000*60*60));
      let _minute = Math.floor(difference % (60*60*1000) / (1000*60));
      let _second =  Math.floor(difference % (60*1000) / 1000);

      this._TimeDecompte = ""+_day+"J "+_hour+"H "+_minute+ "m "+_second+"s ";

      if (difference < 0) {
        clearInterval(this.T);
        this._TimeDecompte = "Expiré";
        // this._TimeDecompte = 'Expiré';
      }

    }, 1000);
  }


  DoNotFing(){

  }

  /**
   *
   * @param Data
   */
  checkStructureAnnee(Data) {
    const toReplace = 'd\'id ' + Data.id;
    this.structureService.getStructureCurrentAnnee(Data.id).subscribe(annRes => {

      const anneeScolaire = annRes.anneeScolaire;


      let typeEvent = null; // annRes['anneeScolaire'];//.replace(/\s+/g, '');

      if (Data.type === 'Institut') {
        typeEvent = 'Candidature';
      } else {
        typeEvent = 'Inscription';
      }
      this.CheckStructureInscriptionEvent(Data, typeEvent, anneeScolaire);


    }, anneeError => {
      Util_fonction.AlertMessage(anneeError.error.ststus, anneeError.error.message.replace(toReplace, Data.sigle))
    });
  }

  CheckStructureInscriptionEvent(Data,typeEvent, anneeScolaire) {

    this.listBody.id_structure = Data.id;
    this.listBody.type_evenement = typeEvent;
    this.evenementService.getEvenementByTypeAnneeAndStructure(Data.id, typeEvent, anneeScolaire).subscribe(eventStrucRes => {
      sessionStorage.setItem('id_structure', Data.id);
      sessionStorage.setItem('structureSigle', Data.sigle);
      sessionStorage.setItem('structureType', Data.type);
      sessionStorage.setItem('structureLogo', Data.logo);
      sessionStorage.setItem('structureAnneeScolaire', anneeScolaire);
      sessionStorage.setItem('evenementType', typeEvent);
      this.navigateToCheckCandidat();
    }, errorEvent => {
      Swal.fire({
        title: 'Note!',
        text: '' + errorEvent.error.message,
        icon: 'info',
        confirmButtonText: 'ok'
      });
    });
  }

  navigateToCheckCandidat() {
    this.router.navigate(['/pages/utilisateur/statutCandidat_verification']);
  }


  NavigateToPreInscription() {
    // this.active = 'Preinscription';
    this.router.navigate(['/pages/utilisateur/pre-inscription']);
  }


  NavigateToReInscription(event) {
    sessionStorage.setItem('EvenementData', JSON.stringify(event));
    this.router.navigate(['/pages/utilisateur/re-inscription']);
  }

  modifPage() {
    sessionStorage.setItem('ID_Structure', structureSelected.Data.id);
    // this.active = 'Preinscription_modif';
    this.router.navigate(['/pages/utilisateur/pre-inscription_Modification']);
  }

  navigatePayement() {
    // this.active = 'Payement';
    this.router.navigate(['/pages/utilisateur/payement']);
  }

  ListePassage() {
    this.router.navigate(['/pages/utilisateur/Liste_Passage']);
  }
  ListeAdmission() {
    this.router.navigate(['/pages/utilisateur/Liste_Admission']);
  }

  initFilterForm() {
    // await this.delay(900);

    this.FilterForm = this.formBuilder.group({
      anneeF: new FormControl(null, [Validators.required]),
      // type: new FormControl(null),
      cursus: new FormControl(null)
    })
  }

}
