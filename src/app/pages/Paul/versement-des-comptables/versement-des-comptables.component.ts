import { Component, OnInit } from '@angular/core';
import {VersementService} from "../../../services/versement.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {Util_fonction} from "../../models/util_fonction";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import {PersonnelAdminService} from "../../../services/GestionPersonnelAdmin/personnel-admin.service";
import {UNIV_MINISTERE, UNIV_NAME} from "../../../CONSTANTES";
import {StructureService} from "../../../services/structure.service";
declare var $: any;

@Component({
  selector: 'app-versement-des-comptables',
  templateUrl: './versement-des-comptables.component.html',
  styleUrls: ['./versement-des-comptables.component.css']
})
export class VersementDesComptablesComponent implements OnInit {
  univ_Minist = UNIV_MINISTERE;
  univ_name = UNIV_NAME;
  user = JSON.parse(sessionStorage.getItem('user'));
  _RECTORAT: boolean =  this.user.structure.type === 'RECTORAT';
  structureId = this.user.structure.id;


  ListComptables:any = [];
  Versements:any;
  comptaData: any;
  showCompta: boolean = false;
  showForm : boolean = false;
  vermentSpinner : boolean = false;
  showversementRecu : boolean = false;
  imprimespinner : boolean = false;

  VersermentBody ={
    agentComptable_id: null,
    dateDeVersenement: null,
    // heureDeVersenement: {
    //   hour: null,
    //   minute: null,
    //   nano: null,
    //   second: null
    // },
    montant: 0,
    motif: null,
    structure_id: 0
  }
  comptaVersementForm: FormGroup;
  SelectData: any;
  versementRecu: any;
  ListChefComptables: any;

  GetBody = {
    id_structure: null,
    role: null
  }
  admin = false;
  retoratStructure;
  constructor(private versementService: VersementService,
              private structureService : StructureService,
              private personnelAdminService: PersonnelAdminService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (this._RECTORAT){
      this.retoratStructure = JSON.parse(sessionStorage.getItem("retoratStructure"));
      this.structureId = this.retoratStructure.id;
    }
    for (let rl of this.user.users.roles){
      if (rl.nom === "ROLE_ADMIN"){
        this.admin = true;
      }
    }
    this.initVersemntForm();
    this.getListOfComptables();
    this.getListOfChefComptables();
    // this.GetAllVersements();
  }

  getListOfChefComptables(){
    // this.GetBody.role = "ROLE_CHEF_COMPTABLE";
    // this.GetBody.id_structure = +this.structureId;
    // this.personnelAdminService.getStructurePersonnel(this.GetBody).subscribe(EnseignantListRes => {
    this.structureService.getChefComptableList(this.structureId).subscribe(chefComptableListRes => {
      this.ListChefComptables = chefComptableListRes;

    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message)

    });
  }

  /**
   * LISTE DES COMPTABLES
   */
  async getListOfComptables(){
    this.ListComptables = await this.structureService.getComptableList(this.structureId).toPromise();
    console.log(this.ListComptables);
  }

  /**
   *
   * @constructor
   */
  // async GetAllVersements(){
  //   this.Versements = await this.versementService.GetVersements(this.user.structure.id).toPromise();
  //   console.log(this.Versements);
  // }

  async consultrer(element){
    this.showCompta = true;
    this.comptaData = element;
    // this.Versements = await this.versementService.GetVersements(this.user.structure.id).toPromise();
    // console.log(this.Versements);
  }

  async launchEncaissement(element){
    console.log(element);
    this.initVersemntForm();
    this.SelectData = element;
    this.showForm = true;
    $('#VersementFormModal').modal('show');
    $('#VersementFormModal').appendTo('body');
  }

  SaveVersement() {
    this.vermentSpinner = true;
    this.VersermentBody.agentComptable_id = +this.SelectData.id;
    this.VersermentBody.structure_id = +this.user.structure.id;
    this.VersermentBody.montant = +this.comptaVersementForm.controls.montant.value;
    this.VersermentBody.motif = this.comptaVersementForm.controls.motif.value;

    // let dateselect =
    // let datArray = [];
    // datArray.push(dateselect.getFullYear());datArray.push(dateselect.getMonth());datArray.push(dateselect.getDay());
    // let hour = dateselect.getHours();
    // let minute = dateselect.getMinutes();
    // let second = dateselect.getSeconds();
    // let nano = dateselect.getMilliseconds();
    console.log(this.comptaVersementForm.controls.dateDeVersenement.value);
    // const util = new Util_fonction();

    this.VersermentBody.dateDeVersenement = this.comptaVersementForm.controls.dateDeVersenement.value;
    // this.VersermentBody.heureDeVersenement.hour = hour;
    // this.VersermentBody.heureDeVersenement.minute = minute;
    // this.VersermentBody.heureDeVersenement.second = second;
    // this.VersermentBody.heureDeVersenement.nano = nano;
    this.Save(this.VersermentBody);
  }

  Save(VersermentBody){
    this.versementService.SaveVersement(VersermentBody).subscribe(saveResponse => {
      this.vermentSpinner = false;
      this.versementRecu = saveResponse;
      $('#VersementFormModal').modal('hide');
      this.showForm = false;
      console.log(saveResponse);
      Swal.fire({
        title: '',
        text: 'Versement effectué avec succès',
        icon:'success'
      }).then((result) => {
        if (result.isConfirmed) {
          $('#VersementFormModal').modal('hide');
          this.LaunchDecharge();
        }
      })
    }, SaveError => {
      this.vermentSpinner = false;
      console.log(SaveError);
      Swal.fire({
        title: '',
        text: SaveError.error.message,
        icon:'error'
      })
    })
  }

  LaunchDecharge(){
    this.showversementRecu = true;
    $('#ressumModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#ressumModal').appendTo('body');
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

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 15;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(this.versementRecu.nomAgentComptable+''+ this.versementRecu.versement_id + '_' + this.versementRecu.agentComptable_id + '.pdf'); // Generated PDF
      this.imprimespinner = false;
      $('#ressumModal').modal('hide');
    });
  }

  logo(logo) {
    return logo.split('/')[5];
  }


  /**
   * INITIALISATION DU FORMULAIRE DE VERSEMENT
   */
  initVersemntForm(){
    this.comptaVersementForm = this.formBuilder.group({
      dateDeVersenement: new FormControl(null,[Validators.required]),
      montant: new FormControl(null,[Validators.required]),
      motif: new FormControl(null, [Validators.required]),
    })
  }
}
