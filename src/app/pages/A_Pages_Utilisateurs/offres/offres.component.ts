import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {OffresService} from "../../../services/offres.service";
import Swal from "sweetalert2";
import {StructureService} from "../../../services/structure.service";
import {structureSelected} from "../../REST_URL";
import {Util_fonction} from "../../models/util_fonction";
declare var $: any;

@Component({
  selector: 'app-offres',
  templateUrl: './offres.component.html',
  styleUrls: ['./offres.component.css']
})
export class OffresComponent implements OnInit {
OffreStageBody = {
  "libelle" : "Stage de formation",
  "niveauEtude" : "",
  "description" : "",
  "entreprise" : "",
  "email" : "",
  "dateDebut" : "",
  "dateFin" : "",
  "idStructure" : null
};

  OffreByNiveau ={
    "idStructure" : null,
    "niveauEtude" : null,
    "anneeScolaire" : null
  };
  OffreForm: FormGroup;
  StructureFileterForm: FormGroup;
  StructureID:any;
  Offre_Select:any;
  structure_ID:any;
  allStructure = [];
  struct_select:boolean = false
  ShowListInteresse :boolean = false
  displayedColumns: string[] = ['libelle', 'entreprise', 'niveau', 'dateDebut', 'dateFin', 'action'];
  dataSource: any;
  anneeScolaire:any;
  action: string;
  editID: any;
  idOffre: any;
  structureData:any; // = structureSelected.Data;
constructor(private formBuilder: FormBuilder, private activeRoute: ActivatedRoute,
            private route: Router,
            private offreService: OffresService, private structureService: StructureService) { }

  ngOnInit() {
    this.initForm();
    if (sessionStorage.getItem('structureSelected')){
      this.structureData = JSON.parse(sessionStorage.getItem('structureSelected'));

      // this.initStructureFilter();
      this.StructureSearchFilterChanger();
    }
    this.getStructures();
    this.GetStructureStages();
  }
  getStructures() {
    this.structureService.getStuctures().subscribe(
      (res) => {
        // console.log(res);
        //   this.allStructure = res;
        for (const str of res) {
          // let st = ;
          if (str['type'] + '' !== 'RECTORAT') {
            this.allStructure.push(str);
          }
        }
      },
      (error) => {
      });
  }

  niveau;
  entreprise;
  libelle;
  getBody = {
    idStructure: null,
    niveau: null,
    entreprise: null,
    libelle: null
  }
  GetStructureStages() {
    this.getBody.idStructure = +this.structure_ID;
    this.getBody.niveau = this.niveau;
    this.getBody.entreprise = this.entreprise;
    this.getBody.libelle = this.libelle;

    this.offreService.getStructStages(this.getBody).subscribe((res)=> {
      this.dataSource = res.content;
    });
  }

  StructureSearchFilterChanger(){
    let structureID = this.structureData.Data.id;// this.StructureFileterForm.controls.structureID.value;
    this.structure_ID = this.structureData.Data.id; //this.StructureFileterForm.controls.structureID.value;
    if (structureID !== null && structureID !== undefined){
      this.struct_select = true;
      this.structureService.getStructureCurrentAnnee(structureID).subscribe(annRes => {
        const anneeScolaire = annRes.anneeScolaire;
        this.anneeScolaire = annRes.anneeScolaire;
        let getBody = {
          id_structure:+structureID,
          anneeScolaire: anneeScolaire
        }
        this.offreService.getStructStages(getBody).subscribe((res)=> {
          this.dataSource = res;
          if (Object.keys(res).length <= 0) {
            Util_fonction.AlertMessage("info", "Il n'y a pas d'offre de stage pour le moment");
          }
        });
      }, AnneError => {
        Util_fonction.AlertMessage("warning", AnneError.error.message);
      });
    } else {
      this.struct_select = false;
    }
  }

  newOffre(){
    this.action = "new";
  this.initForm();
    $('#OffreFormModal').modal('show');
    $('#OffreFormModal').appendTo('body');
  }

  modif(element){
  this.action = "edit";
  this.editID = element.id;
    this.initForm();
    if (element.dateFin[1].toString().length <= 1){
      element.dateFin[1] = '0'+element.dateFin[1];
    }
    if (element.dateFin[2].toString().length <= 1){
      element.dateFin[2] = '0'+element.dateFin[2];
    }

    if (element.dateDebut[1].toString().length <= 1){
      element.dateDebut[1] = '0'+element.dateDebut[1];
    }
    if (element.dateDebut[2].toString().length <= 1){
      element.dateDebut[2] = '0'+element.dateDebut[2];
    }


    let DF = element.dateFin[0]+'-'+element.dateFin[1]+'-'+element.dateFin[2];
    let DD = element.dateDebut[0]+'-'+element.dateDebut[1]+'-'+element.dateDebut[2];
    this.OffreForm.controls.dateDebut.setValue(DD);
    // this.OffreForm.controls.dateFin.setValue(element.dateFin[0]+'/'+element.dateFin[1]+'/'+element.dateFin[2]);
    this.OffreForm.controls.dateFin.setValue(DF);
    this.OffreForm.controls.description.setValue(element.description);
    this.OffreForm.controls.niveauEtude.setValue(element.niveauEtude);
    this.OffreForm.controls.email.setValue(element.email);
    this.OffreForm.controls.entreprise.setValue(element.entreprise);
    this.OffreForm.controls.structureID.setValue(this.structure_ID);

    $('#OffreFormModal').modal('show');
    $('#OffreFormModal').appendTo('body');
  }

  Manifestion(element){
    this.Offre_Select = element;
    this.ShowListInteresse = true;
  }
  /**
   * CREATION D'UNE OFFRE
   * @constructor
   */
  CreatOffreSubmit(){
  this.OffreStageBody.libelle = this.OffreForm.controls.libelle.value;
  this.OffreStageBody.dateDebut = this.OffreForm.controls.dateDebut.value;
  this.OffreStageBody.dateFin = this.OffreForm.controls.dateFin.value;
  this.OffreStageBody.description = this.OffreForm.controls.description.value;
  this.OffreStageBody.niveauEtude = this.OffreForm.controls.niveauEtude.value;
  this.OffreStageBody.email = this.OffreForm.controls.email.value;
  this.OffreStageBody.entreprise = this.OffreForm.controls.entreprise.value;
  this.OffreStageBody.idStructure = +this.OffreForm.controls.structureID.value;

  this.offreService.saveStageOffre(this.OffreStageBody).subscribe((res) =>{
    if(Util_fonction.checkIfNoTEmpty(this.structure_ID) && Util_fonction.checkIfNoTEmpty(this.anneeScolaire)){
      this.GetStructureStages();
    }
    $('#OffreFormModal').modal('hide');
    Util_fonction.SuccessMessage(res);
    this.initForm();
  }, (error)=> {
    Util_fonction.AlertMessage(error.error.status,error.error.message);
  })
  }

  EditOffreSubmit(){
    this.OffreStageBody.libelle = this.OffreForm.controls.libelle.value;
    this.OffreStageBody.dateDebut = this.OffreForm.controls.dateDebut.value;
    this.OffreStageBody.dateFin = this.OffreForm.controls.dateFin.value;
    this.OffreStageBody.description = this.OffreForm.controls.description.value;
    this.OffreStageBody.niveauEtude = this.OffreForm.controls.niveauEtude.value;
    this.OffreStageBody.email = this.OffreForm.controls.email.value;
    this.OffreStageBody.entreprise = this.OffreForm.controls.entreprise.value;
    this.OffreStageBody.idStructure = +this.OffreForm.controls.structureID.value;

    this.offreService.updateStageOffre(this.OffreStageBody, this.editID).subscribe((Updateres) =>{
      if(this.structure_ID !== null && this.anneeScolaire !== null && this.anneeScolaire !== undefined && this.structure_ID !== undefined){
        this.GetStructureStages();
      }
      $('#OffreFormModal').modal('hide');
      Util_fonction.SuccessMessage(Updateres);

    }, (error)=> {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }

  delete(element){
    Swal.fire({
      title: '',
      html: 'êtes-vous sûr de supprimer cet <strong> ' + element.nom + '</strong>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'non, annuler',
      confirmButtonText: 'Oui, Supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.offreService.deleteStageOffre(element.id).subscribe( deletRes=>{
          if(this.structure_ID !== null && this.anneeScolaire !== null && this.anneeScolaire !== undefined && this.structure_ID !== undefined){
            this.GetStructureStages();
          }
          Util_fonction.SuccessMessage(deletRes);
        }, deleerror => {
          // this.add_spinner = false;
          Util_fonction.AlertMessage(deleerror.error.status,deleerror.error.message);
        })
      }
    });
  }
  backToHome(){
    this.route.navigate(['']);
  }
  initForm() {
    this.OffreForm = this.formBuilder.group({
      "libelle" : new FormControl('Stage de formation',[Validators.required]),
      "niveauEtude" : new FormControl('', [Validators.required]),
      "description" : new FormControl('', [Validators.required]),
      "entreprise" : new FormControl('', [Validators.required]),
      "email" : new FormControl('', [Validators.required]),
      "dateDebut" : new FormControl('', [Validators.required]),
      "dateFin" : new FormControl('', [Validators.required]),
      "structureID": new FormControl('')
    })
  }

  initStructureFilter(){
    this.StructureFileterForm = this.formBuilder.group({
      structureID: new FormControl('', [Validators.required]),
    });
  }

}
