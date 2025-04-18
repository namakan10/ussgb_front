import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {OffresService} from "../../../services/offres.service";
import Swal from "sweetalert2";
import {MatTableDataSource} from "@angular/material";
import {Util_fonction} from "../../models/util_fonction";
declare var $: any;

@Component({
  selector: 'app-list-offres-entreprise',
  templateUrl: './list-offres-entreprise.component.html',
  styleUrls: ['./list-offres-entreprise.component.css']
})
export class ListOffresEntrepriseComponent implements OnInit {
  displayedColumns: string[] = ['libelle', 'entreprise', 'niveau', 'dateDebut', 'dateFin', 'action'];
  dataSource: any;// new MatTableDataSource<any[]>();
  Show_maniF_Form: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  user:any;
  ListOffres:any;
  OffreSelectToShow:any;
  Show_statut = false;
  showNiveau = false;
  showEntrepriseInput = false;
  // fileterByNiveauForm: FormGroup;
  Offre_Form: FormGroup;
  ManifestationBody = {
    "etudiant" : {
      "id" : null
    },
    "stage" : {
      "id" : null
    }
  }

 OffreByNiveau ={
  "idStructure" : null,
  "niveauEtude" : null,
  "anneeScolaire" : null
};

  constructor(private formBuilder: FormBuilder, private activeRoute: ActivatedRoute, private offreService: OffresService) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.initForm();
    this.GetStructureStages();
  }

  getBody = {
    idStructure: null,
    niveau: null,
    entreprise: null,
    libelle: null
  }

  GetStructureStages() {
    this.getBody.idStructure = +this.user.structure.id;
    this.getBody.niveau = this.Offre_Form.controls.niveau.value;
    this.getBody.entreprise = this.Offre_Form.controls.nom.value;;
    this.getBody.libelle = this.Offre_Form.controls.libelle.value;;

    this.offreService.getStructStages(this.getBody).subscribe((res)=> {
      this.ListOffres = res.content;
      this.dataSource = res.content;
      if (Object.keys(this.ListOffres).length <= 0) {
        Util_fonction.AlertMessage("info", "Il n'y a pas d'offre de stage pour le moment");
      }
    });
  }

  // typeS= null;
  // FilterChangerSearch(){
  //  this.typeS = this.Offre_Form.controls.type.value;
  // }


  desactivAll() {
    this.Offre_Form.controls.niveau.reset();
    this.Offre_Form.controls.niveau.clearValidators();
    this.Offre_Form.controls.niveau.updateValueAndValidity();

    this.Offre_Form.controls.nom.reset();
    this.Offre_Form.controls.nom.clearValidators();
    this.Offre_Form.controls.nom.updateValueAndValidity();
  }

  showOffre(element){
    this.Show_statut = true;
    this.OffreSelectToShow = element;

    $('#OffreShowModal').modal('show');
    $('#OffreShowModal').appendTo('body');
  }

  Manifestrer(element){
    this.Show_maniF_Form = true;
    this.OffreSelectToShow = element;
    // $('#Offre_ManifesterModal').modal('show');
    // $('#Offre_ManifesterModal').appendTo('body');
    Swal.fire({
      title: '',
      html: "Êtes-vous sûr de vouloir postuler à l'offre de stage suivant: <br>"+element.libelle+" <br> de "+element.entreprise,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Non',
      confirmButtonText: 'Oui, Postuler!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.SaveManifestation(element);
      }
    })
  }

  hideModal(item){
    if(item === 'form'){
      $('#Offre_ManifesterModal').modal('hide');
    } else {
      $('#OffreShowModal').modal('hide');
    }
  }

  SaveManifestation(element){
    this.ManifestationBody.etudiant.id = this.user.users.etudiant.id;
    this.ManifestationBody.stage.id = element.id;
    this.offreService.saveManifestation(this.ManifestationBody).subscribe( saveRes => {
      Util_fonction.SuccessMessage(saveRes);

    }, saveError => {
      Util_fonction.AlertMessage(saveError.error.status,saveError.error.message);
    })
  }

  initForm(){

    this.Offre_Form = this.formBuilder.group({
      // type: new FormControl('', [Validators.required]),
      niveau: new FormControl(''),
      nom: new FormControl(''),
      libelle: new FormControl('')
    });

 }

}
