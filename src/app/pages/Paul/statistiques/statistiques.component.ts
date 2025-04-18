import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StructureService} from "../../../services/structure.service";
import {FraisInscriptionService} from "../../../services/GestionFrais/frais-inscription.service";
import * as CanvasJS from '../../../../assets/canvasjs.min';
import {UNIV_FILIERE, UNIV_OPTION} from "../../../CONSTANTES";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import {FiliereService} from "../../../services/GestionFilieres/filiere.service";
import {Keys} from "@swimlane/ngx-datatable";
import {Util_fonction} from "../../models/util_fonction";
import {Router} from "@angular/router";

@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css']
})
export class StatistiquesComponent implements OnInit {
  StructureAnnees: any;
  anneeScolaire: any;
  Filieres: any;

  reussite  = ["reus_"];

  id = "";
  st:any;
  aff_spinner: boolean = false;
  pdf_spinner: boolean = false;
  showTable: boolean = false;
  Univ_opt = UNIV_OPTION;
  Univ_fil = UNIV_FILIERE;
  typ_table = "";
  TableTile = "";
  textResult = '';


  user = JSON.parse(sessionStorage.getItem("user"));

  typeStat: any;
  INSCRIPT_STAT_FORM: FormGroup;
  PAIEMENTS_STAT_FORM: FormGroup;
  REUSSITE_STAT_FORM: FormGroup;

  Inscript_statSend = {
    id_structure: null,
    annee_scolaire: null,
    age: null,
    genre: null,
    nationalite: null,
    option: null,
    filiere: null,
    niveau: null
  }

  Paiement_statSend = {
    id_structure: null,
    annee_scolaire: null,
    motif: null,
    cursus: null,
    niveau: null
  }

  Passage_statSend = {
    annee_scolaire: null,
    id_structure: null,
    id_filiere: null,
    genre: null,
    passerelle: null
  }
  dataSource: any;
  dataSourceTemp: any;
//-
  filiereListBody = {
    id_structure: null,
    id_departement: null,
    id_candidat: null,
    cursus: null,
  };
  HasRole: boolean = false;
  constructor(private fb: FormBuilder,
              private structureService: StructureService,
              private statistiquesService:  FraisInscriptionService,
              private filiereService: FiliereService,
              private router: Router) {
     // this.HasRole = Util_fonction.checkIfAsRole(this.user, ["ROLE_ADMIN", "ROLE_GRH"]);
     this.HasRole = Util_fonction.checkIfAsRole2(this.user, ["ROLE_ADMIN", "ROLE_GRH"]);
  }

  ngOnInit() {
    this.initInscriptStatForm();
    this.initPayementStatForm();
    this.initReussiteStatForm();
    this.GetStuctureAnnees();
    this.GetStuctureFilieres();
  }
  StatTypeSelected(){
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: ""
      },
      data: []
    });
    chart.render();
    if (this.typeStat === "COURRIER"){
      this.router.navigate(['structure/'+this.user.structure.id+'/statistique-courrier']);
    } else {
      this.router.navigate(['statistiques']);
    }
  }
  GetStuctureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id)
      .subscribe(res => {
        this.StructureAnnees = res;
      })
  }
  GetStuctureFilieres(){
    this.filiereListBody.id_structure = this.user.structure.id;
    this.filiereService.GetStructureFilieres(this.filiereListBody).subscribe( resFill => {
      // this.change_spinner = false;
      this.Filieres = resFill;
    })
  }

  change() {
    this.dataSource = [];
    this.dataSourceTemp = [];
    this.aff_spinner = true;
    this.typ_table = "directLoop";
    this.initInscriptStatData();
    this.Inscript_statSend.id_structure = this.user.structure.id;
    this.Inscript_statSend.annee_scolaire = this.anneeScolaire;
    if (this.INSCRIPT_STAT_FORM.controls.selected.value === "nationalite"){
      this.Inscript_statSend.nationalite = true;
    }else
    if (this.INSCRIPT_STAT_FORM.value.selected === "genre"){
      this.Inscript_statSend.genre = true;
    }else
    if (this.INSCRIPT_STAT_FORM.value.selected === "niveau"){
      this.Inscript_statSend.niveau = true;
    }else
    if (this.INSCRIPT_STAT_FORM.value.selected === "niveau_genre"){
      this.Inscript_statSend.niveau = true;
      this.Inscript_statSend.genre = true;
    }else
    if (this.INSCRIPT_STAT_FORM.value.selected === "option"){
      this.Inscript_statSend.option = true;
    }else
    if (this.INSCRIPT_STAT_FORM.value.selected === "option_genre"){
      this.Inscript_statSend.option = true;
      this.Inscript_statSend.genre = true;
    }else
    if (this.INSCRIPT_STAT_FORM.value.selected === "filiere"){
      this.Inscript_statSend.filiere = true;
    }else
    if (this.INSCRIPT_STAT_FORM.value.selected === "filiere_genre"){
      this.Inscript_statSend.filiere = true; this.Inscript_statSend.genre = true;
    }else
    if (this.INSCRIPT_STAT_FORM.value.selected === "age"){
      this.Inscript_statSend.age = true;
    }else
    if (this.INSCRIPT_STAT_FORM.value.selected === "age_genre"){
      this.Inscript_statSend.age = true;
      this.Inscript_statSend.genre = true;
    }else
    if (this.INSCRIPT_STAT_FORM.value.selected === "age_niveau"){
      this.Inscript_statSend.age = true;
      this.Inscript_statSend.niveau = true;
    }else
    if (this.INSCRIPT_STAT_FORM.value.selected === "age_genre_niveau"){
      this.Inscript_statSend.age = true;
      this.Inscript_statSend.genre = true;
      this.Inscript_statSend.niveau = true;
    }


    this.statistiquesService.StatistiqueInscription(this.Inscript_statSend).subscribe(
      res =>{
        if (!!res) {
          this.PrepareCanvasData(res, this.INSCRIPT_STAT_FORM.controls.selected.value);
        }else {
          Util_fonction.AlertMessage("info", "aucun résultal");
          this.PrepareCanvasData([], this.INSCRIPT_STAT_FORM.controls.selected.value);
        }
      }
    )
  }

  /**
   * POUR LE PAIEMENT
   */
  change2(){
    this.dataSource= [];
    this.dataSourceTemp = [];
    this.textResult = '';
    this.aff_spinner = true;
    this.typ_table = "directLoop";
    this.initPaiementStatData();
    this.Paiement_statSend.id_structure = this.user.structure.id;
    this.Paiement_statSend.annee_scolaire = this.anneeScolaire;

    if (this.PAIEMENTS_STAT_FORM.value.selected === "pay_niveau"){this.Paiement_statSend.niveau = true;}
    if (this.PAIEMENTS_STAT_FORM.value.selected === "cursus"){this.Paiement_statSend.cursus = true;}
    if (this.PAIEMENTS_STAT_FORM.value.selected === "motif"){this.Paiement_statSend.motif = true;}

    this.statistiquesService.statistiquePaiements(this.Paiement_statSend).subscribe(
      res =>{
        if (this.PAIEMENTS_STAT_FORM.controls.selected.value === "global"){
          this.textResult = res[0].montant;
          this.aff_spinner = false;
        } else {
          if(res.length > 0){
            this.aff_spinner = false;
            this.PrepareCanvasData(res, this.PAIEMENTS_STAT_FORM.controls.selected.value);
          }else {
            this.aff_spinner = false;
            Util_fonction.AlertMessage("info", "aucun résultal");
            this.PrepareCanvasData([], this.PAIEMENTS_STAT_FORM.controls.selected.value);
          }
        }
      }

    )

  }

  /**
   * POUR LA REUSSITE
   */
  Reussite_change() {
    this.dataSource = [];
    this.dataSourceTemp= [];
    this.aff_spinner = true;
    this.typ_table = "directLoop";
    this.Passage_statSend.id_structure = this.user.structure.id;
    this.Passage_statSend.annee_scolaire = this.anneeScolaire;
    this.Passage_statSend.id_filiere = this.REUSSITE_STAT_FORM.controls.id_filiere.value;
    this.Passage_statSend.genre = this.REUSSITE_STAT_FORM.controls.genre.value;
    this.Passage_statSend.passerelle = this.REUSSITE_STAT_FORM.controls.passerelle.value;

    this.statistiquesService.StatistiqueReussite(this.Passage_statSend).subscribe(
      res =>{
        this.aff_spinner = false;
        if (Object.keys(res).length > 0){
          // this.noResul = false;
          this.PrepareReussiteCanvasData(res);
          this.aff_spinner = false;
        }else {
          Util_fonction.AlertMessage("info", "aucun résultal");
          this.PrepareReussiteCanvasData([])
          // this.noResul = true;
          this.aff_spinner = false;
        }
      }
    )
  }


  PrepareReussiteCanvasData(donnees){
    let data =[];
    let filiere = null;
    let titre = ""+this.REUSSITE_STAT_FORM.controls.passerelle.value;
    if (this.REUSSITE_STAT_FORM.controls.genre.value === 'true'){
      titre += "/ Genre";
    }
    if (Util_fonction.checkIfNoTEmpty(this.Passage_statSend.id_filiere)){
      for (let fil of this.Filieres){
        if (fil.id === +this.Passage_statSend.id_filiere){
          // titre += "/ "+this.Univ_fil+" : "+fil.codeFiliere;
          titre += "/ Filière :"+fil.codeFiliere;
        }
      }
    }

    for (let dn of donnees){
      data.push({ y: dn.nombre, label: dn.label+" ["+dn.pourcentage+"%]"});
    }
    // appel du canvas
    this.CanvanPieBar(data,titre);
    this.GenerTable(donnees,titre);
  }

  /**
   *
   * @param donnees
   * @param stat
   * @constructor
   */
  PrepareCanvasData(donnees, stat){
    let level =["L1","L2","L3","M1","M2"];
    let data =[];
    let titre = "";

   if (stat === "genre"){
     for (let dn of donnees){
       data.push({ y: dn.nombre, label: dn.genre+": "+dn.pourcentage+"% soit " });
     }
     this.CanvasPieCircular(data, "Inscription/genre");
   }

   if (stat === "nationalite") {
     for (let dn of donnees){
       data.push({ y: dn.nombre, label: dn.nationalite+" : "+dn.pourcentage+" % soit "+dn.nombre });
     }
     this.CanvasPieCircular(data, "Inscription/nationalité");
   }

/** Niveau */
   if (stat === "niveau_genre" || stat === "niveau" || stat === "age_niveau" || stat === "age_genre_niveau"){
     this.typ_table = "levelLoop";
     for (let lev of level){
       if (donnees.hasOwnProperty(''+lev)){
         for (let l of donnees[""+lev]){
           if (stat === "niveau_genre"){
             titre = "Inscription/Niveau & genre";
             data.push({ y: l.nombre, label: lev+"/"+l.genre+"/"+l.pourcentage+"%" });
           }
           if (stat === "niveau"){
             titre = "Inscription/Niveau";
             data.push({ y: l.nombre, label: lev+"/"+l.pourcentage+"%" });
           }

           /** Age - niveau */
           if (stat === "age_niveau"){
             titre = "Inscription/Age & niveau";
             data.push({ y: l.nombre, label: lev+":["+l.age+"] "+l.pourcentage+"% ("+l.nombre+")" });
           }

           /** Age - genre - niveau */
           if (stat === "age_genre_niveau"){
             titre = "Inscription/Age & niveau";
             data.push({ y: l.nombre, label: lev+":["+l.age+" | "+l.genre+" ]"+l.pourcentage+"% ("+l.nombre+")" });
             // lev+":["+l.age+" | "+l.genre+" ]"+l.pourcentage+"% ("+l.nombre+")"
           }
         }
       }
     }
     if(stat === "age_genre_niveau"){
       this.CanvanPieBar(data,titre)
     } else {
       this.CanvanPieColumn(data,titre)
     }
   }

/** Filière / Option*/
    if (stat === "filiere" || stat === "option"){
      for (let dn of donnees){
        if (stat === "filiere"){
          data.push({ y: dn.nombre, label: dn.filiere+": "+dn.pourcentage+"% soit "+dn.nombre });
        }

        if (stat === "option"){
          data.push({ y: dn.nombre, label: dn.option+": "+dn.pourcentage+"% soit "+dn.nombre });
        }

      }
      this.CanvanPieBar(data, "Inscription/"+this.Univ_fil);
    }

    if (stat === "filiere_genre" || stat === "option_genre"){
      for (let dn of donnees){
        if (stat === "filiere_genre"){
          titre = "Inscription/Filière & genre";
          data.push({ y: dn.nombre, label: dn.filiere+"("+dn.genre+"): "+dn.pourcentage+"% soit "+dn.nombre });
        }

        if (stat === "option_genre"){
          titre = "Inscription/Option & genre";
          data.push({ y: dn.nombre, label: dn.option+"("+dn.genre+"): "+dn.pourcentage+"% soit "+dn.nombre });
        }
      }
      this.CanvanPieBar(data, titre);
    }





/** Age // Pay: cursus*/
    if (stat === "age" || stat === "age_genre" || stat === "cursus" || stat === "pay_niveau" || stat === "motif"){
      for (let dn of donnees){
        if (stat === "age"){
          titre = "Inscription/tranche d'âge";
          data.push({ y: dn.nombre, label: "["+dn.age+"]: "+dn.pourcentage+"% soit "+dn.nombre });
          this.CanvanPieBar(data, titre);
        }

        if (stat === "age_genre"){
          titre = "Inscription/tranche d'âge & genre";
          data.push({ y: dn.nombre, label: "["+dn.age+"]"+dn.genre+": "+dn.pourcentage+"% soit "+dn.nombre });
          this.CanvanPieBar(data, titre);
        }

        // Cas de paiement
        if (stat === "cursus"){
          titre = "Paiement total / Cursus";
          data.push({ y: dn.montant, label: "cursus "+dn.cursus+"["+dn.montant+"]" });
          this.CanvanPieColumn(data, titre);
        }

        if (stat === "pay_niveau"){
          titre = "Paiement total / Niveau";
          data.push({ y: dn.montant, label: "niveau "+dn.niveau});
          this.CanvanPieColumn(data, titre);
        }
        if (stat === "motif"){
          titre = "Paiement total / Motif";
          data.push({ y: dn.montant, label: "motif "+dn.motif+"["+dn.montant+"]" });
          this.CanvanPieColumn(data, titre);
        }

      }

    }

    /** Age genre niveau */

    this.GenerTable(donnees,titre);

    this.aff_spinner = false;
  }

  /***
   *  GENERER LE TABLEAU
   * @param donnees
   * @constructor
   */

  TotalP = 0;
  TotalN = 0;
  TotalM = 0;
  GenerTable(donnees, titre){
    this.TotalP = 0;
    this.TotalN = 0;
    this.TotalM = 0;
    this.TableTile = ""+titre;
    let level =["L1","L2","L3","M1","M2"];
    let data =[];

    if (this.typ_table === "levelLoop"){
      for (let lev of level){
        let levelPourcent = 0;
        if (donnees.hasOwnProperty(''+lev)){
          for (let l of donnees[""+lev]){
            levelPourcent += l.pourcentage;
              data.push({
                genre: l.hasOwnProperty('genre') ? l.genre : null,
                niveau: l.hasOwnProperty('niveau') ? l.niveau : null,
                option: l.hasOwnProperty('option') ? l.option : null,
                filiere: l.hasOwnProperty('filiere') ? l.filiere : null,
                age: l.hasOwnProperty('age') ? l.age : null,
                label: l.hasOwnProperty('label') ? l.label : null,
                motif: l.hasOwnProperty('motif') ? l.motif : null,
                montant: l.hasOwnProperty('montant') ? l.montant : null,
                nombre: l.nombre,
                pourcentage: l.pourcentage,
                levelPourcent: levelPourcent
              });
            }}}
      data.forEach(d => {
        if (d.hasOwnProperty("pourcentage")){
          this.TotalP += d.pourcentage;
        }
        if (d.hasOwnProperty("nombre")){
          this.TotalN += d.nombre;
        }
        if (d.hasOwnProperty("montant")){
          this.TotalM += d.montant;
        }
      });
      this.TotalP = Math.round(this.TotalP);
      this.dataSource = data;
      this.dataSourceTemp = data;
    } else {
      donnees.forEach(d => {
        if (d.hasOwnProperty("pourcentage")){
          this.TotalP += d.pourcentage;
        }
        if (d.hasOwnProperty("nombre")){
          this.TotalN += d.nombre;
        }

        if (d.hasOwnProperty("montant")){
          this.TotalM += d.montant;
        }
      });
      this.TotalP = Math.round(this.TotalP);
      this.dataSource = donnees;
      this.dataSourceTemp = donnees;
    }

    this.showTable = true;
  }

  /**
   *
   * @param donnees
   * @constructor
   */
  CanvasPieCircular(donnees, titre){
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: ""+titre
      },
      data: [{
        type: "pie",
        startAngle: 240,
        indexLabel: "{label} {y}",
        dataPoints: donnees
      }]
    });
    chart.render();
  }

  CanvanPieColumn(donnees, titre) {
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: ""+titre
      },
      data: [{
        type: "column",
        dataPoints: donnees
      }]
    });

    chart.render();
  }

  CanvanPieBar(donnees, titre){
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title:{
        text: ""+titre
      },
      axisY:{
        title: "",
        includeZero: true,
        interval: 300
      },
      toolTip: {
        shared: true
      },
      data: [{
        type: "bar",
        name: donnees.hasOwnProperty('montant') ? 'montant' : 'nombre',
        toolTipContent: "<b>{label}</b> <br> <span style=\"color:#4F81BC\">{name}</span>: {y}",
        dataPoints: donnees
      }]
    });
    chart.render();
  }

  exportpdf() {
    this.pdf_spinner = true;
    const data = document.getElementById('export-doc');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 280;
      const pageHeight = 100;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('landscape', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 10, position, imgWidth, 200);
      pdf.save('Statistique_'+this.TableTile+'_.pdf'); // Generated PDF
      this.pdf_spinner = false;
    });
  }

  EmptyChecking(element){
    return Util_fonction.checkIfNoTEmpty(element);
  }


  initInscriptStatForm(){
    this.INSCRIPT_STAT_FORM = this.fb.group({
      selected: this.fb.control(null, Validators.required),
    });
  }
  initInscriptStatData() {
    this.Inscript_statSend.age = false;
    this.Inscript_statSend.genre = false;
    this.Inscript_statSend.option = false;
    this.Inscript_statSend.filiere = false;
    this.Inscript_statSend.niveau = false;
    this.Inscript_statSend.nationalite = false;
  }

  initPayementStatForm(){
    this.PAIEMENTS_STAT_FORM = this.fb.group({
      selected: this.fb.control(null, Validators.required),
    });
  }

  initReussiteStatForm(){
    this.REUSSITE_STAT_FORM = this.fb.group({
      // annee: this.fb.control(null, Validators.required),
      passerelle: this.fb.control(null, Validators.required),
      id_filiere: this.fb.control(null),
      genre: this.fb.control(null),
    });
  }
  initPaiementStatData(){
    this.Paiement_statSend.motif = false;
    this.Paiement_statSend.niveau = false;
    this.Paiement_statSend.cursus = false;
  }

  formatMoneyNumeric(element){
    return Util_fonction.formatMoneyNumeric(element);
  }

  FilterBy(type,order){
    // arrayOfObjects.sort((a, b) => (a.propertyToSortBy < b.propertyToSortBy ? -1 : 1));
    if (type === "montant"){
      if (order === "ASC"){
        this.dataSource = this.dataSourceTemp.sort((a, b) => (+a.montant < +b.montant ? -1 : 1));
      }else {
        this.dataSource = this.dataSourceTemp.sort((a, b) => (+a.montant > +b.montant ? -1 : 1));
      }
    }
    if (type === "niveau"){
      if (order === "ASC"){
        this.dataSource = this.dataSourceTemp.sort((a, b) => (a.niveau < b.niveau ? -1 : 1));
      }else {
        this.dataSource = this.dataSourceTemp.sort((a, b) => (a.niveau > b.niveau ? -1 : 1));

      }
    }

  }


}
