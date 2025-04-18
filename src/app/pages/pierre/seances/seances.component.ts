import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
declare var $: any;
import Swal from 'sweetalert2';
import { DepartementService } from '../../../services/departement.service';
import { OptionsService } from '../../../services/GestionFilieres/Options/options.service';
import { PersonnelAdminService } from '../../../services/GestionPersonnelAdmin/personnel-admin.service';
import {Util_fonction} from "../../models/util_fonction";
@Component({
  selector: 'app-seances',
  templateUrl: './seances.component.html',
  styleUrls: ['./seances.component.css']
})
export class SeancesComponent implements OnInit {
  error: any;
  spinner = false;
  message = null;
  dateEvaluation;
  date;
  action = '';
  allSalle = [];
  seance = [];
  grp = [];
  ueTrouv = false;
  type;
  salle = false;
  heureDebut;
  groupe;
  typeSeance;
  nbreSemaine;
  id_enseignant;
  id_departement;
  id_option;
  ue;
  heureFin;
  enseignant;
  dataSource;
  displayedColumns: string[] = ['codeUE', 'typeSeance', 'nbreSemaine', 'date', 'heure', 'enseignant', 'salle', 'groupe', 'Action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  user: any;
  AllUe = [];
  allSurveillantNonChoix = [];
  salleDispo;
  AllEnseignant = [];
  allDepartement = [];
  allOption = [];
  AllSeance = [];
  AllGroupe = [];
  seanceTrouver = [];

  constructor(private departementService: DepartementService, private personnelAdminService: PersonnelAdminService,
    public datepipe: DatePipe, private optionsService: OptionsService) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    const dateEnCours = JSON.parse(sessionStorage.getItem('dateEnCours'));
    const data = {
      idStructure: this.user.structure.id,
      anneeScolaire: dateEnCours['anneeScolaire']
    };
    this.personnelAdminService.getEnseignantParStructure(this.user.structure.id).subscribe((res) => {
      this.AllEnseignant = res;
    },
    (error) => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
      this.spinner = false;
    });

    this.departementService.getStructureDepartements(this.user.structure.id).subscribe((res) => {
      this.allDepartement = res;
    },
    (error) => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
      this.spinner = false;
    });

    this.optionsService.getStructureOptions(this.user.structure.id).subscribe((res) => {
      this.allOption = res;
    },
    (error) => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
      this.spinner = false;
    });

    this.personnelAdminService.getGroupeByStructure(data).subscribe((res) => {
      this.AllGroupe = res;
    },
    (error) => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
      this.spinner = false;
    });
  }

  getUE(event) {
    this.spinner = true;
    this.ueTrouv = false;
    this.AllUe = [];
    // tslint:disable-next-line:radix
    this.personnelAdminService.getUEEnseignat(parseInt(event.value)).subscribe((res) => {
      this.AllUe = res;
      this.spinner = false;
      this.ueTrouv = true;
    },
    (error) => {
      Util_fonction.AlertMessage(error.error.status,error.error.message);
      this.spinner = false;
    });
  }

  getSalles(type?, evaluation?) {
    this.allSalle = [];
    if (this.dateEvaluation &&
      this.heureDebut &&
      this.heureFin) {
        this.spinner = true;
        this.salle = false;
        const data = {
          idStructure: this.user.structure.id,
          dateEvaluation: this.datepipe.transform(this.dateEvaluation, 'yyyy-MM-dd'),
          heureDebut: this.heureDebut,
          heureFin: this.heureFin,
        };
        this.personnelAdminService.getSalleDispo(data).subscribe(res => {
          this.allSalle = res;
          this.spinner = false;
          this.salle = true;
        },
        (error) => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  showModal() {
    this.message = null;
    this.error = null;
    // this.inti();
    this.action = 'Gestion des emplois du temps';
    $('#staticBackdrop').modal('show');
    $('#staticBackdrop').appendTo('body');
  }

  onSubmit() {
    this.message =  null;
    this.error =  null;
    if (this.typeSeance === 'TD_TP') {
      this.groupe.forEach((element, index) => {
        // tslint:disable-next-line:radix
        this.grp.push({id: parseInt(element)});
      if (this.groupe.length === (index + 1)) {
        this.seance.push(
          {
            typeSeance : this.typeSeance,
              dateDebut : this.dateEvaluation,
              heureDebut : this.heureDebut,
              nbreSemaine: this.nbreSemaine,
              heureFin : this.heureFin,
              ue : {
                // tslint:disable-next-line:radix
                id : parseInt(this.ue)
              },
              salle : {
                // tslint:disable-next-line:radix
                id : parseInt(this.salleDispo)
              },
              enseignant : {
                // tslint:disable-next-line:radix
                id : parseInt(this.enseignant)
              },
              groupes : this.grp
            }
            );
            this.addSSeance();
          }
        });
      } else {
        this.seance.push(
          {
            typeSeance : this.typeSeance,
              dateDebut : this.dateEvaluation,
              heureDebut : this.heureDebut,
              heureFin : this.heureFin,
              nbreSemaine: this.nbreSemaine,
              ue : {
                // tslint:disable-next-line:radix
                id : parseInt(this.ue)
              },
              salle : {
                // tslint:disable-next-line:radix
                id : parseInt(this.salleDispo)
              },
              enseignant : {
                // tslint:disable-next-line:radix
                id : parseInt(this.enseignant)
              },
            }
            );
            this.addSSeance();
      }
  }

  onUpdate() {
  }

  addSSeance() {
    this.spinner = true;
    this.message =  null;
    this.error =  null;
    this.personnelAdminService.addSeances(this.user.structure.id, this.seance).subscribe(
      res => {
        Util_fonction.SuccessMessage(res);
        this.spinner = false;
        this.seance = [];
      },
        (error) => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        });
  }

  getSeance() {
    let link = '';
    let id = '';
    this.AllSeance = [];
    this.spinner = true;
    this.seanceTrouver = [];
    if (this.type === 'structure') {
      link = '/structure/';
      id = this.user.structure.id;
    } else if (this.type === 'département') {
      link = '/departement/';
      id = this.id_departement;
    } else if (this.type === 'option') {
      link = '/option/';
      id = this.id_option;
    }
      this.personnelAdminService.getAllSeance(link, id).subscribe((res) => {
        this.AllSeance = res;
        this.spinner = false;
        this.AllSeance.forEach((element, index) => {
          this.seanceTrouver.push({
            id: element.id,
            codeUE: element.ue.codeUE,
            typeSeance: element.typeSeance,
            date: element.dateDebut,
            heure:  element.heureDebut.toString().replace(',', 'h') + ' à ' + element.heureFin.toString().replace(',', 'h'),
            enseignant: element.enseignant.user.prenom + ' ' + element.enseignant.user.nom + ' : ' + element.enseignant.user.telephone,
            salle: element.salle.numSalle,
            groupe: element.groupe,
            nbreSemaine: element.nbreSemaine
          });

          if (this.AllSeance.length === (index + 1)) {
            this.dataSource = new MatTableDataSource(this.seanceTrouver.reverse());
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }

        });
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      });
  }

  supprimer(id) {
    this.message =  null;
    this.error =  null;
    this.spinner = true;

    Swal.fire({
      icon: 'info',
      title: 'Voulez-vous confirmer la suppression ?',
      showCancelButton: true,
      confirmButtonText: `Supprimer`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.personnelAdminService.deleteSeance(id).subscribe((res) => {
            Util_fonction.SuccessMessage(res);
          this.spinner = false;
          this.getSeance();
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

}
