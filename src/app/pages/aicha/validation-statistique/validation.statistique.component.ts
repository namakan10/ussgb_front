import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService, SelectItem} from "primeng/api";
import {CourrierService} from "../Courrier/courrier.service";
import {SpinnerService} from "../spinner.service";
import {StatistiqueValidationService} from "./statistique-validation.service";
import {Observable} from "rxjs";
import {startWith} from "rxjs-compat/operator/startWith";
import {map} from "rxjs/operators";
import {StructureService} from "../../../services/structure.service";
import {UesServiceService} from "../../../services/ues.service";
import {Util_fonction} from "../../models/util_fonction";

@Component({
  selector: 'app-validation.tatistique',
  templateUrl: './validation.statistique.component.html',
  styleUrls: ['./validation.statistique.component.css']
})
export class ValidationStatistiqueComponent implements OnInit,OnDestroy {

  structureId:number;
  ues:any[];
  ecs:any[];

  ueSelected:any;
  ecSelected:any;

  user = JSON.parse(sessionStorage.getItem('user'));
  barreData: any;
  pieData: any;
  lineData: any;
  doughnutData: any;
  keyword="nomUE"
  keyword2="nomEC"

  genre:boolean;
   currentDate = new Date();
   anneeScolaire: string = `${this.currentDate.getFullYear()}`;
   anneeScolaires: any;// string[] = ["2020 - 2021","2019 - 2020","2018 - 2019","2017 - 2018","2016 - 2017","2015 - 2016","2014 - 2015","2013 - 2014","2012 - 2013","2011 - 2012","2010 - 2011","2009-2010"];


  constructor(
    public service: StatistiqueValidationService,
    private uesService: UesServiceService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private spinnerService: SpinnerService,
    private structureService: StructureService

  ) {

    this.structureId = this.user.structure.id; //+this.route.snapshot.paramMap.get("id");
    this.GetStuctureAnnees();
    this.initData(this.structureId);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.spinnerService.hide();
  }

  displayFn(ue: any): string {
    return ue && ue.nomUE ? ue.nomUE : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.ues.filter(ue => (ue.nomUE.toLowerCase().includes(filterValue) || ue.codeUE.toLowerCase().includes(filterValue)));
  }

  initData(id: number) {
    this.genre=true;
    this.getAllUEs();
    // this.getValidationStatistique(this.anneeScolaire,this.genre);
  }

  // StructureAnnees;
  GetStuctureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id)
      .subscribe(res => {
        this.anneeScolaires = res;
      })
  }

  getValidationStatistique(anneeScolaire:string,genre:boolean=false,ec?:any,ue?:any) {
    this.spinnerService.show();
    this.service.getValidations(this.structureId,anneeScolaire,genre,ec,ue).subscribe((response:any[]) => {
      this.spinnerService.hide();
      this.initCHart(response);
    }, error => {
      this.spinnerService.hide();
    });
  }


  getAllUEs() {
    this.spinnerService.show();
    this.uesService.getUesByStructure(this.structureId).subscribe((response:any) => {
      this.spinnerService.hide();
      response.content.forEach(u => u.nomUE = u.codeUE+' '+u.nomUE);
      this.ues = response.content;
    }, error => {
      this.spinnerService.hide();
    });
  }

  getAllECByUEd(ue) {
    this.spinnerService.show();
    this.service.getElementConstitutifByUEId(ue).subscribe((response:any[]) => {
      this.spinnerService.hide();
      response.forEach(e => e.nomEC = e.codeEC+' '+e.nomEC);
      this.ecs=response;
    }, error => {
      this.spinnerService.hide();
    });
  }


  setAnnee(value) {
    this.anneeScolaire = value;
    if (Util_fonction.checkIfNoTEmpty(this.ueSelected) || Util_fonction.checkIfNoTEmpty(this.ecSelected))
    this.getValidationStatistique(this.anneeScolaire,this.genre,this.ecSelected,this.ueSelected);
  }

  setUE(value) {
    this.ueSelected = value;
    this.ecSelected = null;
    this.getAllECByUEd(this.ueSelected);
    this.getValidationStatistique(this.anneeScolaire,this.genre,this.ecSelected,this.ueSelected);
  }
  setEC(value) {
    this.ecSelected = value;
    this.getValidationStatistique(this.anneeScolaire,this.genre,this.ecSelected,this.ueSelected);
  }

  setGenre(value) {
    this.genre=value;
    this.getValidationStatistique(this.anneeScolaire,this.genre,this.ecSelected,this.ueSelected);
  }



  initCHart(datas:any[]){
   const  backgroundColor= datas.map((e)=> '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6));
      this.pieData = {
      labels: datas.map((e) => e.label + " ( " + e.pourcentage + " % )" ),
      datasets: [
        {
          data: datas.map((e)=>e.nombre),
          backgroundColor: backgroundColor,
          hoverBackgroundColor: backgroundColor
        }]
    };
    this.doughnutData = {
      labels: datas.map((e)=> e.label + " ( " + e.pourcentage + " % )" ),
      datasets: [
        {
          data: datas.map((e) => e.nombre),
          backgroundColor: backgroundColor,
          hoverBackgroundColor: backgroundColor
        }]
    };

    this.barreData = {
      labels: datas.map((e)=> e.nombre + " %"),
      datasets: [
        {
          label: 'Validation homme',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: datas.map((e:any) => {
            if (e.label.includes('Homme')) {
              return e.nombre;
            }
          })
        },
        {
          label: 'Validation femme',
          backgroundColor: '#9CCC65',
          borderColor: '#7CB342',
          data: datas.map((e:any) => {
            if (e.label.includes('Femme')) {
              return e.nombre;
            }
          })
        }
      ]
    }

    this.lineData =  {
      labels: datas.map((e)=> e.nombre + " %"),
      datasets: [
        {
          label: 'Validation homme',
          data: datas.map((e:any) => {
            if (e.label.includes('Homme')) {
              return e.nombre;
            }
          }),
          fill: false,
          borderColor: '#1E88E5'
        },
        {
          label: 'Validation femme',
          data: datas.map((e:any) => {
            if (e.label.includes('Femme')) {
              return e.nombre;
            }
          }),
          fill: false,
          borderColor: '#7CB342'
        }
      ]
    }

  }


}
