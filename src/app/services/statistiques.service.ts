import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HEADERS, REST_URL} from "../pages/REST_URL";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  constructor(private httpClient: HttpClient) { }
  // by UE
  public getUEStats(data):Observable<any> {
    return this.httpClient.post(REST_URL+'/evaluationEnseignements/statistiques',data,{headers:HEADERS});
  }
  //enseignement
  public getTeachingStats(data):Observable<any> {
    return this.httpClient.post(REST_URL+'/evaluationEnseignements/statistiques', data,{headers:HEADERS});
  }
  //courriel global
  public getCourrierGlobalStats(idStructure) {
    return this.httpClient.get(REST_URL+`/statistiques/courriersGlobal/${idStructure}`);
  }
  // Get tatistiques Courriers en traitement
  public getOngoingCourrierStats(idStructure):Observable<any> {
    return this.httpClient.get(REST_URL+`/statistiques/courriersTraitement/${idStructure}`, {headers:HEADERS});
  }
  // Get Statistiques Courriers par mois
  public getMontlyCourrierStats(idStructure,year) :Observable<any>{
    return this.httpClient.get(REST_URL+`/statistiques/courriersMois/${idStructure}?annee=${year}`, {headers:HEADERS});
  }
  //Get Statistiques Personnel
  public getPersonnelStats(idStructure) :Observable<any>{
    return this.httpClient.get(REST_URL+`/statistiques/personnel/${idStructure}`,{headers:HEADERS});
  }
  //Get Statistiques Niveaux d’étude du personnel
  public getPersonnelLevelStats(idStructure) :Observable<any>{
    return this.httpClient.get(REST_URL+`/statistiques/niveauEtudePersonnel/${idStructure}`,{headers:HEADERS});
  }
  //Get Statistiques par corps du personnel
  //this is not clear in documentation
  // public getPersonnelCorpStats(idStructure) {
  //   return this.httpClient.get(REST_URL+`/statistiques/niveauEtudePersonnel/${idStructure}`);
  // }

  // Get Statistiques par genre du personnel
  public getPersonnelGenreStats(idStructure) : Observable<any>{
    return this.httpClient.get(REST_URL+`/statistiques/genre?id_structure=${idStructure}`, {headers:HEADERS});
  }
//Get Statistiques par Tranche d’âge du personnel

  public getPersonnelAgeStats(idStructure) {
    return this.httpClient.get(REST_URL+`/statistiques/ages?id_structure=${idStructure}`);
  }

}
