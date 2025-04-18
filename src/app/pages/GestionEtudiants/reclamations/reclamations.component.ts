import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { id } from '@swimlane/ngx-charts';
import Swal from 'sweetalert2';
import { EtudiantService } from '../../../services/GestionEtudiants/etudiant.service';
import { ReclamationServiceService } from '../../../services/GestionEtudiants/reclamation-service.service';
import {Util_fonction} from "../../models/util_fonction";
declare var $: any;

//--------------
export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
  'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];
//--------------

@Component({
  selector: 'app-reclamations',
  templateUrl: './reclamations.component.html',
  styleUrls: ['./reclamations.component.css']
})
export class ReclamationsComponent implements OnInit {
  displayedColumns = ['nomUE', 'codeUE', 'semestre', 'type', 'dateEvaluation','anneScolaire', 'note','action'];
  displayedColumns2: string[] = ['nomUE', 'codeUE', 'type', 'session', 'date','action'];
  dataSource: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  ReclamationForm: FormGroup;
  UEEelementConstitutifForm: FormGroup;
  Omi_UE_Form: FormGroup;
  ID_Etudiant:any;
  user:any;

  noteArray: any= [];

  BodyData = {
      ue: {
        id: null
      },
        elementConstitutif: { // pour forme
          id: null
        },
      evaluation: {
        id: null
      },
      etudiant: {
        id: null
      },
      motif: ""
  }
  BodyData2 = {
    ue: {
      id: null
    },
      elementConstitutif: null,
    evaluation: {
        id: null
      },
    etudiant: {
      id: null
    },
    motif: ""
}
  showForm = false;
  ListReclamation = true;
  Show_statut = false;
  statutDatas: any;
  selectList = 'Liste des réclamation';
  ElementConstitutifArray = [];
  id_UE_Element: any;
  Show_UeElemenFormModal= false;
  Select_Ue_elements: any;
  List_Ue_Etudiant: any;

  UE_elementFind = false;
  omission_Select = false;
  Noteconstest_Select = false;
  My_UEs: any;
  My_Evaluation: any;

  SelectEvaluType: any = null;
  SelectEvaluNum: any = null;

  optUE_spinner = false;
  optEL_UE_spinner = false;
  optEVA_spinner = false;
  _IUG = false;


  constructor(private reclamationService: ReclamationServiceService,
     private formBuilder : FormBuilder, private etudiantService: EtudiantService) {
    // Create 100 users
    const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.dataSource2 = new MatTableDataSource();
  }
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if(this.user.structure.type === 'Institut' && this.user.structure.sigle === 'IUG'){
      this._IUG = true;
    }
    this.initForm();
    this.ID_Etudiant = this.user.users.etudiant.id;
    this.getMyReclamation();
  }


  getMyReclamation(){
    this.ListReclamation = true;
    this.etudiantService.getEtudiantReclamation(this.ID_Etudiant).subscribe(reclamResponse =>{
      for(let reclam of reclamResponse){
        if(reclam.note === null){
          reclam.note = 'pas de note';
        }
        this.noteArray.push(reclam);
      }
      this.dataSource = this.noteArray;
    })
  }


  getEvaluationReclamation(){
    this.optEVA_spinner = true;
    this.reclamationService.getEtudiantEvaluation(this.ID_Etudiant).subscribe( res => {
      if(this.Noteconstest_Select){
        this.My_Evaluation = res;
        this.optEVA_spinner = false;
      }else{
        this.dataSource2 = res;
      }
    }, error => {
      this.optEVA_spinner = false;
      Util_fonction.AlertMessage("warning",error.error.message);
    })
  }

  /**
   * Les UE de ETUDIANT
   */
  getETudiantUE(){
    this.optUE_spinner = true;
    this.etudiantService.getEtudiant_UEs(this.ID_Etudiant).subscribe( resUE => {
      this.My_UEs = resUE;
      this.optUE_spinner = false;
    }, error => {
      this.optUE_spinner = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }

  DoReclamation(){
    this.initForm();
    $('#ReclamationFormModal').modal('show');
    $('#ReclamationFormModal').appendTo('body');
  }


  /**
   * GENERATION DU FORMULAIRE SELON LE MOTIF
   */
  GenerateForm(){
    this.DesactiveAllInput();
    this.UE_elementFind = false;
    this.Noteconstest_Select = false;
    this.omission_Select = false;

    if(this.ReclamationForm.controls.motif.value ==='Note omise'){
      this.omission_Select = true;
      this.Noteconstest_Select = false;
      this.ActiveOmition_UE_Input();
      this.getETudiantUE();

    } else {
      this.Noteconstest_Select = true;
      this.omission_Select = false;
      this.ActiveNoteContestInput();
      this.getEvaluationReclamation();
    }

  }

  ActiveOmition_UE_Input(){
    this.ReclamationForm.controls.ue.setValidators([Validators.required]);
    this.ReclamationForm.controls.ue.updateValueAndValidity();
  }

  ActiveOmitionElement_UE_Input(){
    this.ReclamationForm.controls.element_ue.setValidators([Validators.required]);
    this.ReclamationForm.controls.element_ue.updateValueAndValidity();
  }

  ActiveNoteContestInput(){
    this.ReclamationForm.controls.evaluations.setValidators([Validators.required]);
    this.ReclamationForm.controls.evaluations.updateValueAndValidity();
  }

  DesactiveAllInput(){
    this.ReclamationForm.controls.ue.reset();
        this.ReclamationForm.controls.ue.clearValidators();
        this.ReclamationForm.controls.ue.updateValueAndValidity();

        this.ReclamationForm.controls.element_ue.reset();
        this.ReclamationForm.controls.element_ue.clearValidators();
        this.ReclamationForm.controls.element_ue.updateValueAndValidity();

        this.ReclamationForm.controls.evaluations.reset();
        this.ReclamationForm.controls.evaluations.clearValidators();
        this.ReclamationForm.controls.evaluations.updateValueAndValidity();

  }

  ShowStatut(row){
    this.StatutModal();
    this.showForm = false;
    this.Show_statut = true;
    this.statutDatas = row;
  }

  public StatutModal() {
    $('#exampleModal').modal('show');
    $('#exampleModal').appendTo('body');
    }

    // Onchange ---     ---------------------??
    CheckElementExistance(){
      for(let ue of this.My_UEs){
        if(this.ReclamationForm.controls.ue.value === ue.id) {
          if(Object.keys(ue.elementConstitutifs).length > 0){
            this.UE_elementFind = true;
            this.optEL_UE_spinner = true;
            this.ActiveOmitionElement_UE_Input();
            for(let elementConstitut of ue.elementConstitutifs){
              this.Select_Ue_elements.push(elementConstitut);
            }
            this.optEL_UE_spinner = false;
          }
        }
      }

      // let idUe = this.Omi_UE_Form.controls.ue.value;
      // for(let elements of this.List_Ue_Etudiant){
      //   if(idUe === elements.id){
      //     if(Object.keys(elements.elementConstitutifs).length > 0){
      //       this.UE_elementFind = true;

      //       // ACTIVE INPUT
      //       this.Omi_UE_Form.controls.elementConstUE.setValidators([Validators.required]);
      //       this.Omi_UE_Form.controls.elementConstUE.updateValueAndValidity();
      //       // show select element constitutif
      //       for(let elementConstitut of elements.elementConstitutifs){
      //         this.Select_Ue_elements.push(elementConstitut);
      //       }

      //     } else {
      //       this.UE_elementFind = false;
      //       this.Omi_UE_Form.controls.elementConstUE.reset();
      //       this.Omi_UE_Form.controls.elementConstUE.clearValidators();
      //       this.Omi_UE_Form.controls.elementConstUE.updateValueAndValidity();
      //     }
      //   }
      // }
    }

    EvaluationGetData() {
      const idEvalu = this.ReclamationForm.controls.evaluations.value;
      for(let evaluation of this.My_Evaluation){
        if(idEvalu +'' === ''+evaluation.id) {
            this.SelectEvaluNum = evaluation.numEvaluation;
         }
      }
    }

    /***
     *
     */
    submitMyReclamationForm(){
      this.BodyData.motif = this.ReclamationForm.controls.motif.value;
      this.BodyData.etudiant.id = this.ID_Etudiant;
      // CAS DE L'OMISSION ---> ELEMENT CONSTITUTIF
      if(this.omission_Select && this.UE_elementFind){
          this.BodyData.elementConstitutif.id = this.ReclamationForm.controls.element_ue.value;
          this.BodyData.ue = null;
          this.BodyData.evaluation = null;
      }
      // CAS DE L'OMISSION ---> UE
      if (this.omission_Select && !this.UE_elementFind) {
        this.BodyData.ue.id = this.ReclamationForm.controls.ue.value;
        this.BodyData.evaluation = null;
        this.BodyData.elementConstitutif = null;
      }
      // CAS DE NOTE CONTESTEE  ---> ELEMENT
      if(this.Noteconstest_Select){
        this.BodyData.evaluation.id = +this.ReclamationForm.controls.evaluations.value; //this.ReclamationForm.controls.evaluations.value;
        for(let evaluation of this.My_Evaluation){
          if(this.BodyData.evaluation.id +'' === ''+evaluation.id) {
            this.BodyData.elementConstitutif = evaluation.elementConstitutif;
            this.BodyData.ue.id = evaluation.ue.id;
           }
        }
      }

      this.Send_Reclamation();

    }

        /**
     * METHODE POUR ENVOYER LA RECLAMATION --- ****??
     */
    Send_Reclamation(){
      this.reclamationService.addReclamation(this.BodyData).subscribe(reclamationResponse =>{
        Swal.fire({
         icon: 'success',
         title: 'Enregistré',
         text: ''+reclamationResponse,
         showCancelButton: false,
         showConfirmButton: true,
         confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            $('#ReclamationFormModal').modal('hide');
          }
        })
    }, error => {
        Util_fonction.AlertMessage("warning",error.error.message);
    });
    }


    /***
   * Initialisation du formulaire
   */
  initForm() {
    this.ReclamationForm = this.formBuilder.group({
      ue: new FormControl(''),
      element_ue: new FormControl(''),
      evaluations: new FormControl(''),
      motif: new FormControl('', [Validators.required])

    });

    this.UEEelementConstitutifForm = this.formBuilder.group({
      element: new FormControl('', [Validators.required])

    });
    this.Omi_UE_Form = this.formBuilder.group({
      ue: new FormControl('', [Validators.required]),
      elementConstUE: new FormControl(''),

    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}
