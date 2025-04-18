import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonnelAdminService } from '../../services/GestionPersonnelAdmin/personnel-admin.service';
declare var $: any;
import Swal from 'sweetalert2';
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import { Router } from '@angular/router';
import { Util_fonction } from '../models/util_fonction';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Location} from '@angular/common';
import {OptionsService} from "../../services/GestionFilieres/Options/options.service";
import {UNIV_OPTION} from "../../CONSTANTES";

@Component({
  selector: 'app-emargements',
  templateUrl: './emargements.component.html',
  styleUrls: ['./emargements.component.css']
})
export class EmargementsComponent implements OnInit {
  displayedColumns: string[] = ['numEtudiant', 'prenom', 'nom', 'genre', 'signature'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  spinner = false;
  univ_opt = UNIV_OPTION;
  user = JSON.parse(sessionStorage.getItem('user'));
  change_list: boolean = false;
  constructor( private route: ActivatedRoute,
               private optionService: OptionsService,
    private _location: Location,
    private personnelAdminService: PersonnelAdminService) { }
    List_action: string = "tous";
  ngOnInit() {
    this.GetOptions();
  }
  GetListeEmargement(){
    const idEval = this.route.snapshot.paramMap.get("id");
      this.spinner = true;
      let data = [];
      this.personnelAdminService.listePresenceEvaluation(idEval, this.List_action).subscribe(res => {
          if (res.length === 0) {
            this.dataSource = new MatTableDataSource([]);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            Util_fonction.AlertMessage('info','Pas d\'émargement pour le moment');
            this.spinner = false;
            return;
          }

          let Emargement = res;
          Emargement.filter(e => e.option.id === this.id_option);
          this.dataSource = new MatTableDataSource(Emargement);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinner = false;

        },
        (error) => {
          Util_fonction.AlertMessage(error.error.status,error.error.message);
          this.spinner = false;
        });
        // this.List_action='tous'
    }


  Options: any;
  GetOptions(){
    this.optionService.getStructure_Options(this.user.structure.id).subscribe(
      res =>{
        this.Options = res;
        this.Options.map(o => {o.nom = o.codeOption+" "+o.nom});
      }
    )
  }

  id_option :any;
  keyword = 'nom';
  OptionSelectEvent(event){
    if (Util_fonction.checkIfNoTEmpty(event)){
      this.id_option = event.id;
    }
  }

  CheckEmpty(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }


    applyFilter2(event: Event) {
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
        pdf.save('emargements.pdf'); // Generated PDF
        this.spinner = false;
      });
    }
    goBack() {
      this._location.back();
    }

}
