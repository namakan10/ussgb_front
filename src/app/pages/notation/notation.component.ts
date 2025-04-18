import { Component, OnInit, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';

import html2canvas from "html2canvas";
import jspdf from "jspdf";
import { ActivatedRoute, Router } from '@angular/router';
import { Util_fonction } from '../models/util_fonction';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { PersonnelAdminService } from '../../services/GestionPersonnelAdmin/personnel-admin.service';
import {Location} from '@angular/common';
import {NotesService} from "../../services/GestionEtudiants/notes.service";
declare var $: any;

@Component({
  selector: 'app-notation',
  templateUrl: './notation.component.html',
  styleUrls: ['./notation.component.css']
})
export class NotationComponent implements OnInit {
  displayedColumns: string[] = ['check','numEtudiant', 'prenom', 'nom','dateDeNaissance', 'telephone', 'niveau', 'note', 'action'];
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;
// {static: false}
  dataSource;
  message = null;
  allGroupe = [];
  error: any;
  action = '';
  idEvaluation;
  event = {
    index : 0
  };
  trouver = false;
  eventSelect;
  spinner = false;
  change_list: boolean = false;

  type;
  ue;
  dateEvaluation;
  sallesReservation;
  heureDebut;
  heureFin;
  session;
  idGroupe;
  salleChoisi = [];
  salleDispo = [];
  surveillaChoisi = [];
  surveillaDispo = [];
  listNote = [];
  note = 0;
  noteNew = '';
  autorisation = false;

  constructor(private route: ActivatedRoute,
    private _location: Location,
    private personnelAdminService: PersonnelAdminService,
    private noteService: NotesService
  ) { }

  ngOnInit() {
    this.idEvaluation = this.route.snapshot.paramMap.get("id")
    this.notes()
  }
  notes() {

  this.action = 'Gestion des notes';
  this.error = null;
  this.message = null;
  this.getGroupe(this.event);

}
eventSelcted:any;
presence = false;
getGroupe(event) {
  this.spinner = true;
  this.event.index = event.index;
  this.allGroupe = [];
  this.dataSource = [];
  if (event.index === 2) {
    this.personnelAdminService.listeGroupeEvaluation(this.idEvaluation).subscribe(res => {
      this.allGroupe = res;
      Util_fonction.AlertEmptyMessage(res);
        this.eventSelect = event.index;
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status, error.error.message);
        this.spinner = false;
      });
    } else if (event.index === 1) {
    this.eventSelcted = event;
      this.GetListeNonNoteEvaluation(event);
    }  else if (event.index === 0) {
      this.personnelAdminService.listeNoteEvaluation(this.idEvaluation).subscribe(res => {
        Util_fonction.AlertEmptyMessage(res);
        const data1 = [];
        this.eventSelect = event.index;
        res.forEach((element,) => {
          const minidata = {
            numEtudiant : element.etudiant.numEtudiant,
            prenom: element.etudiant.prenom,
            nom: element.etudiant.nom,
            telephone: element.etudiant.hasOwnProperty("user") ? element.etudiant.user.telephone : "",
            niveau: element.etudiant.niveau,
            dateDeNaissance: element.etudiant.hasOwnProperty("user") ? Util_fonction.DateConvert2(element.etudiant.user.dateDeNaissance) : "",
            id: element.id,
            note: element.note,
          };
          data1.push(minidata);
          if (Object.keys(res).length > 0) {
            this.trouver = true;
            this.dataSource = new MatTableDataSource(data1);
            // setTimeout(() => this.dataSource.paginator = this.paginator);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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

  GetListeNonNoteEvaluation(event){
    this.dataSource =[];
    this.personnelAdminService.listeNonNoteEvaluation(this.idEvaluation, this.presence).subscribe(res => {
        Util_fonction.AlertEmptyMessage(res);
        const data1 = [];
        this.eventSelect = event.index;
        res.forEach((element, index) => {
          const minidata = {
            numEtudiant : element.numEtudiant,
            prenom: element.user.prenom,
            nom: element.user.nom,
            telephone: element.user.telephone,
            dateDeNaissance: Util_fonction.DateConvert2(element.user.dateDeNaissance),
            niveau: element.niveau,
            id: element.id,
          };
          data1.push(minidata);
          if (res.length === (index + 1)) {
            this.trouver = true;
            this.dataSource = new MatTableDataSource(data1);
            // setTimeout(() => this.dataSource.paginator = this.paginator);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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
  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
      pdf.save('notes.pdf'); // Generated PDF
      this.spinner = false;
      // this.showAttestPay = false;
    });
  }
   ngAfterViewInit(): void {
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
 }
 goBack() {
  this._location.back();
}

  groupPresence = false;
getEtudiantGroupe() {
  this.dataSource = [];
  this.spinner = true;
  this.trouver = false;
  const data = {
    idEvaluation : this.idEvaluation,
    idGroupe : this.idGroupe
  };
  this.personnelAdminService.getEtudiantGroupe(data, this.groupPresence).subscribe(res => {
    const data1 = [];
    res.forEach((element, index) => {
      const minidata = {
        numEtudiant : element.numEtudiant,
        prenom: element.user.prenom,
        nom: element.user.nom,
        telephone: element.user.telephone,
        niveau: element.niveau,
        dateDeNaissance: Util_fonction.DateConvert2(element.user.dateDeNaissance),
        id: element.id,
      };
      data1.push(minidata);
      if (res.length === (index + 1)) {
        this.trouver = true;
        this.dataSource = new MatTableDataSource(data1);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
//  if (event !== '') {
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
 // }
}


  isCheckedOrNot(event){
    if (event.target.name === 'allSelector'){
      this.CheckALl(event.target.checked);
    }else {
      this.CheckSing(event);
    }
  }

  SendNoteToDelete: any[] = [];
  selectedState: boolean = false;
  CheckALl(status){
    // let element = document.getElementsByClassName('ck');
    let element = $('.ck');
    if (status){
      this.SendNoteToDelete = [];
      for (let i = 0; i < element.length; i++) {
        this.SendNoteToDelete.push({
          id: element[i].value,
        });
        element[i].checked = status;
      }
    } else {
      for (let j = 0; j < element.length; j++) {
        element[j].checked = status;
        this.SendNoteToDelete = this.SendNoteToDelete.filter(d => d.id !== element[j].value);
      }
    }

    this.selectedState = Object.keys(this.SendNoteToDelete).length >= 1;

    console.log("All : ",this.SendNoteToDelete);
  }

  CheckSing(event){
    console.log("event.target.value : ", event.target.value);
    if (event.target.checked){
      // this.data.etudiant_id = event.target.value;
      this.SendNoteToDelete.push({
        id: +event.target.value
      });
    }else {
      this.SendNoteToDelete = this.SendNoteToDelete.filter(data => +data.id !== +event.target.value);
    }

    console.log("SendNoteToDelete : ", this.SendNoteToDelete);

    this.selectedState = Object.keys(this.SendNoteToDelete).length >= 1;
  }

  ConfirmeDelete(){
    console.log("this.SendNoteToDelete ::: ",this.SendNoteToDelete);
    Swal.fire({
      title: '',
      text: "Etes-vous sûr de vouloir supprimer la/les ligne(s) cochée(s) ? ",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.noteService.DeleteNote_s(this.SendNoteToDelete).subscribe(delRes1=>{
          Util_fonction.SuccessMessage(delRes1);
          this.SendNoteToDelete = [];
          this.notes();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })
  }
  ConfirmeSingleDelete(element){
    console.log("this.SendNoteToDelete ::: ",this.SendNoteToDelete);
    Swal.fire({
      title: '',
      text: "Etes-vous sûr de vouloir supprimer la note de  "+element.numEtudiant,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.noteService.DeleteSingleNote(element.id).subscribe(delRes1=>{
          Util_fonction.SuccessMessage(delRes1);
          this.notes();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })
  }

  DeleAllNoteOfEvaluation(){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer toutes les notes de cette evaluation ? ",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.noteService.Delete_eval_note_s(this.idEvaluation).subscribe(deleteRes =>{
          console.log("deleteRes ; ", deleteRes)
          this.notes();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })
  }

}
