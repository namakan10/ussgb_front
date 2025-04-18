import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {HEADERS, REST_URL} from "../../pages/REST_URL";
import { Observable } from 'rxjs';
import {Util_fonction} from "../../pages/models/util_fonction";

const url = REST_URL+'/frais_inscription';

@Injectable({
  providedIn: 'root'
})
export class FraisInscriptionService {

  constructor(private httpClient: HttpClient) { }

  public enregistrerFrais(fraisInscription) {
    return this.httpClient.post(url, fraisInscription);
  }

  public updateFraisInscription(fraisInscription) {
    return this.httpClient.put(`${url}/${fraisInscription.id}`, fraisInscription);
  }

  public getFraisInscriptions() {
    return this.httpClient.get(url);
  }

  public getFraisInscription(id){
    return this.httpClient.get(`${url}/${id}`);
  }

  public deleteFrais(id) {
    return this.httpClient.delete(`${url}/${id}`);
  }

  statistiqueFraisInscription(id_structure: any, annee_scolaire: any, motif: any, mode_paiement: any, periode: any): Observable<any> {
    return this.httpClient.get(REST_URL + `/paiements/statistiques?id_structure=${id_structure}&annee_scolaire=${annee_scolaire}&motif=${motif}&mode_paiement=${mode_paiement}&periode=${periode}`, {headers:HEADERS});
  }

  statistiqueParGenre(id_structure: any, path: any, typeDonnee: String): Observable<any> {
    return this.httpClient.get(REST_URL + `/statistiques/genres${path}${id_structure}?typeDonnee=` + typeDonnee, {headers:HEADERS});
  }

  // StatistiqueInscription(data: any, path: any): Observable<any> {
  //   return this.httpClient.post(REST_URL + `/statistiques/inscription${path}`, data, {headers:HEADERS});
  // }

  /**
   * Statistique sur les Inscriptions
   * @param data
   * @constructor
   */
  StatistiqueInscription(data: any) {
    let param = new HttpParams();

    if (Util_fonction.checkIfNoTEmpty(data.id_structure)){
      param = param.append("id_structure", data.id_structure);
    }

    if (Util_fonction.checkIfNoTEmpty(data.annee_scolaire)){
      param = param.append("annee_scolaire", data.annee_scolaire);
    }

    if (Util_fonction.checkIfNoTEmpty(data.age) && data.age){
      param = param.append("age", data.age);
    }

    if (Util_fonction.checkIfNoTEmpty(data.filiere) && data.filiere){
      param = param.append("filiere", data.filiere);
    }

    if (Util_fonction.checkIfNoTEmpty(data.genre) && data.genre){
      param = param.append("genre", data.genre);
    }

    if (Util_fonction.checkIfNoTEmpty(data.niveau) && data.niveau){
      param = param.append("niveau", data.niveau);
    }
    if (Util_fonction.checkIfNoTEmpty(data.nationalite) && data.nationalite){
      param = param.append("nationalite", data.nationalite);
    }

    if (Util_fonction.checkIfNoTEmpty(data.option) && data.option){
      param = param.append("option", data.option);
    }

    return this.httpClient.get<any>(REST_URL + `/statistiques/inscriptions`, {params:param});
  }

  /***
   * statistique sur le paiement lors des inscriptions
   * @param data
   */
  statistiquePaiements(data: any) {
    let param = new HttpParams();
    // if (Util_fonction.checkIfNoTEmpty(data.id_structure) && data.id_structure){
    //   param = param.append("id_structure", data.id_structure);
    // }

    if (Util_fonction.checkIfNoTEmpty(data.annee_scolaire) && data.annee_scolaire){
      param = param.append("annee_scolaire", data.annee_scolaire);
    }

    // if (Util_fonction.checkIfNoTEmpty(data.cursus) && data.cursus){
      param = param.append("cursus", data.cursus);
    // }

    // if (Util_fonction.checkIfNoTEmpty(data.motif) && data.motif){
      param = param.append("motif", data.motif);
    // }

    // if (Util_fonction.checkIfNoTEmpty(data.niveau) && data.niveau){
      param = param.append("niveau", data.niveau);
    // }

    if (Util_fonction.checkIfNoTEmpty(data.id_structure) && data.id_structure){
      param = param.append("id_structure", data.id_structure);
    }
    return this.httpClient.get<any>(REST_URL + `/statistiques/paiements`, {params:param});
  }

  /**
   * Statistique sur le Passage
   * @param data
   * @constructor
   */
  StatistiqueReussite(data: any) {
    console.log(data);
    let param = new HttpParams();

    if (Util_fonction.checkIfNoTEmpty(data.id_structure)){
      param = param.append("id_structure", data.id_structure);
    }

    if (Util_fonction.checkIfNoTEmpty(data.annee_scolaire)){
      param = param.append("anneeScolaire", data.annee_scolaire);
    }

    if (Util_fonction.checkIfNoTEmpty(data.id_filiere)){
      param = param.append("id_filiere", data.id_filiere);
    }

    if (Util_fonction.checkIfNoTEmpty(data.genre) && data.genre){
      param = param.append("genre", data.genre);
    }

    if (Util_fonction.checkIfNoTEmpty(data.passerelle)){
      param = param.append("passerelle", data.passerelle);
    }

    console.log(param);
    return this.httpClient.get<any>(REST_URL + `/statistiques/passage`, {params:param});
  }



  statistiquePaiement(data: any): Observable<any> {
    return this.httpClient.post(REST_URL + `/statistiques/paiement`, data, {headers:HEADERS});
  }

}
