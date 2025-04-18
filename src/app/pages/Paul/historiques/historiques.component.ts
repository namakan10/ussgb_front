import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Util_fonction} from "../../models/util_fonction";
import {MatTableDataSource} from "@angular/material/table";
import {HistoriquesService} from "../../../services/historiques.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {PAG_LARGE_SIZE, PAG_SMALL_SIZE} from "../../../CONSTANTES";
declare var $: any;


@Component({
  selector: 'app-historiques',
  templateUrl: './historiques.component.html',
  styleUrls: ['./historiques.component.css']
})
export class HistoriquesComponent implements OnInit {
  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'dateAction',
    'idRef',
    'modifBy',
    // 'Type',
    'actions'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  FilterForm: FormGroup;

  listBody = {
    id_structure: null,
    date: null,
    startDate: null,
    endDate: null,
    operation: null,
    table: null
  }

  user = JSON.parse(sessionStorage.getItem('user'));

  choix: boolean = true;
  _spinner: boolean = false;

  pageSize = PAG_LARGE_SIZE;
  pageSizeOptions = [PAG_LARGE_SIZE];
  length = 100;



  constructor(private formBuilder: FormBuilder,
              private historiqueService: HistoriquesService) { }

  ngOnInit() {
    this.initFilterForm();
  }
  EmptyCheck(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }
  GetHistoriqueList(){
    // let simple: boolean = false;
    this._spinner = true;
    this.listBody.id_structure = +this.user.structure.id;
    this.listBody.date = this.FilterForm.controls.date.value;
    this.listBody.startDate = this.FilterForm.controls.startDate.value;
    this.listBody.endDate = this.FilterForm.controls.endDate.value;
    this.listBody.operation = this.FilterForm.controls.operation.value;
    this.listBody.table = this.FilterForm.controls.table.value;

    this.historiqueService.getHistoriques(this.listBody, this.choix).subscribe( res =>{
      this.dataSource = new MatTableDataSource(res.content)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_LARGE_SIZE, this.dataSource.data);
      this._spinner = false;
    });
  }
  data: any;
  showDetail: boolean = false;
  detail(element){
    this.showDetail = true;
    this.data = null;
    // for (let el of element.)
    this.data = element;
    $('#detailFormModal').modal('show');
    $('#detailFormModal').appendTo('body');
  }

  initFilterForm(){
    this.FilterForm = this.formBuilder.group({
      startDate: new FormControl (null, [Validators.required]),
      endDate: new FormControl (null, [Validators.required]),
      date: new FormControl (null),
      operation: new FormControl (null),
      table: new FormControl (null)
    })
  }

}
