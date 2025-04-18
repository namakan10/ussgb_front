import {Component, OnInit, ViewChild} from '@angular/core';
import {UNIV_FILIERE} from "../../../CONSTANTES";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {DemandeEtudiantService} from "../../../services/demande-etudiant.service";
import {StructureService} from "../../../services/structure.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import Swal from "sweetalert2";
import {Util_fonction} from "../../models/util_fonction";
import * as XLSX from "xlsx";

@Component({
  selector: 'app-demande-etudiant-traitement',
  templateUrl: './demande-etudiant-traitement.component.html',
  styleUrls: ['./demande-etudiant-traitement.component.css']
})
export class DemandeEtudiantTraitementComponent implements OnInit {

  displayedColumns: string[] = ['multiple','numEtudiant', 'nom', 'type', 'optionOrg','optionDest', 'statut', 'annee', 'action'];
  dataSource = new MatTableDataSource<any>();
  ListeName="";
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filiereListBody = {
    id_structure: null,
    id_departement: null,
    id_specialiteCandidat: null,
    cursus: null
  }
  user = JSON.parse(sessionStorage.getItem('user'));
  Options : any;
  action : any;
  opt_transf : boolean = false;
  univ_fil = UNIV_FILIERE;

  DemandeForm : FormGroup;

  sendData = {
    date: null,
    etudiant_id: null,
    option_id: null,
    statut: null,
    type: null
  }

  _spinner : boolean = false;
  _spinner1 : boolean = false;

  code_option;
  num_etudiant;
  niveau;
  annee_scolaire;

  anneeStructure: any;

  sendArray = [];
  stautResp = null;

  constructor(private optionService: OptionsService, private formBuilder: FormBuilder, private structureService: StructureService,
              private  demandeService: DemandeEtudiantService) {
    this.sendArray = [];

    this.structureService.getStuctureAnnees(this.user.structure.id).subscribe(
      (res) => {
        this.anneeStructure = res;
        this._spinner1 = false;
      },
      (error) => {
        // this.error = error;
        // this.spinner = false;
      });

  }



  ngOnInit() {
    // this.initForm();
    // this.GetMesDemandes();
    this.get_StructureOptions();
  }

  get_StructureOptions() {
    // this.filiereListBody.id_structure = this.structureID;
    // this.filiereListBody.cursus = this.etudiant.cursus;

    this.optionService.getStructureOptions(this.user.structure.id).subscribe(optRes => {
      this.Options = optRes;
    });
  }


  type;
  statut;
  afficher() {
    this.dataSource = new MatTableDataSource([]);
    this._spinner1 = true;
    let body = {
      annee_scolaire: this.annee_scolaire, //this.etudiant.users.etudiant.anneeScolaire,
      id_structure: this.user.structure.id,
      num_etudiant: this.num_etudiant,
      niveau: this.niveau,
      code_option: this.code_option
    }
    // this.etudiant.users.etudiant.id
    this.demandeService.GetDemandes(body, 'a_traiter').subscribe(res =>{
      if (Object.keys(res.content).length > 0){
        const dat = res.content.filter(d => d.type === this.type && d.statut === this.statut);
        if (Object.keys(dat).length > 0){
          this.dataSource = new MatTableDataSource(dat);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this._spinner1 = false;
        }else {
          this._spinner1 = false;

          Util_fonction.AlertMessage("info", "Aucune demande <strong>"+this.statut+"</strong> du type <strong>"+this.type+"</strong> pour le niveau <strong>"+this.niveau+"</strong> trouvée!");
        }
      }else {
        this._spinner1 = false;
        Util_fonction.AlertMessage("info", "aucune demande trouvée!");
      }
      const opt = Util_fonction.checkIfNoTEmpty(this.code_option) ? this.code_option : "";
      const num = Util_fonction.checkIfNoTEmpty(this.num_etudiant) ? this.num_etudiant : "";
      this.ListeName = this.type+" "+this.statut+" "+opt+" "+" "+num;
    }, error =>{
      this._spinner1 = false;
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }

  checkIfIsNotNull (element){
    return Util_fonction.checkIfNoTEmpty(element);
  }
  checkIfArrayNotEmpty (element){
    return Util_fonction.checkIfArrayNoTEmpty(element);
  }
  Delete_Demande(element){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer cette demande !",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.demandeService.deleteDemande(element.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
          this.afficher();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })

  }

  Validation(resp, element){

    Swal.fire({
      title: '',
      html: "Etes-vous sûre de vouloir <strong>' "+resp+" '</strong> cette demande !",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui !'
    }).then((result) => {
      if (result.isConfirmed) {
        let sendData = {
          date: null,
          etudiant_id: element.etudiant.id,
          option_id: this.checkIfIsNotNull(element.option) ? element.option.id : null,
          statut: resp,
          type: element.type
        }

        this.demandeService.TraiterLaDemande(element.id,sendData).subscribe(res =>{
          this._spinner = false;
          Util_fonction.SuccessMessage(res);
          // $('#demandeModal').modal('hide');

          this.afficher();
        }, error => {
          this._spinner = false;
          Util_fonction.AlertMessage(error.error.status, error.error.message);
        });
      }
    })

  }




  MultipleSelect($event, element){
    // console.log(element);
    // console.log($event.target.checked);
    // console.log($event.target.name);
    if ($event.target.checked){
      const sendData = {
        id: element.id,
        date: null,
        etudiant_id: element.etudiant.id,
        option_id: this.checkIfIsNotNull(element.option) ? element.option.id : null,
        statut: null,
        type: element.type
      }

      this.sendArray.push(sendData);
    }

    if (!$event.target.checked){
      this.sendArray = this.sendArray.filter((elem) => elem.id !== element.id);
    }
  }

  multipleValidation(resp) {
    const rp = resp === 'REFUSEE' ? 'REFUSER' : 'ACCEPTER'
    Swal.fire({
      title: '',
      html: "Etes-vous sûre de vouloir <strong>' "+rp+" '</strong> les demandes cochés !",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sendArray = this.sendArray.map(elemt =>{
          return {
            date: null,
            etudiant_id: elemt.etudiant_id,
            option_id: this.checkIfIsNotNull(elemt.option_id) ? elemt.option_id : null,
            statut: resp,
            type: elemt.type
          };
        });
        console.log(this.sendArray);
        this.demandeService.TraiterLesDemandesCoches(this.sendArray).subscribe(res =>{
          this._spinner = false;
          this.sendArray =[];
          Util_fonction.SuccessMessage(res);
          // $('#demandeModal').modal('hide');

          this.afficher();
        }, error => {
          this._spinner = false;
          this.sendArray =[];
          Util_fonction.AlertMessage(error.error.status, error.error.message);
          this.afficher();
        });
      }
    })
  }

  // exportPDF(){
  //   Util_fonction.MultiplePagePDF("TestM");
  // }

  PrintPDF(){
    Util_fonction.Print("");
  }

  ExcelEntete : boolean = false;
  exportexcel() {
    const element = document.getElementById('print');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'demandes.xlsx');
 }

  initForm(){
    this.DemandeForm = this.formBuilder.group({
      option: new FormControl(null),
      type: new FormControl(null, [Validators.required])
    });
  }

}
