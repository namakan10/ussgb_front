import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {StructureService} from "../../../services/structure.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UesServiceService} from "../../../services/ues.service";
import Swal from 'sweetalert2';
import { DepartementService } from '../../../services/departement.service';
import {Util_fonction} from "../../../pages/models/util_fonction";
import {PAG_SMALL_SIZE, UNIV_FILIERE, UNIV_FILIERE_S, UNIV_OPTION, UNIV_OPTION_S} from "../../../CONSTANTES";
import {OptionsService} from "../../../services/GestionFilieres/Options/options.service";
import {PersonnelAdminService} from "../../../services/GestionPersonnelAdmin/personnel-admin.service";
declare var $: any;

@Component({
  selector: 'app-ue-list',
  templateUrl: './ue-list.component.html',
  styleUrls: ['./ue-list.component.css']
})
export class UeListComponent implements OnInit {
  univ_opt=UNIV_OPTION_S;
  Ue: Object = {
    id: '',
    nomUE: '',
    codeUE: '',
    semester: '',
    volumeHoraire: '',
    credit: '',
    chapitre: '',
    options:'',
    elementConstitutifs:'',
    departement:{
      id : this.route.snapshot.paramMap.get("id"),
      nom: this.route.snapshot.paramMap.get("nom"),
      contact: this.route.snapshot.paramMap.get("contact"),
      email: this.route.snapshot.paramMap.get("email"),
      type: this.route.snapshot.paramMap.get("type"),
    },
  };
  id = null;
  searchKey: string;

  dataSource;
  ecSource:any;
  displayedColumns: string[] = [
    // 'Cursus',
    'NomUE',
    'CodeUE',
    'Semestre',
    'VolumeHoraire',
    'Crédit',
    'Chapitre',
    'Département',
    'Actions'
  ];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;

structure: any;
error: any;
action:any;
derData:any;
message = null;
isloading=true;
spinner=false;
nomEC;nomUE;
  cursus;
codeEC ; codeUE
volumeHoraire;semestre
poid;credit
chapitre;
idUe;ider
chosen
type;idEC
dataUE:any;
dataEC:any;
nomUe = '';

user = JSON.parse(sessionStorage.getItem('user'));
  uni_fil = UNIV_FILIERE_S;
  Option: any ;
  filiereListBody = {
    id_structure: null,
    id_departement: null,
    id_candidat: null,
    cursus: null,
  };
  sem: any;
  keyword = "nom"

  PersonnelBody={
    id_structure: null,
    role: null
  }
  constructor(private structureService: StructureService,
              private route: ActivatedRoute,
              private router: Router,
              private personnelService: PersonnelAdminService,
              private uesService: UesServiceService,
              private optionService: OptionsService,
              private derService: DepartementService,
              private refChange: ChangeDetectorRef,
             ) { }
  ngOnInit(): void {
    this.getUesByStructure(this.user.structure.id);
    this.getOptionByStructure(this.user.structure.id);
    this.getEnseignants();
    this.loadDer();
  }
  loadDer(){
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.derService.getDerByStructure(this.user.structure.id).subscribe((data) => {
      this.derData = data;
      this.refChange.detectChanges();
      })
  }

  Enseignants:any;
  getEnseignants(){
    this.PersonnelBody.id_structure = this.user.structure.id;
    this.PersonnelBody.role = "ROLE_ENSEIGNANT";
    this.personnelService.getStructurePersonnel(this.PersonnelBody).subscribe(
      (res) => {
        this.Enseignants = res.content;
      });
  }
  getUesByStructure(id){
    this._spinner = true;
      this.uesService.getUesByStructure(id).subscribe(
        res => {
           this.dataSource = new MatTableDataSource(res.content);
           this.dataSource.paginator = this.paginator;
           this.dataSource.sort = this.sort;
          this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
          this._spinner = false;
           this.refChange.detectChanges();
        }, error1 => {
        });
    }

  All(){
    this.getUesByStructure(this.user.structure.id);
  }

  optionSelect: any;
  getOptionByStructure(id){
    this.filiereListBody.id_structure = id;
      this.optionService.getStructureOptions(id).subscribe(
        res => {
           this.Option = res;
           this.Option.map(f => {f.nom = f.codeOption+' '+ f.nom});
           this.refChange.detectChanges();
        }, error1 => {
        });
    }


  optionSelectName = "";
  OptionSelectEvent(event){
    this.optionSelect = event.id;
    this.optionSelectName = " ("+event.codeOption+") "+event.nom;
  }

  _spinner: boolean = false;
  Afficher(){
    this._spinner = true;
    const data = {
      id_structure: this.user.structure.id,
      id_option: this.optionSelect,
      semestre: this.sem
    }
    this.uesService.getUes(data).subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
        this._spinner = false;
        this.refChange.detectChanges();
      },
        error =>{
          this._spinner = false;
        }
    )
  }


    onSearchClear() {
      this.searchKey = '';
      this.applyFilter();
    }

    applyFilter() {
      this.dataSource.filter = this.searchKey.trim().toLowerCase();
    }
    initUE(){
    this.nomUE=''
    this.codeUE=''
    this.semestre=''
    this.ider=''
    this.credit=''
    this.chapitre=''
    this.volumeHoraire=''
    }
    initEC(){
      this.nomEC=''
      this.codeEC=''
      this.poid=''
      this.chapitre=''
      this.volumeHoraire=''
      }

    showModal() {

    this.initUE();
      this.action = 'Ajouter une nouvelle UE';
      this.type="Ajouter"
      $('#staticBackdrop').modal('show');
      $('#staticBackdrop').appendTo('body');
    }
    showModal2() {

      this.initEC();
      this.type="Ajouter"
        this.action = 'Ajouter un nouvel élément constitutif';
        $('#addEC').modal('show');
        $('#addEC').appendTo('body');
      }
      showModal3() {
        //  this.inti();
          this.action = 'Liste des éléments constitutifs';
          $('#listEC').modal('show');
          $('#listEC').appendTo('body');
        }
        showModalUE(UE) {
          this.dataUE=UE
          this.dataEC=UE.elementConstitutifs
            this.action = 'Détail de l\'UE';
            $('#modalUE').modal('show');
            $('#modalUE').appendTo('body');
          }

    addEC(id: number,chosen:String) {
      this.idUe=id;
      this.chosen=chosen
      this.showModal2()
    }
    onSubmitEC() {
      this.spinner = true;
      const data = {
        nomEC: this.nomEC,
        codeEC: this.codeEC,
        volumeHoraire:this.volumeHoraire,
        poid:this.poid,
        chapitre:this.chapitre,
        ue:{
          id : this.idUe,  //this.route.snapshot.paramMap.get("id"),
        },
      };
      this.uesService.createEc(data).subscribe(
        (data) => {
      //    $('#addEC').modal('hide');
          this.spinner = false;
          Util_fonction.SuccessMessage(data);
            this.ngOnInit()
        },
        (error) => {
          this.spinner = false;
           // get the status as error.status
          Util_fonction.AlertMessage(error.error.status,error.error.message ? error.error.message:error.error);
        })
    }
    onSubmitUE() {
      this.spinner = true;
      const data = {
        nomUE: this.nomUE,
        codeUE: this.codeUE,
        semestre:this.semestre,
        volumeHoraire:this.volumeHoraire,
        credit:this.credit,
        chapitre:this.chapitre,
        departement:{
          id : this.ider,  //this.route.snapshot.paramMap.get("id"),
        },
      };
      this.uesService.createUes(data).subscribe(
        (value) => {
          $('#staticBackdrop').modal('hide');
          this.spinner = false;
          Util_fonction.SuccessMessage(value);
            this.ngOnInit()
        },
        (error:any) => {
          this.spinner = false;
//          error error {"timestamp":1634171899404,"status":409,"error":"Conflict","message":"Une UE est déjà enregistrée avec le même code","path":"/ussgb/ues"}

           // get the status as error.status

          if(error.status===409){
             Util_fonction.AlertMessage("Conflict ue",'Une ue est déjà enregistrée avec le même code');
          }else {
             Util_fonction.AlertMessage("Erreur ue",error.error.message ? error.error.message:error.error);
          }
        })
    }

    onUpdateUE() {
      this.spinner = true;
      const data = {
          id:this.idUe,
        nomUE: this.nomUE,
        codeUE: this.codeUE,
        semestre:this.semestre,
        cursus:this.cursus,
        volumeHoraire:this.volumeHoraire,
        credit:this.credit,
        chapitre:this.chapitre,
        departement:{
          id : this.ider,  //this.route.snapshot.paramMap.get("id"),
        },
      };

      this.uesService.updateUE(data).subscribe(
        (value) => {
          console.log("UPDATE UE",value)

          $('#staticBackdrop').modal('hide');
          this.spinner = false;
          Util_fonction.SuccessMessage(value);
          this.getUesByStructure(this.user.structure.id);
        },
        (error) => {
          this.spinner = false;
          console.log("UPDATE UE error",error)

          // get the status as error.status
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        })
    }
    detailsUE(uE) {
      this.type="Modifier"
      this.action = 'Modifier l\'UE '+uE.nomUE;
      this.nomUE = uE.nomUE;
      this.codeUE = uE.codeUE;
      this.cursus= Util_fonction.checkIfNoTEmpty(uE.cursus) ? uE.cursus.toString() : uE.cursus;
      this.semestre=uE.semestre.toString();
      this.chapitre=uE.chapitre;
      this.credit=uE.credit;
      this.volumeHoraire=uE.volumeHoraire;
      //waiting for departement
      this.ider=uE.departement.id.toString()
      this.idUe=uE.id
      $('#staticBackdrop').modal('show');
      $('#staticBackdrop').appendTo('body');
    }
    onUpdateEC() {
      this.spinner = true;
      const data = {
          id:this.idUe,
        nomEC: this.nomEC,
        codeEC: this.codeEC,
        volumeHoraire:this.volumeHoraire,
        poid:this.poid,
        chapitre:this.chapitre,
        ue:{
          id : this.idUe,  //this.route.snapshot.paramMap.get("id"),
        },
      };

      this.uesService.updateEC(data,this.idEC).subscribe(
        (value) => {
          this.showEc(this.idUe, this.nomUe);
          $('#addEC').modal('hide');
          this.spinner = false;
          console.log("UPDATE EC",value)

          Util_fonction.SuccessMessage(value);
            this.ngOnInit()
        },
        (error) => {
          this.spinner = false;
          console.log("UPDATE EC error",error)

          // get the status as error.status
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        })
    }

  editUE(uE) {
    this.detailsUE(uE)
  }
  //updates UE
  detailsEC(eC) {
    this.type="Modifier"
    this.action = 'Modifier l\' élément Constitutif '+eC.nomEC;
    this.nomEC = eC.nomEC;
    this.codeEC = eC.codeEC;
    this.chapitre=eC.chapitre;
    this.poid=eC.poid;
    this.volumeHoraire=eC.volumeHoraire;
    this.idEC=eC.id
    $('#addEC').modal('show');
    $('#addEC').appendTo('body');
  }

editEC(eC) {
  this.detailsEC(eC)
}


  deleteUE(id: number) {
    this.spinner = true;
  Swal.fire({
    icon: 'info',
    title: 'Voulez-vous confirmer la suppression ?',
    showCancelButton: true,
    confirmButtonText: `Supprimer`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
       this.uesService.deleteUes(id).subscribe(
        (data) => {
          $('#staticBackdrop').modal('hide');
          this.spinner = false;
          Util_fonction.SuccessMessage(data);
            this.ngOnInit()
        },
        (error) => {
          this.spinner = false;
           // get the status as error.status
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        })
    } else {
      return false;
    }
  });

  }
  //delete element constitutif
  deleteEC(idEC) {
    this.spinner = true;
  Swal.fire({
    icon: 'info',
    title: 'Voulez-vous confirmer la suppression ?',
    showCancelButton: true,
    confirmButtonText: `Supprimer`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
       this.uesService.deleteEC(idEC).subscribe(
        (data) => {
        //  $('#listEC').modal('hide');
          this.spinner = false;
          Util_fonction.SuccessMessage(data);
            this.ngOnInit()
        },
        (error) => {
          this.spinner = false;
           // get the status as error.status
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        })
    } else {
      return false;
    }
  });
  }

 //afficher les elements constitutif d'une ue
  listEcSpinner = false
  showEc(idUe, nomUe) {
    // console.log(element);
    this.ecSource = [];
    this.listEcSpinner = true;
    this.uesService.GetUesElementsConstitufis(idUe).subscribe(
      res => {
        this.ecSource = res;
        this.listEcSpinner = false;
      }
    )
      // element.elementConstitutifs
    this.idUe = idUe
    this.nomUe = nomUe
    this.showModal3();
   // this.router.navigate(['/pages', 'structure',this.route.snapshot.paramMap.get("id") , 'filiere', 'Ue', id]);
  }
  addPersonnel(id: number) {
    this.router.navigate(['/pages', 'Ue', id, 'personnelAdministratifs']);
  }


  checkIfNotEmpty(elment){
      return Util_fonction.checkIfNoTEmpty(elment);
  }

  attacheOptions: any;
  showOptions(element){
    this.attacheOptions = [];
    this.UeID = element.id;
    this.UeData = element;
    console.log("this.UeData", this.UeData);
    this.ToSelectOption = this.Option.filter(o => o.id !== element.id);
    this.ToSelectOption = this.ToSelectOption.map(os => {return {id: os.id, name: os.nom}});
    this.uesService.getOptionsByUe(element.id).subscribe(
      res => {
        this.attacheOptions = res;

        $('#OptionListeAttacheToUe').modal({
          backdrop: 'static',
          keyboard: false
        });
        $('#OptionListeAttacheToUe').appendTo('body');
      }, error =>{
        Util_fonction.AlertMessage2(error.error.status, error)
      }
    )

  }

  SendOptions;
  ToSelectOption;
  selectedOpt;
  OptionsSelected(event:any[], action){
    if (this.checkIfNotEmpty(event) && action !=="valider"){
      this.SendOptions = event.map(e => {return {id: e.id}});
    }else {
      this.uesService.AffectUeToOption(this.SendOptions,this.UeID).subscribe(
        addOptionresponse => {
          console.log("addresponse", addOptionresponse);
          this.selectedOpt = [];
          this.RechargeUeOptionList();
          // this.UeEnseignants = enseignantsToSend;
          Util_fonction.SuccessMessage("Enseignant(s) retiré(s) avec succès !");

        }, error => {
          Util_fonction.AlertMessage2(error.error.status, error)
        });
    }
    console.log("event", event);
  }

  //--------------------------affect Enseignant
  UeEnseignants:any;
  EnseignantsToSelect= [];
  UeData;
  UeID: any;
  showEnseignantListes(element){
    this.UeEnseignants = [];
    this.EnseignantsToSelect = [];
    this.UeID = element.id;
    this.UeData = element;
    this.uesService.getEnseignantByUes(element.id).subscribe(
      res => {
        console.log("res",res)
        this.UeEnseignants = res;
        this.GetEnseignantsOrVacataires("ROLE_ENSEIGNANT");

        console.log("this.ueEns", this.EnseignantsToSelect);

        $('#UeEnseignantsListe').modal({
          backdrop: 'static',
          keyboard: false
        });
        $('#UeEnseignantsListe').appendTo('body');
      }, error =>{
        Util_fonction.AlertMessage2(error.error.status, error)
      }
    )

  }

  RechargeEnseignantList(){
    this.uesService.getEnseignantByUes(this.UeID).subscribe(
      res => {
        this.UeEnseignants = res;
        console.log("this.ueEns", this.EnseignantsToSelect);
      }
    )
  }
  RechargeUeOptionList(){
    this.uesService.getOptionsByUe(this.UeID).subscribe(
      res => {
        this.attacheOptions = res;
        console.log("attacheOptions", this.attacheOptions);
      }
    )
  }

  deleteEnseignantToUe(element){
    Swal.fire({
      title: "",
      text: "Êtes-vous sûr de vouloir supprimer "+element.nom+" ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Oui, Supprimer!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.typeChoix = element.statut === "VACATAIRE" || "Vacataire" ? "ROLE_VACATAIRE" : "ROLE_ENSEIGNANT";
        let enseignantsToSend = this.UeEnseignants.filter(e => e.id !== element.id);
        let send = [{
          id: element.id
        }];

        this.uesService.RetirerUeToTeachers(send,this.UeID).subscribe(
          ueAffectres => {
            this.UeEnseignants = enseignantsToSend;
            Util_fonction.SuccessMessage("Enseignant(s) retiré(s) avec succès !");

          }, error => {
            Util_fonction.AlertMessage2(error.error.status, error)
          });
      }
    })

  }

  deleteOptionToUe(element){
    Swal.fire({
      title: "",
      text: "Êtes-vous sûr de vouloir supprimer "+element.nom+" ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Oui, Supprimer!"
    }).then((result) => {
      if (result.isConfirmed) {
        let send = [{
          id: element.id
        }];
        this.uesService.RetirerUeToOption(send,this.UeID).subscribe(
          removeUeOption => {
            this.RechargeUeOptionList();
            Util_fonction.SuccessMessage("Option(s) retiré(s) avec succès !");

          }, error => {
            Util_fonction.AlertMessage2(error.error.status, error)
          });
      }
    })



  }
  //==========================================
  //AFFECTATION DES ENSEIGNANTS A UNE UE
  //==========================================
  typeChoix = "ROLE_ENSEIGNANT";
  _spinner2:boolean = false;
  ToSelect:any;
  GetEnseignantsOrVacataires(role){
    this._spinner2 = true;
    this.typeChoix = role;
    this.PersonnelBody.role = role;
    this.PersonnelBody.id_structure = this.user.structure.id;
    this.personnelService.getStructurePersonnel(this.PersonnelBody)
      .subscribe((data : any) =>{
        this.ToSelect = data.content.map(t => {return {id: t.id, name: t.prenom + ' ' + t.nom}});
        this._spinner2 = false;
      });
      console.log("this.ToSelect", this.ToSelect);
      this.refChange.detectChanges();
  }

  SendEnseignants;
  selectedEns;
  EnseignantsSelected(event:any[], action){
    if (this.checkIfNotEmpty(event) && action !=="valider"){
      this.SendEnseignants = event.map(e => {return {id: e.id}});
    }else {
      this.uesService.AffectUeToTeacher(this.SendEnseignants,this.UeID).subscribe(
        addresponse => {
          console.log("addresponse", addresponse);
          this.selectedEns = [];
          this.RechargeEnseignantList();
          // this.UeEnseignants = enseignantsToSend;
          Util_fonction.SuccessMessage("Enseignant(s) affecté(s) avec succès !");

        }, error => {
          Util_fonction.AlertMessage2(error.error.status, error)
        });
    }
    console.log("event", event);
  }

//=======================================
  EcEnseignants;
  EcData;
  ToSelectEc;
  showTeachers(ec){
    this.EcData = ec;
    this.uesService.getEnseignantByEC(ec.id).subscribe(ecEnseignants =>{
      this.EcEnseignants = ecEnseignants;

      $('#listECEnseignants').modal('show');
      $('#listECEnseignants').appendTo('body');
    })
  }

  SendEcEnseignants;
  selectedEcEns;
  EnseignantsSelected_Ec(event:any[], action){
    if (this.checkIfNotEmpty(event) && action !=="valider"){
      this.SendEcEnseignants = event.map(e => {return {id: e.id}});
    }else {
      this.uesService.AffectEcToTeacher(this.EcData.id,this.SendEcEnseignants).subscribe(
        addEcresponse => {
          console.log("addresponse", addEcresponse);
          this.selectedEcEns = [];
          this.RechargeEcEnseignantList();
          // this.UeEnseignants = enseignantsToSend;
          Util_fonction.SuccessMessage("Enseignant(s) affecté(s) avec succès !");

        }, error => {
          Util_fonction.AlertMessage2(error.error.status, error)
        });
    }
    console.log("event", event);
  }

  RechargeEcEnseignantList(){
    this.uesService.getEnseignantByEC(this.EcData.id).subscribe(
      res => {
        this.EcEnseignants = res;
        console.log("this.EcEnseignants", this.EcEnseignants);
      }
    )
  }

  deleteEnseignantToEc(element){
    Swal.fire({
      title: "",
      text: "Êtes-vous sûr de vouloir supprimer "+element.nom+" ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Oui, Supprimer!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.typeChoix = element.statut === "VACATAIRE" || "Vacataire" ? "ROLE_VACATAIRE" : "ROLE_ENSEIGNANT";
        let enseignantsToSend = this.EcEnseignants.filter(e => e.id !== element.id);
        let send = [{
          id: element.id
        }];

        this.uesService.RetirerEcToTeachers(send,this.EcData.id).subscribe(
          EcAffectres => {
            this.EcEnseignants = enseignantsToSend;
            Util_fonction.SuccessMessage("Enseignant(s) retiré(s) avec succès !");

          }, error => {
            Util_fonction.AlertMessage2(error.error.status, error)
          });
      }
    })

  }

 handleSuccessfullyResponse(dataSource: MatTableDataSource<any>, response, displayedColumns: string[], sort: MatSort,
    paginator: MatPaginator, customFilter = null) {
dataSource = new MatTableDataSource(response);
dataSource.sort = sort;
dataSource.paginator = paginator;
if (customFilter != null) {
dataSource.filterPredicate =
(data, filtersJson: string) => {
const matchFilter = [];
const filters = JSON.parse(filtersJson);

filters.forEach(filter => {
const val = data[filter.id] === null ? '' : data[filter.id];
matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
});
return matchFilter.every(Boolean);
};
} else {
dataSource.filterPredicate = (data, filter) => {
const accumulator = (currentTerm, key) => {
return this.nestedFilterCheck(currentTerm, data, key);
};
const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
// Transform the filter by converting it to lowercase and removing whitespace.
const transformedFilter = filter.trim().toLowerCase();
return dataStr.indexOf(transformedFilter) !== -1;
};
}
return dataSource;
}

nestedFilterCheck(search, data, key) {
if (typeof data[key] === 'object') {
for (const k in data[key]) {
if (data[key][k] !== null) {
search = this.nestedFilterCheck(search, data[key], k);
}
}
} else {
search += data[key];
}
return search;
}

ngAfterViewInit(): void {
}
      }
