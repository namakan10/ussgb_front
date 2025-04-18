import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// import { TabsetComponent } from 'ngx-bootstrap/tabs';
import * as CanvasJS from '../../../../assets/canvasjs.min';
import { CandidatureService } from '../../../services/GestionEtudiants/candidature.service';
import { FiliereService } from '../../../services/GestionFilieres/filiere.service';
import { OptionsService } from '../../../services/GestionFilieres/Options/options.service';
import { FraisInscriptionService } from '../../../services/GestionFrais/frais-inscription.service';
import { PreInscriptionServiceService } from '../../../services/pre-inscription-service.service';
import { StructureService } from '../../../services/structure.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {StatistiquesService} from "../../../services/statistiques.service";
import {Util_fonction} from "../../models/util_fonction";


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.scss']
})
export class StatistiqueComponent implements OnInit {
  panelOpenState = false;
  spinner = false;
  hasRole = false;
  spinner1 = true;
  id_structure;
  annee_scolaire;
  id_filiere;
  id_option;
  periode;
  mode_paiement;
  motif;
  niveau;
  allStructure: any = [];
  anneeStructure: any = [];
  filiereStructure: any;
  optionFiliere: any;
  error: any;
  anneeStructureTrouver = false;
  optionTrouver = false;
  global //--
  onGlobal //--
  personalStat//--
  levelStat // --
  year //--
  public chartType3: string = 'line';

  public chartType: string = 'bar';

  public chartDatasets: Array<any> = [
  ];

  public chartLabels: Array<any> = [];

  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }



  public chartType2: string = 'pie';

  public chartDatasets2: Array<any> = [];

  public chartLabels2: Array<any> = [];

  public chartColors2: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    }
  ];

  public chartOptions2: any = {
    responsive: true
  };
  public chartClicked2(e: any): void { }
  public chartHovered2(e: any): void { }
  date_debut;
  date_fin;
  path = "";
  title = "";
  method = "";
  typeDonnee = "";
  type = "";

  displayedColumns: string[];
  dataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;

  constructor(private structureService: StructureService,
    private filiere:  FiliereService,
    private option:  OptionsService,
    private candidature:  CandidatureService,
    private frais:  FraisInscriptionService,
    private stats:  StatistiquesService,
    private preinscription:  PreInscriptionServiceService,
    public datepipe: DatePipe
    ) { }

    affiState2 = 0;
    index = 0;
    affiState3 = false;
    affiState = false;
    user: any;
    allTypeGenre: any = [];
    total = null;
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.id_structure = this.user.structure.id;
    this.getIformationByStructure(this.id_structure);
    this.structureService.getStuctures().subscribe(
      (res) =>{
        this.allStructure = res;
        this.spinner1 = false;
      })
  }

  getIformationByStructure(value) {
    this.spinner = true;
    this.anneeStructureTrouver = false;
    this.optionTrouver = false;
    this.optionFiliere = {};
    this.anneeStructure = {};
    this.filiereStructure = {};
    this.mode_paiement = null;
    this.motif = null;
    this.niveau = null;
    this.error = {};
    this.structureService.getStuctureAnnees(value).subscribe(
      (res) =>{

        this.anneeStructureTrouver = true;
        this.anneeStructure = res;
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      });

      }

  getOptionByFiliere(value) {
    this.spinner = true;
    this.optionTrouver = false;
    this.optionFiliere = {};
    this.error = {};
    this.mode_paiement = null;
    this.motif = null;
    this.niveau = null;
    this.option.getOptionsByFiliereID(value).subscribe(
      (res) =>{
        this.optionFiliere = res;
        this.optionTrouver = true;
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      })
  }
  TypeDonnee(event) {
    const tabId = event.index;
    let typeDonnee = '';
    if (event.index === 0) {
      typeDonnee = 'Graphique';
    } else {
      typeDonnee = 'Tableau';
    }
    if(this.method === 'StatistiqueGenre') {
      if(this.path === '/niveau/'){
        this.displayedColumns = ['niveau', 'genre', 'nombre', 'pourcentage'];
      } else if(this.path === '/type/'){
        this.displayedColumns = ['type', 'genre', 'nombre', 'pourcentage'];
      } else {
        this.displayedColumns = ['genre', 'nombre', 'pourcentage'];
      }
      this.StatistiqueGenre(this.path, typeDonnee, tabId)
    } else if(this.method === 'StatistiqueInscription') {
      if(this.path == '/niveau'){
        this.displayedColumns = ['niveau', 'nombre', 'pourcentage'];
      } else if(this.path == '/niveau/age'){
        this.displayedColumns = ['type', 'age', 'nombre', 'pourcentage'];
      }
      this.StatistiqueInscription(this.path, typeDonnee, tabId)
    }
  }

  StatistiqueGenre(path, typeDonnee, tabId){
    this.spinner = true;
    this.affiState2 = 0;
    this.affiState3 = false;
    this.total = null;
    this.path = path;
    this.typeDonnee = typeDonnee;
    this.method = "StatistiqueGenre";
    this.index = tabId;
    // this.staticTabs.tabs[tabId].active = true;
    this.frais.statistiqueParGenre(this.id_structure, path, typeDonnee).subscribe(
      (res) =>{
                if(path === "/"){
                  this.title = "Genre de façon globale";
                } else if (path === "/niveau/") {
                  this.title = "Genre par niveau";
                } else {
                  this.title = "Genre par type";
                }
        if(typeDonnee === "Graphique"){
          if(path !== "/type/" && path !== "/niveau/"){
          let tableau = [];
          res.forEach((element, index) => {
            tableau.push({y:element.nombre , name: element.label});
            if(res.length === (index + 1)){
              this.affiState2 = 1;
              this.chart(tableau, this.title);
            }
          });
        } else {
          this.affiState2 = 1;
          var arr = Object.entries(res).map(([type, value]) => ({type, value}));
          this.allTypeGenre = arr;
          arr.forEach((e, ind) => {
            let tab:any = e.value;
            let tableau = [];
            tab.forEach((element, index) => {
              tableau.push({y:element.nombre , name: element.label});
              if(tab.length === (index + 1)){
                this.affiState2 = 1;
                  this.chart2(tableau, e.type, ind);
                }
              });
            });
        }
      } else {
        var arr = Object.entries(res).map(([type, value]) => ({type, value}));
        let tableau = [];
          arr.forEach((e, ind) => {
            let tab:any = e.value;
            if(this.path != "/"){
              tab.forEach((element, index) => {
                  if(this.path === "/type/"){
                      element['type'] = e.type
                  }
                  tableau.push(element);
                  if(tab.length === (index + 1)){
                    this.affiState2 = 2;
                    this.dataSource = new MatTableDataSource(tableau);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    }
                });
            } else {
              tableau.push(tab);
                if(arr.length === (ind + 1)){
                  this.affiState2 = 2;
                  this.dataSource = new MatTableDataSource(tableau);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  }
            }
          });

        }

        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  StatistiqueInscription(path, typeDonnee, tabId){
    this.spinner = true;
    this.affiState2 = 0;
    this.total = null;
    this.path = path;
    this.typeDonnee = typeDonnee;
    this.method = "StatistiqueInscription";
    this.affiState3 = false;
    this.index = tabId;
    // this.staticTabs.tabs[tabId].active = true;
    let data = {
      id_structure: this.id_structure ,
      annee_scolaire: this.annee_scolaire,
      type_donnee: typeDonnee
    }
    this.frais.StatistiqueInscription(data).subscribe(
      (res) =>{
        this.affiState2 = 1;
        let tableau = [];
        if (path === "/niveau") {
          this.title = "Inscription par niveau";
        } else {
          this.title = "Inscription par niveau et âge";
        }
        if(typeDonnee == "Graphique"){
            if (path === "/niveau") {
              res.forEach((element, index) => {
                tableau.push({y:element.nombre , name: element.label});
                if(res.length === (index + 1)){
                  this.chart(tableau, this.title);
                }
              });
            } else {
            var arr = Object.entries(res).map(([type, value]) => ({type, value}));
            arr.forEach((e, ind) => {
              let tab:any = e.value;
              let tableau = [];
              tab.forEach((element, index) => {
                tableau.push({y:element.nombre , name: element.label});
                if(tab.length === (index + 1)){
                  this.affiState2 = 1;
                    this.chart2(tableau, e.type, ind);
                  }
                });
              });
            }
      } else {
        if (path === "/niveau") {
            res.forEach((element, index) => {
                tableau.push(element);
                if(res.length === (index + 1)){
                  this.affiState2 = 2;
                  this.dataSource = new MatTableDataSource(tableau);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  }
            });

          } else {
            var arr = Object.entries(res).map(([type, value]) => ({type, value}));
            arr.forEach((e, ind) => {
              let tab:any = e.value;
              tab.forEach((element, index) => {
                element['type'] = e.type;
                tableau.push(element);
                if(tab.length === (index + 1)){
                  this.affiState2 = 2;
                  this.dataSource = new MatTableDataSource(tableau);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  }
                });
              });
          }
      }

        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      })
  }


  // verify(type) {
  //   if(this.type !== ""){
  //     if(this.type !== type) {
  //       this.type = type;
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }
  //   this.type = type;
  //   return false;
  // }

  statistiquePaiement(debut, fin){
    this.affiState2 = 0;
    this.affiState3 = false;
    this.total = null;
    this.spinner = true;
    const data = {
      id_structure: this.id_structure ,
      date_debut: this.datepipe.transform(debut, 'yyyy-MM-dd'),
      date_fin: this.datepipe.transform(fin, 'yyyy-MM-dd')
    }
    this.frais.statistiquePaiement(data).subscribe(
      (res) =>{
        this.total = res;
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      })
  }

  chart(tableau, title){
    let chart = new CanvasJS.Chart("chartContainer0", {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title:{
        text: title
      },
      data: [{
        type: "pie",
        // showInLegend: true,
        toolTipContent: "{name}",
        indexLabel: "{name}",
        dataPoints: tableau
      }]
    });

    chart.render();

  }

  chart2(tableau, title, id){
    let chart = new CanvasJS.Chart("chartContainer"+id, {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title:{
        text: title
      },
      data: [{
        type: "pie",
        // showInLegend: true,
        toolTipContent: "{name}",
        indexLabel: "{name}",
        dataPoints: tableau
      }]
    });
    chart.render();

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

    const contentDataURL = canvas.toDataURL('image/png');
    const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    const position = 15;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    pdf.save(this.title + '.pdf'); // Generated PDF
    this.spinner = false;
    });
  }

  hasRoleAdmin() {
    this.hasRole = false;
    if (this.user['users'] ) {
    this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_ADMIN') {
            this.hasRole = true;

        }
    });
    return this.hasRole;
}
}

//by Alou diarra
  getTeachingStats(year,typeDonnee,tabId){
    this.year=year
    this.initValue()
    this.typeDonnee = typeDonnee;
    this.method = "getTeachingStats";
    this.index = tabId;
    const data= {
      "id_structure" : 2,
      "type_donnee" : "Graphique",
      "anneeScolaire": year
    }
    //console.log(data)
    this.stats.getTeachingStats(data).subscribe(
      (res) =>{
        if(typeDonnee==="Graphique"){

          var arr=res;
          arr.forEach((e, ind) => {
            let tab:any = e.statistiques;
            //  console.log(tab)
            let tableau = [];
            tab.forEach((element, index) => {
              tableau.push({y:element.nombre , name: element.label});
              // console.log('Tableau')
              // console.log(tableau)
              if(tab.length === (index + 1)){
                // console.log('index data')
                // console.log(ind)
                this.affiState2 = 1;
                this.chart2(tableau, e.ue.codeUE, ind);
              }
            });
          });
        }else{
          let tableau = [];
          arr.forEach((e, ind) => {
            let tab:any = e.statistiques;
            tableau.push(tab);
            if(res.length === (ind + 1)){
              this.affiState2 = 22222;
              this.dataSource = new MatTableDataSource(tableau);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          })
        }

        //  this.total = res;
        this.spinner = false;
      },
      (error) => {

        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      })

  }
  getUEStats(path,typeDonnee,year){
    this.initValue()
//  console.log(typeDonnee)
//  console.log(path)
    // console.log(year)
    this.title="par UE"
    this.spinner=true;
    this.path = path;
    this.typeDonnee = typeDonnee;
    this.method = "getUEStats";
    this.index = 0
    const data= {
      "id_structure" : this.id_structure,
      "type_donnee" : "Graphique",
      "anneeScolaire": year,
      "idUE" : 2
    }
//  console.log(data)
    this.stats.getUEStats(data).subscribe(
      (res) =>{
        //  console.log(res);
        if(typeDonnee === "Graphique"){
          this.affiState2 = 1;
          let tableau = [];
          res.forEach((element, index) => {
            tableau.push({y:element.nombre , name: element.label});
            if(res.length === (index + 1)){
              //  console.log(tableau);

              this.chart(tableau, this.title);
            }
          });
        }else{
          var arr = Object.entries(res).map(([type, value]) => ({type, value}));
          let tableau = [];
          arr.forEach((e, ind) => {
            let tab:any = e.value;
            tableau.push(tab);
            if(arr.length === (ind + 1)){
              this.affiState2 = 2222;
              this.dataSource = new MatTableDataSource(tableau);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          })
        }
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      })

  }
  getCourrierGlobalStats(){
    this.initValue()
    this.spinner = true;
    this.stats.getCourrierGlobalStats(this.id_structure).subscribe(
      (res) =>{
        this.global = res;
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      })
  }
  getOngoingCourrierStats(){
    this.initValue()
    this.spinner = true;
    this.stats.getOngoingCourrierStats(this.id_structure).subscribe(
      (res) =>{

        this.onGlobal = res;
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      })
  }
  getPersonnelStats(){
    this.initValue()
    this.spinner = true;
    this.stats.getPersonnelStats(this.id_structure).subscribe(
      (res) =>{

        // console.log(res["Tous les courriers"]);
        this.personalStat = res;
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      })
  }
  initValue(){
    this.personalStat=null
    this.global=null
    this.onGlobal=null
    this.levelStat=null
    let tableau = [];
    this.affiState2 = 0;
    this.affiState3 = false;
    this.affiState = false;
    this.total = null;
  }
  getPersonnelLevelStats(){
    this.initValue()
    this.spinner = true;
    this.stats.getPersonnelLevelStats(this.id_structure).subscribe(
      (res) =>{
        // console.log(res["Tous les courriers"]);
        this.levelStat = res;
        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      })
  }
  getPersonnelGenreStats(path, typeDonnee, tabId){
    //new
    this.initValue()
    this.spinner = true;
    this.path = path;
    this.typeDonnee = typeDonnee;
    this.method = "getPersonnelGenreStats";
    this.index = tabId;
    // this.staticTabs.tabs[tabId].active = true;
    this.stats.getPersonnelGenreStats(this.id_structure).subscribe(
      (res) =>{

        if(typeDonnee === "Graphique"){
          //   if(path !== "/type/" && path !== "/niveau/"){
          //   let tableau = [];
          //   res.forEach((element, index) => {
          //     tableau.push({y:element.nombre , name: element.label});
          //     if(res.length === (index + 1)){
          //       this.affiState2 = 1;
          //       this.chart(tableau, this.title);
          //     }
          //   });
          // } else {
          this.affiState2 = 1;
          var arr = Object.entries(res).map(([type, value]) => ({type, value}));
          this.allTypeGenre = arr;
          arr.forEach((e, ind) => {
            let tab:any = e.value;
            let tableau = [];
            //     tab.forEach((element, index) => {
            tableau.push({y:tab.Femmes , name: "Femmes "+tab.Femmes});
            tableau.push({y:tab.Hommes , name: "Hommes "+tab.Hommes});
            // if(tab.length === (index + 1)){
            this.affiState2 = 1;
            this.chart2(tableau, e.type, ind);
            //   }
            //   });
          });
          //  }
        } else {
          var arr = Object.entries(res).map(([type, value]) => ({type, value}));
          let tableau = [];
          arr.forEach((e, ind) => {
            let tab:any = e.value;
            //  if(this.path != "/"){
            //   tab.forEach((element, index) => {
            // if(this.path === "/type/"){
            //     element['type'] = e.type
            // }
            tab['type']=e.type
            tableau.push(tab);
            // if(tab.length === (index + 1)){
            this.affiState2 = 22;
            this.dataSource = new MatTableDataSource(tableau);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            //  }
            //     });
            // } else {
            //   tableau.push(tab);
            //     if(arr.length === (ind + 1)){
            //       this.affiState2 = 2;
            //       this.dataSource = new MatTableDataSource(tableau);
            //       this.dataSource.paginator = this.paginator;
            //       this.dataSource.sort = this.sort;
            //       }
            //   }
          });

        }

        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      })
  }
  getPersonnelAgeStats(path,typeDonnee,tabId){
    //new
    this.initValue()
    this.spinner = true;
    this.path = path;
    this.typeDonnee = typeDonnee;
    this.method = "getPersonnelAgeStats";
    this.index = tabId;
    // this.staticTabs.tabs[tabId].active = true;
    this.stats.getPersonnelAgeStats(this.id_structure).subscribe(
      (res) =>{

        if(typeDonnee === "Graphique"){
          //   if(path !== "/type/" && path !== "/niveau/"){
          //   let tableau = [];
          //   res.forEach((element, index) => {
          //     tableau.push({y:element.nombre , name: element.label});
          //     if(res.length === (index + 1)){
          //       this.affiState2 = 1;
          //       this.chart(tableau, this.title);
          //     }
          //   });
          // } else {
          this.affiState2 = 1;
          var arr = Object.entries(res).map(([type, value]) => ({type, value}));
          this.allTypeGenre = arr;
          arr.forEach((e, ind) => {

            let tab:any = e.value;
            let tableau = [];

            //     tab.forEach((element, index) => {
            tableau.push({y:tab["De 18 - 25"] , name: "De 18 - 25"});
            tableau.push({y:tab["De 26 - 35"] , name: "De 26 - 35"});
            tableau.push({y:tab["De 36 - 45"] , name: "De 36 - 45"});
            tableau.push({y:tab["De 46 - 55"] , name: "De 46 - 55"});
            tableau.push({y:tab["De 56 - 65"] , name: "De 56 - 65"});

            // tableau.push({y:tab.Hommes , name: "Hommes "+tab.Hommes});
            // if(tab.length === (index + 1)){
            this.affiState2 = 1;
            this.chart2(tableau, e.type, ind);
            //   }
            //   });
          });
          //  }
        } else {
          var arr = Object.entries(res).map(([type, value]) => ({type, value}));
          let tableau = [];
          arr.forEach((e, ind) => {
            let tab:any = e.value;
            //  if(this.path != "/"){
            //   tab.forEach((element, index) => {
            // if(this.path === "/type/"){
            //     element['type'] = e.type
            // }
            tab['type']=e.type
            tableau.push(tab);
            // if(tab.length === (index + 1)){
            this.affiState2 = 222;
            this.dataSource = new MatTableDataSource(tableau);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            //  }
            //     });
            // } else {
            //   tableau.push(tab);
            //     if(arr.length === (ind + 1)){
            //       this.affiState2 = 2;
            //       this.dataSource = new MatTableDataSource(tableau);
            //       this.dataSource.paginator = this.paginator;
            //       this.dataSource.sort = this.sort;
            //       }
            //   }
          });

        }

        this.spinner = false;
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      })
  }
  /*
      getStat(){

        this.apiservice.getStatistiques()
        .subscribe((data : any) =>{
          this.stat=data;
          this.chartColor = "#FFFFFF";

          this.canvas = document.getElementById("chartHours");
          this.ctx = this.canvas.getContext("2d");

          this.chartHours = new Chart(this.ctx, {
            type: 'bar',

            data: {
              labels: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct","Nov","Dec"],
              datasets: [{
                  borderColor: "#6bd098",
                  backgroundColor: "#6bd098",
                  pointRadius: 0,
                  pointHoverRadius: 0,
                  borderWidth: 3,
                  data: this.stat.upload,
                  label:'Upload',
                },
                {
                  borderColor: "#f17e5d",
                  backgroundColor: "#f17e5d",
                  pointRadius: 0,
                  pointHoverRadius: 0,
                  borderWidth: 3,
                  data: this.stat.download,
                  label:'Téléchargements',
                },
                {
                  borderColor: "#fcc468",
                  backgroundColor: "#fcc468",
                  pointRadius: 0,
                  pointHoverRadius: 0,
                  borderWidth: 3,
                  data: this.stat.user,
                  label:'Ulitilisateur',
                }
              ]
            },
            options: {
              legend: {
                display: true
              },

              tooltips: {
                enabled: true
              },

              scales: {
                yAxes: [{

                  ticks: {
                    fontColor: "#9f9f9f",
                    beginAtZero: false,
                    maxTicksLimit: 5,
                    //padding: 20
                  },
                  gridLines: {
                    drawBorder: false,
                    zeroLineColor: "#ccc",
                    color: 'rgba(255,255,255,0.05)'
                  }

                }],

                xAxes: [{
                  barPercentage: 1.6,
                  gridLines: {
                    drawBorder: false,
                    color: 'rgba(255,255,255,0.1)',
                    zeroLineColor: "transparent",
                    display: false,
                  },
                  ticks: {
                    padding: 20,
                    fontColor: "#9f9f9f"
                  }
                }]
              },
            }
          });

        });
      }
  */
//end by Alou
}
