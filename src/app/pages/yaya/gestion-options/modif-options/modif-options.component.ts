import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
// import { FiliereService } from '../../../../../../ussgb-angular/src/app/services/GestionFilieres/filiere.service';
import { OptionsService } from '../../../../services/GestionFilieres/Options/options.service';
import {Util_fonction} from "../../../models/util_fonction";

@Component({
  selector: 'ngx-modif-options',
  templateUrl: './modif-options.component.html',
  styleUrls: ['./modif-options.component.scss']
})
export class ModifOptionsComponent implements OnInit {

  modifOptionForm: FormGroup;
  Option:any = {
    id:this.route.snapshot.paramMap.get("id_option"),
    nom: '',
    codeOption:'',
    filiere: {
      id:this.route.snapshot.paramMap.get("id_filiere"),
    },
  };
  id :any;
   id_structure:any;
    OptionNotFound: string;

    id_departement:any;
    id_filiere:any;
  Filiere: Object;
  filiere:any;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              // private filiereService: FiliereService,
              private optionService: OptionsService,
              private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id_option");
    this.id_structure = this.route.snapshot.paramMap.get("id"),
    this.getFilieres(this.id);
    this.getStructureOptions(this.id);
    // initiation du formulaire
    this.initForm();
  }
  // foction initialisation du formulaire pour le lier au template dans ng OnInit
  initForm(){

    this.modifOptionForm = this.formBuilder.group({
      nom: [this.Option.nom, Validators.required],
      codeOption: [this.Option.codeOption, Validators.required],
      filiere: {
        id: this.id_filiere,
      }
    });
  }
  getFilieres(id){
  //   this.filiereService.getFilieres(id).subscribe(filiereRes => {
  //     console.log(filiereRes);
  //     this.Filiere = filiereRes;
  //  });
   }
  getStructureOptions(id) {
    this.optionService.getOptions(id).subscribe((data) => {
      console.log(data);
    this.Option= data;
    })
    }

  // handleSuccessfulResponse(res) {
  //   this.Batiment = res;
  //   this.initForm();
  // }
  Annuler(){
    this.router.navigate(['/pages/filiere/'+this.id_filiere+'/Options']);

  }
  modifierOption() {
    this.Option.nom = this.modifOptionForm.value['nom'];
    this.Option.codeOption = this.modifOptionForm.value['codeOption'];
    this.Option.filiere = {
      id : this.route.snapshot.paramMap.get("id_filiere"),
    };
    //let id = this.route.snapshot.paramMap.get("id_structure");
    this.optionService.updateOption(this.Option).subscribe(
      response => {
        Swal.fire({
          title: "",
          text: " Option modifié avec succes!",
          icon: "success",
        }).then((result) => {
          this.router.navigate(['/pages', 'structure',this.route.snapshot.paramMap.get("id"),'departement',this.route.snapshot.paramMap.get("id"),'filiere',this.route.snapshot.paramMap.get("id"),'Options']);

        });

        this.router.navigate(['/pages/filiere/'+this.id_filiere+'/Options']);
      },error =>{
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      },

    )
  }

}
