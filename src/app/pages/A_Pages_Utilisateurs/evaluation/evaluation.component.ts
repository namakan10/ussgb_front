import { EvenementsComponent } from './../../structure/evenements/evenements.component';
import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { PersonnelAdminService } from '../../../services/GestionPersonnelAdmin/personnel-admin.service';
declare var $: any;
import Swal from 'sweetalert2';
import {Util_fonction} from "../../models/util_fonction";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import { Router } from '@angular/router';
import { UesServiceService } from '../../../services/ues.service';
import {environment} from "../../../../environments/environment";
import {StructureService} from "../../../services/structure.service";


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],

})
export class EvaluationComponent implements OnInit {
  env = environment.env;
  displayedColumns: string[] = ['anneeScolaire', 'ue','ec', 'type', 'session', 'date', 'heure', 'Action'];
  displayedColumns2: string[] = ['numEtudiant', 'prenom', 'nom', 'genre', 'telephone', 'nationalite'];
  displayedColumns3: string[] = ['numEtudiant', 'prenom', 'nom', 'telephone', 'niveau', 'note', 'action'];
  dataSource;
  dataSource2;
  dataSource3;
  action = '';
  idEvaluation;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator2: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort2: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort3: MatSort;
  user: any;
  idEval: any;
  Eval: any;
  annee:any;
  anneeSc:any;
  anneeEnCours: any;
  allEvaluation = [];
  AllUe = [];
  trouver = false;
  spinner = false;
  autorisation = false;
  surveillantSelected: boolean = false;
  change_list: boolean = false;
  noteNew = '';
  salle = false;
  allSalle = [];
  allSurveillant = [];
  allSurveillantChoisi = [];
  List_SurveillantChoisi = [];
  allSurveillantNonChoix = [];
  allSalleChoisi = [];
  allSalleNonChoix = [];
  allGroupe = [];
  error: any;
  message = null;
  event = {
    index : 0
  };
  type;
  ue;
  ec;
  dateEvaluation;
  sallesReservation;
  heureDebut;
  heureFin;
  session;
  idGroupe;
  eventSelect;
  salleChoisi = [];
  salleDispo = [];
  surveillaChoisi = [];
  surveillaDispo = [];
  listNote = [];
  note = 0;
  allEc:any
  ckeckIsUE:boolean

  @ViewChild('basicModal', { static: true }) public contentModal;
  @ViewChild('basicModalSurveillant', { static: true }) public contentModalSurveillant;
  List_action: string = "tous";

  constructor(private personnelAdminService: PersonnelAdminService,
              private router: Router,
              public datepipe: DatePipe,
              private uesService: UesServiceService,
              private structureService: StructureService
              ) {
  }
  inti() {
    this.allEvaluation = [];
    this.salle = false;
    this.spinner = false;
    this.allSalle = [];
    this.allSalleChoisi = [];
    this.allSalleNonChoix = [];
    this.type = null;
    this.ue = null;
    this.dateEvaluation = null;
    this.sallesReservation = null;
    this.heureDebut = null;
    this.heureFin = null;
    this.session = null;
    this.ec=null
    this.salleChoisi = [];
    this.salleDispo = [];
  }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.anneeEnCours = JSON.parse(sessionStorage.getItem('dateEnCours'));
    this.GetStuctureAnnees();
    this.getEcByTeacher(this.user.users.personnel.id)

    this.ckeckIsUE=false

    this.allSurveillantChoisi = [];
    this.List_SurveillantChoisi = [];
    this.allSurveillantNonChoix = [];

    this.personnelAdminService.getSurveillant(this.user.structure.id).subscribe((res) => {
      this.allSurveillant = [];
      res.forEach((element, index) => {
        // tslint:disable-next-line:no-shadowed-variable
        const data = {
          id: element.id,
          nom: element.nom,
          prenom: element.prenom,
          telephone: element.telephone,
          genre: element.genre
        };
        this.allSurveillant.push(data);
      });

    });

    this.personnelAdminService.getUEEnseignat(this.user.users.personnel.id).subscribe((res) => {
        this.AllUe = res;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      });
  }

  StructureAnnees;
  GetStuctureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id)
      .subscribe(res => {
        this.StructureAnnees = res;
      })
  }

  GetEnseignantEvaluation() {
    this.spinner = true;
    if (this.anneeSc === '') {
      this.dataSource = [];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.spinner = false;
      return;
    }
    this.personnelAdminService.get_EvaluationEnseignat(this.user.users.personnel.id, this.anneeSc).subscribe((res) => {
      res.forEach((element, index) => {
          this.spinner = false;
          const data = {
            id: element.id,
            ue: element.ue === null ? '--' : element.ue.codeUE,
            ec: element.elementConstitutif === null ? '--' : element.elementConstitutif.codeEC,
            anneeScolaire: element.anneeScolaire,
            type: element.type,
            session: element.session,
            date: element.dateEvaluation,
            sallesReservation: element.reservationSalles,
            // tslint:disable-next-line:no-non-null-assertion
            heure: element.heureDebut!.toString().replace(',', 'h') + ' à ' + element.heureFin!.toString().replace(',', 'h'),
          };
          this.allEvaluation.push(data);
          if (res.length === (index + 1)) {
            this.dataSource = new MatTableDataSource(this.allEvaluation.reverse());
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        },
        (error) => {
          this.spinner = false;
          Util_fonction.AlertMessage(error.error.status, error.error.message);
        });

        this.spinner = false;
    });

  }

  /**
   *
   * @param type
   */

  getEcByTeacher(id) {
    this.uesService.getEcsByEnseignant(id).subscribe((data) => {
      this.allEc = data;
      //print()
    })
  }

   verifierEvaluationPassee(evaluation) {
    // Obtenir la date/heure actuelle
    const maintenant = new Date();
      // Extraire l'heure de début de l'évaluation
  const heureFin = evaluation.heure.split(' à ')[1];
    // Créer un objet Date pour la fin de l'évaluation
    const dateHeureFin = new Date(`${evaluation.dateEvaluation}T${heureFin}`);
    // Comparer avec la date/heure actuelle
    return maintenant > dateHeureFin;
  }
  

  change(type) {
    if (type === 'add') {
      this.salleDispo.forEach(element => {
        this.allSalleChoisi.push(element);
        this.allSalleNonChoix.splice(this.allSalleNonChoix.indexOf(element), 1);
      });
      this.salleDispo = [];
    } else if (type === 'remove') {
      this.salleChoisi.forEach(element => {
        this.allSalleNonChoix.push(element);
        this.allSalleChoisi.splice(this.allSalleChoisi.indexOf(element), 1);
      });
      this.salleChoisi = [];
    } else if (type === 'addAll') {
      this.allSalleNonChoix = [];
      this.allSalleChoisi = [];
      this.allSalle.forEach(element => {
        this.allSalleChoisi.push(element.id.toString());
      });
    }else if (type === 'removeAll') {
      this.allSalleNonChoix = [];
      this.allSalleChoisi = [];
      this.allSalle.forEach(element => {
        this.allSalleNonChoix.push(element.id.toString());
      });
    }
  }

  change2(type) {
    if (type === 'add') {
      this.surveillaDispo.forEach(element => {
        // this.allSurveillantChoisi.push({id:element});
        this.allSurveillantNonChoix.splice(this.allSurveillantNonChoix.indexOf(element), 1);
        this.AddtoChoosed(element,"selecting");
      });
      // this.surveillaDispo = [];
    } else if (type === 'remove') {
      this.surveillaChoisi.forEach(element => {
        // this.allSurveillantNonChoix.push(element);
        this.List_SurveillantChoisi.splice(this.allSurveillantChoisi.indexOf(element), 1);
        this.AddtoNonChoosed(element, "selecting");
      });
      // this.surveillaChoisi = [];
    } else if (type === 'addAll') {
      this.allSurveillantNonChoix = [];
      this.List_SurveillantChoisi = [];
      this.allSurveillant.forEach(element => {
        // this.allSurveillantChoisi.push(element.id.toString());
        this.AddtoChoosed(element, "all");
      });
    }else if (type === 'removeAll') {
      this.List_SurveillantChoisi = [];
      this.allSurveillantNonChoix = [];
      this.allSurveillant.forEach(element => {
        this.AddtoNonChoosed(element, "all");
      });
    }
  }

  AddtoChoosed(element, action){
    if (action !== "all"){
      for (let allSurv of this.allSurveillant){
        if (allSurv.id === +element){
          this.List_SurveillantChoisi.push(allSurv);
        }
      }
    } else {
      for (let allSurv of this.allSurveillant){
        if (allSurv.id === +element.id) {
          this.List_SurveillantChoisi.push(allSurv);
        }
      }
    }
  }

  AddtoNonChoosed(element, action){
    if (action !== "all"){
      for (let allSurv of this.allSurveillant){
        if (allSurv.id === +element){
          this.allSurveillantNonChoix.push(allSurv);
        }
      }
    } else {
      for (let allSurv of this.allSurveillant){
        if (allSurv.id === +element.id) {
          this.allSurveillantNonChoix.push(allSurv);
        }
      }
    }

  }

  getSalles(type?, evaluation?) {
    console.log("Evaluation -->", evaluation);
    this.allSalle = [];
    this.allSalleNonChoix = [];
    this.allSalleChoisi = [];
    if (this.dateEvaluation &&
      this.heureDebut &&
      this.heureFin) {
      // this.spinner = true;
      // this.salle = false;
      const data = {
        idStructure: this.user.structure.id,
        dateEvaluation: this.datepipe.transform(this.dateEvaluation, 'yyyy-MM-dd'),
        heureDebut: this.heureDebut,
        heureFin: this.heureFin,
      };
      this.personnelAdminService.getSalleDispo(data).subscribe(res => {
          this.allSalle = res;
          this.allSalle.forEach(element => {
            this.allSalleNonChoix.push(element.id.toString());
          });
          if (type === 'details') {
            evaluation.sallesReservation.forEach(element => {
              this.allSalle.push(element.salle);
              this.allSalleChoisi.push(element.salle.id.toString());
            });
          }

          console.log("---this.allSalleChoisi -->", this.allSalleChoisi);
          this.spinner = false;
          this.salle = true;
        },
        (error) => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        });
    }
  }



  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();

    if (this.dataSource3.paginator) {
      this.dataSource3.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSubmit() {
    this.spinner = true;
    this.message = null;
    this.error = null;
    const tab = [];
    this.allSalleChoisi.forEach(element => {
      tab.push({id: +element});
    });
    const data =  this.ec !=null ? {
        dateEvaluation: this.dateEvaluation,
        anneeScolaire: this.annee,
        type: this.type,
        heureDebut: this.heureDebut,
        heureFin: this.heureFin,
        session: this.session,
        elementConstitutif: {
          id: +this.ec
        },
        sallesReservation: tab
      }:
      {
        dateEvaluation: this.dateEvaluation,
        anneeScolaire: this.annee,
        type: this.type,
        heureDebut: this.heureDebut,
        heureFin: this.heureFin,
        session: this.session,
        ue: {
          id: +this.ue
        },
        sallesReservation: tab
      };
    this.personnelAdminService.createEvaluation(data).subscribe(res => {
        this.inti();
        this.spinner = false;
        this.ngOnInit();
        Util_fonction.SuccessMessage(res);
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      });
  }
  showModal() {
    this.message = null;
    this.error = null;
    this.inti();
    this.action = 'Création d\'évaluation';
    $('#staticBackdrop').modal('show');
    $('#staticBackdrop').appendTo('body');
  }

  showModalEC() {
    this.message = null;
    this.error = null;
    this.inti();
    this.action = 'Création d\'évaluation';
    $('#staticBackdropec').modal('show');
    $('#staticBackdropec').appendTo('body');
  }

  details(evaluation, action) {
    console.log(evaluation);
    let u_e = 0;
    let e_c = 0;
    this.salle = true;
    this.action = 'Détails de l\'évaluation';
    this.session = evaluation.session.toString();
    this.type = evaluation.type;
    if(evaluation.ue != "--"){
      u_e = this.AllUe.find(e => e.codeUE === evaluation.ue).id;
      this.ue = u_e;
    }

    if(evaluation.ec !="--"){
      e_c = this.allEc.find(e => e.codeEC === evaluation.ec).id;
      this.ec = e_c;
    }


    this.dateEvaluation =  Util_fonction.DateConvert2(evaluation.date);//new Date(this.datepipe.transform(evaluation.date, 'yyyy/MM/dd'));
    this.heureDebut = Util_fonction.HeureConvert(evaluation.heure.split(' ')[0].replace('h', ':'));
    this.heureFin = Util_fonction.HeureConvert(evaluation.heure.split(' ')[2].replace('h', ':'));
    this.getSalles('details', evaluation);
    // this.contentModal.show();
    if (action === 'detail'){
      $('#staticBackdrop').modal('show');
      $('#staticBackdrop').appendTo('body');
    }

  }

  modifier(evaluation) {
    // console.log("evaluation====> ",evaluation)
    // console.log(evaluation.ue)
    // console.log(evaluation.ec)
    const evalua = {
      dateEvaluation: evaluation.date,
      heure: evaluation.heure,
    };
    console.log("evalua => ", evalua);
    
    const estPassee = this.verifierEvaluationPassee(evalua);
  
    if (estPassee) {
      return Util_fonction.AlertMessage(400,"L'évaluation est passée, vous ne pouvez plus modifier");
    }

    this.message = null;
    this.error = null;
    this.idEvaluation = evaluation.id;
    this.details(evaluation, 'modif');
    this.action = 'Modification de l\'évaluation';
    if(evaluation.ue != "--"){
      $('#staticBackdrop').modal('show');
      $('#staticBackdrop').appendTo('body');
    }
    if(evaluation.ec != "--"){
      $('#staticBackdropec').modal('show');
      $('#staticBackdropec').appendTo('body');
    }
    // $('#staticBackdrop').modal('show');
    // $('#staticBackdrop').appendTo('body');
  }

  onUpdate() {
    this.spinner = true;
    this.message = null;
    this.error = null;
    const tab = [];
    this.allSalleChoisi.forEach(element => {
      tab.push({id: +element});
    });
    const data = this.ec !=null ? {
        dateEvaluation: this.dateEvaluation,
        type: this.type,
        heureDebut: this.heureDebut,
        heureFin: this.heureFin,
        session: this.session,
        elementConstitutif: {
          id: +this.ec
        },
        sallesReservation: tab
      }:
      {
        dateEvaluation: this.dateEvaluation,
        type: this.type,
        heureDebut: this.heureDebut,
        heureFin: this.heureFin,
        session: this.session,
        ue: {
          id: +this.ue
        },
        sallesReservation: tab
      };
    this.personnelAdminService.updateEvaluation(data, this.idEvaluation).subscribe(updateRes => {
        this.inti();
        this.spinner = false;

        Util_fonction.SuccessMessage(updateRes);
        console.log("==============> OK");
        // this.ec !=null ?
        this.ngOnInit();
        $('#staticBackdrop').modal('hide');
        $('#staticBackdropec').modal('hide');

      }, error => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      });
  }

  desactiver() {
    if (this.action === 'Détails de l\'évaluation') {
      return true;
    }
  }

  surveillant(evaluation) {
    this.spinner = true;
    this.surveillantSelected = true;
    this.action = 'Gestion des surveillants';
    this.message = null;
    this.error = null;
    this.idEvaluation = evaluation.id;

    this.personnelAdminService.listeSurveillantEvaluation(evaluation.id).subscribe(res => {
      this.allSurveillantNonChoix = [];
      this.allSurveillantChoisi = [];
      this.List_SurveillantChoisi = [];
      res.forEach(element => {
        // this.allSurveillant.push(element);
        this.List_SurveillantChoisi.push({id:element.id, nom:element.nom, prenom:element.prenom, telephone:element.telephone, genre:element.genre});
        this.allSurveillantChoisi.push(element.id.toString());
        // this.allSurveillantNonChoix.push(data.id.toString());
      });

      for (let surv of this.allSurveillant){
        if (!this.allSurveillantChoisi.includes(surv.id.toString())){
          this.allSurveillantNonChoix.push(surv);
        }
      }

      this.spinner = false;
    }, (error) => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
      this.spinner = false;
    });
    $('#staticBackdrop2').modal('show');
    $('#staticBackdrop2').appendTo('body');
  }

  onSubmitSurveillant() {

    const data = [];
    for (let sendData of this.List_SurveillantChoisi){
      data.push({id:+sendData.id});
    }
    this.personnelAdminService.addSurveillantEvaluation(this.idEvaluation, data).subscribe(res => {
        Util_fonction.SuccessMessage(res);
        // this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        // this.spinner = false;
      });
  }

  supprimer(row) {
    const evalua = {
      dateEvaluation: row.date,
      heure: row.heure,
    };
    console.log("evalua => ", evalua);
    
    const estPassee = this.verifierEvaluationPassee(evalua);

    if (estPassee) {
      return Util_fonction.AlertMessage(400,"L'évaluation est terminée, vous ne pouvez plus supprimer");
    }
    this.spinner = true;
    this.error = null;
    this.message = null;
    Swal.fire({
      icon: 'info',
      title: 'Voulez-vous confirmer la suppression ?',
      showCancelButton: true,
      confirmButtonText: `Supprimer`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.personnelAdminService.removeEvaluation(row.id).subscribe(res => {
            Util_fonction.SuccessMessage(res);
            this.spinner = false;
          },
          (error) => {
            Util_fonction.AlertMessage(error.error.status,error.error.message);
            this.spinner = false;
          });
      } else {
        this.spinner = false;
      }
    });
  }

  presence(row) {
    this.Eval = row;
    this.spinner = true;
    this.idEval = row.id;
    this.action = "Liste d'émargement";
    this.GetListeEmargement();

  }

  GetListeEmargement(){
    this.router.navigate(['/emargements/'+this.idEval]);
    // this.spinner = true;
    // let data = [];
    // this.personnelAdminService.listePresenceEvaluation(this.idEval, this.List_action).subscribe(res => {
    //     if (res.length === 0) {
    //       this.dataSource2 = new MatTableDataSource([]);
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //       Util_fonction.AlertMessage('info','Pas d\'émargement pour le moment');
    //       this.spinner = false;
    //       return;
    //     }

    //     this.dataSource2 = new MatTableDataSource(res);
    //     this.dataSource2.paginator = this.paginator2;
    //     this.dataSource2.sort = this.sort2;
    //     this.spinner = false;

    //     if (!this.change_list){
    //       $('#staticBackdrop3').modal('show');
    //       $('#staticBackdrop3').appendTo('body');
    //     }
    //   },
    //   (error) => {
    //     Util_fonction.AlertMessage(error.error.status,error.error.message);
    //     this.spinner = false;
    //   });
    //   this.List_action='tous'
  }

  notes(row) {
    this.router.navigate(['/notation/'+row.id]);
    // this.idEvaluation = row.id;
    // this.action = 'Gestion des notes';
    // this.error = null;
    // this.message = null;
    // this.getGroupe(this.event);
    // $('#staticBackdrop4').modal('show');
    // $('#staticBackdrop4').appendTo('body');
  }

  imprimer() {
    this.spinner = true;
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/jpeg');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 15;
      pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
      pdf.save('attestation.pdf'); // Generated PDF
      this.spinner = false;
      // this.showAttestPay = false;
    });
  }

// getListe() {
//   this.personnelAdminService.listePresenceEvaluation(this.idEvaluation, this.List_action).subscribe(res => {
//     const data = [];
//     if (res.length === 0) {
//       this.message = 'Pas d\'émargement pour le moment';
//       this.spinner = false;
//     }
//
//     res.forEach((element, index) => {
//       const minidata = {
//         numEtudiant : element.numEtudiant,
//         prenom: element.user.prenom,
//         nom: element.user.nom,
//         genre: element.user.genre,
//         telephone: element.user.telephone,
//         nationalite: element.nationalite
//       };
//       data.push(minidata);
//       if (res.length === (index + 1)) {
//         this.dataSource2 = new MatTableDataSource(data);
//         this.dataSource2.paginator = this.paginator2;
//         this.dataSource2.sort = this.sort2;
//         this.spinner = false;
//       }
//     });
//      },
//      (error) => {
//        Util_fonction.AlertMessage(error.error.status,error.error.message);
//        this.spinner = false;
//      });
// }

  getGroupe(event) {
    this.spinner = true;
    this.event.index = event.index;
    this.allGroupe = [];
    this.dataSource3 = [];
    if (event.index === 2) {
      this.personnelAdminService.listeGroupeEvaluation(this.idEvaluation).subscribe(res => {
          this.allGroupe = res;
          this.eventSelect = event.index;
          this.spinner = false;
        },
        (error) => {
          Util_fonction.AlertMessage(error.error.status, error.error.message);
          this.spinner = false;
        });
    } else if (event.index === 1) {
      // this.personnelAdminService.listeNonNoteEvaluation(this.idEvaluation).subscribe(res => {
      //     const data1 = [];
      //     this.eventSelect = event.index;
      //     res.forEach((element, index) => {
      //       const minidata = {
      //         numEtudiant : element.numEtudiant,
      //         prenom: element.user.prenom,
      //         nom: element.user.nom,
      //         telephone: element.user.telephone,
      //         niveau: element.niveau,
      //         id: element.id,
      //       };
      //       data1.push(minidata);
      //       if (res.length === (index + 1)) {
      //         this.trouver = true;
      //         this.dataSource3 = new MatTableDataSource(data1);
      //         this.spinner = false;
      //       }
      //     });
      //     this.spinner = false;
      //   },
      //   (error) => {
      //     Util_fonction.AlertMessage(error.error.status,error.error.message);
      //     this.spinner = false;
      //   });
    }  else if (event.index === 0) {
      this.personnelAdminService.listeNoteEvaluation(this.idEvaluation).subscribe(res => {
          const data1 = [];
          this.eventSelect = event.index;
          res.forEach((element, index) => {
            const minidata = {
              numEtudiant : element.etudiant.numEtudiant,
              prenom: element.etudiant.user.prenom,
              nom: element.etudiant.user.nom,
              telephone: element.etudiant.user.telephone,
              niveau: element.etudiant.niveau,
              id: element.id,
              note: element.note,
            };
            data1.push(minidata);
            if (res.length === (index + 1)) {
              this.trouver = true;
              this.dataSource3 = new MatTableDataSource(data1);
              this.spinner = false;
            }
          });
          this.spinner = false;
        },
        (error) => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        });
    }
  }

  getEtudiantGroupe() {
    this.spinner = true;
    this.trouver = false;
    const data = {
      idEvaluation : this.idEvaluation,
      idGroupe : this.idGroupe
    };
    // this.personnelAdminService.getEtudiantGroupe(data).subscribe(res => {
    //     const data1 = [];
    //     res.forEach((element, index) => {
    //       const minidata = {
    //         numEtudiant : element.numEtudiant,
    //         prenom: element.user.prenom,
    //         nom: element.user.nom,
    //         telephone: element.user.telephone,
    //         niveau: element.niveau,
    //         id: element.id,
    //       };
    //       data1.push(minidata);
    //       if (res.length === (index + 1)) {
    //         this.trouver = true;
    //         this.dataSource3 = new MatTableDataSource(data1);
    //         this.spinner = false;
    //       }
    //     });
    //     this.spinner = false;
    //   },
    //   (error) => {
    //     Util_fonction.AlertMessage(error.error.status,error.error.message);
    //     this.spinner = false;
    //   });
  }

  enregistrer() {
    this.spinner = true;
    this.message = null;
    this.error = null;
    if (this.autorisation === true) {
      this.personnelAdminService.EnregistrerNoteEvaluation(this.idEvaluation, this.listNote).subscribe(res => {
          this.spinner = false;
          this.listNote = [];
          Util_fonction.SuccessMessage(res);
          if (this.event.index === 2) {
            this.getEtudiantGroupe();
          } else if (this.event.index === 1) {
            this.getGroupe(this.event);
          }
        },
        (error) => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        });
    } else {
      Util_fonction.AlertMessage(407, "Veuillez corriger les notes invalides d'abord");
    }
  }

  add(idEtudiant, event) {
    this.autorisation = false;
    this.noteNew = event.target.value + ' ' + idEtudiant;
    if (parseFloat(event.target.value) < 0 || parseFloat(event.target.value) > 20) {

      Util_fonction.AlertMessage(407, "Vous venez d'inserer une note invalide.\nMerci de le changer s'il vous plait sinon sa valeur ne sera pas prise en compte.");
    } else {
      if (this.listNote.some(x => x.idEtudiant === idEtudiant)) {
        this.listNote.some(x => {
            if (x.idEtudiant === idEtudiant) {
              x.note = parseFloat(event.target.value);
              return true;
            }
          }
        );
      } else {
        const data = {
          idEtudiant : idEtudiant,
          note : parseFloat(event.target.value)
        };
        this.listNote.push(data);
      }
      this.autorisation = true;
    }
  }

  update(event) {
    if (event !== '') {
      this.spinner = true;
      const data = {
        // tslint:disable-next-line:radix
        idNote : parseInt(event.split(' ')[1]),
        nouvelleNote : parseFloat(event.split(' ')[0])
      };
      this.personnelAdminService.updateNoteEvaluation(data).subscribe(res => {
          this.spinner = false;
          this.listNote = [];
          Util_fonction.SuccessMessage(res);
          this.getGroupe(this.event);
        },
        (error) => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        });
    }
  }

  checkIfIsEmpty(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }
}
