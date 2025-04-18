import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CandidatService} from "../../../../services/GestionEtudiants/candidat.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import Swal from 'sweetalert2';
import {Util_fonction} from "../../../models/util_fonction";
import {PAG_SMALL_SIZE} from "../../../../CONSTANTES";
declare var $: any;

@Component({
  selector: 'app-candidat-academie',
  templateUrl: './candidat-academie.component.html',
  styleUrls: ['./candidat-academie.component.css']
})
export class CandidatAcademieComponent implements OnInit {

  AcademieForm: FormGroup;
  showForm: boolean = false;
  creatForm: boolean = false;
  // specialiteID;
  CandidatSpecialites;
  searchKey: string;
  SelectEditID: any;
  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'nom',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;

  constructor(private formBuilder: FormBuilder,
    private specialiteServ: CandidatService,
) { }

ngOnInit(): void {
  this.initForm();
  this.getAllAcademie();
}

getAllAcademie() {
  this.specialiteServ.getAcademies().subscribe(specialRes =>{
    this.dataSource = new MatTableDataSource(specialRes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
    // this.handleSuccessfulResponse(specialRes);
  });
}

newAcademie(){
  this.initForm();
  this.creatForm = true;

  $('#AcademieFormModal').modal('show');
  $('#AcademieFormModal').appendTo('body');
}

showFormSat(state){
  if (state === 'true'){
    this.showForm = true;
  } else {
    this.showForm = false;
  }
}


creatAcademie(AcademieForm){
  this.specialiteServ.InsertAcademie(AcademieForm.value).subscribe(res=>{
    // this.util.showToast('success', 'Créer', res.toString());
    this.getAllAcademie();
    $('#AcademieFormModal').modal('hide');
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
  this.AcademieForm.controls.nom.setValue(element.nom);

  $('#AcademieFormModal').modal('show');
  $('#AcademieFormModal').appendTo('body');
}

update_Academie(AcademieForm){
  this.specialiteServ.UpdateAcademie(this.SelectEditID, AcademieForm.value.nom).subscribe(Updateres=>{
    // this.util.showToast('success', 'Mise à jour', res.toString());
    this.getAllAcademie();
    $('#AcademieFormModal').modal('hide');
    this.showForm = false;
    this.initForm();
    Util_fonction.SuccessMessage(Updateres);
  }, error => {
    Util_fonction.AlertMessage(error.error.status,error.error.message);
  });
}

Delete_Academie(element){
  Swal.fire({
    title: '',
    text: "Etes-vous sûre de vouloir supprimer '"+element.nom+"'",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Annuler!',
    confirmButtonText: 'Oui, Supprimé!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.specialiteServ.deleteAcademie(element.id).subscribe(delRes=>{
        Util_fonction.SuccessMessage(delRes);
        this.getAllAcademie();
      }, error => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
      });
    }
  })

}

initForm(){
    this.AcademieForm = this.formBuilder.group({
      nom: ['', Validators.required],
    });
}


// handleSuccessfulResponse(response) {
//   this.dataSource = this.util.handleSuccessfullyResponse(
//     this.dataSource,
//     response,
//     this.displayedColumns,
//     this.sort,
//     this.paginator
//   );
// }

onSearchClear() {
  this.searchKey = '';
  this.applyFilter();
}

applyFilter() {
  this.dataSource.filter = this.searchKey.trim().toLowerCase();
}


}
