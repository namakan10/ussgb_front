import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FilesService} from "../../../services/files.service";
import {Util_fonction} from "../../models/util_fonction";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {UNIV_FILIERE, UNIV_FILIERE_S} from "../../../CONSTANTES";
declare var $: any;

@Component({
  selector: 'app-charge-fseg-list',
  templateUrl: './charge-fseg-list.component.html',
  styleUrls: ['./charge-fseg-list.component.css']
})
export class ChargeFsegListComponent implements OnInit {

  user = JSON.parse(sessionStorage.getItem("user"));
  fichier : File;
  fichierInp;
  optionInp;
  _spinner: boolean = false;
  fileOk: boolean = false;
  filiereListBody = {
    id_structure: null,
    id_departement: null,
    id_candidat: null,
    cursus: null,
  };
  uni_fil = UNIV_FILIERE_S;
  optionSelect;
  constructor(private fileService: FilesService,
              private optionService: OptionsService,
              private refChange: ChangeDetectorRef) { }

  ngOnInit() {
    this.GetOptions();
  }

  Options: any;
  GetOptions(){
    this.filiereListBody.id_structure = this.user.structure.id;
    this.optionService.getStructure_Options(this.user.structure.id).subscribe(
      res => {
        console.log(res);
        this.Options = res;
        this.Options.map(f => {f.nom = f.codeOption+' '+ f.nom});
        this.refChange.detectChanges();
      }, error1 => {
      });
  }

  FileSelect(event){
    this.fileOk = false;
    this.fichier = event.target.files[0];
    let fichier = event.target.files[0];
    const ext = fichier.name.substr(fichier.name.lastIndexOf('.') + 1);
    const extension = ['xlsx', 'xls', 'XLS', 'XLSX'];
    if (extension.includes(ext)) {
      this.fileOk = true;
    } else {
      this.fileOk = false;
      Util_fonction.AlertMessage("warning", "Le fichier ne respecte pas le format excel! <br> <strong>xlsx ou xls</strong>");
    }
  }

  Charger(){
    this._spinner = true;
    // console.log(this.user.structure.id, this.optionSelect);
    this.fileService.SendeStudentFile(this.user.structure.id, this.optionSelect, this.fichier).subscribe(
      res =>{
        this._spinner = false;
        Util_fonction.SuccessMessage(res);
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      })
  }

  optionSelectName = "";
  keyword = "nom";
  OptionSelectEvent(event){
    this.optionSelect = event.id;
    this.optionSelectName = " ("+event.codeOption+") "+event.nom;
  }

  cancel(){
    this.optionSelect = undefined;
  }

  // ShowDownloadModal(){
  //   $('#fileChooseModal').modal({
  //     backdrop: 'static',
  //     keyboard: false
  //   });
  //   $('#fileChooseModal').appendTo('body');
  // }
  ChargementsModal(){
    this.fichierInp = null;
    this.optionInp = null;
    this.optionSelect = undefined;
    this.fileOk = false;

    $('#chargementModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#chargementModal').appendTo('body');

  }

  checkIfNotNull(element){
   return Util_fonction.checkIfNoTEmpty(element);
  }

}
