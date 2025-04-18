import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {StructureService} from "../../../services/structure.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DepartementService} from "../../../services/departement.service";
import {FiliereService} from "../../../services/GestionFilieres/filiere.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CandidatService} from "../../../services/GestionEtudiants/candidat.service";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UNIV_FILIERE, UNIV_FILIERE_CODE, UNIV_OPTION, UNIV_OPTION_CODE} from "../../../CONSTANTES";

@Component({
  selector: 'ngx-filiere',
  templateUrl: './filiere.component.html',
  styleUrls: ['./filiere.component.scss']
})
export class FiliereComponent implements OnInit {
  univ_fil = UNIV_FILIERE;
  univ_filCode = UNIV_FILIERE_CODE;

  univ_opt = UNIV_OPTION;
  univ_optCode = UNIV_OPTION_CODE;
  showForm :boolean = false;
  creatForm :boolean;
  DepSelectID;
  Filieres;
  Options;
  AllSpecialites;
  dialogName;
  checkResult;
  anneeScolaireChecking = null;
  structureID;
  structureEvenements;

  filiereForm: FormGroup;
  searchKey: string;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'code',
    'nom',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public dialog: MatDialog,
              private filiereService: FiliereService,
              private optionService: OptionsService,
              private SpecService: CandidatService) { }

  ngOnInit(): void {
    this.structureID = sessionStorage.getItem('id_structure');
    this.getAllFiliers();
    this.initForm();
  }

  /***
   * pemmet de savoir si le formuaire est pour la création ou pour la mise à jour
   * @param selected
   */
  formSelected(selected){
    if (selected === 'creat') {
      this.creatForm = true;
    } else {
      this.creatForm = false;
    }
    this.showForm = true;
  }


  saveFiliere(filiereForm: FormGroup){
    if (this.creatForm) {
      this.addEvenement(filiereForm);
    } else {
      /** Mise à jours **/
      this.update_Evenement(filiereForm);
    }
  }

  cancelForm() {
    this.showForm = false;
    this.initForm();
  }

  /**
   * Méthode création d'une année
   * @param {FormGroup} filiereForm
   */
  addEvenement(filiereForm: FormGroup) {
    this.filiereService.createFiliere(filiereForm.value).subscribe(res =>{
      // this.utilService.showToast('success', 'Succès', res.toString());
      this.showForm = false;
      this.getAllFiliers();
    },error1 => {
      console.log(error1);
      // this.utilService.showToast('danger', 'Erreur', error1['error']);
    });
  }

  /***
   * Méthode qui remplie le formulaire d'edition
   * @param id
   */
  fullEditForm(id){
    for (let fil of this.Filieres){
      if (fil['id'] === id){
        this.filiereForm.controls.id.setValue(fil.id);
        this.filiereForm.controls.codeFiliere.setValue(fil.anneeScolaire);
        this.filiereForm.controls.nom.setValue(fil.semestre);
      }
    }
  }

  /**
   * Méthode mise à jours d'une année
   * @param {FormGroup} filiereForm
   */
  update_Evenement(filiereForm: FormGroup){
    // this.filiereService.updateFiliere(filiereForm.value).subscribe(res =>{
    //   // this.utilService.showToast('success', 'Succès', res.toString());
    //   this.showForm = false;
    //   this.getAllFiliers();
    // },error1 => {
    //   // this.utilService.showToast('danger', 'Erreur', error1['error']);
    // });
  }



  deletefil(ID){
    this.filiereService.deleteFiliere(ID).subscribe(delRes =>{
      // this.utilService.showToast('success', 'Succès', delRes.toString());
      this.getAllFiliers();
    }, error1 => {
      // this.utilService.showToast('danger', 'Erreur', error1['error']);
    });
  }

  /**
   * Amene les années créée par la structure courante
   */
  getAllFiliers(){
    this.filiereService.getAllFiliere().subscribe(getRes =>{
      // console.log(getRes);
      this.Filieres = getRes;
      // this.handleSuccessfulResponse(getRes);
    });
  }

  AffectOptions(filID){
    this.getOptions(filID);
  }

  getOptions(filID){
    this.optionService.getOptionsByFiliereID(filID).subscribe(optionRes =>{
      // console.log(optionRes);
      this.Options = optionRes;
    });
  }

  getSepcialite(){
    this.SpecService.getSepcialites().subscribe(specRes =>{
      this.AllSpecialites = specRes;

    });
  }

  /***
   * Initialisation du formulaire
   */
  initForm(){
    if (this.creatForm){
      this.filiereForm = this.formBuilder.group({
        departement: {
          id : this.DepSelectID
        },
        codeFiliere : new FormControl (null, Validators.required),
        nom : new FormControl (null, Validators.required),
      });
    } else {
      this.filiereForm = this.formBuilder.group({
        departement: {
          id : this.DepSelectID
        },
        codeFiliere : new FormControl (null, Validators.required),
        id : new FormControl (null),
        nom : new FormControl (null, Validators.required),
      });
    }
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }
}
