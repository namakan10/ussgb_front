import { Component, OnInit } from '@angular/core';

import {EvenementService} from '../../../services/evenement.service';
import {StructureService} from '../../../services/structure.service';
import {Router} from '@angular/router';

import Swal from 'sweetalert2';
import {Util_fonction} from "../../models/util_fonction";
import {UNIV_IST} from "../../../CONSTANTES";

@Component({
    selector: 'ngx-pre-inscriptions',
    templateUrl: './pre-inscriptions.component.html',
    styleUrls: ['./pre-inscriptions.component.scss']
})
export class PreInscriptionsComponent implements OnInit {
  univ_inst = UNIV_IST;
  structures;
    contentStructures = [];
    EndDate: number;
    FSEG: any;
    IUG: any;
    FHG: any;
    IUDT: any;
    _TimeDecompte: any;
    _TimeDecompteFHG: string = null;
    _TimeDecompteIUG: string = null;
    _TimeDecompteFSEG: string = null;
    _TimeDecompteIUDT: string = null;
    curent_sigle: string;

  listBody = {
    cursus: null,
    id_annee: null,
    id_structure: null,
    type_evenement: null,

  }

    constructor(private evenementService: EvenementService,
                private structureService: StructureService,
                private router: Router) { }

    ngOnInit(): void {
        sessionStorage.clear();
        this.getStructures();
    }

    /**
     * Amene toutes les structure sauf les structures administratifs.
     */
    getStructures() {

        this.structureService.getStuctures().subscribe(res => {
            this.structures = res;
            const toDay = new Date();
            for (const structu of this.structures){
                if (structu.type !== 'Structure administratif') {
                    this.contentStructures.push(structu);
                }
            }

            for (let str of this.contentStructures){
                // get evenement
              this.listBody.id_structure = +str.id;
                this.curent_sigle = str.sigle;
                this.evenementService.getStucturesEvenements(this.listBody).subscribe(Str_Event => {
                    for(let event of Str_Event){
                        if(event.type === 'INSCRIPTION') {
                            const d_D = new Date(event.dateDebut);
                            const d_F = new Date(event.dateFin);
                            if (toDay >= d_D && toDay <= d_F ){
                                // Décompte
                                if (this.curent_sigle === 'FHG') {
                                    console.log('La pré-Inscription en cours FHG');
                                    this.GetTimeFHG(d_F);
                                }

                                if (this.curent_sigle === 'IUG') {
                                    console.log('La pré-Inscription en cour IUG');
                                    this.GetTimeIUG(d_F);

                                }

                                if (this.curent_sigle === 'FSEG') {
                                    this.GetTimeFSEG(d_F);
                                }

                                if (this.curent_sigle === 'IUDT') {
                                    this.GetTimeIUDT(d_F);
                                }


                             } else {
                                if (this.curent_sigle === 'FHG') {
                                    this._TimeDecompteFHG = null;
                                }

                                if (this.curent_sigle === 'IUG') {
                                    this._TimeDecompteIUG = null;
                                }

                                if (this.curent_sigle === 'FSEG') {
                                    this._TimeDecompteFSEG = null;
                                }

                                if (this.curent_sigle === 'IUDT') {
                                    this._TimeDecompteIUDT = null;
                                }

                             }

                            console.log("-----------------");
                            console.log(d_D);
                        }
                    }
                })
            }
            //
        });
    }

    /***
     * TIMER DECOMPTE PARTE
     */
    GetTimeFHG(date){
        this.EndDate = new Date(date).getTime();

        // _TimeDecompte: any;
        this.FHG = setInterval(()=>{
            let now = new Date().getTime();
            let difference = this.EndDate - now;
            let _day = Math.floor(difference / (60*60*1000*24)) ;// this._hour * 24;
            let _hour = Math.floor(difference % (60*60*24*1000) / (1000*60*60));
            let _minute = Math.floor(difference % (60*60*1000) / (1000*60));
            let _second =  Math.floor(difference % (60*1000) / 1000);

                this._TimeDecompteFHG = ""+_day+"J "+_hour+"H "+_minute+ "m "+_second+"s ";

            if (difference < 0) {
                clearInterval(this.FHG);
                this._TimeDecompteFHG = "Expiré";
                // this._TimeDecompte = 'Expiré';
            }

        }, 1000);
    }

    GetTimeIUG(date){
        this.EndDate = new Date(date).getTime();


        // _TimeDecompte: any;
        this.IUG = setInterval(()=>{
            let now = new Date().getTime();
            let difference = this.EndDate - now;
            let _day = Math.floor(difference / (60*60*1000*24)) ;// this._hour * 24;
            let _hour = Math.floor(difference % (60*60*24*1000) / (1000*60*60));
            let _minute = Math.floor(difference % (60*60*1000) / (1000*60));
            let _second =  Math.floor(difference % (60*1000) / 1000);

                this._TimeDecompteIUG = ""+_day+"J "+_hour+"H "+_minute+ "m "+_second+"s ";

            if (difference < 0) {
                clearInterval(this.IUG);
                this._TimeDecompteIUG = "Expiré";
                // this._TimeDecompte = 'Expiré';
            }

        }, 1000);
    }

    GetTimeIUDT(date){
        this.EndDate = new Date(date).getTime();

        // _TimeDecompte: any;
        this.IUDT = setInterval(()=>{
            let now = new Date().getTime();
            let difference = this.EndDate - now;
            let _day = Math.floor(difference / (60*60*1000*24)) ;// this._hour * 24;
            let _hour = Math.floor(difference % (60*60*24*1000) / (1000*60*60));
            let _minute = Math.floor(difference % (60*60*1000) / (1000*60));
            let _second =  Math.floor(difference % (60*1000) / 1000);

                this._TimeDecompteIUDT = ""+_day+"J "+_hour+"H "+_minute+ "m "+_second+"s ";

            if (difference < 0) {
                clearInterval(this.IUDT);
                this._TimeDecompteIUDT = "Expiré";
                // this._TimeDecompte = 'Expiré';
            }

        }, 1000);
    }

    GetTimeFSEG(date){
        this.EndDate = new Date(date).getTime();

        // _TimeDecompte: any;
        this.FSEG = setInterval(()=>{
            let now = new Date().getTime();
            let difference = this.EndDate - now;
            let _day = Math.floor(difference / (60*60*1000*24)) ;// this._hour * 24;
            let _hour = Math.floor(difference % (60*60*24*1000) / (1000*60*60));
            let _minute = Math.floor(difference % (60*60*1000) / (1000*60));
            let _second =  Math.floor(difference % (60*1000) / 1000);

                this._TimeDecompteFSEG = ""+_day+"J "+_hour+"H "+_minute+ "m "+_second+"s ";

            if (difference < 0) {
                clearInterval(this.FSEG);
                this._TimeDecompteFSEG = "Expiré";
                // this._TimeDecompte = 'Expiré';
            }

        }, 1000);
    }


    /**
     *
     * @param idStruc
     * @param sigle
     * @param typeStructure
     */
    checkStructureAnnee(idStruc, sigle, typeStructure, logo) {
        const toReplace = 'd\'id ' + idStruc;
        this.structureService.getStructureCurrentAnnee(idStruc).subscribe(annRes => {

            const anneeScolaire = annRes.anneeScolaire;

            console.log("===ANNEE A verifier===");
            console.log(anneeScolaire);

            let typeEvent = null; // annRes['anneeScolaire'];//.replace(/\s+/g, '');

            if (typeStructure === 'Institut') {
                typeEvent = 'Candidature';
            } else {
                typeEvent = 'Inscription';
            }
            this.CheckStructureInscriptionEvent(idStruc, sigle, typeStructure, typeEvent, anneeScolaire, logo);


        }, anneeError => {
          Util_fonction.AlertMessage("info",anneeError.error.message.replace(toReplace, sigle));

        });
    }


    CheckStructureInscriptionEvent(idStruc, sigle, typeStructure, typeEvent, anneeScolaire, logo) {
        this.evenementService.getEvenementByTypeAnneeAndStructure(idStruc, typeEvent, anneeScolaire).subscribe(eventStrucRes => {
            sessionStorage.setItem('id_structure', idStruc);
            sessionStorage.setItem('structureSigle', sigle);
            sessionStorage.setItem('structureType', typeStructure);
            sessionStorage.setItem('structureLogo', logo);
            sessionStorage.setItem('structureAnneeScolaire', anneeScolaire);
            sessionStorage.setItem('evenementType', typeEvent);
            this.navigateToCheckCandidat();
        }, errorEvent => {
          Util_fonction.AlertMessage("info", errorEvent.error.message);
        });
    }


    navigateToCheckCandidat() {
        this.router.navigate(['/pages/utilisateur/statutCandidat_verification']);
    }

}
