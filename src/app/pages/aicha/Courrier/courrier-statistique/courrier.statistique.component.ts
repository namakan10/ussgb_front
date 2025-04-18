import {Component, OnDestroy, OnInit} from '@angular/core';
import {CourrierService} from "../courrier.service";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService, SelectItem} from "primeng/api";
import {Courrier} from "../courrier.model";
import {SpinnerService} from "../../spinner.service";
import {REST_URL} from "../../../REST_URL";
import {StructureService} from '../../../../services/structure.service';

@Component({
  selector: 'app-courrier.tatistique',
  templateUrl: './courrier.statistique.component.html',
  styleUrls: ['./courrier.statistique.component.css']
})
export class CourrierStatistiqueComponent implements OnInit,OnDestroy {



  structureId:number;
  user:any = JSON.parse(sessionStorage.getItem('user'));
  barreData: any;
  pieData: any;
  lineData: any;
  doughnutData: any;

  global:boolean=true;
  mois:boolean=false;
  statut:boolean=false;

   currentDate = new Date();
   anneeScolaire: string = `${this.currentDate.getFullYear()}`;
   anneeScolaires: any; //string[] = ["2021","2020","2019","2018","2017","2016","2015","2014","2013","2012","2011","2010"];


  constructor(
    public service: CourrierService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private spinnerService: SpinnerService,
    private structureService: StructureService,
  ) {

    this.structureId = this.user.structure.id;//+this.route.snapshot.paramMap.get("id");

    console.log('id_structure', this.structureId);
    console.log('current user', this.user);

  }

  ngOnInit() {
    this.GetStuctureAnnees()
  }

  ngOnDestroy(): void {
    this.spinnerService.hide();
  }


  initData(id: number) {
    this.global=true;
    this.mois = false;
    this.statut = false;
    this.anneeScolaire = this.anneeScolaires[0].anneeScolaire;
    this.getCourrierStatistique(this.global,this.mois,this.statut);
  }

  GetStuctureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id)
      .subscribe(res => {
        this.anneeScolaires = res;
        this.initData(this.structureId);
      })
  }

  getCourrierStatistique(global:boolean,mois:boolean,statut:boolean) {
    console.log('id_structure', this.structureId);
    console.log('annee', this.anneeScolaire);
    console.log('mois', mois);
    console.log('global', global);
    console.log('statut_traitement', statut);
    this.spinnerService.show();
    this.service.getCourrierStatistique(this.structureId,this.anneeScolaire,global,mois,statut).subscribe((response:any[]) => {
      this.spinnerService.hide();
      console.log("### Data statistiques des courriers ===>", response);
      this.initCHart(response);
    }, error => {
      this.spinnerService.hide();
      console.log("### Error statistiques des courriers ===>", error);
    });
  }


  setAnnee(value) {
    console.log("annee selected",value);
    this.anneeScolaire = value;
    this.getCourrierStatistique(this.global,this.mois,this.statut);
  }

  setGlobal(value) {
    console.log("global selected",value);
    this.global=value;
    this.getCourrierStatistique(this.global,this.mois,this.statut);
  }

  setMois(value) {
    console.log("mois selected",value);
    this.mois=value;
    this.getCourrierStatistique(this.global,this.mois,this.statut);
  }

  setStatut(value) {
    console.log("statut selected",value);
    this.statut=value;
    this.getCourrierStatistique(this.global,this.mois,this.statut);
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
          label: 'Courriers entrants',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: datas.map((e:any) => {
            if (e.label.includes('Arrivés')) {
              return e.nombre;
            }
          })
        },
        {
          label: 'Courriers sortants',
          backgroundColor: '#9CCC65',
          borderColor: '#7CB342',
          data: datas.map((e:any) => {
            if (e.label.includes('Départs')) {
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
          label: 'Courriers entrants',
          data: datas.map((e:any) => {
            if (e.label.includes('Arrivés')) {
              return e.nombre;
            }
          }),
          fill: false,
          borderColor: '#1E88E5'
        },
        {
          label: 'Courriers sortants',
          data: datas.map((e:any) => {
            if (e.label.includes('Départs')) {
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
