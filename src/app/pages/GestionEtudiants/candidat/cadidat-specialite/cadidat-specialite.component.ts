import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CandidatService} from "../../../../services/GestionEtudiants/candidat.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import Swal from 'sweetalert2';
import { FiliereService } from '../../../../services/GestionFilieres/filiere.service';
import {Util_fonction} from "../../../models/util_fonction";
declare var $: any;

@Component({
  selector: 'ngx-cadidat-specialite',
  templateUrl: './cadidat-specialite.component.html',
  styleUrls: ['./cadidat-specialite.component.scss']
})
export class CadidatSpecialiteComponent implements OnInit {

  SpecialiteForm: FormGroup;
  showForm: boolean = false;
  creatForm: boolean = false;
  // specialiteID;
  CandidatSpecialites;
  searchKey: string;
  SelectEditID: any;
  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'code',
    'nom',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  sendArray: any;
  user: any;
  AllStructureFilieres: any;
  select_SpecialiteFilieres: any;
  affect: boolean = false;
  AffectArray: any=[];
  ListArray: any=[{}];

  constructor(private formBuilder: FormBuilder,
              private specialiteServ: CandidatService,
              private filiereService: FiliereService
) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.initForm();
    this.getAllSepcialites();
    this.getAllStructureFIliere();
  }


  getAllSepcialites() {
    this.specialiteServ.getSepcialites().subscribe(specialRes =>{
      this.dataSource = specialRes;
      // this.handleSuccessfulResponse(specialRes);
    });
  }

  // Filière de la structure
  getAllStructureFIliere(){
    this.filiereService.getStructureFilieres(2).subscribe(AllStructureFilieres =>{
      this.AllStructureFilieres = AllStructureFilieres;
      console.log(this.AllStructureFilieres);
      // this.handleSuccessfulResponse(specialRes);
    });
  }

  // Filière de la structure
  getFIliereOf_Select_Spcialite(element){
    this.affect = true;
    let body = {
      "id_specialiteCandidat" : +element.id,
      "id_structure" : this.user.structure.id
    }

    this.specialiteServ.getFiliereByCandidatSepcialites(body).subscribe(select_SpecialiteFilieres =>{
      this.select_SpecialiteFilieres = select_SpecialiteFilieres;
      console.log(select_SpecialiteFilieres);

      for (let spec_FIll of this.select_SpecialiteFilieres){
          this.AffectArray.push(spec_FIll.nom);
      }


      this.ListArray=[{}];
      this.sendArray = [{}];
      for (let allFIll of this.AllStructureFilieres){
        if (this.AffectArray.includes(allFIll.nom) ){
          this.ListArray.push({id: allFIll.id, nom: allFIll.nom, codeFiliere: allFIll.codeFiliere, statut: 'ok'});
          this.sendArray.push({id: allFIll.id});
        } else {
          this.ListArray.push({id: allFIll.id, nom: allFIll.nom, codeFiliere: allFIll.codeFiliere, statut: 'no'});
        }
      }

      this.ListArray.splice(0, 1);
      this.sendArray.splice(0, 1);

      console.log(this.ListArray);


      $('#filiereAffectFormModal').modal('show');
      $('#filiereAffectFormModal').appendTo('body');
    });
  }

  handelRoleChecking(id, event){
    if (event.target.checked){
      // add
      this.sendArray.push({id: id});
    } else {
      // delete
      for (let i = 0; i < this.sendArray.length; i++ ) {
        if (this.sendArray[i]['id'] === id ) {
          this.sendArray.splice(i, 1);
          i--;
        }
      }
    }
  }

  newSpecialite(){
    this.initForm();
    this.creatForm = true;

    $('#SpecialFormModal').modal('show');
    $('#SpecialFormModal').appendTo('body');
  }

  // affectFiliere(){}

  affectFiliere(){
    const bod =[{id:5}];
    this.filiereService.updateFiliere_Specialite(3,bod).subscribe(update => {
      Util_fonction.SuccessMessage(update);
    }, error => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    });
    }


  showFormSat(state){
    if (state === 'true'){
      this.showForm = true;
    } else {
      this.showForm = false;
    }
  }


  creatSpecialite(SpecialiteForm){
    this.specialiteServ.InserSepcialites(SpecialiteForm.value).subscribe(res=>{
      // this.util.showToast('success', 'Créer', res.toString());
      this.getAllSepcialites();
      $('#SpecialFormModal').modal('hide');
      this.showForm = false;
      Util_fonction.SuccessMessage(res);
    }, error => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    });
  }

  fullEditForm(element){
    console.log(element);
    this.initForm();
    this.showForm = true;
    this.creatForm = false;
    this.SelectEditID = element.id;
    this.SpecialiteForm.controls.nom.setValue(element.nom);
    this.SpecialiteForm.controls.code.setValue(element.code);

    $('#SpecialFormModal').modal('show');
    $('#SpecialFormModal').appendTo('body');
  }

  updateSpecialite(SpecialiteForm){
    this.specialiteServ.UpdateSepcialiteCandidat(this.SelectEditID, SpecialiteForm.value).subscribe(Updateres=>{
      // this.util.showToast('success', 'Mise à jour', res.toString());
      this.getAllSepcialites();
      $('#SpecialFormModal').modal('hide');
      this.showForm = false;
      this.initForm();
      Util_fonction.SuccessMessage(Updateres);
    }, error => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    });
  }

  Delete_Specialite(element){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer '"+element.nom+"'",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.specialiteServ.deleteSpecialite(element.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
          this.getAllSepcialites();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })
  }


  initForm(){
      this.SpecialiteForm = this.formBuilder.group({
        nom: ['', Validators.required],
        code: ['', Validators.required],
      });
  }



  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

}
