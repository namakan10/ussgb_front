import {Component, OnInit, ViewChild} from '@angular/core';
import {PAG_SMALL_SIZE, UNIV_FILIERE} from "../../../CONSTANTES";
import {DemandeEtudiantService} from "../../../services/demande-etudiant.service";
import {Util_fonction} from "../../models/util_fonction";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {environment} from "../../../../environments/environment";
declare var $: any;


@Component({
  selector: 'app-demande-transfert-externe',
  templateUrl: './demande-transfert-externe.component.html',
  styleUrls: ['./demande-transfert-externe.component.css']
})
export class DemandeTransfertExterneComponent implements OnInit {
  uni_fil = UNIV_FILIERE;
  _http = environment._HTTP;
  startDate= null;
  endDate= null;
  num_phone= null;
  Options= null;
  option = null;

  _spinner1;
  user = JSON.parse(sessionStorage.getItem('user'));

  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'departStructure',
    'initiateBy',
    'numEtudiant',
    'nom',
    'prenom',
    'telephone',
    'niveau',
    'lastOption',
    'newOption',
    'transferDate',
    'statut',
    'actions',
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;
  TransfertData;

  newStatus;
  newNiveau;
  constructor(
    private demandeService: DemandeEtudiantService,
    private optionService: OptionsService,

  ) { }

  ngOnInit() {
    this.getOptions();
    this.afficher();
  }


parseImage(img: string): string {
  if(!img) return;
  return img.includes("public.") ? "https://" + img : "http://" + img ;
}
  afficher(){
    const data = {
      idStructure: this.user.structure.id,
      idOption: Util_fonction.checkIfNoTEmpty(this.option) ? this.option.id : null,
      startDate: this.startDate,
      endDate: this.endDate,
      studentTel: this.num_phone
    }
    this.demandeService.GetExternalTransferts(data).subscribe(transferts =>{
      this.dataSource = new MatTableDataSource(transferts.content)
      this.dataSource.paginator = this.paginator;
      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
      console.log("transferts", transferts);
    });
  }
  OptionsTemp;
  getOptions(){
    this.optionService.getStructure_Options(this.user.structure.id).subscribe(
      res =>{
        this.OptionsTemp = res;
        this.Options = this.OptionsTemp.map(o => {
          return {id: o.id, name: o.codeOption+" "+o.nom}
        });
      }
    )
  }

  checkIfIsNotNull(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }

  //TRANSFERT DETAIL
  TransfertDetail(element){
    this.TransfertData = element;

    $('#TransfertModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#TransfertModal').appendTo('body');
  }

  //CHANGE
  activeInputs: boolean = false;
  loading : boolean = false;
  changeInfo(event){
    this.newNiveau = null;
    this.newStatus = null;
    this.activeInputs = event.target.checked;
  }

  //TRANSFERT VALIDATION
  Validation(value, TransfertData){
    this.loading = true;
    const data = {
      idTransfert: TransfertData.id,
      niveau: this.checkIfIsNotNull(this.newNiveau) ? this.newNiveau : TransfertData.etudiant.newNiveau,
      statutDemande: value,
      statutEtudiant: this.checkIfIsNotNull(this.newStatus) ? this.newStatus : TransfertData.etudiant.statut
    }

    console.log("data -->", data);
    this.demandeService.TransferValidation(data).subscribe(validationResponse => {
      console.log("validationResponse -->", validationResponse);
      this.newNiveau = null;
      this.newStatus = null;
      this.activeInputs = false;
      $('#TransfertModal').modal('hide');
      // Util_fonction.SuccessMessage(validationResponse);
      Util_fonction.AlertMessage("success", "Transfert "+value);
    },error => {
      this.loading  = false;
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }

}
