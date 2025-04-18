import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { PAG_MIDLE_SIZE } from '../../../CONSTANTES';
import { FilesService } from '../../../services/files.service';
import { Util_fonction } from '../../models/util_fonction';
import * as XLSX from "xlsx";
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-charger-notes-ec',
  templateUrl: './charger-notes-ec.component.html',
  styleUrls: ['./charger-notes-ec.component.css']
})
export class ChargerNotesEcComponent implements OnInit {
  nbrEc = 0;
  fileOk: boolean = false;
  fichier: File;
  _spinner: boolean = false;
  user = JSON.parse(sessionStorage.getItem("user"));
  exempleFIle = environment.EC_EXEMPLE_FILE;

  listNoteCalcule: any = [];
  pageSize = PAG_MIDLE_SIZE;
  pageSizeOptions = [PAG_MIDLE_SIZE];
  length = 100;
  dataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = [
    "numEtudiant",
    "prenom",
    "nom",
    // "date_de_naissance",
    "niveau",
    "noteDevoir",
    "noteTP",
    "noteExamen",
    "noteFinal",
    "status",
  ];

  constructor(private fileService: FilesService) {}

  ngOnInit() {}

  FileSelect(event) {
    this.fileOk = false;
    this.fichier = event.target.files[0];
    let fichier = event.target.files[0];
    const ext = fichier.name.substr(fichier.name.lastIndexOf(".") + 1);
    const extension = ["xlsx", "xls", "XLS", "XLSX"];
    if (extension.includes(ext)) {
      this.fileOk = true;
    } else {
      this.fileOk = false;
      Util_fonction.AlertMessage(
        "warning",
        "Le fichier ne respecte pas le format excel! <br> <strong>xlsx ou xls</strong>"
      );
    }
  }

  Charger() {
    this._spinner = true;
    this.fileService.SendNotesFile(this.fichier, "ec", this.nbrEc ).subscribe(
      (res) => {
        Util_fonction.SuccessMessage(res);
        this._spinner = false;
        
        // this.listNoteCalcule = res;
        // this.dataSource = new MatTableDataSource(this.listNoteCalcule);

        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        // this.pageSizeOptions = Util_fonction.paginatSequence(
        //   PAG_MIDLE_SIZE,
        //   this.dataSource.data
        // );
        // this.length = this.dataSource.data.length;

        
        // setTimeout(() => {
        //   this.exportexcel();
        // }, 1500);
      },
      (error) => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      }
    );
  }

  exportexcel() {
    const element = document.getElementById("excel-table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {
      dateNF: "mm/dd/yyyy;@",
      cellDates: true,
      raw: true,
    });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "note-charge.xlsx");
  }

  replceStr(element){
    return element.replace("_", " ");
  }

}
